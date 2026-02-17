/**
 * @file AuditTrailCard.tsx
 * @description Individual Audit Trail Entry Card Component
 * Phase 5.1: Advanced Features - Calculation History Card
 *
 * Displays a single calculation entry with key metrics
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { AuditLogEntry } from '../lib/inheritance/audit-log';
import { AuditTrailManager } from '../lib/inheritance/audit-trail-manager';
import { PDFExporter } from '../lib/export/PDFExporter';

export interface AuditTrailCardProps {
  entry: AuditLogEntry;
  onPress?: (entry: AuditLogEntry) => void;
  onExport?: (entry: AuditLogEntry) => void;
  onDelete?: (entryId: string) => void;
  isFavorite?: boolean;
  onToggleFavorite?: (entryId: string) => void;
}

/**
 * Audit Trail Card Component
 * Displays calculation history entry with actions
 */
export function AuditTrailCard({
  entry,
  onPress,
  onExport,
  onDelete,
  isFavorite = false,
  onToggleFavorite,
}: AuditTrailCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const formatted = AuditTrailManager.formatEntryForDisplay(entry);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const timestamp = new Date().toLocaleDateString('ar-SA');
      const filename = `تقرير-${entry.madhab}-${timestamp}`;

      // Create a minimal calculation result from audit entry
      const calculationResult = {
        madhab: entry.madhab || 'hanafi',
        madhhabName: entry.madhab || 'الحنفي',
        success: true,
        shares: entry.result?.shares || [],
        confidence: entry.result?.confidence || 100,
        calculationTime: entry.metadata?.duration || 0,
        awlApplied: entry.result?.awlApplied || false,
        raddApplied: entry.result?.raddApplied || false,
        blockedHeirs: entry.result?.blockedHeirs || [],
        specialCases: entry.result?.specialCases || { 
          awl: false, 
          auled: 0, 
          radd: false, 
          hijabTypes: [] 
        },
        steps: entry.result?.steps || [],
      };

      await PDFExporter.generateAndShare(calculationResult, {
        filename,
        includeCalculationSteps: true,
        theme: 'light',
      });

      onExport?.(entry);
      Alert.alert('تم بنجاح', 'تم تصدير التقرير بنجاح');
    } catch (error) {
      Alert.alert(
        'خطأ',
        error instanceof Error ? error.message : 'فشل في تصدير التقرير'
      );
    } finally {
      setIsExporting(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'تأكيد الحذف',
      'هل تريد حذف هذا السجل؟ لا يمكن التراجع عن هذا الإجراء.',
      [
        { text: 'إلغاء', onPress: () => {} },
        {
          text: 'حذف',
          onPress: () => onDelete?.(entry.id || ''),
          style: 'destructive',
        },
      ]
    );
  };

  const handleToggleFavorite = () => {
    onToggleFavorite?.(entry.id || '');
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress?.(entry)}
      activeOpacity={0.7}
    >
      {/* Header Row */}
      <View style={styles.cardHeader}>
        <View style={styles.headerLeft}>
          <Text style={styles.madhab}>{formatted.madhab}</Text>
          <Text style={styles.date}>{formatted.date}</Text>
        </View>

        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.favoriteButton}
            onPress={handleToggleFavorite}
          >
            <Text style={styles.favoriteIcon}>
              {isFavorite ? '⭐' : '☆'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Info Row */}
      <View style={styles.cardBody}>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>المبلغ</Text>
          <Text style={styles.infoValue}>{formatted.estate}</Text>
        </View>

        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>الورثة</Text>
          <Text style={styles.infoValue}>{formatted.heirsCount}</Text>
        </View>

        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>الثقة</Text>
          <Text style={[
            styles.infoValue,
            {
              color:
                (entry.result?.confidence || 0) > 90
                  ? '#4caf50'
                  : (entry.result?.confidence || 0) > 75
                    ? '#ff9800'
                    : '#f44336',
            },
          ]}>
            {formatted.confidence}
          </Text>
        </View>

        <Text style={styles.time}>{formatted.time}</Text>
      </View>

      {/* Expanded Details */}
      {isExpanded && (
        <View style={styles.expandedDetails}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>تاريخ التسجيل:</Text>
            <Text style={styles.detailValue}>{formatted.date}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>عدد الحصص:</Text>
            <Text style={styles.detailValue}>
              {entry.result?.shares?.length || 0}
            </Text>
          </View>

          {entry.metadata?.notes && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>ملاحظات:</Text>
              <Text style={styles.detailValue}>{entry.metadata.notes}</Text>
            </View>
          )}
        </View>
      )}

      {/* Action Buttons */}
      <View style={styles.cardActions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.expandButton]}
          onPress={() => setIsExpanded(!isExpanded)}
        >
          <Text style={styles.actionButtonText}>
            {isExpanded ? '▼ أقل' : '▶ المزيد'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.exportButton]}
          onPress={handleExport}
          disabled={isExporting}
        >
          <Text style={styles.actionButtonText}>
            {isExporting ? '⏳ جاري...' : '📄 تصدير'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={handleDelete}
        >
          <Text style={styles.actionButtonText}>🗑️ حذف</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    alignItems: 'center',
  },
  madhab: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1976d2',
    marginBottom: 2,
  },
  date: {
    fontSize: 11,
    color: '#666',
  },
  favoriteButton: {
    padding: 8,
    marginLeft: 8,
  },
  favoriteIcon: {
    fontSize: 18,
  },
  cardBody: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#f9f9f9',
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
  },
  time: {
    fontSize: 10,
    color: '#999',
    textAlign: 'right',
    marginTop: 4,
  },
  expandedDetails: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#f5f5f5',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 11,
    color: '#666',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 11,
    color: '#333',
    flex: 1,
    textAlign: 'right',
    marginLeft: 8,
  },
  cardActions: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingBottom: 12,
    gap: 6,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 6,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  expandButton: {
    backgroundColor: '#e3f2fd',
  },
  exportButton: {
    backgroundColor: '#f3e5f5',
  },
  deleteButton: {
    backgroundColor: '#ffebee',
  },
  actionButtonText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#333',
    textAlign: 'center',
  },
});

export default AuditTrailCard;
