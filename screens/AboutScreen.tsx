/**
 * About Screen
 * Phase 6: App Integration & Navigation
 * 
 * Information about the application, features, and version
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

interface AboutScreenProps {
  navigation?: any;
}

export default function AboutScreen({ navigation }: AboutScreenProps) {
  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.appName}>حاسبة المواريث الشرعية</Text>
        <Text style={styles.version}>الإصدار 1.0.0</Text>
      </View>

      {/* Description */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>حول التطبيق</Text>
        <Text style={styles.description}>
          تطبيق شامل وموثوق لحساب المواريث وفقاً لأحكام الشريعة الإسلامية. يدعم التطبيق المذاهب الفقهية الأربعة (الحنفي، المالكي، الشافعي، والحنبلي) مع دعم كامل للحالات الشرعية المعقدة.
        </Text>
      </View>

      {/* Features */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>المميزات الرئيسية</Text>
        <FeatureItem title="حسابات دقيقة" description="حسابات شرعية دقيقة لتقسيم التركات" />
        <FeatureItem title="دعم المذاهب الأربعة" description="الحنفي والمالكي والشافعي والحنبلي" />
        <FeatureItem title="حالات شرعية شاملة" description="دعم العول والرد والحجب والتعصيب" />
        <FeatureItem title="سجل العمليات" description="تتبع كامل للعمليات والحسابات" />
        <FeatureItem title="واجهة سهلة الاستخدام" description="تصميم بديهي وسهل التنقل" />
        <FeatureItem title="دعم اللغة العربية" description="دعم كامل للعربية والتخطيط من اليمين لليسار" />
      </View>

      {/* Fiqh Methods */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>المذاهب الفقهية المدعومة</Text>
        <MethodItem name="المذهب الحنفي" scholar="أبو حنيفة النعمان" />
        <MethodItem name="المذهب المالكي" scholar="مالك بن أنس" />
        <MethodItem name="المذهب الشافعي" scholar="محمد بن إدريس الشافعي" />
        <MethodItem name="المذهب الحنبلي" scholar="أحمد بن حنبل" />
      </View>

      {/* Special Cases */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>الحالات الشرعية</Text>
        <CaseItem name="العول" description="زيادة الفروض على التركة" />
        <CaseItem name="الرد" description="رد الفاضل على ذوي الفروض" />
        <CaseItem name="الحجب" description="منع الوارث أو تنقيص حده" />
        <CaseItem name="التعصيب" description="الإرث بلا حد معين" />
      </View>

      {/* Legal */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>الحقوق والترخيص</Text>
        <Text style={styles.text}>
          © 2026 Merath Application. جميع الحقوق محفوظة.
        </Text>
        <Text style={styles.text}>
          تم تطوير هذا التطبيق بعناية لضمان دقة الحسابات وفقاً للشريعة الإسلامية.
        </Text>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          شكراً لاستخدامك تطبيق حاسبة المواريث الشرعية
        </Text>
      </View>
    </ScrollView>
  );
}

function FeatureItem({ title, description }: { title: string; description: string }) {
  return (
    <View style={styles.featureItem}>
      <View style={styles.featureDot} />
      <View style={styles.featureContent}>
        <Text style={styles.featureTitle}>{title}</Text>
        <Text style={styles.featureDescription}>{description}</Text>
      </View>
    </View>
  );
}

function MethodItem({ name, scholar }: { name: string; scholar: string }) {
  return (
    <View style={styles.methodItem}>
      <Text style={styles.methodName}>{name}</Text>
      <Text style={styles.methodScholar}>({scholar})</Text>
    </View>
  );
}

function CaseItem({ name, description }: { name: string; description: string }) {
  return (
    <View style={styles.caseItem}>
      <Text style={styles.caseName}>{name}</Text>
      <Text style={styles.caseDescription}>{description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    paddingTop: 16,
  },
  header: {
    backgroundColor: '#4F46E5',
    paddingVertical: 32,
    paddingHorizontal: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  appName: {
    fontSize: 28,
    fontWeight: '700',
    color: 'white',
    marginBottom: 8,
  },
  version: {
    fontSize: 14,
    color: '#E0E7FF',
  },
  section: {
    backgroundColor: 'white',
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 16,
  },
  description: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 22,
  },
  text: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 22,
    marginBottom: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    paddingVertical: 8,
  },
  featureDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4F46E5',
    marginRight: 12,
    marginTop: 6,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 20,
  },
  methodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  methodName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    flex: 1,
  },
  methodScholar: {
    fontSize: 13,
    color: '#6B7280',
  },
  caseItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  caseName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  caseDescription: {
    fontSize: 13,
    color: '#6B7280',
  },
  footer: {
    paddingHorizontal: 16,
    paddingVertical: 32,
    alignItems: 'center',
    marginBottom: 16,
  },
  footerText: {
    fontSize: 13,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 20,
  },
});
