/**
 * @file EstateInput.tsx
 * @description مكون إدخال بيانات التركة
 * Estate Input Component for Phase 5
 * 
 * استقبال بيانات التركة الشرعية من المستخدم
 */

import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { useCalculator } from '../lib/inheritance/hooks';
import { EstateData } from '../lib/inheritance/types';

export interface EstateInputProps {
  onEstateChange?: (estate: EstateData) => void;
  initialEstate?: EstateData;
}

/**
 * مكون إدخال التركة
 * Allows users to input estate financial data
 */
export function EstateInput({ onEstateChange, initialEstate }: EstateInputProps) {
  const { estateData, updateEstateData } = useCalculator();

  const [total, setTotal] = useState(initialEstate?.total.toString() || estateData.total.toString());
  const [funeral, setFuneral] = useState((initialEstate?.funeral ?? initialEstate?.funeralCosts ?? estateData.funeral ?? estateData.funeralCosts ?? 0).toString());
  const [debts, setDebts] = useState((initialEstate?.debts ?? estateData.debts ?? 0).toString());
  const [will, setWill] = useState((initialEstate?.will ?? initialEstate?.willAmount ?? estateData.will ?? estateData.willAmount ?? 0).toString());
  const [error, setError] = useState<string | null>(null);

  const handleTotalChange = useCallback((text: string) => {
    setTotal(text);
    validateAndUpdate({
      total: parseFloat(text) || 0,
      funeral: parseFloat(funeral) || 0,
      debts: parseFloat(debts) || 0,
      will: parseFloat(will) || 0
    });
  }, [funeral, debts, will]);

  const handleFuneralChange = useCallback((text: string) => {
    setFuneral(text);
    validateAndUpdate({
      total: parseFloat(total) || 0,
      funeral: parseFloat(text) || 0,
      debts: parseFloat(debts) || 0,
      will: parseFloat(will) || 0
    });
  }, [total, debts, will]);

  const handleDebtsChange = useCallback((text: string) => {
    setDebts(text);
    validateAndUpdate({
      total: parseFloat(total) || 0,
      funeral: parseFloat(funeral) || 0,
      debts: parseFloat(text) || 0,
      will: parseFloat(will) || 0
    });
  }, [total, funeral, will]);

  const handleWillChange = useCallback((text: string) => {
    setWill(text);
    validateAndUpdate({
      total: parseFloat(total) || 0,
      funeral: parseFloat(funeral) || 0,
      debts: parseFloat(debts) || 0,
      will: parseFloat(text) || 0
    });
  }, [total, funeral, debts]);

  const validateAndUpdate = (estate: EstateData) => {
    // التحقق من الصحة
    const funeralVal = estate.funeral ?? estate.funeralCosts ?? 0;
    const debtsVal = estate.debts ?? 0;
    const willVal = estate.will ?? estate.willAmount ?? 0;
    
    if (estate.total < 0 || funeralVal < 0 || debtsVal < 0 || willVal < 0) {
      setError('جميع القيم يجب أن تكون موجبة');
      return;
    }

    if (estate.total === 0) {
      setError('التركة يجب أن تكون أكبر من صفر');
      return;
    }

    setError(null);
    updateEstateData(estate);
    onEstateChange?.(estate);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>بيانات التركة</Text>
      <Text style={styles.subtitle}>Estate Financial Data</Text>

      {/* إجمالي التركة */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>إجمالي التركة</Text>
        <TextInput
          style={styles.input}
          placeholder="Total Estate"
          placeholderTextColor="#999"
          value={total}
          onChangeText={handleTotalChange}
          keyboardType="decimal-pad"
          editable={true}
        />
      </View>

      {/* تكاليف الجنازة */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>تكاليف الجنازة</Text>
        <TextInput
          style={styles.input}
          placeholder="Funeral Costs"
          placeholderTextColor="#999"
          value={funeral}
          onChangeText={handleFuneralChange}
          keyboardType="decimal-pad"
        />
      </View>

      {/* الديون */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>الديون</Text>
        <TextInput
          style={styles.input}
          placeholder="Debts"
          placeholderTextColor="#999"
          value={debts}
          onChangeText={handleDebtsChange}
          keyboardType="decimal-pad"
        />
      </View>

      {/* الوصية */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>الوصية (اختياري)</Text>
        <TextInput
          style={styles.input}
          placeholder="Will (Optional)"
          placeholderTextColor="#999"
          value={will}
          onChangeText={handleWillChange}
          keyboardType="decimal-pad"
        />
      </View>

      {/* رسالة الخطأ */}
      {error && <Text style={styles.errorText}>{error}</Text>}

      {/* ملخص التركة */}
      <View style={styles.summary}>
        <Text style={styles.summaryTitle}>ملخص التركة</Text>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>الإجمالي:</Text>
          <Text style={styles.summaryValue}>{parseFloat(total) || 0}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>بعد الخصومات:</Text>
          <Text style={styles.summaryValue}>
            {(parseFloat(total) || 0) - (parseFloat(funeral) || 0) - (parseFloat(debts) || 0)}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginBottom: 16
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
    textAlign: 'right'
  },
  subtitle: {
    fontSize: 12,
    color: '#666',
    marginBottom: 16,
    textAlign: 'right'
  },
  inputGroup: {
    marginBottom: 12
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
    textAlign: 'right'
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 10,
    fontSize: 14,
    color: '#333',
    backgroundColor: '#fff',
    textAlign: 'right'
  },
  errorText: {
    fontSize: 12,
    color: '#d32f2f',
    marginBottom: 12,
    textAlign: 'right'
  },
  summary: {
    backgroundColor: '#e3f2fd',
    padding: 12,
    borderRadius: 6,
    marginTop: 12
  },
  summaryTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1976d2',
    marginBottom: 8,
    textAlign: 'right'
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6
  },
  summaryLabel: {
    fontSize: 12,
    color: '#333',
    textAlign: 'right'
  },
  summaryValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1976d2'
  }
});

export default EstateInput;
