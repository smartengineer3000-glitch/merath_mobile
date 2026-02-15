/**
 * @file CalculatorScreen.tsx
 * @description الشاشة الرئيسية للآلة الحاسبة
 * Main Calculator Screen for Phase 5
 * 
 * تنسيق وتنظيم جميع المكونات معاً
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import EstateInput from '../components/EstateInput';
import HeirSelector from '../components/HeirSelector';
import MadhhabSelector from '../components/MadhhabSelector';
import CalculationButton from '../components/CalculationButton';
import ResultsDisplay from '../components/ResultsDisplay';
import CalculationHistory from '../components/CalculationHistory';

export interface CalculatorScreenProps {
  onNavigate?: (screen: string) => void;
}

type ScreenMode = 'calculator' | 'history';

/**
 * الشاشة الرئيسية للآلة الحاسبة
 * Main orchestration screen combining all components
 */
export function CalculatorScreen({ onNavigate }: CalculatorScreenProps) {
  const [screenMode, setScreenMode] = useState<ScreenMode>('calculator');
  const [selectedHistoryEntry, setSelectedHistoryEntry] = useState<string | null>(null);

  const handleHistoryEntrySelect = useCallback((entryId: string) => {
    setSelectedHistoryEntry(entryId);
    // في تطبيق حقيقي، سيتم الانتقال إلى عرض التفاصيل
  }, []);

  const handleCalculationComplete = useCallback(() => {
    // التمرير السلس للنتائج
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* رأس الشاشة مع علامات التبويب */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>حاسبة المواريث الإسلامية</Text>
          <Text style={styles.headerSubtitle}>Islamic Inheritance Calculator</Text>

          {/* علامات التبويب */}
          <View style={styles.tabBar}>
            <TouchableOpacity
              style={[
                styles.tab,
                screenMode === 'calculator' && styles.tabActive
              ]}
              onPress={() => setScreenMode('calculator')}
            >
              <Text style={[
                styles.tabText,
                screenMode === 'calculator' && styles.tabTextActive
              ]}>
                حاسبة
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.tab,
                screenMode === 'history' && styles.tabActive
              ]}
              onPress={() => setScreenMode('history')}
            >
              <Text style={[
                styles.tabText,
                screenMode === 'history' && styles.tabTextActive
              ]}>
                السجل
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* محتوى الشاشة */}
        {screenMode === 'calculator' ? (
          <ScrollView
            style={styles.content}
            showsVerticalScrollIndicator={false}
            bounces={true}
          >
            {/* قسم المذهب */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>اختر المذهب الإسلامي</Text>
              </View>
              <MadhhabSelector />
            </View>

            {/* قسم البيانات المالية */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>بيانات التركة</Text>
              </View>
              <EstateInput />
            </View>

            {/* قسم الوارثون */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>إضافة الوارثون</Text>
              </View>
              <HeirSelector />
            </View>

            {/* زر الحساب - with default props for now */}
            <View style={styles.section}>
              <CalculationButton
                madhab="hanafi"
                heirs={{}}
                estate={{ total: 0, funeral: 0, debts: 0, will: 0 }}
                onCalculationComplete={handleCalculationComplete}
              />
            </View>

            {/* قسم النتائج */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>النتائج والتوزيع</Text>
              </View>
              <ResultsDisplay />
            </View>

            {/* مساحة فارغة في النهاية */}
            <View style={{ height: 20 }} />
          </ScrollView>
        ) : (
          <View style={styles.historyContent}>
            <CalculationHistory onEntrySelect={handleHistoryEntrySelect} />
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  header: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0'
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1976d2',
    textAlign: 'center',
    marginBottom: 4
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginBottom: 12
  },
  tabBar: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    marginHorizontal: -16
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
    alignItems: 'center'
  },
  tabActive: {
    borderBottomColor: '#1976d2',
    backgroundColor: '#f5f5f5'
  },
  tabText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#666'
  },
  tabTextActive: {
    color: '#1976d2',
    fontWeight: '700'
  },
  content: {
    flex: 1,
    paddingTop: 16
  },
  historyContent: {
    flex: 1
  },
  section: {
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0'
  },
  sectionHeader: {
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0'
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    textAlign: 'right'
  }
});

export default CalculatorScreen;
