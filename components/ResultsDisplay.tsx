/**
 * @file ResultsDisplay.tsx
 * @description عرض النتائج والتوزيع
 * Results Display Component for Phase 5
 * 
 * عرض شامل لنتائج الحساب والتوزيع
 */

import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert
} from 'react-native';
import { useResults } from '../lib/inheritance/hooks';
import type { CalculationResult } from '../lib/inheritance/types';

export interface ResultsDisplayProps {
  result?: CalculationResult | null;
  onClose?: () => void;
}

/**
 * مكون عرض النتائج
 * Displays calculation results with distribution details
 */
export function ResultsDisplay({ result, onClose }: ResultsDisplayProps) {
  const hooksResults = useResults();
  const results = hooksResults?.previousResults || [];
  const [showComparison, setShowComparison] = useState(false);
  const [selectedResultId, setSelectedResultId] = useState<number | null>(null);

  const currentResult = result || results[0];
  const previousResults = results.slice(1, 4);

  const stats_data = useMemo(() => {
    return {
      totalResults: results ? results.length : 0,
      currentResult: 1,
      madhabs: {}
    };
  }, [results]);

  if (!currentResult || !currentResult.success) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateTitle}>لا توجد نتائج</Text>
          <Text style={styles.emptyStateText}>قم بإجراء عملية حساب أولاً</Text>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* رأس النتائج */}
      <View style={styles.header}>
        <View style={styles.madhhabBadge}>
          <Text style={styles.madhhabBadgeText}>{currentResult.madhhabName}</Text>
        </View>
        <Text style={styles.title}>نتائج التوزيع</Text>
        {currentResult.calculationTime && (
          <Text style={styles.calculationTime}>
            وقت الحساب: {currentResult.calculationTime}ms
          </Text>
        )}
      </View>

      {/* حالات خاصة */}
      {currentResult.specialCases && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>حالات خاصة</Text>
          <View style={styles.specialCases}>
            {currentResult.awlApplied && (
              <View style={styles.specialCaseItem}>
                <Text style={styles.specialCaseLabel}>العول:</Text>
                <Text style={styles.specialCaseValue}>مطبق</Text>
              </View>
            )}
            {currentResult.raddApplied && (
              <View style={styles.specialCaseItem}>
                <Text style={styles.specialCaseLabel}>الرد:</Text>
                <Text style={styles.specialCaseValue}>مطبق</Text>
              </View>
            )}
            {currentResult.blockedHeirs && 
              currentResult.blockedHeirs.length > 0 && (
              <View style={styles.hijabContainer}>
                <Text style={styles.hijabLabel}>المحجوبون:</Text>
                {currentResult.blockedHeirs.map((heir: string, idx: number) => (
                  <Text key={idx} style={styles.hijabType}>• {heir}</Text>
                ))}
              </View>
            )}
          </View>
        </View>
      )}

      {/* جدول التوزيع */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>جدول التوزيع</Text>
        <View style={styles.table}>
          {/* رأس الجدول */}
          <View style={styles.tableHeader}>
            <Text style={styles.tableHeaderCell}>المبلغ</Text>
            <Text style={styles.tableHeaderCell}>النسبة</Text>
            <Text style={styles.tableHeaderCell}>الوارث</Text>
          </View>

          {/* صفوف الجدول */}
          {currentResult.shares && currentResult.shares.map((share: any, index: number) => (
            <View
              key={index}
              style={[
                styles.tableRow,
                index % 2 === 1 && styles.tableRowAlternate
              ]}
            >
              <Text style={styles.tableCell}>
                {share.amount.toFixed(2)} ر.س
              </Text>
              <Text style={styles.tableCell}>
                {share.fraction.numerator}/{share.fraction.denominator}
              </Text>
              <Text style={styles.tableCell}>{share.name}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* الملخص المالي */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>الملخص المالي</Text>
        <View style={styles.summaryContainer}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>إجمالي التركة:</Text>
            <Text style={styles.summaryValue}>
              {currentResult.shares.reduce((sum: number, s: any) => sum + s.amount, 0).toFixed(2)} ر.س
            </Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>مستوى الثقة:</Text>
            <Text style={[
              styles.summaryValue,
              { color: currentResult.confidence > 90 ? '#4caf50' : '#ff9800' }
            ]}>
              {currentResult.confidence}%
            </Text>
          </View>
        </View>
      </View>

      {/* خطوات الحساب */}
      {currentResult.steps && currentResult.steps.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>خطوات الحساب</Text>
          <ScrollView style={styles.stepsContainer} scrollEnabled={true}>
            {currentResult.steps.map((step: any, index: number) => (
              <View key={index} style={styles.step}>
                <View style={styles.stepHeader}>
                  <Text style={styles.stepNumber}>{step.stepNumber}</Text>
                  <Text style={styles.stepTitle}>{step.title}</Text>
                </View>
                <Text style={styles.stepDescription}>{step.description}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      )}

      {/* النتائج السابقة */}
      {previousResults && previousResults.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>النتائج السابقة</Text>
          <ScrollView style={styles.historyContainer} scrollEnabled={true}>
            {previousResults.map((prevResult: any, index: number) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.historyItem,
                  selectedResultId === index && styles.historyItemSelected
                ]}
                onPress={() => setSelectedResultId(index)}
              >
                <Text style={styles.historyItemMadhab}>{prevResult.madhhabName}</Text>
                <Text style={styles.historyItemAmount}>
                  {prevResult.shares.reduce((sum: number, s: any) => sum + s.amount, 0).toFixed(0)} ر.س
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* زر المقارنة */}
      {previousResults && previousResults.length > 0 && (
        <TouchableOpacity
          style={styles.comparisonButton}
          onPress={() => setShowComparison(!showComparison)}
        >
          <Text style={styles.comparisonButtonText}>
            {showComparison ? '▼ مقارنة المذاهب' : '▶ مقارنة المذاهب'}
          </Text>
        </TouchableOpacity>
      )}

      {/* الإحصائيات */}
      {showComparison && stats_data && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>الإحصائيات</Text>
          <View style={styles.statsContainer}>
            <View style={styles.statRow}>
              <Text style={styles.statValue}>{stats_data.totalResults}</Text>
              <Text style={styles.statLabel}>إجمالي الحسابات</Text>
            </View>
            <View style={styles.statRow}>
              <Text style={styles.statValue}>{stats_data.currentResult}</Text>
              <Text style={styles.statLabel}>النتيجة الحالية</Text>
            </View>
          </View>
        </View>
      )}

      {/* زر الإغلاق */}
      {onClose && (
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeButtonText}>إغلاق</Text>
        </TouchableOpacity>
      )}

      <View style={{ height: 20 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  header: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    marginBottom: 12
  },
  madhhabBadge: {
    backgroundColor: '#e3f2fd',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignSelf: 'flex-end',
    marginBottom: 6
  },
  madhhabBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1976d2'
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 6
  },
  calculationTime: {
    fontSize: 11,
    color: '#999',
    textAlign: 'center'
  },
  section: {
    marginHorizontal: 12,
    marginBottom: 12,
    backgroundColor: '#fff',
    borderRadius: 6,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0'
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#333',
    marginBottom: 10,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    textAlign: 'right'
  },
  emptyState: {
    paddingVertical: 40,
    alignItems: 'center'
  },
  emptyStateTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6
  },
  emptyStateText: {
    fontSize: 12,
    color: '#999'
  },
  specialCases: {
    backgroundColor: '#fff3e0',
    borderRadius: 4,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ffb74d'
  },
  specialCaseItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4
  },
  specialCaseLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333'
  },
  specialCaseValue: {
    fontSize: 12,
    color: '#ff9800',
    fontWeight: '600'
  },
  hijabContainer: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#ffe0b2'
  },
  hijabLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4
  },
  hijabType: {
    fontSize: 11,
    color: '#666',
    marginVertical: 2
  },
  table: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    overflow: 'hidden'
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#1976d2',
    padding: 8
  },
  tableHeaderCell: {
    flex: 1,
    fontSize: 11,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center'
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#f9f9f9'
  },
  tableRowAlternate: {
    backgroundColor: '#fff'
  },
  tableCell: {
    flex: 1,
    fontSize: 11,
    color: '#333',
    textAlign: 'center'
  },
  summaryContainer: {
    backgroundColor: '#e8f5e9',
    borderRadius: 4,
    padding: 10,
    borderWidth: 1,
    borderColor: '#81c784'
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6
  },
  summaryLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#333'
  },
  summaryValue: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2e7d32'
  },
  stepsContainer: {
    maxHeight: 200
  },
  step: {
    backgroundColor: '#f5f5f5',
    borderRadius: 4,
    padding: 10,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#1976d2'
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6
  },
  stepNumber: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1976d2',
    marginRight: 8
  },
  stepTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
    flex: 1
  },
  stepDescription: {
    fontSize: 11,
    color: '#666',
    textAlign: 'right'
  },
  historyContainer: {
    maxHeight: 150
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#f9f9f9',
    borderRadius: 4,
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginBottom: 6,
    borderWidth: 2,
    borderColor: 'transparent'
  },
  historyItemSelected: {
    backgroundColor: '#e3f2fd',
    borderColor: '#1976d2'
  },
  historyItemMadhab: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1976d2'
  },
  historyItemAmount: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333'
  },
  comparisonButton: {
    marginHorizontal: 12,
    marginBottom: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#e3f2fd',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#1976d2'
  },
  comparisonButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1976d2',
    textAlign: 'center'
  },
  statsContainer: {
    backgroundColor: '#f3e5f5',
    borderRadius: 4,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ce93d8'
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#333'
  },
  statValue: {
    fontSize: 12,
    fontWeight: '700',
    color: '#7b1fa2'
  },
  closeButton: {
    marginHorizontal: 12,
    marginTop: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#d32f2f',
    borderRadius: 6,
    alignItems: 'center'
  },
  closeButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#fff'
  }
});

export default ResultsDisplay;
