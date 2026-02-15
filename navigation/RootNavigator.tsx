/**
 * Root Navigator Configuration
 * Phase 6: App Integration & Navigation
 * 
 * Main navigation orchestration with bottom tab navigation
 * Integrates all screens and navigation flows
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Ionicons from '@expo/vector-icons/Ionicons';
import { I18nManager, Platform } from 'react-native';

// Types
import type { RootStackParamList, TabParamList } from './types';
import { linking } from './linking';

// Screens
import CalculatorScreen from '../screens/CalculatorScreen';
import HistoryScreen from '../screens/HistoryScreen';
import SettingsScreen from '../screens/SettingsScreen';
import AboutScreen from '../screens/AboutScreen';

const Tab = createBottomTabNavigator<TabParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();

/**
 * Tab Navigator
 * Provides bottom tab navigation between main screens
 */
export function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: true,
        headerStyle: {
          backgroundColor: '#FFFFFF',
          borderBottomWidth: 1,
          borderBottomColor: '#E5E7EB',
        },
        headerTitleStyle: {
          fontSize: 18,
          fontWeight: '600',
          color: '#1F2937',
        },
        headerTitleAlign: 'center',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E5E7EB',
          height: Platform.OS === 'ios' ? 85 : 65,
          paddingBottom: Platform.OS === 'ios' ? 20 : 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
          marginTop: 4,
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'calculator';

          if (route.name === 'Calculator') {
            iconName = focused ? 'calculator' : 'calculator-outline';
          } else if (route.name === 'History') {
            iconName = focused ? 'time' : 'time-outline';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'settings' : 'settings-outline';
          } else if (route.name === 'About') {
            iconName = focused ? 'information-circle' : 'information-circle-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#4F46E5',
        tabBarInactiveTintColor: '#9CA3AF',
        lazy: true,
      })}
    >
      <Tab.Screen
        name="Calculator"
        component={CalculatorScreen}
        options={{
          title: 'حاسبة المواريث',
          tabBarLabel: 'الحاسبة',
        }}
      />
      <Tab.Screen
        name="History"
        component={HistoryScreen}
        options={{
          title: 'سجل العمليات',
          tabBarLabel: 'السجل',
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          title: 'الإعدادات',
          tabBarLabel: 'الإعدادات',
        }}
      />
      <Tab.Screen
        name="About"
        component={AboutScreen}
        options={{
          title: 'حول التطبيق',
          tabBarLabel: 'حول',
        }}
      />
    </Tab.Navigator>
  );
}

/**
 * Root Navigator
 * Main navigation container with stack for handling modals/errors
 */
export function RootNavigator() {
  // Enable RTL layout for Arabic
  I18nManager.forceRTL(true);

  return (
    <NavigationContainer linking={linking}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen
          name="MainApp"
          component={TabNavigator}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}


export default RootNavigator;
