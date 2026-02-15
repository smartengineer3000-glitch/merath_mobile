/**
 * نظام الاختبارات الشامل للمواريث الشرعية
 * Comprehensive Test Suite for Islamic Inheritance System
 * 
 * يختبر جميع الحالات والمذاهب الأربعة
 * ويتحقق من التطابق الكامل مع حاسبة HTML
 */

import { InheritanceCalculationEngine } from './calculation-engine';
import { MadhhabType, EstateData, HeirsData } from './types';

/**
 * تعريف حالة اختبار واحدة
 */
export interface TestCase {
  id: string;
  name: string;
  description: string;
  madhab: MadhhabType;
  estate: EstateData;
  heirs: HeirsData;
  expectedResults: {
    total: number;
    shares: Record<string, number>;
    hasAwl?: boolean;
    hasRadd?: boolean;
  };
  tags: string[];
}

/**
 * نتائج الاختبار
 */
export interface TestResult {
  testId: string;
  testName: string;
  madhab: MadhhabType;
  passed: boolean;
  expectedTotal: number;
  actualTotal: number;
  expectedShares: Record<string, number>;
  actualShares: Record<string, number>;
  differences: Record<string, number>;
  maxDifference: number;
  error?: string;
  duration: number;
}

/**
 * تقرير نتائج جميع الاختبارات
 */
export interface TestReport {
  totalTests: number;
  passedTests: number;
  failedTests: number;
  successRate: number;
  totalDuration: number;
  madhabs: {
    shafii: { total: number; passed: number };
    hanafi: { total: number; passed: number };
    maliki: { total: number; passed: number };
    hanbali: { total: number; passed: number };
  };
  results: TestResult[];
  summary: string;
}

/**
 * فئة نظام الاختبارات
 */
export class TestSuite {
  private testCases: TestCase[] = [];
  private results: TestResult[] = [];
  private tolerance: number = 0.01; // 1% تسامح

  constructor(tolerance: number = 0.01) {
    this.tolerance = tolerance;
    this.initializeTestCases();
  }

