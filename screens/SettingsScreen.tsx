/**
 * Settings Screen
 * Phase 6: App Integration & Navigation
 * 
 * Application settings and preferences
 * Ready for future enhancements
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView, Switch } from 'react-native';

interface SettingsScreenProps {
  navigation?: any;
}

export default function SettingsScreen({ navigation }: SettingsScreenProps) {
  const [arabicLayout, setArabicLayout] = React.useState(true);
  const [notifications, setNotifications] = React.useState(true);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>العرض</Text>
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>اللغة العربية والتخطيط من اليمين</Text>
          <Switch
            value={arabicLayout}
            onValueChange={setArabicLayout}
            trackColor={{ false: '#D1D5DB', true: '#A5B4FC' }}
            thumbColor={arabicLayout ? '#4F46E5' : '#F3F4F6'}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>الإشعارات</Text>
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>تفعيل الإشعارات</Text>
          <Switch
            value={notifications}
            onValueChange={setNotifications}
            trackColor={{ false: '#D1D5DB', true: '#A5B4FC' }}
            thumbColor={notifications ? '#4F46E5' : '#F3F4F6'}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>حول التطبيق</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>الإصدار</Text>
          <Text style={styles.infoValue}>1.0.0</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>حقوق النشر</Text>
          <Text style={styles.infoValue}>© 2026 Merath</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          شكراً لاستخدامك تطبيق حاسبة المواريث الشرعية
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    paddingTop: 16,
  },
  section: {
    backgroundColor: 'white',
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 12,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  settingLabel: {
    fontSize: 14,
    color: '#4B5563',
    fontWeight: '500',
    flex: 1,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  infoLabel: {
    fontSize: 14,
    color: '#4B5563',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 14,
    color: '#6B7280',
  },
  footer: {
    paddingHorizontal: 16,
    paddingVertical: 24,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
  },
});
