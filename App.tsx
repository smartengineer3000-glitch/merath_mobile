/**
 * Main Application Entry Point
 * Phase 6: App Integration & Navigation
 * 
 * Root application component that initializes navigation,
 * sets up gesture handlers, and configures the status bar
 */

import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View, Text, StyleSheet } from 'react-native';
import RootNavigator from './navigation/RootNavigator';

/**
 * Error Boundary Component
 * Catches and handles errors in the application
 */
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('App Error:', error);
    console.error('Error Info:', errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Return a minimal fallback UI to prevent total crash (React Native compatible)
      return (
        <GestureHandlerRootView style={{ flex: 1 }}>
          <SafeAreaProvider>
            <View style={styles.errorContainer}>
              <Text style={styles.errorTitle}>⚠️ Application Error</Text>
              <Text style={styles.errorMessage}>
                The application encountered an unexpected error.
              </Text>
              <Text style={styles.errorDetail}>
                {this.state.error?.message || 'Unknown error'}
              </Text>
              <Text style={styles.errorRestart}>
                Please restart the application.
              </Text>
            </View>
          </SafeAreaProvider>
        </GestureHandlerRootView>
      );
    }

    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <RootNavigator />
        </SafeAreaProvider>
      </GestureHandlerRootView>
    );
  }
}

/**
 * App Component
 * 
 * Wraps the application with necessary providers and configuration:
 * - GestureHandlerRootView: Enables gesture handling for navigation
 * - SafeAreaProvider: Handles safe area insets for notched devices
 * - RootNavigator: Main navigation container
 */
export default function App() {
  return (
    <ErrorBoundary>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <RootNavigator />
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </ErrorBoundary>
  );
}

// Styles for error boundary UI
const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#d32f2f',
    marginBottom: 12,
    textAlign: 'center',
  },
  errorMessage: {
    fontSize: 16,
    color: '#333',
    marginBottom: 12,
    textAlign: 'center',
  },
  errorDetail: {
    fontSize: 12,
    color: '#666',
    marginVertical: 10,
    textAlign: 'center',
  },
  errorRestart: {
    fontSize: 12,
    color: '#999',
    marginTop: 20,
    textAlign: 'center',
  },
});
