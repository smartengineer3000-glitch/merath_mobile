/**
 * محرك الحسابات الرئيسي
 * Main Inheritance Calculation Engine
 * 
 * يحسب حصص الورثة وفقاً للمذهب الفقهي المختار
 */

import { FractionClass } from './fraction';
import { HijabSystem } from './hijab-system';
import { FIQH_DATABASE } from './constants';
import {
  MadhhabType,
  HeirsData,
  EstateData,
  CalculationResult,
  CalculationStep,
  HeirShare,
  SpecialCases
} from './types';
import { validateEstateData, validateHeirsData, getHeirName, formatTime } from './utils';

export class InheritanceCalculationEngine {
  private madhab: MadhhabType;
  private estate: EstateData;
  private heirs: HeirsData;
  private steps: CalculationStep[] = [];
  private currentStep: number = 0;
  private hijabSystem: HijabSystem;

  constructor(
    madhab: MadhhabType,
    estate: EstateData,
    heirs: HeirsData
  ) {
    this.madhab = madhab;
    this.estate = estate;
    this.heirs = heirs;
    this.hijabSystem = new HijabSystem(madhab);
  }

  /**
   * تنفيذ الحساب الكامل
   * Execute full calculation
   */
  calculate(): CalculationResult {
    const startTime = performance.now();

    try {
      // الخطوة 1: التحقق من صحة البيانات
      this.validateInput();

      // الخطوة 2: حساب التركة الصافية
      const netEstate = this.calculateNetEstate();

      // الخطوة 3: تحديد الورثة بعد الحجب
      const validHeirs = this.applyHijab();

      // الخطوة 4: تطبيق الفروض الأساسية
      const provisioned = this.applyProvisions(validHeirs);

      // الخطوة 5: معالجة الحالات الخاصة
      const { shares, hasAwl, awlAmount, hasRadd } = this.handleSpecialCases(
        provisioned,
        netEstate
      );

      // الخطوة 6: حساب المبالغ النهائية
      const finalShares = this.calculateFinalAmounts(shares, netEstate);

      const endTime = performance.now();

      return {
        success: true,
        madhab: this.madhab,
        madhhabName: FIQH_DATABASE.madhabs[this.madhab].name,
        shares: finalShares,
        specialCases: {
          awl: hasAwl,
          auled: awlAmount,
          radd: hasRadd,
          hijabTypes: this.getHijabTypes()
        } as SpecialCases,
        confidence: this.calculateConfidence(),
        steps: this.steps,
        calculationTime: endTime - startTime
      };
    } catch (error) {
      const endTime = performance.now();

      return {
        success: false,
        madhab: this.madhab,
        madhhabName: FIQH_DATABASE.madhabs[this.madhab].name,
        shares: [],
        specialCases: {
          awl: false,
          auled: 0,
          radd: false,
          hijabTypes: []
        } as SpecialCases,
        confidence: 0,
        steps: this.steps,
        calculationTime: endTime - startTime,
        error: error instanceof Error ? error.message : 'خطأ غير معروف'
      };
    }
  }

  /**
   * التحقق من صحة البيانات المدخلة
   */
  private validateInput(): void {
    const estateError = validateEstateData(
      this.estate.total,
      this.estate.funeral ?? 0,
      this.estate.debts ?? 0
    );
    if (estateError) {
      throw new Error(estateError);
    }

    const heirsError = validateHeirsData(this.heirs);
    if (heirsError) {
      throw new Error(heirsError);
    }

    this.addStep(
      'التحقق من البيانات',
      'تم التحقق من صحة جميع البيانات المدخلة بنجاح',
      'validate',
      {}
    );
  }

  /**
   * حساب التركة الصافية
   */
  private calculateNetEstate(): number {
    const funeral = this.estate.funeral ?? 0;
    const debts = this.estate.debts ?? 0;
    const net = this.estate.total - funeral - debts;

    this.addStep(
      'حساب التركة الصافية',
      `التركة الصافية = ${this.estate.total} - ${funeral} - ${debts} = ${net}`,
      'estate_calculation',
      {
        total: this.estate.total,
        funeral: funeral,
        debts: debts,
        net: net
      }
    );

    return net;
  }

  /**
   * تطبيق الحجب
   */
  private applyHijab(): HeirsData {
    const { heirs: validHeirs, log } = this.hijabSystem.applyHijab(
      this.heirs
    );

    if (log.length > 0) {
      this.addStep(
        'تطبيق الحجب',
        `تم تطبيق قواعد الحجب: ${log.join(', ')}`,
        'hijab',
        { hijabLog: log }
      );
    }

    return validHeirs;
  }

