-- ============================================================
-- 測試資料（僅供開發用途）
-- ============================================================

-- 醫療機構
insert into institutions (name, code, type, address, phone) values
('台灣大學醫學院附設醫院', 'NTU001', 'medical_center', '台北市中正區中山南路7號', '02-23123456'),
('台北榮民總醫院', 'VGH001', 'medical_center', '台北市北投區石牌路二段201號', '02-28712121'),
('新光吳火獅紀念醫院', 'SKH001', 'hospital', '台北市士林區文昌路95號', '02-28332211'),
('長春診所', 'CLN001', 'clinic', '台北市中山區長春路100號', '02-25018888'),
('信義家醫診所', 'CLN002', 'clinic', '台北市信義區信義路五段100號', '02-27581234');

-- ICD-10 快速參考（示範用途）
-- 主要诊断：E11.9 Type 2 diabetes mellitus without complications
-- I10 Essential (primary) hypertension
-- J18.9 Pneumonia, unspecified organism
-- N18.3 Chronic kidney disease, stage 3
