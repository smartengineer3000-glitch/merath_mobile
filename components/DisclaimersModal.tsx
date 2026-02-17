/**
 * @file DisclaimersModal.tsx
 * @description Legal Disclaimers & Privacy Policy Modal Component
 * Phase 3: Legal Compliance & User Acceptance
 *
 * Displays legal disclaimers, privacy policy, and terms of service
 * with user acceptance tracking
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Alert
} from 'react-native';
import { LEGAL_DISCLAIMERS, getDisclaimer } from '../lib/legal/Disclaimers';

export interface DisclaimersModalProps {
  visible: boolean;
  onAccept: () => void;
  onDecline: () => void;
  showPrivacyPolicy?: boolean;
}

type DisclaimerTab = 'disclaimer' | 'privacy' | 'terms';

/**
 * Disclaimers Modal Component
 * Displays legal disclaimers with tab navigation for different content
 */
export function DisclaimersModal({
  visible,
  onAccept,
  onDecline,
  showPrivacyPolicy = false
}: DisclaimersModalProps) {
  const [activeTab, setActiveTab] = useState<DisclaimerTab>('disclaimer');
  const [acceptedAll, setAcceptedAll] = useState(false);

  const handleAccept = useCallback(() => {
    if (!acceptedAll) {
      Alert.alert(
        'تأكيد القبول',
        'يجب عليك قراءة وقبول جميع الشروط والأحكام للمتابعة',
        [{ text: 'حسناً', onPress: () => {} }]
      );
      return;
    }

    onAccept();
  }, [acceptedAll, onAccept]);

  const handleDecline = useCallback(() => {
    Alert.alert(
      'تأكيد الرفض',
      'إذا رفضت الشروط، لن تتمكن من استخدام التطبيق. هل أنت متأكد؟',
      [
        { text: 'الاستمرار', onPress: () => {} },
        {
          text: 'أرفض',
          onPress: onDecline,
          style: 'destructive'
        }
      ]
    );
  }, [onDecline]);

  const getTabContent = () => {
    switch (activeTab) {
      case 'disclaimer':
        return getDisclaimer('main');
      case 'privacy':
        return getDisclaimer('privacy');
      case 'terms':
        return getDisclaimer('terms');
      default:
        return getDisclaimer('main');
    }
  };

  const getTabLabel = (tab: DisclaimerTab) => {
    switch (tab) {
      case 'disclaimer':
        return 'إخلاء المسؤولية';
      case 'privacy':
        return 'سياسة الخصوصية';
      case 'terms':
        return 'الشروط والأحكام';
      default:
        return 'إخلاء المسؤولية';
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={false}
      animationType="slide"
      onRequestClose={() => {}} // Prevent dismiss by back button
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>القوانين والشروط</Text>
          <Text style={styles.headerSubtitle}>Terms & Conditions</Text>
        </View>

        {/* Tab Navigation */}
        <View style={styles.tabNavigation}>
          {(['disclaimer', 'privacy', 'terms'] as DisclaimerTab[]).map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[
                styles.tab,
                activeTab === tab && styles.tabActive
              ]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[
                styles.tabLabel,
                activeTab === tab && styles.tabLabelActive
              ]}>
                {getTabLabel(tab)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Content Scroll Area */}
        <ScrollView
          style={styles.contentScroll}
          showsVerticalScrollIndicator={true}
        >
          <View style={styles.content}>
            <Text style={styles.contentText}>
              {getTabContent()}
            </Text>
          </View>
        </ScrollView>

        {/* Acceptance Checkbox */}
        <View style={styles.acceptanceContainer}>
          <TouchableOpacity
            style={[
              styles.checkbox,
              acceptedAll && styles.checkboxChecked
            ]}
            onPress={() => setAcceptedAll(!acceptedAll)}
          >
            {acceptedAll && (
              <Text style={styles.checkboxMark}>✓</Text>
            )}
          </TouchableOpacity>
          <Text style={styles.acceptanceText}>
            أوافق على جميع الشروط والأحكام وسياسة الخصوصية
          </Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.declineButton, !acceptedAll && styles.declineButtonDisabled]}
            onPress={handleDecline}
          >
            <Text style={styles.declineButtonText}>رفض</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.acceptButton,
              !acceptedAll && styles.acceptButtonDisabled
            ]}
            onPress={handleAccept}
            disabled={!acceptedAll}
          >
            <Text style={styles.acceptButtonText}>قبول واستمرار</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  header: {
    backgroundColor: '#fff',
    paddingTop: 20,
    paddingBottom: 16,
    paddingHorizontal: 16,
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
    textAlign: 'center'
  },
  tabNavigation: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingHorizontal: 8
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
    alignItems: 'center'
  },
  tabActive: {
    borderBottomColor: '#1976d2',
    backgroundColor: '#f5f5f5'
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: '#666',
    textAlign: 'center'
  },
  tabLabelActive: {
    color: '#1976d2',
    fontWeight: '700'
  },
  contentScroll: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  content: {
    backgroundColor: '#fff',
    margin: 12,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0'
  },
  contentText: {
    fontSize: 12,
    color: '#333',
    lineHeight: 20,
    textAlign: 'right'
  },
  acceptanceContainer: {
    backgroundColor: '#fff',
    marginHorizontal: 12,
    marginBottom: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0'
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    backgroundColor: '#fff'
  },
  checkboxChecked: {
    backgroundColor: '#1976d2',
    borderColor: '#1976d2'
  },
  checkboxMark: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff'
  },
  acceptanceText: {
    fontSize: 12,
    color: '#333',
    flex: 1,
    textAlign: 'right',
    fontWeight: '500'
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingBottom: 20,
    gap: 8
  },
  declineButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#d32f2f',
    alignItems: 'center'
  },
  declineButtonDisabled: {
    opacity: 0.5
  },
  declineButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#d32f2f'
  },
  acceptButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#1976d2',
    borderRadius: 6,
    alignItems: 'center'
  },
  acceptButtonDisabled: {
    backgroundColor: '#90caf9',
    opacity: 0.6
  },
  acceptButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#fff'
  }
});

export default DisclaimersModal;