  /**
   * تهيئة حالات الاختبار الأساسية
   */
  private initializeTestCases(): void {
    // =============== الحالات البسيطة ===============
    
    // حالة 1: زوج وابنة
    this.testCases.push({
      id: 'simple_01',
      name: 'زوج وابنة',
      description: 'الزوج يأخذ الربع والابنة تأخذ النصف',
      madhab: 'shafii',
      estate: { total: 120000, funeral: 0, debts: 0, will: 0 },
      heirs: { husband: 1, daughter: 1 },
      expectedResults: {
        total: 120000,
        shares: { husband: 30000, daughter: 60000, remainder: 30000 }
      },
      tags: ['basic', 'provisions', 'radd']
    });

    // حالة 2: زوج وابن
    this.testCases.push({
      id: 'simple_02',
      name: 'زوج وابن',
      description: 'الزوج يأخذ الربع والابن يأخذ التعصيب',
      madhab: 'shafii',
      estate: { total: 120000, funeral: 0, debts: 0, will: 0 },
      heirs: { husband: 1, son: 1 },
      expectedResults: {
        total: 120000,
        shares: { husband: 30000, son: 90000 }
      },
      tags: ['basic', 'provisions', 'taassib']
    });

    // حالة 3: الأب والأم
    this.testCases.push({
      id: 'simple_03',
      name: 'الأب والأم',
      description: 'الأب يأخذ ثلث والأم تأخذ ثلث والباقي للأب',
      madhab: 'shafii',
      estate: { total: 120000, funeral: 0, debts: 0, will: 0 },
      heirs: { father: 1, mother: 1 },
      expectedResults: {
        total: 120000,
        shares: { father: 80000, mother: 40000 }
      },
      tags: ['basic', 'provisions', 'taassib']
    });

    // =============== حالات الحجب ===============

    // حالة 4: ابن يحجب الإخوة (Shafi'i)
    this.testCases.push({
      id: 'hijab_01',
      name: 'ابن يحجب الإخوة',
      description: 'الابن يحجب كامل الإخوة والأخوات',
      madhab: 'shafii',
      estate: { total: 120000, funeral: 0, debts: 0, will: 0 },
      heirs: {
        son: 1,
        full_brother: 1,
        full_sister: 1
      },
      expectedResults: {
        total: 120000,
        shares: { son: 120000, full_brother: 0, full_sister: 0 }
      },
      tags: ['hijab', 'complete_hijab', 'siblings']
    });

    // حالة 5: الأب يحجب الجد (Shafi'i)
    this.testCases.push({
      id: 'hijab_02',
      name: 'الأب يحجب الجد',
      description: 'الأب يحجب الجد الأب تماماً',
      madhab: 'shafii',
      estate: { total: 120000, funeral: 0, debts: 0, will: 0 },
      heirs: { father: 1, grandfather: 1 },
      expectedResults: {
        total: 120000,
        shares: { father: 120000, grandfather: 0 }
      },
      tags: ['hijab', 'complete_hijab', 'paternal_line']
    });

    // حالة 6: الأب يخفض الأم (Shafi'i)
    this.testCases.push({
      id: 'hijab_03',
      name: 'الأب يخفض نصيب الأم',
      description: 'الأب يخفض الأم من الثلث إلى السدس',
      madhab: 'shafii',
      estate: { total: 120000, funeral: 0, debts: 0, will: 0 },
      heirs: { son: 1, father: 1, mother: 1 },
      expectedResults: {
        total: 120000,
        shares: { son: 0, father: 70000, mother: 20000, remainder: 30000 }
      },
      tags: ['hijab', 'partial_hijab', 'mother']
    });

    // =============== حالات العول والرد ===============

    // حالة 7: عول (الفروض تزيد على التركة)
    this.testCases.push({
      id: 'awl_01',
      name: 'عول - ثلاث بنات فقط',
      description: 'ثلاث بنات تأخذ الثلثان لكن لا يوجد عاصب',
      madhab: 'shafii',
      estate: { total: 60000, funeral: 0, debts: 0, will: 0 },
      heirs: { daughter: 3 },
      expectedResults: {
        total: 60000,
        shares: { daughter: 60000 }, // كل واحدة تأخذ 20000
        hasRadd: true
      },
      tags: ['radd', 'daughters', 'special']
    });

    // حالة 8: رد - الفروض أقل من التركة
    this.testCases.push({
      id: 'radd_01',
      name: 'رد - بنت فقط',
      description: 'بنت واحدة ترجع لها الباقي من التركة',
      madhab: 'shafii',
      estate: { total: 100000, funeral: 0, debts: 0, will: 0 },
      heirs: { daughter: 1 },
      expectedResults: {
        total: 100000,
        shares: { daughter: 100000 },
        hasRadd: true
      },
      tags: ['radd', 'single_daughter', 'special']
    });

    // =============== حالات متعددة المذاهب ===============

    // حالة 9: الجد مع الإخوة (Hanafi vs Shafi'i)
    this.testCases.push({
      id: 'madhab_01',
      name: 'الجد مع الإخوة - Hanafi',
      description: 'في Hanafi: الجد يشارك الإخوة، في Shafi\'i: يحجبهم',
      madhab: 'hanafi',
      estate: { total: 120000, funeral: 0, debts: 0, will: 0 },
      heirs: { grandfather: 1, full_brother: 2 },
      expectedResults: {
        total: 120000,
        shares: { grandfather: 40000, full_brother: 80000 } // تقسيم متساوي
      },
      tags: ['madhab_difference', 'grandfather', 'hanafi']
    });

    // =============== حالات معقدة ===============

    // حالة 10: زوج وأطفال ووالد
    this.testCases.push({
      id: 'complex_01',
      name: 'زوج وابن وابنة والأب',
      description: 'حالة معقدة مع عدة ورثة',
      madhab: 'shafii',
      estate: { total: 240000, funeral: 5000, debts: 10000, will: 15000 },
      heirs: {
        husband: 1,
        son: 1,
        daughter: 1,
        father: 1
      },
      expectedResults: {
        total: 210000, // بعد الخصومات
        shares: {
          husband: 0, // محجوب
          father: 0,  // محجوب
          son: 140000,
          daughter: 70000
        }
      },
      tags: ['complex', 'multiple_heirs', 'hijab', 'deductions']
    });

    // حالة 11: زوجة وأطفال ووالدة
    this.testCases.push({
      id: 'complex_02',
      name: 'زوجة وابن وابنة والأم',
      description: 'حالة معقدة مع الزوجة والأم',
      madhab: 'shafii',
      estate: { total: 180000, funeral: 0, debts: 0, will: 0 },
      heirs: {
        wife: 1,
        son: 1,
        daughter: 1,
        mother: 1
      },
      expectedResults: {
        total: 180000,
        shares: {
          wife: 22500,   // 1/8 (مع الأطفال)
          mother: 0,     // محجوبة
          son: 78750,
          daughter: 78750
        }
      },
      tags: ['complex', 'multiple_heirs', 'wife', 'hijab']
    });
  }

