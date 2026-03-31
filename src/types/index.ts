export type InstitutionType = 'clinic' | 'hospital' | 'medical_center'

export type UserRole = 'admin' | 'physician' | 'nurse' | 'case_manager' | 'viewer'

export type ReferralDirection = 'upward' | 'downward' | 'lateral'

export type ReferralStatus =
  | 'pending'
  | 'scheduled'
  | 'arrived'
  | 'in_treatment'
  | 'completed'
  | 'cancelled'
  | 'no_show'
  | 'returned'

export type ReferralUrgency = 'emergency' | 'urgent' | 'routine'

export type DocumentType =
  | 'referral_letter'
  | 'lab_report'
  | 'imaging'
  | 'prescription'
  | 'discharge_summary'
  | 'consent_form'
  | 'other'

export type NotificationType =
  | 'new_referral'
  | 'status_changed'
  | 'overdue'
  | 'report_received'
  | 'followup_due'

export interface Institution {
  id: string
  name: string
  code: string
  type: InstitutionType
  address?: string
  phone?: string
  fax?: string
  email?: string
  created_at: string
  updated_at: string
}

export interface Profile {
  id: string
  institution_id: string
  full_name: string
  employee_id?: string
  role: UserRole
  specialty?: string
  license_number?: string
  phone?: string
  avatar_url?: string
  is_active: boolean
  created_at: string
  updated_at: string
  institution?: Institution
}

export interface Patient {
  id: string
  institution_id: string
  id_hash: string
  chart_no?: string
  name_masked: string
  birth_year?: number
  gender?: 'M' | 'F' | 'other'
  blood_type?: string
  nhi_card_valid: boolean
  phone_masked?: string
  primary_diagnosis?: string
  chronic_conditions?: string[]
  allergies?: string[]
  insurance_type: string
  created_at: string
  updated_at: string
}

export interface Referral {
  id: string
  referral_no: string
  patient_id: string
  direction: ReferralDirection
  from_institution_id: string
  to_institution_id: string
  referring_physician_id?: string
  receiving_physician_id?: string
  referral_reason: string
  diagnosis_code: string
  diagnosis_name: string
  urgency: ReferralUrgency
  status: ReferralStatus
  referral_date: string
  appointment_date?: string
  actual_visit_date?: string
  completion_date?: string
  treatment_summary?: string
  followup_instructions?: string
  return_date?: string
  nhi_approved?: boolean
  nhi_code?: string
  copayment_exempted: boolean
  created_by?: string
  created_at: string
  updated_at: string
  // Joined fields
  patient?: Patient
  from_institution?: Institution
  to_institution?: Institution
  referring_physician?: Profile
  receiving_physician?: Profile
}

export interface HealthLog {
  id: string
  patient_id: string
  referral_id?: string
  recorded_by?: string
  recorded_at: string
  systolic_bp?: number
  diastolic_bp?: number
  heart_rate?: number
  temperature?: number
  oxygen_saturation?: number
  weight?: number
  height?: number
  hba1c?: number
  blood_glucose?: number
  creatinine?: number
  cholesterol?: number
  notes?: string
}

export interface Document {
  id: string
  referral_id: string
  patient_id: string
  uploaded_by?: string
  doc_type: DocumentType
  file_name: string
  file_path: string
  file_size?: number
  mime_type?: string
  is_encrypted: boolean
  created_at: string
}

export interface Notification {
  id: string
  user_id: string
  referral_id?: string
  type: NotificationType
  title: string
  message: string
  is_read: boolean
  created_at: string
  referral?: Referral
}

export interface AuditLog {
  id: number
  user_id?: string
  action: string
  resource_type: string
  resource_id?: string
  old_values?: Record<string, unknown>
  new_values?: Record<string, unknown>
  ip_address?: string
  user_agent?: string
  created_at: string
}

// UI helpers
export const STATUS_CONFIG: Record<ReferralStatus, { label: string; color: string }> = {
  pending: { label: '待處理', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
  scheduled: { label: '已掛號', color: 'bg-blue-100 text-blue-800 border-blue-200' },
  arrived: { label: '已報到', color: 'bg-indigo-100 text-indigo-800 border-indigo-200' },
  in_treatment: { label: '治療中', color: 'bg-purple-100 text-purple-800 border-purple-200' },
  completed: { label: '已完成', color: 'bg-green-100 text-green-800 border-green-200' },
  cancelled: { label: '已取消', color: 'bg-gray-100 text-gray-600 border-gray-200' },
  no_show: { label: '未就診', color: 'bg-red-100 text-red-800 border-red-200' },
  returned: { label: '已下轉', color: 'bg-teal-100 text-teal-800 border-teal-200' },
}

export const DIRECTION_CONFIG: Record<ReferralDirection, { label: string; icon: string }> = {
  upward: { label: '上轉', icon: '↑' },
  downward: { label: '下轉', icon: '↓' },
  lateral: { label: '平轉', icon: '↔' },
}

export const URGENCY_CONFIG: Record<ReferralUrgency, { label: string; color: string }> = {
  emergency: { label: '緊急', color: 'bg-red-500 text-white' },
  urgent: { label: '急診', color: 'bg-orange-500 text-white' },
  routine: { label: '一般', color: 'bg-slate-200 text-slate-700' },
}

export const ROLE_LABELS: Record<UserRole, string> = {
  admin: '系統管理員',
  physician: '醫師',
  nurse: '護理師',
  case_manager: '個案管理師',
  viewer: '唯讀人員',
}

export const INSTITUTION_TYPE_LABELS: Record<InstitutionType, string> = {
  clinic: '診所',
  hospital: '醫院',
  medical_center: '醫學中心',
}
