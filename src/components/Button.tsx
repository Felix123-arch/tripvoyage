import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../theme';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger';
type ButtonSize = 'sm' | 'md';

interface Props {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  block?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
}

export function Button({ title, onPress, variant = 'primary', size = 'md', block, disabled, style }: Props) {
  const t = useTheme();

  const variantStyles: Record<ButtonVariant, ViewStyle> = {
    primary: { backgroundColor: t.colors.primary, borderWidth: 0 },
    secondary: { backgroundColor: t.colors.surface, borderColor: t.colors.outline, borderWidth: 1 },
    outline: { backgroundColor: 'transparent', borderColor: t.colors.primary, borderWidth: 1.5 },
    danger: { backgroundColor: 'transparent', borderColor: t.colors.error, borderWidth: 1.5 },
  };

  const variantText: Record<ButtonVariant, string> = {
    primary: t.colors.onPrimary,
    secondary: t.colors.onSurface,
    outline: t.colors.primary,
    danger: t.colors.error,
  };

  const sizeStyles: Record<ButtonSize, ViewStyle> = {
    md: { paddingHorizontal: t.spacing.xl, paddingVertical: 14 },
    sm: { paddingHorizontal: t.spacing.lg, paddingVertical: 10 },
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
      style={[
        s.base,
        { borderRadius: t.radius.md, minHeight: size === 'sm' ? 40 : t.touchMin },
        variantStyles[variant],
        sizeStyles[size],
        block && s.block,
        disabled && { opacity: 0.5 },
        style,
      ]}
    >
      <Text
        style={[
          s.text,
          {
            fontSize: size === 'sm' ? t.typography.label.fontSize : 14,
            fontFamily: t.typography.fontFamily,
            fontWeight: '600',
            color: variantText[variant],
          },
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  base: { alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8 },
  block: { width: '100%' },
  text: { letterSpacing: 0.2 },
});
