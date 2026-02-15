/**
 * @file components/ui/Card.tsx
 * @description Material Design 3 Card component for elevated content
 */

import React from 'react';
import {
  View,
  StyleSheet,
  ViewStyle,
  Pressable,
} from 'react-native';
import { useTheme } from '../../lib/design/theme';

export type CardElevation = 'flat' | 'low' | 'medium' | 'high';

export interface ModernCardProps {
  children: React.ReactNode;
  elevation?: CardElevation;
  onPress?: () => void;
  style?: ViewStyle;
  padding?: number;
}

export const ModernCard: React.FC<ModernCardProps> = ({
  children,
  elevation = 'medium',
  onPress,
  style,
  padding,
}) => {
  const { colors, spacing, borderRadius } = useTheme();

  const getElevationStyles = (): ViewStyle => {
    switch (elevation) {
      case 'flat':
        return {
          shadowColor: 'transparent',
          elevation: 0,
        };
      case 'low':
        return {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.15,
          shadowRadius: 2,
          elevation: 2,
        };
      case 'high':
        return {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.25,
          shadowRadius: 10,
          elevation: 8,
        };
      case 'medium':
      default:
        return {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.2,
          shadowRadius: 5,
          elevation: 5,
        };
    }
  };

  const cardStyle: ViewStyle = {
    backgroundColor: '#FFFFFF',
    borderRadius: borderRadius.lg,
    padding: padding ?? spacing.md,
    ...getElevationStyles(),
  };

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          cardStyle,
          style,
          {
            opacity: pressed ? 0.8 : 1,
          },
        ]}
      >
        {children}
      </Pressable>
    );
  }

  return <View style={[cardStyle, style]}>{children}</View>;
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
  },
});

export default ModernCard;
