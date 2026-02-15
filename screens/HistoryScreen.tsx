/**
 * History Screen
 * Phase 6: App Integration & Navigation
 * 
 * Displays calculation history and audit log
 * Integrates with CalculationHistory component
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import CalculationHistory from '../components/CalculationHistory';

interface HistoryScreenProps {
  navigation?: any;
}

export default function HistoryScreen({ navigation }: HistoryScreenProps) {
  return (
    <View style={styles.container}>
      <CalculationHistory />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
});