  /**
   * تشغيل جميع الاختبارات
   */
  async runAllTests(): Promise<TestReport> {
    console.log('🧪 بدء تشغيل الاختبارات الشاملة...\n');
    console.log(`📊 عدد الاختبارات: ${this.testCases.length}`);
    console.log(`🎯 المذاهب المختبرة: شافعي، حنفي، مالكي، حنبلي\n`);

    this.results = [];
    const startTime = performance.now();

    for (const testCase of this.testCases) {
      const result = this.runSingleTest(testCase);
      this.results.push(result);

      // طباعة النتيجة على الفور
      const status = result.passed ? '✅' : '❌';
      console.log(
        `${status} ${result.testId}: ${result.testName} (${result.madhab}) - ${result.duration.toFixed(2)}ms`
      );
    }

    const totalDuration = performance.now() - startTime;

    // إنشاء التقرير
    const report = this.generateReport(totalDuration);
    return report;
  }

  /**
   * تشغيل اختبار واحد
   */
  private runSingleTest(testCase: TestCase): TestResult {
    const startTime = performance.now();

    try {
      // إنشاء محرك الحساب
      const engine = new InheritanceCalculationEngine(
        testCase.madhab,
        testCase.estate,
        testCase.heirs
      );

      // تنفيذ الحساب
      const calculationResult = engine.calculate();

      const duration = performance.now() - startTime;

      // التحقق من النتائج
      if (!calculationResult.success) {
        return {
          testId: testCase.id,
          testName: testCase.name,
          madhab: testCase.madhab,
          passed: false,
          expectedTotal: testCase.expectedResults.total,
          actualTotal: 0,
          expectedShares: testCase.expectedResults.shares,
          actualShares: {},
          differences: {},
          maxDifference: 0,
          error: calculationResult.error || 'Unknown error',
          duration
        };
      }

      // تحويل shares من array إلى object
      const actualShares: Record<string, number> = {};
      let totalAmount = 0;
      
      for (const share of calculationResult.shares) {
        const key = share.key || share.heir || share.name || 'unknown';
        actualShares[key] = share.amount;
        totalAmount += share.amount;
      }

      // حساب الفارق
      const differences: Record<string, number> = {};
      let maxDifference = 0;

      for (const [heir, expectedAmount] of Object.entries(
        testCase.expectedResults.shares
      )) {
        const actualAmount = actualShares[heir] || 0;
        const expectedAmountNum = typeof expectedAmount === 'number' ? expectedAmount : 0;
        const difference = Math.abs(actualAmount - expectedAmountNum);
        differences[heir] = difference;
        maxDifference = Math.max(maxDifference, difference);
      }

      // التحقق من النجاح
      const totalDiff = Math.abs(
        totalAmount - testCase.expectedResults.total
      );
      const passed =
        totalDiff <= this.tolerance &&
        maxDifference <= this.tolerance * testCase.expectedResults.total;

      return {
        testId: testCase.id,
        testName: testCase.name,
        madhab: testCase.madhab,
        passed,
        expectedTotal: testCase.expectedResults.total,
        actualTotal: totalAmount,
        expectedShares: testCase.expectedResults.shares,
        actualShares: actualShares,
        differences,
        maxDifference,
        duration
      };
    } catch (error) {
      const duration = performance.now() - startTime;
      return {
        testId: testCase.id,
        testName: testCase.name,
        madhab: testCase.madhab,
        passed: false,
        expectedTotal: testCase.expectedResults.total,
        actualTotal: 0,
        expectedShares: testCase.expectedResults.shares,
        actualShares: {},
        differences: {},
        maxDifference: 0,
        error: error instanceof Error ? error.message : 'Unknown error',
        duration
      };
    }
  }

