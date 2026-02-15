/**
 * نوع البيانات الأساسية لحاسبة المواريث الشرعية
 * Fundamental Data Types for Islamic Inheritance Calculator
 */

// ====== المذاهب الإسلامية ======
export type MadhhabType = 'shafii' | 'hanafi' | 'maliki' | 'hanbali';

// ====== أنواع الورثة ======
export type HeirType =
  | 'husband'
  | 'wife'
  | 'son'
  | 'daughter'
  | 'father'
  | 'mother'
  | 'grandfather'
  | 'grandmother'
  | 'full_brother'
  | 'full_sister'
  | 'half_brother_paternal'
  | 'half_sister_paternal'
  | 'half_brother_maternal'
  | 'half_sister_maternal'
  | 'nephew_from_brother'
  | 'niece_from_brother'
  | 'uncle_paternal'
  | 'uncle_maternal'
  | 'aunt_paternal'
  | 'aunt_maternal';

// ====== بيانات التركة ======
export interface EstateData {
  total: number;        // إجمالي التركة بالريال
  funeral?: number;     // تكاليف التجهيز والدفن
  funeralCosts?: number;  // تكاليف التجهيز والدفن (alternative name)
  debts?: number;       // الديون المستحقة
  will?: number;        // الوصية (تُحسب بثلث الباقي عادة)
  willAmount?: number;  // الوصية (alternative name)
}

// ====== بيانات الورثة ======
export interface HeirsData {
  [key: string]: number | undefined;
}

// ====== نظام الكسور ======
export interface FractionData {
  numerator: number;    // البسط
  denominator: number;  // المقام
}

// ====== حصة الوارث (Enhanced) ======
export interface HeirShare {
  heir?: string;
  key?: HeirType;
  name: string;
  count?: number;
  fraction?: FractionData;
  share?: number;
  percentage?: number;
  amount: number;
  shareType?: string;
  madhab?: MadhhabType;
  type?: string;
  shares?: Array<{
    person: number;
    amount: number;
  }>;
}

// ====== الحالات الخاصة ======
export interface SpecialCases {
  awl: boolean;
  auled: number;
  radd: boolean;
  hijabTypes: string[];
}

// ====== نتيجة الحساب (Enhanced) ======
export interface CalculationResult {
  success: boolean;
  madhab: MadhhabType;
  madhhabName: string;
  shares: HeirShare[];
  netEstate?: number;
  finalBase?: number;
  blockedHeirs?: string[];
  awlApplied?: boolean;
  raddApplied?: boolean;
  bloodRelativesApplied?: boolean;
  confidence: number;
  steps: CalculationStep[];
  calculationTime: number;
  error?: string;
  specialCases?: SpecialCases;
  madhhabNotes?: string[];
  warnings?: string[];
  confidenceFactors?: string[];
}

// ====== خطوات الحساب ======
export interface CalculationStep {
  stepNumber: number;
  title: string;
  description: string;
  action: string;
  details: Record<string, any>;
  timestamp: string;
}

// ====== معلومات المذهب ======
export interface MadhhabConfig {
  code: MadhhabType;
  name: string;
  description: string;
  color: string;
  icon: string;
  rules: MadhhabRules;
}

// ====== قواعد المذهب ======
export interface MadhhabRules {
  grandfather_with_siblings: 'hijab' | 'musharak';
  mother_with_father_children: 'third_of_remainder' | 'sixth';
  mother_with_father_only: 'third' | 'sixth';
  spouse_radd: boolean;
  umariyyah_rule: 'first' | 'second';
}

// ====== حالات الاختبار ======
export interface TestCase {
  name: string;
  heirs: HeirsData;
  expected: Record<string, number>;
  tolerance?: number;
  madhab?: MadhhabType;
  description: string;
}

// ====== نتائج الاختبار ======
export interface TestResult {
  name: string;
  madhab: MadhhabType;
  passed: boolean;
  skipped: boolean;
  error?: string;
  discrepancies?: string[];
  testTime: number;
}

// ====== إدخالات السجل ======
export interface AuditEntry {
  id: string;
  timestamp: Date;
  action: string;
  type: 'success' | 'error' | 'warning' | 'info' | 'calculation';
  message: string;
  details?: Record<string, any>;
  component?: string;
}
