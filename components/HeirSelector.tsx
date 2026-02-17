/**
 * @file HeirSelector.tsx
 * @description اختيار الوارثون
 * Heir Selection Component for Phase 5
 * 
 * إضافة وإدارة الوارثون بشكل ديناميكي
 */

import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Modal,
  Alert
} from 'react-native';
import { useHeirs } from '../lib/inheritance/hooks';
import type { HeirsData, HeirType } from '../lib/inheritance/types';
import { HeirValidator } from '../lib/validation/InputValidator';
import type { ValidationResult } from '../lib/validation/InputValidator';

export interface HeirSelectorProps {
  onHeirsChange?: (heirs: HeirsData) => void;
}

const HEIR_TYPES: { key: HeirType; label: string; emoji: string }[] = [
  { key: 'husband', label: 'الزوج', emoji: '💍' },
  { key: 'wife', label: 'الزوجة', emoji: '💍' },
  { key: 'son', label: 'الابن', emoji: '👦' },
  { key: 'daughter', label: 'البنت', emoji: '👧' },
  { key: 'father', label: 'الأب', emoji: '👨' },
  { key: 'mother', label: 'الأم', emoji: '👩' },
  { key: 'grandfather', label: 'الجد', emoji: '👴' },
  { key: 'full_brother', label: 'الأخ الشقيق', emoji: '👨‍🤝‍👨' },
  { key: 'full_sister', label: 'الأخت الشقيقة', emoji: '👩‍🤝‍👩' },
  { key: 'half_brother_paternal', label: 'الأخ لأب', emoji: '👨' }
];

/**
 * مكون اختيار الوارثون
 * Displays and manages heir selection
 */