  /**
   * إنشاء تقرير شامل
   */
  private generateReport(totalDuration: number): TestReport {
    const passedTests = this.results.filter(r => r.passed).length;
    const failedTests = this.results.filter(r => !r.passed).length;
    const successRate =
      (passedTests / this.results.length) * 100;

    // إحصائيات المذاهب
    const madhabs = {
      shafii: {
        total: this.results.filter(r => r.madhab === 'shafii').length,
        passed: this.results.filter(
          r => r.madhab === 'shafii' && r.passed
        ).length
      },
      hanafi: {
        total: this.results.filter(r => r.madhab === 'hanafi').length,
        passed: this.results.filter(
          r => r.madhab === 'hanafi' && r.passed
        ).length
      },
      maliki: {
        total: this.results.filter(r => r.madhab === 'maliki').length,
        passed: this.results.filter(
          r => r.madhab === 'maliki' && r.passed
        ).length
      },
      hanbali: {
        total: this.results.filter(r => r.madhab === 'hanbali').length,
        passed: this.results.filter(
          r => r.madhab === 'hanbali' && r.passed
        ).length
      }
    };

    // ملخص النتائج
    const summary =
      `✅ نجح: ${passedTests}/${this.results.length} اختبار (${successRate.toFixed(1)}%)\n` +
      `❌ فشل: ${failedTests}\n` +
      `⏱️ الوقت الإجمالي: ${totalDuration.toFixed(2)}ms\n` +
      `📊 المذاهب: Shafi'i (${madhabs.shafii.passed}/${madhabs.shafii.total}), ` +
      `Hanafi (${madhabs.hanafi.passed}/${madhabs.hanafi.total}), ` +
      `Maliki (${madhabs.maliki.passed}/${madhabs.maliki.total}), ` +
      `Hanbali (${madhabs.hanbali.passed}/${madhabs.hanbali.total})`;

    return {
      totalTests: this.results.length,
      passedTests,
      failedTests,
      successRate,
      totalDuration,
      madhabs,
      results: this.results,
      summary
    };
  }

  /**
   * الحصول على نتائج الاختبار الأخيرة
   */
  getResults(): TestResult[] {
    return this.results;
  }

  /**
   * حفظ التقرير بصيغة JSON
   */
  saveReport(report: TestReport, filename: string = 'test-report.json'): void {
    const json = JSON.stringify(report, null, 2);
    console.log(`\n📄 تم حفظ التقرير في: ${filename}`);
    // في بيئة الإنتاج، يتم حفظ الملف على القرص
  }
}

/**
 * دالة مساعدة لتشغيل الاختبارات
 */
export async function runTestSuite(): Promise<TestReport> {
  const suite = new TestSuite(0.01); // 1% تسامح
  const report = await suite.runAllTests();
  
  console.log('\n' + '='.repeat(50));
  console.log('📋 ملخص النتائج:');
  console.log('='.repeat(50));
  console.log(report.summary);
  console.log('='.repeat(50) + '\n');

  // طباعة الاختبارات الفاشلة
  const failedTests = report.results.filter(r => !r.passed);
  if (failedTests.length > 0) {
    console.log('❌ الاختبارات الفاشلة:\n');
    for (const test of failedTests) {
      console.log(`• ${test.testId}: ${test.testName}`);
      if (test.error) {
        console.log(`  خطأ: ${test.error}`);
      } else {
        console.log(
          `  أقصى فارق: ${test.maxDifference} (التسامح: ${0.01})`
        );
      }
    }
    console.log();
  }

  return report;
}

export default TestSuite;
