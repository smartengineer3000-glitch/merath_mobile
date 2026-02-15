/**
 * @file components/ui/Button.tsx
 * @description Modern Material Design 3 button component
 * Replaces generic buttons with professional styling
 */

import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
} from 'react-native';
import { useTheme } from '../../lib/design/theme';

export type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'danger';
export type ButtonSize = 'small' | 'medium' | 'large';

export interface ModernButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
  style?: ViewStyle;
}

export const ModernButton: React.FC<ModernButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon,
  fullWidth = false,
  style,
}) => {
  const { colors, spacing, borderRadius, typography } = useTheme();

  const getSizeStyles = (): { padding: number; fontSize: number } => {
    switch (size) {
      case 'small':
        return { padding: spacing.sm, fontSize: 12 };
      case 'large':
        return { padding: spacing.lg, fontSize: 16 };
      case 'medium':
      default:
        return { padding: spacing.md, fontSize: 14 };
    }
  };

  const getVariantStyles = (): { backgroundColor: string; color: string } => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: disabled ? '#BDBDBD' : colors.primary,
          color: '#FFFFFF',
        };
      case 'secondary':
        return {
          backgroundColor: disabled ? '#E0E0E0' : colors.secondary,
          color: '#FFFFFF',
        };
      case 'tertiary':
        return {
          backgroundColor: 'transparent',
          color: colors.primary,
        };
      case 'danger':
        return {
          backgroundColor: disabled ? '#FFCCCC' : colors.status.error,
          color: '#FFFFFF',
        };
      default:
        return {
          backgroundColor: colors.primary,
          color: '#FFFFFF',
        };
    }
  };

  const sizeStyles = getSizeStyles();
  const variantStyles = getVariantStyles();

  const buttonStyle: ViewStyle = {
    paddingVertical: sizeStyles.padding,
    paddingHorizontal: sizeStyles.padding * 1.5,
    borderRadius: borderRadius.md,
    backgroundColor: variantStyles.backgroundColor,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: disabled ? 0.6 : 1,
    ...(fullWidth && { width: '100%' }),
    ...(variant === 'tertiary' && {
      borderWidth: 1,
      borderColor: colors.primary,
    }),
  };

  const textStyle: TextStyle = {
    fontSize: sizeStyles.fontSize,
    fontWeight: '600',
    color: variantStyles.color,
    marginLeft: icon ? spacing.sm : 0,
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      style={[buttonStyle, style]}
    >
      {loading ? (
        <ActivityIndicator color={variantStyles.color} />
      ) : (
        <>
          {icon}
          <Text style={textStyle}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: '600',
  },
});

export default ModernButton;
