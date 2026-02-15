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
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <RootNavigator />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
