/**
 * Navigation Type Definitions
 * Phase 6: App Integration & Navigation
 * 
 * Defines all navigation types and parameter lists for the app
 */

import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

/**
 * Root Stack Parameter List
 * Defines top-level navigation screens
 */
export type RootStackParamList = {
  MainApp: undefined;
  Details: { id: string };
  Error: { message: string };
};

/**
 * Tab Parameter List
 * Defines bottom tab screens
 */
export type TabParamList = {
  Calculator: undefined;
  History: undefined;
  Settings: undefined;
  About: undefined;
};

/**
 * Calculator Tab Param List
 * Specific parameters for calculator navigation
 */
export type CalculatorParamList = {
  Main: undefined;
  Results: { calculationId: string };
};

/**
 * Navigation Props Type
 * For use in any bottom tab screen
 */
export type TabNavigationProp = BottomTabNavigationProp<TabParamList>;

/**
 * Stack Navigation Props Type
 * For use in any stack screen
 */
export type StackNavigationProp = NativeStackNavigationProp<RootStackParamList>;

/**
 * Calculator Navigation Props
 */
export type CalculatorNavigationProp = NativeStackNavigationProp<CalculatorParamList>;

/**
 * Generic navigation prop extractor
 * Usage: type Props = { navigation: NavigationOf<ScreenName> }
 */
export type NavigationOf<T extends keyof TabParamList> = BottomTabNavigationProp<
  TabParamList,
  T
>;

/**
 * Route Props Types
 */
export type CalculatorRouteParams = {
  route: import('@react-navigation/native').RouteProp<CalculatorParamList, 'Results'>;
};