  /**
   * تطبيق الفروض الأساسية
   */
  private applyProvisions(heirs: HeirsData): Map<string, FractionClass> {
    const shares = new Map<string, FractionClass>();

    // الزوج
    if (heirs['husband'] && heirs['husband'] > 0) {
      const hasChildren =
        (heirs['son'] || 0) > 0 || (heirs['daughter'] || 0) > 0;
      const fraction = hasChildren ? new FractionClass(1, 4) : new FractionClass(1, 2);
      shares.set('husband', fraction);
    }

    // الزوجة
    if (heirs['wife'] && heirs['wife'] > 0) {
      const hasChildren =
        (heirs['son'] || 0) > 0 || (heirs['daughter'] || 0) > 0;
      const fraction = hasChildren ? new FractionClass(1, 8) : new FractionClass(1, 4);
      const totalShare = fraction.multiply(heirs['wife']);
      shares.set('wife', totalShare);
    }

    // الأب
    if (heirs['father'] && heirs['father'] > 0) {
      const hasChildren =
        (heirs['son'] || 0) > 0 || (heirs['daughter'] || 0) > 0;
      if (hasChildren) {
        shares.set('father', new FractionClass(1, 6));
      } else {
        // عصبة
        shares.set('father', new FractionClass(1, 1)); // سيتم حسابه لاحقاً
      }
    }

    // الأم
    if (heirs['mother'] && heirs['mother'] > 0) {
      const hasChildren =
        (heirs['son'] || 0) > 0 || (heirs['daughter'] || 0) > 0;
      const hasFather = (heirs['father'] || 0) > 0;

      if (hasChildren) {
        shares.set('mother', new FractionClass(1, 6));
      } else if (hasFather) {
        // الأم مع الأب فقط
        const rule = FIQH_DATABASE.madhabs[this.madhab].rules
          .mother_with_father_only;
        const fraction =
          rule === 'third'
            ? new FractionClass(1, 3)
            : new FractionClass(1, 6);
        shares.set('mother', fraction);
      } else {
        shares.set('mother', new FractionClass(1, 3));
      }
    }

    // البنت
    if (heirs['daughter'] && heirs['daughter'] > 0) {
      const hasMultipleDaughters = heirs['daughter'] > 1;
      const hasSon = (heirs['son'] || 0) > 0;

      if (hasSon) {
        // مع الابن: نسبة 1:2
        shares.set('daughter', new FractionClass(2, 3)); // سيتم توزيعها
      } else if (hasMultipleDaughters) {
        shares.set('daughter', new FractionClass(2, 3));
      } else {
        shares.set('daughter', new FractionClass(1, 2));
      }
    }

    // الابن والعصبات الأخرى
    if (heirs['son'] && heirs['son'] > 0) {
      // سيتم حساب حصة الابن كعصبة
      shares.set('son', new FractionClass(1, 1)); // placeholder
    }

    this.addStep(
      'تطبيق الفروض',
      'تم تطبيق الفروض الشرعية على الورثة',
      'provisions',
      { shares: Array.from(shares.entries()).map(([k, v]) => [k, v.toString()]) }
    );

    return shares;
  }

  /**
   * معالجة الحالات الخاصة (عول/رد)
   */
  private handleSpecialCases(
    shares: Map<string, FractionClass>,
    netEstate: number
  ): {
    shares: Map<string, FractionClass>;
    hasAwl: boolean;
    awlAmount: number;
    hasRadd: boolean;
  } {
    // حساب المجموع الأولي
    let total = new FractionClass(0, 1);
    for (const fraction of shares.values()) {
      if (fraction.toDecimal() < 1) {
        total = total.add(fraction);
      }
    }

    const totalDecimal = total.toDecimal();
    let hasAwl = false;
    let awlAmount = 0;
    let hasRadd = false;

    // التحقق من العول
    if (totalDecimal > 1.0001) {
      hasAwl = true;
      awlAmount = (totalDecimal - 1) * 100; // النسبة المئوية

      // تطبيق معامل العول
      const coefficient = 1 / totalDecimal;
      for (const [key, fraction] of shares) {
        const adjusted = fraction.multiply(coefficient);
        shares.set(key, adjusted);
      }

      this.addStep(
        'تطبيق العول',
        `العول من مقام ${total.denominatorValue} إلى ${Math.round(total.denominatorValue * totalDecimal)}`,
        'awl',
        { originalSum: totalDecimal, awlPercentage: awlAmount }
      );
    }
    // التحقق من الرد
    else if (totalDecimal < 0.9999) {
      hasRadd = true;

      // توزيع الباقي على ذوي الفروض
      const remainder = new FractionClass(1, 1).subtract(total);
      for (const [key, fraction] of shares) {
        const share = fraction.add(remainder.multiply(fraction.toDecimal() / totalDecimal));
        shares.set(key, share);
      }

      this.addStep(
        'تطبيق الرد',
        `الرد على الورثة بنسبة ${((1 - totalDecimal) * 100).toFixed(2)}%`,
        'radd',
        { remainder: (1 - totalDecimal).toFixed(4) }
      );
    }

    return { shares, hasAwl, awlAmount, hasRadd };
  }

  /**
   * حساب المبالغ النهائية
   */
  private calculateFinalAmounts(
    shares: Map<string, FractionClass>,
    netEstate: number
  ): HeirShare[] {
    const result: HeirShare[] = [];

    for (const [heirKey, fraction] of shares) {
      const amount = netEstate * fraction.toDecimal();
      const count = this.heirs[heirKey as keyof HeirsData] || 1;

      result.push({
        key: heirKey as any,
        name: getHeirName(heirKey as any),
        count: typeof count === 'number' ? count : 1,
        fraction: {
          numerator: fraction.numeratorValue,
          denominator: fraction.denominatorValue
        },
        amount: amount,
        shares: this.distributeTo(heirKey, amount, count as number)
      });
    }

    return result;
  }

  /**
   * توزيع المبلغ على الورثة
   */
  private distributeTo(
    heirKey: string,
    totalAmount: number,
    count: number
  ): Array<{ person: number; amount: number }> {
    if (count === 0) return [];

    const perPerson = totalAmount / count;
    return Array.from({ length: count }, (_, i) => ({
      person: i + 1,
      amount: perPerson
    }));
  }

  /**
   * إضافة خطوة إلى السجل
   */
  private addStep(
    title: string,
    description: string,
    action: string,
    details: Record<string, any>
  ): void {
    this.steps.push({
      stepNumber: ++this.currentStep,
      title,
      description,
      action,
      details,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * الحصول على أنواع الحجب المطبقة
   */
  private getHijabTypes(): string[] {
    return []; // يمكن توسيع هذا لاحقاً
  }

  /**
   * حساب مستوى الثقة بالنتيجة
   */
  private calculateConfidence(): number {
    // ستكون هناك معايير مختلفة لحساب الثقة
    return 100;
  }
}
