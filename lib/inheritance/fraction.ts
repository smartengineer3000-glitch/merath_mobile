/**
 * فئة الكسور المتقدمة لحساب المواريث الشرعي
 * Enhanced Fraction Class for Islamic Inheritance Calculations
 * 
 * تدعم العمليات الحسابية على الكسور بدقة عالية جداً
 */

import { FractionData } from './types';

export class FractionClass {
  private numerator: number;
  private denominator: number;

  constructor(numerator: number, denominator: number = 1) {
    if (denominator === 0) {
      throw new Error('المقام لا يمكن أن يكون صفراً | Denominator cannot be zero');
    }

    // تحويل الكسور السالبة
    if (denominator < 0) {
      numerator = -numerator;
      denominator = -denominator;
    }

    this.numerator = numerator;
    this.denominator = denominator;
    this.simplify();
  }

  /**
   * تبسيط الكسر إلى أبسط صورة
   * Simplify fraction to lowest terms
   */
  private simplify(): void {
    const gcd = this.gcd(Math.abs(this.numerator), this.denominator);
    this.numerator /= gcd;
    this.denominator /= gcd;
  }

  /**
   * حساب القاسم المشترك الأكبر
   * Calculate Greatest Common Divisor
   */
  private gcd(a: number, b: number): number {
    return b === 0 ? a : this.gcd(b, a % b);
  }

  /**
   * جمع كسرين
   * Add two fractions
   */
  add(other: FractionClass): FractionClass {
    const newNumerator =
      this.numerator * other.denominator +
      other.numerator * this.denominator;
    const newDenominator =
      this.denominator * other.denominator;

    return new FractionClass(newNumerator, newDenominator);
  }

  /**
   * طرح كسرين
   * Subtract two fractions
   */
  subtract(other: FractionClass): FractionClass {
    const newNumerator =
      this.numerator * other.denominator -
      other.numerator * this.denominator;
    const newDenominator =
      this.denominator * other.denominator;

    return new FractionClass(newNumerator, newDenominator);
  }

  /**
   * ضرب الكسر برقم أو كسر آخر
   * Multiply fraction by number or another fraction
   */
  multiply(scalar: number | FractionClass): FractionClass {
    if (typeof scalar === 'number') {
      return new FractionClass(
        this.numerator * scalar,
        this.denominator
      );
    } else {
      return new FractionClass(
        this.numerator * scalar.numerator,
        this.denominator * scalar.denominator
      );
    }
  }

  /**
   * قسمة الكسر على رقم أو كسر آخر
   * Divide fraction by number or another fraction
   */
  divide(scalar: number | FractionClass): FractionClass {
    if (typeof scalar === 'number') {
      if (scalar === 0) {
        throw new Error('لا يمكن القسمة على صفر | Cannot divide by zero');
      }
      return new FractionClass(
        this.numerator,
        this.denominator * scalar
      );
    } else {
      if (scalar.numerator === 0) {
        throw new Error('لا يمكن القسمة على صفر | Cannot divide by zero');
      }
      return new FractionClass(
        this.numerator * scalar.denominator,
        this.denominator * scalar.numerator
      );
    }
  }

  /**
   * تحويل الكسر إلى عدد عشري
   * Convert fraction to decimal
   */
  toDecimal(): number {
    return this.numerator / this.denominator;
  }

  /**
   * المساواة مع كسر آخر (مع هامش تفاوت)
   * Equality check with tolerance
   */
  equals(other: FractionClass, tolerance: number = 0.001): boolean {
    return Math.abs(this.toDecimal() - other.toDecimal()) <= tolerance;
  }

  /**
   * مقارنة الكسور
   * Compare fractions
   */
  compare(other: FractionClass): number {
    const diff = this.toDecimal() - other.toDecimal();
    if (diff < -0.0001) return -1;
    if (diff > 0.0001) return 1;
    return 0;
  }

  /**
   * إرجاع الكسر كنص رياضي
   * Return as mathematical string
   */
  toString(): string {
    if (this.denominator === 1) {
      return `${this.numerator}`;
    }
    return `${this.numerator}/${this.denominator}`;
  }

  /**
   * إرجاع الكسر باللغة العربية
   * Return Arabic name of fraction
   */
  toArabicName(): string {
    const key = `${this.numerator}/${this.denominator}`;
    const arabicFractions: Record<string, string> = {
      '1/1': 'كامل التركة',
      '1/2': 'النصف',
      '1/3': 'الثلث',
      '2/3': 'الثلثان',
      '1/4': 'الربع',
      '3/4': 'ثلاثة أرباع',
      '1/6': 'السدس',
      '5/6': 'خمسة أسداس',
      '1/8': 'الثمن',
      '7/8': 'سبعة أثمان',
      '0/1': 'لا شيء'
    };
    return arabicFractions[key] || key;
  }

  /**
   * الحصول على البسط
   */
  get numeratorValue(): number {
    return this.numerator;
  }

  /**
   * الحصول على المقام
   */
  get denominatorValue(): number {
    return this.denominator;
  }

  /**
   * تحويل إلى كائن بيانات
   */
  toData(): FractionData {
    return {
      numerator: this.numerator,
      denominator: this.denominator
    };
  }

  /**
   * إنشاء كسر من كائن بيانات
   */
  static fromData(data: FractionData): FractionClass {
    return new FractionClass(data.numerator, data.denominator);
  }

  /**
   * إنشاء كسر من عدد عشري
   */
  static fromDecimal(decimal: number, precision: number = 10): FractionClass {
    const denominator = Math.pow(10, precision);
    const numerator = Math.round(decimal * denominator);
    return new FractionClass(numerator, denominator);
  }
}
