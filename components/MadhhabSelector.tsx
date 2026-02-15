/**
 * @file MadhhabSelector.tsx
 * @description مكون اختيار المذهب الفقهي
 * Madhab Selector Component for Phase 5
 * 
 * اختيار أحد المذاهب الأربعة للحساب
 */

import React, { useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useMadhab } from '../lib/inheritance/hooks';
import { MadhhabType } from '../lib/inheritance/types';

const MADHABS_INFO = {
  hanafi: {
    name: 'الحنفي',
    description: 'مذهب أبي حنيفة',
    color: '#1976d2'
  },
  maliki: {
    name: 'المالكي',
    description: 'مذهب مالك بن أنس',
    color: '#388e3c'
  },
  shafii: {
    name: 'الشافعي',
    description: 'مذهب محمد بن إدريس الشافعي',
    color: '#f57c00'
  },
  hanbali: {
    name: 'الحنبلي',
    description: 'مذهب أحمد بن حنبل',
    color: '#d32f2f'
  }
};

export interface MadhhabSelectorProps {
  onMadhhabChange?: (madhab: MadhhabType) => void;
}

/**
 * مكون اختيار المذهب
 * Allows users to select Islamic school of law
 */
export function MadhhabSelector({ onMadhhabChange }: MadhhabSelectorProps) {
  const { madhab, changeMadhab, getMadhhabInfo } = useMadhab();

  useEffect(() => {
    onMadhhabChange?.(madhab as MadhhabType);
  }, [madhab, onMadhhabChange]);

  const handleMadhhabChange = useCallback((newMadhab: MadhhabType) => {
    changeMadhab(newMadhab);
    onMadhhabChange?.(newMadhab);
  }, [changeMadhab, onMadhhabChange]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>اختر المذهب الفقهي</Text>
      <Text style={styles.subtitle}>Select Islamic School of Law</Text>

      <View style={styles.madhhabsGrid}>
        {(Object.keys(MADHABS_INFO) as MadhhabType[]).map(madhhabKey => {
          const madhhabInfo = MADHABS_INFO[madhhabKey];
          const isSelected = madhab === madhhabKey;

          return (
            <TouchableOpacity
              key={madhhabKey}
              style={[
                styles.madhhabCard,
                isSelected && styles.madhhabCardActive,
                { borderColor: madhhabInfo.color }
              ]}
              onPress={() => handleMadhhabChange(madhhabKey)}
            >
              <View
                style={[
                  styles.madhhabCardHeader,
                  isSelected && { backgroundColor: madhhabInfo.color }
                ]}
              >
                <Text
                  style={[
                    styles.madhhabCardHeaderText,
                    isSelected && styles.madhhabCardHeaderTextActive
                  ]}
                >
                  {madhhabInfo.name}
                </Text>
              </View>

              <View style={styles.madhhabCardBody}>
                <Text style={styles.madhhabDescription}>{madhhabInfo.description}</Text>
                
                {isSelected && (
                  <View style={styles.selectedIndicator}>
                    <Text style={styles.selectedIndicatorText}>✓ مختار</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* معلومات المذهب المختار */}
      <View style={styles.infoContainer}>
        <Text style={styles.infoTitle}>معلومات المذهب الحالي:</Text>
        <View style={styles.infoContent}>
          <Text style={styles.infoItem}>
            <Text style={styles.infoLabel}>المذهب: </Text>
            <Text style={styles.infoValue}>{MADHABS_INFO[madhab as keyof typeof MADHABS_INFO]?.name}</Text>
          </Text>
          <Text style={styles.infoItem}>
            <Text style={styles.infoLabel}>الوصف: </Text>
            <Text style={styles.infoValue}>
              {MADHABS_INFO[madhab as keyof typeof MADHABS_INFO]?.description}
            </Text>
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
  madhhabsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16
  },
  madhhabCard: {
    width: '48%',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    marginBottom: 12,
    overflow: 'hidden'
  },
  madhhabCardActive: {
    borderColor: '#1976d2',
    backgroundColor: '#f5f5f5'
  },
  madhhabCardHeader: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#f0f0f0',
    alignItems: 'center'
  },
  madhhabCardHeaderText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333'
  },
  madhhabCardHeaderTextActive: {
    color: '#fff'
  },
  madhhabCardBody: {
    padding: 10,
    alignItems: 'center'
  },
  madhhabDescription: {
    fontSize: 11,
    color: '#666',
    textAlign: 'center',
    marginBottom: 6
  },
  selectedIndicator: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: '#c8e6c9',
    borderRadius: 4,
    marginTop: 6
  },
  selectedIndicatorText: {
    fontSize: 11,
    color: '#2e7d32',
    fontWeight: '600'
  },
  infoContainer: {
    backgroundColor: '#e3f2fd',
    borderRadius: 6,
    padding: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#1976d2'
  },
  infoTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1976d2',
    marginBottom: 8,
    textAlign: 'right'
  },
  infoContent: {
    backgroundColor: '#fff',
    borderRadius: 4,
    padding: 10
  },
  infoItem: {
    fontSize: 12,
    color: '#333',
    marginBottom: 6,
    textAlign: 'right'
  },
  infoLabel: {
    fontWeight: '600',
    color: '#1976d2'
  },
  infoValue: {
    color: '#333',
    fontWeight: '500'
  }
});

export default MadhhabSelector;
