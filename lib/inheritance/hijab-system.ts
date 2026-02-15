/**
 * نظام الحجب الفقهي الشامل
 * Comprehensive Islamic Hijab (Inheritance Obstruction) System
 * 
 * يطبق جميع قواعس الحجب حسب كل مذهب إسلامي
 */

import { MadhhabType, HeirsData } from './types';
import { getHijabRules } from './constants';

export class HijabSystem {
  private madhab: MadhhabType;
  private hijabLog: string[] = [];

  constructor(madhab: MadhhabType) {
    this.madhab = madhab;
  }

  /**
   * تطبيق قواعس الحجب على الورثة
   * Apply hijab rules to heirs
   */
  applyHijab(heirs: HeirsData): { heirs: HeirsData; log: string[] } {
    this.hijabLog = [];
    const result = { ...heirs };

    // تطبيق الحجب الكامل
    this.applyCompleteHijab(result);

    // تطبيق الحجب الناقص
    this.applyPartialHijab(result);

    return {
      heirs: result,
      log: this.hijabLog
    };
  }

  /**
   * الحجب الكامل: حرمان الوارث من الميراث كلياً
   * Complete Hijab: Complete deprivation from inheritance
   */
  private applyCompleteHijab(heirs: HeirsData): void {
    const rules = getHijabRules(this.madhab);

    // قائمة الحجب الكامل
    const completeHijabRules = rules.filter(r => r.type === 'complete');

    for (const rule of completeHijabRules) {
      const hijabber = heirs[rule.hijabber];

      if (hijabber && hijabber > 0) {
        for (const hijabbed of rule.hijabbed) {
          if (heirs[hijabbed] && heirs[hijabbed]! > 0) {
            this.hijabLog.push(
              `${rule.hijabber} يحجب ${hijabbed}`,
              `${rule.hijabber} blocks ${hijabbed}`
            );
            heirs[hijabbed] = 0;
          }
        }
      }
    }
  }

  /**
   * الحجب الناقص: تقليل نصيب الوارث
   * Partial Hijab: Reduction in heir's share
   */
  private applyPartialHijab(heirs: HeirsData): void {
    const rules = getHijabRules(this.madhab);
    const partialHijabRules = rules.filter(r => r.type === 'partial');

    for (const rule of partialHijabRules) {
      // معالجة القواعس الخاصة
      if (rule.reason === 'from_third_to_sixth') {
        // الأب يخفض الأم من الثلث إلى السدس
        if (heirs['father'] && heirs['father']! > 0 && heirs['mother'] && heirs['mother']! > 0) {
          this.hijabLog.push(
            `الأب يخفض نصيب الأم من الثلث إلى السدس`,
            `Father reduces mother's share from 1/3 to 1/6`
          );
        }
      }
    }
  }

  /**
   * التحقق من حق الميراث للوارث
   * Check if heir has inheritance rights
   */
  checkInheritanceRights(heir: string): boolean {
    // القائمة الكاملة للورثة المعترف بهم فقهياً
    const recognizedHeirs = [
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
      'uncle_maternal',
      'aunt_paternal',
      'aunt_maternal'
    ];

    return recognizedHeirs.includes(heir);
  }

  /**
   * الحصول على سجل الحجب
   * Get hijab log
   */
  getHijabLog(): string[] {
    return this.hijabLog;
  }

  /**
   * التحقق من وجود أبناء
   * Check if there are descendants
   */
  hasDescendants(heirs: HeirsData): boolean {
    return (heirs['son'] || 0) > 0 || (heirs['daughter'] || 0) > 0;
  }

  /**
   * التحقق من وجود والد
   * Check if father exists
   */
  hasFather(heirs: HeirsData): boolean {
    return (heirs['father'] || 0) > 0;
  }

  /**
   * التحقق من وجود والدة
   * Check if mother exists
   */
  hasMother(heirs: HeirsData): boolean {
    return (heirs['mother'] || 0) > 0;
  }

  /**
   * التحقق من وجود زوج
   * Check if husband exists
   */
  hasHusband(heirs: HeirsData): boolean {
    return (heirs['husband'] || 0) > 0;
  }

  /**
   * التحقق من وجود زوجة
   * Check if wife exists
   */
  hasWife(heirs: HeirsData): boolean {
    return (heirs['wife'] || 0) > 0;
  }

  /**
   * التحقق من وجود إخوة
   * Check if siblings exist
   */
  hasSiblings(heirs: HeirsData): boolean {
    const siblings =
      (heirs['full_brother'] || 0) +
      (heirs['full_sister'] || 0) +
      (heirs['half_brother_paternal'] || 0) +
      (heirs['half_sister_paternal'] || 0);

    return siblings > 0;
  }

  /**
   * حساب عدد الذكور
   * Count males
   */
  countMales(heirs: HeirsData): number {
    return (
      (heirs['son'] || 0) +
      (heirs['father'] || 0) +
      (heirs['grandfather'] || 0) +
      (heirs['full_brother'] || 0) +
      (heirs['half_brother_paternal'] || 0) +
      (heirs['half_brother_maternal'] || 0) +
      (heirs['uncle_paternal'] || 0) +
      (heirs['uncle_maternal'] || 0)
    );
  }

  /**
   * حساب عدد الإناث
   * Count females
   */
  countFemales(heirs: HeirsData): number {
    return (
      (heirs['daughter'] || 0) +
      (heirs['mother'] || 0) +
      (heirs['grandmother'] || 0) +
      (heirs['full_sister'] || 0) +
      (heirs['half_sister_paternal'] || 0) +
      (heirs['half_sister_maternal'] || 0) +
      (heirs['aunt_paternal'] || 0) +
      (heirs['aunt_maternal'] || 0)
    );
  }
}