export function HeirSelector({ onHeirsChange }: HeirSelectorProps) {
  const { heirs } = useHeirs();
  const [showModal, setShowModal] = useState(false);
  const [selectedHeirType, setSelectedHeirType] = useState<HeirType>('son');
  const [selectedCount, setSelectedCount] = useState(1);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [modalError, setModalError] = useState<string | null>(null);

  // Convert array heirs to HeirsData object
  const heirsArray = (heirs as any) || [];
  const safeHeirs: HeirsData = useMemo(() => {
    const result: HeirsData = {};
    if (Array.isArray(heirsArray)) {
      heirsArray.forEach((heir: any) => {
        result[heir.key] = heir.count;
      });
    }
    return result;
  }, [heirsArray]);

  const handleAddHeir = useCallback(() => {
    try {
      if (!selectedHeirType) {
        setModalError('يجب اختيار نوع الوارث');
        return;
      }

      if (selectedCount < 1 || selectedCount > 100) {
        setModalError('العدد يجب أن يكون بين 1 و 100');
        return;
      }

      // تحديث الوارثون
      const newHeirs: HeirsData = { ...safeHeirs };
      newHeirs[selectedHeirType] = selectedCount;
      
      // Validate updated heirs list
      const validation = HeirValidator.validate(newHeirs);
      setValidationResult(validation);
      
      if (validation.isValid) {
        onHeirsChange?.(newHeirs);
        setModalError(null);
        setShowModal(false);
      } else {
        // Show first error in modal
        const firstError = validation.errors[0];
        setModalError(firstError.userMessage);
      }
    } catch (err) {
      setModalError(err instanceof Error ? err.message : 'خطأ في إضافة الوارث');
    }
  }, [selectedHeirType, selectedCount, safeHeirs, onHeirsChange]);

  const handleRemoveHeir = useCallback((heirType: HeirType) => {
    Alert.alert(
      'تأكيد الحذف',
      'هل تريد حذف هذا الوارث؟',
      [
        { text: 'إلغاء', onPress: () => {} },
        {
          text: 'حذف',
          onPress: () => {
            const newHeirs: HeirsData = { ...safeHeirs };
            delete newHeirs[heirType];
            
            // Validate updated heirs list
            const validation = HeirValidator.validate(newHeirs);
            setValidationResult(validation);
            
            onHeirsChange?.(newHeirs);
          }
        }
      ]
    );
  }, [safeHeirs, onHeirsChange]);

  const handleClearAll = useCallback(() => {
    Alert.alert(
      'مسح الكل',
      'هل تريد مسح جميع الوارثون؟',
      [
        { text: 'إلغاء', onPress: () => {} },
        {
          text: 'مسح',
          onPress: () => {
            const emptyHeirs: HeirsData = {};
            
            // Validate empty heirs (will show error)
            const validation = HeirValidator.validate(emptyHeirs);
            setValidationResult(validation);
            
            onHeirsChange?.(emptyHeirs);
          }
        }
      ]
    );
  }, [onHeirsChange]);

  const heirEntries = Object.entries(safeHeirs);
  const totalHeirs = Object.values(safeHeirs).reduce((sum: number, count: number | undefined) => sum + (count || 0), 0);

  return (
    <View style={styles.container}>
      {/* الزر الرئيسي لإضافة الوارثون */}
      {/* Validation Errors/Warnings */}
      {validationResult && validationResult.errors.length > 0 && (
        <View style={[styles.feedbackContainer, styles.feedbackErrorContainer]}>
          {validationResult.errors.map((error, index) => (
            <View key={`error-${index}`} style={styles.feedbackItem}>
              <Text style={styles.feedbackIcon}>❌</Text>
              <View style={styles.feedbackText}>
                <Text style={styles.feedbackUserMessage}>{error.userMessage}</Text>
                {error.suggestion && (
                  <Text style={styles.feedbackSuggestion}>{error.suggestion}</Text>
                )}
              </View>
            </View>
          ))}
        </View>
      )}

      {validationResult && validationResult.warnings.length > 0 && (
        <View style={[styles.feedbackContainer, styles.feedbackWarningContainer]}>
          {validationResult.warnings.map((warning, index) => (
            <View key={`warning-${index}`} style={styles.feedbackItem}>
              <Text style={styles.feedbackIcon}>⚠️</Text>
              <View style={styles.feedbackText}>
                <Text style={styles.feedbackUserMessage}>{warning.userMessage}</Text>
                {warning.suggestion && (
                  <Text style={styles.feedbackSuggestion}>{warning.suggestion}</Text>
                )}
              </View>
            </View>
          ))}
        </View>
      )}

      {/* الزر الرئيسي لإضافة الوارثون */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => {
          setShowModal(true);
          setModalError(null);
        }}
      >
        <Text style={styles.addButtonText}>+ إضافة وارث</Text>
      </TouchableOpacity>

      {/* قائمة الوارثون الحاليين */}
      {heirEntries.length > 0 ? (
        <View style={styles.heirsListContainer}>
          <Text style={styles.heirsListTitle}>الوارثون المضافون:</Text>
          <ScrollView style={styles.heirsList} scrollEnabled={false}>
            {heirEntries.map(([heirTypeStr, count]: [string, number | undefined]) => {
              const heirType = heirTypeStr as HeirType;
              const heirLabel = HEIR_TYPES.find(h => h.key === heirType)?.label || heirTypeStr;
              const emoji = HEIR_TYPES.find(h => h.key === heirType)?.emoji || '👤';
              return (
                <View key={heirTypeStr} style={styles.heirItem}>
                  <View style={styles.heirInfo}>
                    <Text style={styles.heirEmoji}>{emoji}</Text>
                    <View style={styles.heirDetails}>
                      <Text style={styles.heirLabel}>{heirLabel}</Text>
                      <Text style={styles.heirCount}>العدد: {count}</Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleRemoveHeir(heirType)}
                  >
                    <Text style={styles.deleteButtonText}>✕</Text>
                  </TouchableOpacity>
                </View>
              );
            })}
          </ScrollView>

          {/* إحصائيات */}
          <View style={styles.statsContainer}>
            <Text style={styles.statsText}>إجمالي الوارثون: {totalHeirs}</Text>
            <Text style={styles.statsText}>عدد الأنواع: {heirEntries.length}</Text>
          </View>

          {/* زر مسح الكل */}
          {heirEntries.length > 0 && (
            <TouchableOpacity
              style={styles.clearButton}
              onPress={handleClearAll}
            >
              <Text style={styles.clearButtonText}>مسح الكل</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>لم يتم إضافة أي وارثون بعد</Text>
        </View>
      )}

      {/* الـ Modal لإضافة وارث جديد */}
      <Modal
        visible={showModal}
        transparent
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>إضافة وارث جديد</Text>
              <TouchableOpacity onPress={() => setShowModal(false)}>
                <Text style={styles.modalCloseButton}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* اختيار نوع الوارث */}
            <Text style={styles.modalLabel}>اختر نوع الوارث:</Text>
            <ScrollView style={styles.heirTypesGrid} scrollEnabled={true}>
              {HEIR_TYPES.map(heirType => (
                <TouchableOpacity
                  key={heirType.key}
                  style={[
                    styles.heirTypeButton,
                    selectedHeirType === heirType.key && styles.heirTypeButtonSelected
                  ]}
                  onPress={() => setSelectedHeirType(heirType.key)}
                >
                  <Text style={styles.heirTypeEmoji}>{heirType.emoji}</Text>
                  <Text style={styles.heirTypeLabel}>{heirType.label}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* اختيار العدد */}
            <Text style={styles.modalLabel}>اختر العدد:</Text>
            <View style={styles.countSelector}>
              {[1, 2, 3, 4, 5].map(count => (
                <TouchableOpacity
                  key={count}
                  style={[
                    styles.countButton,
                    selectedCount === count && styles.countButtonSelected
                  ]}
                  onPress={() => setSelectedCount(count)}
                >
                  <Text style={[
                    styles.countButtonText,
                    selectedCount === count && styles.countButtonTextSelected
                  ]}>
                    {count}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Modal Error Message */}
            {modalError && (
              <View style={styles.modalErrorContainer}>
                <Text style={styles.modalErrorText}>{modalError}</Text>
              </View>
            )}

            {/* أزرار الإجراء */}
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  setShowModal(false);
                  setModalError(null);
                }}
              >
                <Text style={styles.cancelButtonText}>إلغاء</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.confirmButton}
                onPress={handleAddHeir}
              >
                <Text style={styles.confirmButtonText}>تأكيد</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8
  },
  addButton: {
    backgroundColor: '#4caf50',
    borderRadius: 6,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    marginBottom: 12
  },
  addButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600'
  },
  heirsListContainer: {
    marginTop: 8
  },
  heirsListTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    textAlign: 'right'
  },
  heirsList: {
    maxHeight: 200
  },
  heirItem: {
    flexDirection: 'row',
    backgroundColor: '#f9f9f9',
    borderRadius: 6,
    padding: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  heirInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1
  },
  heirEmoji: {
    fontSize: 24,
    marginLeft: 12
  },
  heirDetails: {
    flex: 1
  },
  heirLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
    textAlign: 'right'
  },
  heirCount: {
    fontSize: 11,
    color: '#666',
    textAlign: 'right',
    marginTop: 2
  },
  deleteButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#ffebee',
    justifyContent: 'center',
    alignItems: 'center'
  },
  deleteButtonText: {
    color: '#d32f2f',
    fontSize: 16,
    fontWeight: 'bold'
  },
  statsContainer: {
    backgroundColor: '#e3f2fd',
    borderRadius: 6,
    padding: 10,
    borderWidth: 1,
    borderColor: '#1976d2',
    marginTop: 8
  },
  statsText: {
    fontSize: 12,
    color: '#1976d2',
    fontWeight: '500',
    textAlign: 'right',
    marginVertical: 2
  },
  clearButton: {
    backgroundColor: '#d32f2f',
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: 'center',
    marginTop: 8
  },
  clearButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600'
  },
  emptyState: {
    paddingVertical: 24,
    alignItems: 'center'
  },
  emptyStateText: {
    fontSize: 12,
    color: '#999'
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end'
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    padding: 16,
    maxHeight: '80%'
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0'
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333'
  },
  modalCloseButton: {
    fontSize: 24,
    color: '#666'
  },
  modalLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    textAlign: 'right'
  },
  heirTypesGrid: {
    maxHeight: 150,
    marginBottom: 12
  },
  heirTypeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 6,
    borderWidth: 2,
    borderColor: 'transparent'
  },
  heirTypeButtonSelected: {
    backgroundColor: '#e3f2fd',
    borderColor: '#1976d2'
  },
  heirTypeEmoji: {
    fontSize: 20,
    marginLeft: 8
  },
  heirTypeLabel: {
    fontSize: 13,
    color: '#333',
    flex: 1,
    textAlign: 'right'
  },
  countSelector: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12
  },
  countButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ddd'
  },
  countButtonSelected: {
    backgroundColor: '#1976d2',
    borderColor: '#1976d2'
  },
  countButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333'
  },
  countButtonTextSelected: {
    color: '#fff'
  },
  errorContainer: {
    backgroundColor: '#ffebee',
    borderRadius: 6,
    padding: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ef5350'
  },
  errorText: {
    color: '#d32f2f',
    fontSize: 12,
    textAlign: 'center'
  },
  modalErrorContainer: {
    backgroundColor: '#ffebee',
    borderRadius: 6,
    padding: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#d32f2f'
  },
  modalErrorText: {
    color: '#d32f2f',
    fontSize: 13,
    fontWeight: '500',
    textAlign: 'right'
  },
  feedbackContainer: {
    borderRadius: 6,
    padding: 12,
    marginVertical: 8,
    marginHorizontal: 0
  },
  feedbackErrorContainer: {
    backgroundColor: '#ffebee',
    borderLeftWidth: 4,
    borderLeftColor: '#d32f2f'
  },
  feedbackWarningContainer: {
    backgroundColor: '#fff3e0',
    borderLeftWidth: 4,
    borderLeftColor: '#f57c00'
  },
  feedbackItem: {
    flexDirection: 'row',
    marginBottom: 8
  },
  feedbackIcon: {
    fontSize: 16,
    marginRight: 8,
    marginTop: 2
  },
  feedbackText: {
    flex: 1
  },
  feedbackUserMessage: {
    fontSize: 13,
    fontWeight: '500',
    color: '#333',
    textAlign: 'right',
    marginBottom: 4
  },
  feedbackSuggestion: {
    fontSize: 12,
    color: '#666',
    textAlign: 'right',
    fontStyle: 'italic',
    marginTop: 2
  },
  modalActions: {
    flexDirection: 'row',
    gap: 8
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 6,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd'
  },
  cancelButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666'
  },
  confirmButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#1976d2',
    borderRadius: 6,
    alignItems: 'center'
  },
  confirmButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#fff'
  }
});

export default HeirSelector;
