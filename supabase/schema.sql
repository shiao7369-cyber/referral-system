-- ============================================================
-- 全民健保轉診平台個案追蹤系統 - 資料庫結構
-- ============================================================

-- 啟用 UUID 擴充
create extension if not exists "uuid-ossp";
create extension if not exists pgcrypto;

-- ============================================================
-- 醫療機構資料表
-- ============================================================
create table institutions (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  code text not null unique,          -- 健保特約代號
  type text not null check (type in ('clinic','hospital','medical_center')),
  address text,
  phone text,
  fax text,
  email text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================================
-- 使用者 Profile（搭配 Supabase Auth）
-- ============================================================
create table profiles (
  id uuid primary key references auth.users on delete cascade,
  institution_id uuid references institutions(id),
  full_name text not null,
  employee_id text,                   -- 員工/醫師代號
  role text not null check (role in ('admin','physician','nurse','case_manager','viewer')),
  specialty text,                     -- 科別
  license_number text,                -- 醫師執照號
  phone text,
  avatar_url text,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================================
-- 個案（病人）資料表（去識別化設計）
-- ============================================================
create table patients (
  id uuid primary key default uuid_generate_v4(),
  institution_id uuid references institutions(id) not null,
  -- 去識別化：身分證號使用 SHA-256 Hash
  id_hash text unique not null,       -- sha256(身分證字號)
  chart_no text,                      -- 病歷號
  name_masked text not null,          -- 遮蔽姓名（如：王○明）
  birth_year int,                     -- 出生年（不存完整日期）
  gender text check (gender in ('M','F','other')),
  blood_type text,
  nhi_card_valid bool default true,   -- 健保卡是否有效
  phone_masked text,                  -- 遮蔽電話（後4碼）
  primary_diagnosis text,             -- 主要診斷（ICD-10）
  chronic_conditions text[],          -- 慢性病史
  allergies text[],                   -- 藥物過敏
  insurance_type text default 'NHI', -- 保險類型
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================================
-- 轉診單
-- ============================================================
create table referrals (
  id uuid primary key default uuid_generate_v4(),
  referral_no text not null unique,   -- 轉診序號（如：REF-2024-000001）
  patient_id uuid references patients(id) not null,
  direction text not null check (direction in ('upward','downward','lateral')),
  -- upward: 上轉（診所→醫院）
  -- downward: 下轉（醫院→診所）
  -- lateral: 平轉（同層級）

  from_institution_id uuid references institutions(id) not null,
  to_institution_id uuid references institutions(id) not null,
  referring_physician_id uuid references profiles(id),
  receiving_physician_id uuid references profiles(id),

  -- 轉診資訊
  referral_reason text not null,      -- 轉診原因
  diagnosis_code text not null,       -- ICD-10 診斷碼
  diagnosis_name text not null,       -- 診斷名稱
  urgency text not null default 'routine'
    check (urgency in ('emergency','urgent','routine')),

  -- 狀態追蹤
  status text not null default 'pending'
    check (status in (
      'pending',       -- 待處理
      'scheduled',     -- 已掛號
      'arrived',       -- 已報到
      'in_treatment',  -- 治療中
      'completed',     -- 已完成
      'cancelled',     -- 已取消
      'no_show',       -- 未就診（失聯）
      'returned'       -- 已下轉回診
    )),

  -- 日期
  referral_date date not null default current_date,
  appointment_date date,              -- 預約就診日
  actual_visit_date date,             -- 實際就診日
  completion_date date,               -- 完成日

  -- 回報
  treatment_summary text,             -- 治療摘要
  followup_instructions text,         -- 追蹤建議
  return_date date,                   -- 建議回診日期

  -- 健保
  nhi_approved bool,                  -- 健保核准
  nhi_code text,                      -- 健保核准碼
  copayment_exempted bool default false,

  -- 稽核
  created_by uuid references profiles(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================================
-- 生理數值追蹤
-- ============================================================
create table health_logs (
  id uuid primary key default uuid_generate_v4(),
  patient_id uuid references patients(id) not null,
  referral_id uuid references referrals(id),
  recorded_by uuid references profiles(id),
  recorded_at timestamptz default now(),

  -- 生命徵象
  systolic_bp int,        -- 收縮壓
  diastolic_bp int,       -- 舒張壓
  heart_rate int,         -- 心跳
  temperature numeric(4,1), -- 體溫
  oxygen_saturation int,  -- 血氧

  -- 常用指標
  weight numeric(5,2),    -- 體重(kg)
  height numeric(5,1),    -- 身高(cm)
  hba1c numeric(4,2),     -- 糖化血色素
  blood_glucose int,      -- 血糖(mg/dL)
  creatinine numeric(6,3),-- 肌酸酐
  cholesterol int,        -- 總膽固醇

  notes text
);

-- ============================================================
-- 文件與影像
-- ============================================================
create table documents (
  id uuid primary key default uuid_generate_v4(),
  referral_id uuid references referrals(id) not null,
  patient_id uuid references patients(id) not null,
  uploaded_by uuid references profiles(id),

  doc_type text not null check (doc_type in (
    'referral_letter',    -- 轉診單
    'lab_report',         -- 檢驗報告
    'imaging',            -- 影像（X光、CT、MRI）
    'prescription',       -- 處方箋
    'discharge_summary',  -- 出院摘要
    'consent_form',       -- 同意書
    'other'
  )),
  file_name text not null,
  file_path text not null,            -- Supabase Storage path
  file_size int,                      -- bytes
  mime_type text,
  is_encrypted bool default true,
  created_at timestamptz default now()
);

-- ============================================================
-- 操作稽核軌跡
-- ============================================================
create table audit_logs (
  id bigserial primary key,
  user_id uuid references profiles(id),
  action text not null,               -- 'view','create','update','delete','export'
  resource_type text not null,        -- 'referral','patient','document'
  resource_id uuid,
  old_values jsonb,
  new_values jsonb,
  ip_address inet,
  user_agent text,
  created_at timestamptz default now()
);

-- ============================================================
-- 通知
-- ============================================================
create table notifications (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references profiles(id) not null,
  referral_id uuid references referrals(id),
  type text not null check (type in (
    'new_referral',
    'status_changed',
    'overdue',           -- 超過7天未就診
    'report_received',
    'followup_due'
  )),
  title text not null,
  message text not null,
  is_read bool default false,
  created_at timestamptz default now()
);

-- ============================================================
-- Row Level Security (RLS)
-- ============================================================
alter table institutions enable row level security;
alter table profiles enable row level security;
alter table patients enable row level security;
alter table referrals enable row level security;
alter table health_logs enable row level security;
alter table documents enable row level security;
alter table audit_logs enable row level security;
alter table notifications enable row level security;

-- Profiles: 只能看自己機構
create policy "profiles_own_institution" on profiles
  for all using (
    institution_id = (select institution_id from profiles where id = auth.uid())
  );

-- Patients: 只能看本機構個案
create policy "patients_own_institution" on patients
  for all using (
    institution_id = (select institution_id from profiles where id = auth.uid())
  );

-- Referrals: 發送或接收機構都能看
create policy "referrals_own_institution" on referrals
  for all using (
    from_institution_id = (select institution_id from profiles where id = auth.uid())
    or
    to_institution_id = (select institution_id from profiles where id = auth.uid())
  );

-- Notifications: 只看自己的
create policy "notifications_own" on notifications
  for all using (user_id = auth.uid());

-- ============================================================
-- 自動序號產生器
-- ============================================================
create sequence referral_seq start 1;

create or replace function generate_referral_no()
returns trigger as $$
begin
  new.referral_no := 'REF-' || to_char(current_date, 'YYYY') || '-' ||
                     lpad(nextval('referral_seq')::text, 6, '0');
  return new;
end;
$$ language plpgsql;

create trigger set_referral_no
  before insert on referrals
  for each row execute function generate_referral_no();

-- ============================================================
-- 自動更新 updated_at
-- ============================================================
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger referrals_updated_at before update on referrals
  for each row execute function update_updated_at();
create trigger patients_updated_at before update on patients
  for each row execute function update_updated_at();
create trigger profiles_updated_at before update on profiles
  for each row execute function update_updated_at();

-- ============================================================
-- 索引
-- ============================================================
create index idx_referrals_patient on referrals(patient_id);
create index idx_referrals_status on referrals(status);
create index idx_referrals_date on referrals(referral_date);
create index idx_referrals_from on referrals(from_institution_id);
create index idx_referrals_to on referrals(to_institution_id);
create index idx_health_logs_patient on health_logs(patient_id);
create index idx_audit_logs_user on audit_logs(user_id);
create index idx_audit_logs_resource on audit_logs(resource_type, resource_id);
create index idx_notifications_user on notifications(user_id, is_read);
