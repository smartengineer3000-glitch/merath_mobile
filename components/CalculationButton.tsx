/**
 * @file CalculationButton.tsx
 * @description زر تنفيذ الحساب
 * Calculation Button Component for Phase 5
 * 
 * زر تشغيل حساب الميراث مع عرض حالة التحميل
 */

import React, { useState, useCallback } from 'react';
import { TouchableOpacity, Text, View, ActivityIndicator, StyleSheet } from 'react-native';
import { useCalculator } from '../lib/inheritance/hooks';
import { MadhhabType, HeirsData, EstateData } from '../lib/inheritance/types';

export interface CalculationButtonProps {
  madhab: MadhhabType;
  heirs: HeirsData;
  estate: EstateData;
  onCalculationComplete?: (success: boolean, error?: string) => void;
  disabled?: boolean;
}

/**
 * مكون زر الحساب
 * Triggers calculation and shows loading state
 */
export function CalculationButton({
  madhab,
  heirs,
  estate,
  onCalculationComplete,
  disabled = false
}: CalculationButtonProps) {
  const { calculateWithMethod, result, isCalculating, error } = useCalculator();
  const [localError, setLocalError] = useState<string | null>(null);

  const handleCalculate = useCallback(async () => {
    try {
      setLocalError(null);

      // التحقق من صحة البيانات
      if (!madhab) {
        setLocalError('الرجاء اختيار المذهب');
        onCalculationComplete?.(false, 'الرجاء اختيار المذهب');
        return;
      }

      if (Object.keys(heirs).length === 0) {
        setLocalError('الرجاء إضافة الورثة');
        onCalculationComplete?.(false, 'الرجاء إضافة الورثة');
        return;
      }

      if (estate.total <= 0) {
        setLocalError('التركة يجب أن تكون أكبر من صفر');
        onCalculationComplete?.(false, 'التركة يجب أن تكون أكبر من صفر');
        return;
      }

      // تنفيذ الحساب
      await calculateWithMethod(madhab, heirs);
      onCalculationComplete?.(true);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'حدث خطأ في الحساب';
      setLocalError(errorMessage);
      onCalculationComplete?.(false, errorMessage);
    }
  }, [madhab, heirs, estate, calculateWithMethod, onCalculationComplete]);

  const isDisabled = disabled || Object.keys(heirs).length === 0 || estate.total <= 0 || isCalculating;
  const currentError = localError || error;

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, isDisabled && styles.buttonDisabled]}
        onPress={handleCalculate}
        disabled={isDisabled}
      >
        {isCalculating ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#fff" />
            <Text style={styles.buttonText}>جاري الحساب...</Text>
          </View>
        ) : (
          <Text style={styles.buttonText}>حساب الميراث</Text>
        )}
      </TouchableOpacity>

      {/* رسالة الخطأ */}
      {currentError && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{currentError}</Text>
        </View>
      )}

      {/* رسالة النجاح */}
      {result && result.success && !isCalculating && (
        <View style={styles.successContainer}>
          <Text style={styles.successText}>✓ تم الحساب بنجاح</Text>
        </View>
      )}

      {/* معلومات الحساب */}
      {result && (
        <View style={styles.resultInfo}>
          <Text style={styles.resultInfoTitle}>معلومات الحساب:</Text>
          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>الحالة:</Text>
            <Text style={[styles.resultValue, result.success ? styles.successValue : styles.errorValue]}>
              {result.success ? 'نجح' : 'فشل'}
            </Text>
          </View>
          {result.error && (
            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>الخطأ:</Text>
              <Text style={styles.resultValue}>{result.error}</Text>
            </View>
          )}
          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>المذهب:</Text>
            <Text style={styles.resultValue}>{result.madhab}</Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginBottom: 16
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    backgroundColor: '#1976d2',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 5
  },
  buttonDisabled: {
    backgroundColor: '#bdbdbd',
    opacity: 0.6
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    marginLeft: 8
  },
  errorContainer: {
    marginTop: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#ffebee',
    borderRadius: 6,
    borderLeftWidth: 4,
    borderLeftColor: '#d32f2f'
  },
  errorText: {
    fontSize: 13,
    color: '#d32f2f',
    fontWeight: '500',
    textAlign: 'right'
  },
  successContainer: {
    marginTop: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#e8f5e9',
    borderRadius: 6,
    borderLeftWidth: 4,
    borderLeftColor: '#4caf50'
  },
  successText: {
    fontSize: 13,
    color: '#2e7d32',
    fontWeight: '600',
    textAlign: 'right'
  },
  resultInfo: {
    marginTop: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e0e0e0'
  },
  resultInfoTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    textAlign: 'right'
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
    paddingVertical: 4
  },
  resultLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#666'
  },
  resultValue: {
    fontSize: 12,
    color: '#333',
    fontWeight: '600'
  },
  successValue: {
    color: '#2e7d32'
  },
  errorValue: {
    color: '#d32f2f'
  }
});

export default CalculationButton;
