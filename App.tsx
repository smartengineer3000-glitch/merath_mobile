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
      // Return a minimal fallback UI to prevent total crash
      return (
        <GestureHandlerRootView style={{ flex: 1 }}>
          <SafeAreaProvider>
            <div style={{
              flex: 1,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#f5f5f5',
              flexDirection: 'column',
              padding: 20,
            }}>
              <h1>⚠️ Application Error</h1>
              <p>The application encountered an unexpected error.</p>
              <p style={{ marginTop: 10, fontSize: 12, color: '#666' }}>
                {this.state.error?.message}
              </p>
              <p style={{ marginTop: 20, fontSize: 12 }}>
                Please restart the application.
              </p>
            </div>
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
 * - StatusBar: System status bar configuration
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
