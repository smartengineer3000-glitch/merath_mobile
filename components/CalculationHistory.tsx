/**
 * @file CalculationHistory.tsx
 * @description سجل الحسابات السابقة
 * Calculation History Component for Phase 5
 * 
 * عرض وإدارة السجل الشامل للعمليات والحسابات
 */

import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { useAuditLog } from '../lib/inheritance/hooks';
import { MadhhabType } from '../lib/inheritance/types';

export interface CalculationHistoryProps {
  onEntrySelect?: (entryId: string) => void;
}

/**
 * مكون سجل الحسابات
 * Displays and manages audit log history
 */
export function CalculationHistory({ onEntrySelect }: CalculationHistoryProps) {
  const { auditLog } = useAuditLog();
  const [selectedMadhab, setSelectedMadhab] = useState<MadhhabType | 'all'>('all');
  const [searchText, setSearchText] = useState('');
  const [showStats, setShowStats] = useState(false);

  const stats = useMemo(() => {
    return auditLog?.getStats();
  }, [auditLog]);

  const filteredEntries = useMemo(() => {
    if (!auditLog) return [];

    let entries = auditLog.getAllEntries();

    // تصفية حسب المذهب
    if (selectedMadhab !== 'all') {
      entries = entries.filter(e => e.madhab === selectedMadhab);
    }

    // تصفية حسب البحث
    if (searchText.trim()) {
      entries = entries.filter(e => {
        const searchLower = searchText.toLowerCase();
        return (
          e.madhab.toLowerCase().includes(searchLower) ||
          e.metadata.notes?.toLowerCase().includes(searchLower) ||
          e.id.includes(searchText)
        );
      });
    }

    return entries;
  }, [auditLog, selectedMadhab, searchText]);

  const handleExport = useCallback(() => {
    if (!auditLog) return;
    const json = auditLog.exportAsJSON();
    // في تطبيق حقيقي، سيتم حفظ الملف أو مشاركته
    console.log('Export Data:', json);
  }, [auditLog]);

  const handleClearHistory = useCallback(() => {
    if (auditLog && confirm('هل أنت متأكد من حذف السجل بالكامل؟')) {
      auditLog.clearAll();
    }
  }, [auditLog]);

  const handleDeleteEntry = useCallback((entryId: string) => {
    if (auditLog && confirm('هل أنت متأكد من حذف هذا الإدخال؟')) {
      auditLog.deleteEntry(entryId);
    }
  }, [auditLog]);

  if (!auditLog) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>فشل تحميل السجل</Text>
      </View>
    );
  }

  const entries = auditLog.getAllEntries();

  return (
    <ScrollView style={styles.container}>
      {/* رأس السجل */}
      <View style={styles.header}>
        <Text style={styles.title}>سجل الحسابات</Text>
        <Text style={styles.subtitle}>Calculation History</Text>
      </View>

      {/* شريط البحث والتصفية */}
      <View style={styles.filterBar}>
        <TextInput
          style={styles.searchInput}
          placeholder="بحث..."
          placeholderTextColor="#999"
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      {/* تصفية حسب المذهب */}
      <View style={styles.madhhabFilter}>
        <Text style={styles.filterLabel}>تصفية حسب المذهب:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.madhhabFilterList}>
          {['all', 'hanafi', 'maliki', 'shafii', 'hanbali'].map(madhab => (
            <TouchableOpacity
              key={madhab}
              style={[
                styles.madhhabFilterButton,
                selectedMadhab === madhab && styles.madhhabFilterButtonActive
              ]}
              onPress={() => setSelectedMadhab(madhab as any)}
            >
              <Text
                style={[
                  styles.madhhabFilterButtonText,
                  selectedMadhab === madhab && styles.madhhabFilterButtonTextActive
                ]}
              >
                {madhab === 'all' ? 'الكل' : madhab}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* الإحصائيات */}
      <TouchableOpacity
        style={styles.statsToggle}
        onPress={() => setShowStats(!showStats)}
      >
        <Text style={styles.statsToggleText}>
          {showStats ? '▼ الإحصائيات' : '▶ الإحصائيات'}
        </Text>
      </TouchableOpacity>

      {showStats && stats && (
        <View style={styles.statsContainer}>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>إجمالي العمليات:</Text>
            <Text style={styles.statValue}>{stats.totalEntries}</Text>
          </View>

          <View style={styles.statRow}>
            <Text style={styles.statLabel}>العمليات الناجحة:</Text>
            <Text style={styles.statValue}>{stats.successfulOperations}</Text>
          </View>

          <View style={styles.statRow}>
            <Text style={styles.statLabel}>العمليات الفاشلة:</Text>
            <Text style={styles.statValue}>{stats.failedOperations}</Text>
          </View>

          <View style={styles.statRow}>
            <Text style={styles.statLabel}>معدل النجاح:</Text>
            <Text style={[styles.statValue, { color: '#4caf50' }]}>
              {(stats.successRate * 100).toFixed(1)}%
            </Text>
          </View>

          {stats.madhabs && Object.keys(stats.madhabs).length > 0 && (
            <View style={styles.madhhabStats}>
              <Text style={styles.madhhabStatsTitle}>استخدام المذاهب:</Text>
              {Object.entries(stats.madhabs).map(([madhab, count]) => (
                <View key={madhab} style={styles.madhhabStatRow}>
                  <Text style={styles.madhhabStatLabel}>{madhab}:</Text>
                  <Text style={styles.madhhabStatValue}>{count}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      )}

      {/* قائمة الإدخالات */}
      <View style={styles.entriesHeader}>
        <Text style={styles.entriesHeaderText}>
          {filteredEntries.length > 0 ? `${filteredEntries.length} من ${entries.length} إدخال` : 'لا توجد إدخالات'}
        </Text>
      </View>

      {filteredEntries.length > 0 ? (
        <View style={styles.entriesList}>
          {filteredEntries.map((entry, index) => (
            <View key={entry.id} style={[styles.entryItem, index % 2 === 1 && styles.entryItemAlternate]}>
              <View style={styles.entryContent}>
                <View style={styles.entryHeader}>
                  <Text style={styles.entryMadhab}>{entry.madhab}</Text>
                  <Text style={[
                    styles.entrySuccess,
                    entry.metadata.success ? styles.entrySuccessTrue : styles.entrySuccessFalse
                  ]}>
                    {entry.metadata.success ? '✓ نجح' : '✗ فشل'}
                  </Text>
                </View>

                <Text style={styles.entryTimestamp}>
                  {new Date(entry.timestamp).toLocaleString('ar-SA')}
                </Text>

                {entry.metadata.notes && (
                  <Text style={styles.entryNotes}>{entry.metadata.notes}</Text>
                )}

                <View style={styles.entryDetails}>
                  <Text style={styles.entryDetail}>
                    الوارثون: {Object.keys(entry.heirs).length}
                  </Text>
                  {entry.metadata.duration && (
                    <Text style={styles.entryDetail}>
                      المدة: {entry.metadata.duration}ms
                    </Text>
                  )}
                </View>
              </View>

              <View style={styles.entryActions}>
                <TouchableOpacity
                  style={styles.entryActionButton}
                  onPress={() => onEntrySelect?.(entry.id)}
                >
                  <Text style={styles.entryActionButtonText}>عرض</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.entryActionButton, styles.entryActionButtonDelete]}
                  onPress={() => handleDeleteEntry(entry.id)}
                >
                  <Text style={styles.entryActionButtonDeleteText}>حذف</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>لا توجد سجلات مطابقة</Text>
        </View>
      )}

      {/* أزرار الإجراءات */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.actionButton} onPress={handleExport}>
          <Text style={styles.actionButtonText}>تصدير السجل</Text>
        </TouchableOpacity>

        {entries.length > 0 && (
          <TouchableOpacity
            style={[styles.actionButton, styles.actionButtonDelete]}
            onPress={handleClearHistory}
          >
            <Text style={styles.actionButtonDeleteText}>مسح السجل</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingBottom: 20
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    marginBottom: 16
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'right'
  },
  subtitle: {
    fontSize: 12,
    color: '#666',
    textAlign: 'right',
    marginTop: 4
  },
  errorText: {
    fontSize: 16,
    color: '#d32f2f',
    textAlign: 'center',
    marginTop: 20
  },
  filterBar: {
    paddingHorizontal: 16,
    marginBottom: 12
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 13,
    color: '#333',
    backgroundColor: '#fff',
    textAlign: 'right'
  },
  madhhabFilter: {
    paddingHorizontal: 16,
    marginBottom: 12
  },
  filterLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    textAlign: 'right'
  },
  madhhabFilterList: {
    flexDirection: 'row'
  },
  madhhabFilterButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#1976d2',
    marginLeft: 6,
    backgroundColor: '#fff'
  },
  madhhabFilterButtonActive: {
    backgroundColor: '#1976d2'
  },
  madhhabFilterButtonText: {
    fontSize: 11,
    color: '#1976d2',
    fontWeight: '500'
  },
  madhhabFilterButtonTextActive: {
    color: '#fff'
  },
  statsToggle: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 8
  },
  statsToggleText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1976d2'
  },
  statsContainer: {
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: '#e3f2fd',
    borderRadius: 6,
    padding: 12,
    borderWidth: 1,
    borderColor: '#1976d2'
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#b3e5fc'
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#333'
  },
  statValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1976d2'
  },
  madhhabStats: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#b3e5fc'
  },
  madhhabStatsTitle: {
    fontSize: 11,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
    textAlign: 'right'
  },
  madhhabStatRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4
  },
  madhhabStatLabel: {
    fontSize: 11,
    color: '#333'
  },
  madhhabStatValue: {
    fontSize: 11,
    fontWeight: '600',
    color: '#1976d2'
  },
  entriesHeader: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 8,
    backgroundColor: '#fff',
    borderRadius: 4
  },
  entriesHeaderText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    textAlign: 'right'
  },
  entriesList: {
    marginHorizontal: 16,
    marginBottom: 16
  },
  entryItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 6,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0'
  },
  entryItemAlternate: {
    backgroundColor: '#f9f9f9'
  },
  entryContent: {
    flex: 1
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6
  },
  entryMadhab: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1976d2'
  },
  entrySuccess: {
    fontSize: 11,
    fontWeight: '600'
  },
  entrySuccessTrue: {
    color: '#4caf50'
  },
  entrySuccessFalse: {
    color: '#d32f2f'
  },
  entryTimestamp: {
    fontSize: 11,
    color: '#999',
    marginBottom: 6
  },
  entryNotes: {
    fontSize: 11,
    color: '#666',
    marginBottom: 6,
    fontStyle: 'italic',
    textAlign: 'right'
  },
  entryDetails: {
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  entryDetail: {
    fontSize: 10,
    color: '#999',
    marginLeft: 12
  },
  entryActions: {
    flexDirection: 'row',
    gap: 6,
    marginLeft: 8
  },
  entryActionButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#e3f2fd',
    borderRadius: 4,
    alignItems: 'center'
  },
  entryActionButtonDelete: {
    backgroundColor: '#ffebee'
  },
  entryActionButtonText: {
    fontSize: 10,
    color: '#1976d2',
    fontWeight: '600'
  },
  entryActionButtonDeleteText: {
    fontSize: 10,
    color: '#d32f2f',
    fontWeight: '600'
  },
  emptyState: {
    marginHorizontal: 16,
    paddingVertical: 40,
    alignItems: 'center'
  },
  emptyStateText: {
    fontSize: 14,
    color: '#999'
  },
  actionsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 8
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#1976d2',
    borderRadius: 6,
    alignItems: 'center'
  },
  actionButtonDelete: {
    backgroundColor: '#d32f2f'
  },
  actionButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#fff'
  },
  actionButtonDeleteText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#fff'
  }
});

export default CalculationHistory;
