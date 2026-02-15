/**
 * دوال مساعدة وثوابت نظام المواريث
 * Helper Functions and Inheritance System Constants
 */

import { MadhhabType, HeirType } from './types';

/**
 * قائمة أسماء الورثة بالعربية
 */
export const HEIR_NAMES: Record<HeirType, string> = {
  husband: 'الزوج',
  wife: 'الزوجة',
  son: 'الابن',
  daughter: 'البنت',
  father: 'الأب',
  mother: 'الأم',
  grandfather: 'الجد الأب',
  grandmother: 'الجدة الأب',
  full_brother: 'الأخ الشقيق',
  full_sister: 'الأخت الشقيقة',
  half_brother_paternal: 'الأخ لأب',
  half_sister_paternal: 'الأخت لأب',
  half_brother_maternal: 'الأخ لأم',
  half_sister_maternal: 'الأخت لأم',
  nephew_from_brother: 'ابن الأخ',
  niece_from_brother: 'بنت الأخ',
  uncle_paternal: 'العم الشقيق',
  aunt_paternal: 'العمة الشقيقة',
  uncle_maternal: 'الخال',
  aunt_maternal: 'الخالة'
};

/**
 * ألوان المذاهب
 */
export const MADHAB_COLORS: Record<MadhhabType, string> = {
  shafii: '#FF6B6B',
  hanafi: '#4ECDC4',
  maliki: '#45B7D1',
  hanbali: '#F7DC6F'
};

/**
 * أيقونات المذاهب
 */
export const MADHAB_ICONS: Record<MadhhabType, string> = {
  shafii: '🕌',
  hanafi: '📖',
  maliki: '⚖️',
  hanbali: '📜'
};

/**
 * أسماء المذاهب
 */
export const MADHAB_NAMES: Record<MadhhabType, string> = {
  shafii: 'المذهب الشافعي',
  hanafi: 'المذهب الحنفي',
  maliki: 'المذهب المالكي',
  hanbali: 'المذهب الحنبلي'
};

/**
 * التحقق من صحة المذهب
 */
export function isValidMadhab(madhab: any): madhab is MadhhabType {
  return ['shafii', 'hanafi', 'maliki', 'hanbali'].includes(madhab);
}

/**
 * التحقق من صحة نوع الوارث
 */
export function isValidHeirType(heir: any): heir is HeirType {
  const validHeirs = [
    'husband',
    'wife',
    'son',
    'daughter',
    'father',
    'mother',
    'grandfather',
    'grandmother',
    'full_brother',
    'full_sister',
    'half_brother_paternal',
    'half_sister_paternal',
    'half_brother_maternal',
    'half_sister_maternal',
    'nephew_from_brother',
    'niece_from_brother',
    'uncle_paternal',
    'aunt_paternal',
    'uncle_maternal',
    'aunt_maternal'
  ];
  return validHeirs.includes(heir);
}

/**
 * تنسيق المبلغ كعملة
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('ar-SA', {
    style: 'currency',
    currency: 'SAR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}

/**
 * تنسيق النسبة المئوية
 */
export function formatPercentage(decimal: number): string {
  return `${(decimal * 100).toFixed(2)}%`;
}

/**
 * حساب LCM (أقل مضاعف مشترك)
 */
export function lcm(a: number, b: number): number {
  return Math.abs(a * b) / gcd(a, b);
}

/**
 * حساب GCD (أكبر عامل مشترك)
 */
export function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

/**
 * توليد معرف فريد
 */
export function generateId(): string {
  return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * قياس وقت التنفيذ
 */
export function measureTime<T>(fn: () => T): { result: T; time: number } {
  const start = performance.now();
  const result = fn();
  const time = performance.now() - start;
  return { result, time };
}

/**
 * تنسيق الوقت بصيغة قابلة للقراءة
 */
export function formatTime(milliseconds: number): string {
  if (milliseconds < 1000) {
    return `${milliseconds.toFixed(2)}ms`;
  }
  return `${(milliseconds / 1000).toFixed(2)}s`;
}

/**
 * التحقق من صحة بيانات التركة
 */
export function validateEstateData(total: number, funeral: number, debts: number): string | null {
  if (total <= 0) {
    return 'إجمالي التركة يجب أن يكون أكبر من صفر';
  }
  if (funeral < 0) {
    return 'تكاليف التجهيز لا يمكن أن تكون سالبة';
  }
  if (debts < 0) {
    return 'الديون لا يمكن أن تكون سالبة';
  }
  if (funeral + debts > total) {
    return 'التكاليف والديون تتجاوز إجمالي التركة';
  }
  return null;
}

/**
 * التحقق من صحة بيانات الورثة
 */
export function validateHeirsData(heirs: Record<string, number | undefined>): string | null {
  let hasHeirs = false;

  for (const [key, count] of Object.entries(heirs)) {
    if (count !== undefined) {
      if (!isValidHeirType(key)) {
        return `نوع وارث غير صحيح: ${key}`;
      }
      if (count < 0) {
        return `عدد الورثة لا يمكن أن يكون سالباً: ${key}`;
      }
      if (count > 0) {
        hasHeirs = true;
      }
    }
  }

  if (!hasHeirs) {
    return 'يجب تحديد ورثة واحد على الأقل';
  }

  return null;
}

/**
 * حساب عدد الورثة الإجمالي
 */
export function countTotalHeirs(heirs: Record<string, number | undefined>): number {
  let sum = 0;
  for (const count of Object.values(heirs)) {
    if (count !== undefined) {
      sum += count;
    }
  }
  return sum;
}

/**
 * حساب عدد أنواع الورثة
 */
export function countHeirTypes(heirs: Record<string, number | undefined>): number {
  return Object.values(heirs).filter(count => count && count > 0).length;
}

/**
 * ترتيب الورثة حسب الأولوية الفقهية
 */
export function sortHeirsByPriority(heirs: HeirType[]): HeirType[] {
  const priority: Record<HeirType, number> = {
    husband: 1,
    wife: 2,
    son: 3,
    daughter: 4,
    father: 5,
    mother: 6,
    grandfather: 7,
    grandmother: 8,
    full_brother: 9,
    full_sister: 10,
    half_brother_paternal: 11,
    half_sister_paternal: 12,
    half_brother_maternal: 13,
    half_sister_maternal: 14,
    nephew_from_brother: 15,
    niece_from_brother: 16,
    uncle_paternal: 17,
    aunt_paternal: 18,
    uncle_maternal: 19,
    aunt_maternal: 20
  };

  return [...heirs].sort((a, b) => priority[a] - priority[b]);
}

/**
 * الحصول على اسم الوارث العربي
 */
export function getHeirName(heir: HeirType): string {
  return HEIR_NAMES[heir] || heir;
}

/**
 * الحصول على لون المذهب
 */
export function getMadhhabColor(madhab: MadhhabType): string {
  return MADHAB_COLORS[madhab];
}

/**
 * الحصول على أيقونة المذهب
 */
export function getMadhhabIcon(madhab: MadhhabType): string {
  return MADHAB_ICONS[madhab];
}

/**
 * الحصول على اسم المذهب
 */
export function getMadhhabName(madhab: MadhhabType): string {
  return MADHAB_NAMES[madhab];
}
