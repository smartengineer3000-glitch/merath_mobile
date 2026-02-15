/**
 * Deep Linking Configuration
 * Phase 6: App Integration & Navigation
 * 
 * Configures URL schemes and deep linking routes
 */

import { LinkingOptions } from '@react-navigation/native';
import type { RootStackParamList } from './types';

/**
 * Linking configuration for deep linking support
 * Supports merath:// scheme and https://merath.app domain
 */
export const linking: LinkingOptions<RootStackParamList> = {
  prefixes: ['merath://', 'https://merath.app', 'https://www.merath.app'],
  config: {
    screens: {
      MainApp: '/',
      Details: 'details/:id',
      Error: 'error/:message',
    },
  },
};

/**
 * Deep link route examples:
 * 
 * merath://
 * merath://details/xyz789
 * merath://error/not-found
 * 
 * https://merath.app/
 * https://merath.app/details/xyz789
 * https://merath.app/error/not-found
 */

export const getDeepLink = (screen: string, params?: Record<string, string>): string => {
  let url = `merath://${screen}`;
  
  if (params) {
    const queryString = new URLSearchParams(params).toString();
    url += `?${queryString}`;
  }
  
  return url;
};
