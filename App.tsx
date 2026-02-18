/**
 * Main Application Entry Point
 * Phase 6: App Integration & Navigation
 * 
 * Root application component that initializes navigation,
 * sets up gesture handlers, and configures the status bar
 */

import React, { useEffect, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SplashScreen from 'expo-splash-screen';
import RootNavigator from './navigation/RootNavigator';
import DisclaimersModal from './components/DisclaimersModal';

// Keep the splash screen visible while app initializes
SplashScreen.preventAutoHideAsync().catch(() => {
  // Handle error if preventAutoHideAsync fails
  console.warn('Failed to prevent auto-hiding splash screen');
});

// Define a safety timeout to hide splash if stuck
const SPLASH_HIDE_TIMEOUT = 15000; // 15 seconds max

/**
 * Error Boundary Component
 * Catches and handles errors in the application
 */
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null; errorInfo: React.ErrorInfo | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('=== App Error ===');
    console.error('Error:', error);
    console.error('Error Info:', errorInfo);
    console.error('Component Stack:', errorInfo.componentStack);
    
    // Update state to include error info for debugging
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      // Return a minimal fallback UI to prevent total crash (React Native compatible)
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>⚠️ Application Error</Text>
          <Text style={styles.errorMessage}>
            The application encountered an unexpected error.
          </Text>
          <Text style={styles.errorDetail}>
            {this.state.error?.message || 'Unknown error'}
          </Text>
          {__DEV__ && this.state.errorInfo && (
            <Text style={styles.errorDetail}>
              {this.state.errorInfo.componentStack}
            </Text>
          )}
          <Text style={styles.errorRestart}>
            Please restart the application.
          </Text>
        </View>
      );
    }

    // Render children instead of hardcoding RootNavigator
    return this.props.children;
  }
}

/**
 * App Component
 * 
 * Wraps the application with necessary providers and configuration:
 * - GestureHandlerRootView: Enables gesture handling for navigation
 * - SafeAreaProvider: Handles safe area insets for notched devices
 * - DisclaimersModal: Shows legal disclaimers on first launch
 * - RootNavigator: Main navigation container
 */
export default function App() {
  const [disclaimersAccepted, setDisclaimersAccepted] = useState(false);
  const [disclaimersLoaded, setDisclaimersLoaded] = useState(false);
  const [appReady, setAppReady] = useState(false);
  const [initError, setInitError] = useState<string | null>(null);

  useEffect(() => {
    // Check if user has already accepted disclaimers
    checkDisclaimerAcceptance();

    // Safety timeout: force hide splash screen after max time
    const splashTimeout = setTimeout(() => {
      SplashScreen.hideAsync().catch((err) => {
        console.warn('Safety timeout: Failed to hide splash screen:', err);
      });
    }, SPLASH_HIDE_TIMEOUT);

    return () => clearTimeout(splashTimeout);
  }, []);

  // Hide splash screen once app is ready
  useEffect(() => {
    if (disclaimersLoaded && !initError) {
      SplashScreen.hideAsync().catch((err) => {
        console.warn('Failed to hide splash screen:', err);
      });
      setAppReady(true);
    }
  }, [disclaimersLoaded, initError]);

  const checkDisclaimerAcceptance = async () => {
    try {
      const accepted = await AsyncStorage.getItem('disclaimers_accepted');
      if (accepted === 'true') {
        setDisclaimersAccepted(true);
      }
    } catch (error) {
      console.error('Error checking disclaimer acceptance:', error);
      setInitError(`Storage error: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setDisclaimersLoaded(true);
    }
  };

  const handleDisclaimersAccept = async () => {
    try {
      // Store acceptance in AsyncStorage
      await AsyncStorage.setItem('disclaimers_accepted', 'true');
      await AsyncStorage.setItem('disclaimers_accepted_date', new Date().toISOString());
      
      setDisclaimersAccepted(true);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      console.error('Error saving disclaimer acceptance:', error);
      setInitError(`Failed to save preferences: ${errorMsg}`);
    }
  };

  const handleDisclaimersDecline = () => {
    // User declined - exit app
    console.log('User declined disclaimers');
  };

  // Show error state if initialization failed
  if (initError && disclaimersLoaded) {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#d32f2f', marginBottom: 12, textAlign: 'center' }}>
              خطأ في التهيئة
            </Text>
            <Text style={{ fontSize: 14, color: '#666', marginBottom: 12, textAlign: 'center' }}>
              {initError}
            </Text>
            <Text style={{ fontSize: 12, color: '#999', textAlign: 'center' }}>
              يرجى إعادة تشغيل التطبيق
            </Text>
          </View>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    );
  }

  if (!disclaimersLoaded) {
    // Show loading state while checking disclaimer acceptance
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#4F46E5" />
            <Text style={{ marginTop: 12, fontSize: 14, color: '#666' }}>جاري التحميل...</Text>
          </View>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    );
  }

  // Main app render with error boundary
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ErrorBoundary>
          {/* Disclaimers Modal - Shows if not yet accepted */}
          <DisclaimersModal
            visible={!disclaimersAccepted}
            onAccept={handleDisclaimersAccept}
            onDecline={handleDisclaimersDecline}
          />
          
          {/* Main Navigation - Only shown after disclaimers accepted */}
          {disclaimersAccepted && <RootNavigator />}
        </ErrorBoundary>
      </SafeAreaProvider>
    </GestureHandlerRootView>
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
