/**
 * @file AuditTrailScreen.tsx
 * @description Audit Trail / Calculation History Screen
 * Phase 5.1: Advanced Features - Comprehensive History Dashboard
 *
 * Main screen for viewing calculation history with filtering, sorting, and statistics
 */

import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Modal,
  Alert,
  FlatList,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { useAuditLog } from '../lib/inheritance/hooks';
import { AuditTrailManager } from '../lib/inheritance/audit-trail-manager';
import { AuditLogEntry } from '../lib/inheritance/audit-log';
import AuditTrailCard from '../components/AuditTrailCard';

export interface AuditTrailScreenProps {
  onSelectEntry?: (entry: AuditLogEntry) => void;
}

type SortField = 'timestamp' | 'madhab' | 'total' | 'confidence';
type SortOrder = 'asc' | 'desc';

/**
 * Audit Trail Screen Component
 * Main history dashboard with filtering, sorting, search, and statistics
 */
export function AuditTrailScreen({ onSelectEntry }: AuditTrailScreenProps) {
  const { entries: auditEntries, isLoading } = useAuditLog();

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMadhab, setSelectedMadhab] = useState<string | null>(null);
  const [dateFromText, setDateFromText] = useState('');
  const [dateToText, setDateToText] = useState('');
  const [minEstate, setMinEstate] = useState('');
  const [maxEstate, setMaxEstate] = useState('');

  // Sort State
  const [sortField, setSortField] = useState<SortField>('timestamp');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  // UI State
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  // Get unique madhabs for filter options
  const uniqueMadhabs = useMemo(
    () => AuditTrailManager.getUniqueMadhabs(auditEntries),
    [auditEntries]
  );

  // Parse filter inputs
  const dateFrom = dateFromText
    ? new Date(dateFromText)
    : undefined;
  const dateTo = dateToText
    ? new Date(dateToText)
    : undefined;
  const minEstateNum = minEstate ? parseFloat(minEstate) : undefined;
  const maxEstateNum = maxEstate ? parseFloat(maxEstate) : undefined;

  // Apply filters
  const filteredResult = useMemo(() => {
    return AuditTrailManager.filterEntries(auditEntries, {
      madhab: selectedMadhab || undefined,
      dateFrom,
      dateTo,
      searchTerm: searchTerm.trim(),
      minEstate: minEstateNum,
      maxEstate: maxEstateNum,
    });
  }, [
    auditEntries,
    selectedMadhab,
    dateFrom,
    dateTo,
    searchTerm,
    minEstateNum,
    maxEstateNum,
  ]);

  // Apply sort
  const sortedEntries = useMemo(() => {
    return AuditTrailManager.sortEntries(filteredResult.entries, {
      field: sortField,
      order: sortOrder,
    });
  }, [filteredResult.entries, sortField, sortOrder]);

  // Apply favorites filter if enabled
  const displayedEntries = useMemo(() => {
    if (!favoritesOnly) return sortedEntries;
    return sortedEntries.filter((entry) => favorites.has(entry.id || ''));
  }, [sortedEntries, favoritesOnly, favorites]);

  // Calculate statistics
  const stats = useMemo(() => {
    return AuditTrailManager.getStatistics(filteredResult.entries);
  }, [filteredResult.entries]);

  const handleToggleFavorite = useCallback((entryId: string) => {
    setFavorites((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(entryId)) {
        newSet.delete(entryId);
      } else {
        newSet.add(entryId);
      }
      return newSet;
    });
  }, []);

  const handleDeleteEntry = useCallback(
    (entryId: string) => {
      // In a real app, this would call an API to delete from database
      // For now, we'll just show a message
      Alert.alert(
        'حذف السجل',
        'سيتم حذف هذا السجل من صفحتك الشخصية',
        [
          {
            text: 'متابعة',
            onPress: () => {
              // Could dispatch action to delete entry
              setFavorites((prev) => {
                const newSet = new Set(prev);
                newSet.delete(entryId);
                return newSet;
              });
            },
          },
          { text: 'إلغاء' },
        ]
      );
    },
    []
  );

  const handleClearFilters = useCallback(() => {
    setSearchTerm('');
    setSelectedMadhab(null);
    setDateFromText('');
    setDateToText('');
    setMinEstate('');
    setMaxEstate('');
  }, []);

  const handleExportAll = useCallback(() => {
    const json = AuditTrailManager.exportAsJSON(displayedEntries);
    const content = JSON.stringify(json, null, 2);

    Alert.alert(
      'تصدير البيانات',
      'سيتم نسخ البيانات إلى الحافظة',
      [
        {
          text: 'موافق',
          onPress: () => {
            // In a real app, copy to clipboard and trigger share dialog
            console.log('Export data:', content);
            Alert.alert('متم', 'تم نسخ البيانات بنجاح');
          },
        },
        { text: 'إلغاء' },
      ]
    );
  }, [displayedEntries]);

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateIcon}>📋</Text>
      <Text style={styles.emptyStateTitle}>لا توجد حسابات سابقة</Text>
      <Text style={styles.emptyStateSubtitle}>
        ابدأ بحساب الميراث الأول لديك
      </Text>
    </View>
  );

  const renderFilterModal = () => (
    <Modal
      visible={filterModalVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setFilterModalVisible(false)}
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={() => setFilterModalVisible(false)}>
            <Text style={styles.modalCloseButton}>✕</Text>
          </TouchableOpacity>
          <Text style={styles.modalTitle}>تصفية البيانات</Text>
          <TouchableOpacity onPress={handleClearFilters}>
            <Text style={styles.modalClearButton}>مسح</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.modalContent}>
          {/* Search Input */}
          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>البحث</Text>
            <TextInput
              style={styles.filterInput}
              placeholder="ابحث عن اسم أو وصف..."
              placeholderTextColor="#999"
              value={searchTerm}
              onChangeText={setSearchTerm}
            />
          </View>

          {/* Madhab Filter */}
          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>المذهب الفقهي</Text>
            <View style={styles.madhhabOptions}>
              <TouchableOpacity
                style={[
                  styles.madhhabOption,
                  !selectedMadhab && styles.madhhabOptionSelected,
                ]}
                onPress={() => setSelectedMadhab(null)}
              >
                <Text style={styles.madhhabOptionText}>الكل</Text>
              </TouchableOpacity>
              {uniqueMadhabs.map((madhab) => (
                <TouchableOpacity
                  key={madhab}
                  style={[
                    styles.madhhabOption,
                    selectedMadhab === madhab &&
                    styles.madhhabOptionSelected,
                  ]}
                  onPress={() => setSelectedMadhab(madhab)}
                >
                  <Text style={styles.madhhabOptionText}>{madhab}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Date Range Filter */}
          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>النطاق الزمني</Text>
            <View style={styles.dateRangeInputs}>
              <TextInput
                style={styles.dateInput}
                placeholder="من (YYYY-MM-DD)"
                value={dateFromText}
                onChangeText={setDateFromText}
              />
              <Text style={styles.dateRangeSeparator}>→</Text>
              <TextInput
                style={styles.dateInput}
                placeholder="إلى (YYYY-MM-DD)"
                value={dateToText}
                onChangeText={setDateToText}
              />
            </View>
          </View>

          {/* Estate Range Filter */}
          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>نطاق المبلغ</Text>
            <View style={styles.estateRangeInputs}>
              <TextInput
                style={styles.estateInput}
                placeholder="من"
                keyboardType="decimal-pad"
                value={minEstate}
                onChangeText={setMinEstate}
              />
              <Text style={styles.estateRangeSeparator}>-</Text>
              <TextInput
                style={styles.estateInput}
                placeholder="إلى"
                keyboardType="decimal-pad"
                value={maxEstate}
                onChangeText={setMaxEstate}
              />
            </View>
          </View>

          {/* Statistics */}
          {filteredResult.entries.length > 0 && (
            <View style={styles.filterSection}>
              <Text style={styles.filterLabel}>إحصائيات</Text>
              <View style={styles.statsGrid}>
                <View style={styles.statCard}>
                  <Text style={styles.statLabel}>إجمالي</Text>
                  <Text style={styles.statValue}>
                    {filteredResult.entries.length}
                  </Text>
                </View>
                <View style={styles.statCard}>
                  <Text style={styles.statLabel}>المعدل</Text>
                  <Text style={styles.statValue}>
                    {stats.averageConfidence.toFixed(0)}%
                  </Text>
                </View>
              </View>
            </View>
          )}
        </ScrollView>

        <View style={styles.modalFooter}>
          <TouchableOpacity
            style={styles.modalActionButton}
            onPress={() => setFilterModalVisible(false)}
          >
            <Text style={styles.modalActionButtonText}>متابعة</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1976d2" />
        <Text style={styles.loadingText}>جاري تحميل السجلات...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>سجل الحسابات</Text>
        <Text style={styles.headerSubtitle}>
          {filteredResult.filtered}/{filteredResult.total} سجل
        </Text>
      </View>

      {/* Top Action Bar */}
      <View style={styles.actionBar}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => setFilterModalVisible(true)}
        >
          <Text style={styles.actionButtonIcon}>⚙️</Text>
          <Text style={styles.actionButtonText}>تصفية</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, favoritesOnly && styles.actionButtonActive]}
          onPress={() => setFavoritesOnly(!favoritesOnly)}
        >
          <Text style={styles.actionButtonIcon}>⭐</Text>
          <Text style={styles.actionButtonText}>المفضلة</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleExportAll}
        >
          <Text style={styles.actionButtonIcon}>📥</Text>
          <Text style={styles.actionButtonText}>تصدير</Text>
        </TouchableOpacity>
      </View>

      {/* Sort Options */}
      {displayedEntries.length > 0 && (
        <View style={styles.sortBar}>
          <Text style={styles.sortLabel}>ترتيب حسب:</Text>
          <TouchableOpacity
            style={styles.sortButton}
            onPress={() => {
              if (sortField === 'timestamp') {
                setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
              } else {
                setSortField('timestamp');
                setSortOrder('desc');
              }
            }}
          >
            <Text
              style={[
                styles.sortButtonText,
                sortField === 'timestamp' && styles.sortButtonTextActive,
              ]}
            >
              التاريخ {sortField === 'timestamp' && (sortOrder === 'asc' ? '⬆' : '⬇')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.sortButton}
            onPress={() => {
              if (sortField === 'madhab') {
                setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
              } else {
                setSortField('madhab');
                setSortOrder('asc');
              }
            }}
          >
            <Text
              style={[
                styles.sortButtonText,
                sortField === 'madhab' && styles.sortButtonTextActive,
              ]}
            >
              المذهب {sortField === 'madhab' && (sortOrder === 'asc' ? '⬆' : '⬇')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.sortButton}
            onPress={() => {
              if (sortField === 'confidence') {
                setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
              } else {
                setSortField('confidence');
                setSortOrder('desc');
              }
            }}
          >
            <Text
              style={[
                styles.sortButtonText,
                sortField === 'confidence' && styles.sortButtonTextActive,
              ]}
            >
              الثقة {sortField === 'confidence' && (sortOrder === 'asc' ? '⬆' : '⬇')}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Content */}
      {displayedEntries.length === 0 ? (
        renderEmptyState()
      ) : (
        <FlatList
          data={displayedEntries}
          keyExtractor={(item) => item.id || item.timestamp}
          renderItem={({ item }) => (
            <AuditTrailCard
              entry={item}
              onPress={onSelectEntry}
              onDelete={handleDeleteEntry}
              isFavorite={favorites.has(item.id || '')}
              onToggleFavorite={handleToggleFavorite}
            />
          )}
          contentContainerStyle={styles.listContainer}
          scrollEnabled={true}
        />
      )}

      {/* Filter Modal */}
      {renderFilterModal()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#666',
  },
  actionBar: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 6,
    gap: 4,
  },
  actionButtonActive: {
    backgroundColor: '#e3f2fd',
  },
  actionButtonIcon: {
    fontSize: 14,
  },
  actionButtonText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#333',
  },
  sortBar: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 6,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  sortLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: '#666',
    marginRight: 6,
  },
  sortButton: {
    paddingVertical: 6,
    paddingHorizontal: 8,
    backgroundColor: '#f9f9f9',
    borderRadius: 4,
  },
  sortButtonText: {
    fontSize: 10,
    color: '#666',
    fontWeight: '500',
  },
  sortButtonTextActive: {
    color: '#1976d2',
    fontWeight: '700',
  },
  listContainer: {
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 100,
  },
  emptyStateIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyStateTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  emptyStateSubtitle: {
    fontSize: 12,
    color: '#999',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 12,
    color: '#666',
    marginTop: 8,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalCloseButton: {
    fontSize: 24,
    color: '#999',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  modalClearButton: {
    fontSize: 12,
    color: '#1976d2',
    fontWeight: '600',
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  filterSection: {
    marginBottom: 16,
  },
  filterLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  filterInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 11,
    color: '#333',
  },
  madhhabOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  madhhabOption: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    backgroundColor: '#f9f9f9',
  },
  madhhabOptionSelected: {
    backgroundColor: '#1976d2',
    borderColor: '#1976d2',
  },
  madhhabOptionText: {
    fontSize: 11,
    color: '#333',
    fontWeight: '500',
  },
  dateRangeInputs: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dateInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 6,
    fontSize: 10,
    color: '#333',
  },
  dateRangeSeparator: {
    fontSize: 12,
    color: '#999',
  },
  estateRangeInputs: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  estateInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 6,
    fontSize: 10,
    color: '#333',
  },
  estateRangeSeparator: {
    fontSize: 12,
    color: '#999',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  statCard: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 8,
    backgroundColor: '#f5f5f5',
    borderRadius: 6,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 10,
    color: '#666',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1976d2',
  },
  modalFooter: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  modalActionButton: {
    backgroundColor: '#1976d2',
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  modalActionButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#fff',
  },
});

export default AuditTrailScreen;
