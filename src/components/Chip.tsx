import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useTheme } from '../theme';

interface Props {
  label: string;
  active: boolean;
  onPress: () => void;
}

export function Chip({ label, active, onPress }: Props) {
  const t = useTheme();

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[
        s.chip,
        {
          backgroundColor: active ? t.colors.primary : t.colors.surface,
          borderColor: active ? t.colors.primary : t.colors.outline,
          borderRadius: t.radius.full,
          minHeight: 36,
          paddingHorizontal: t.spacing.lg,
        },
      ]}
    >
      <Text
        style={[
          s.text,
          {
            color: active ? t.colors.onPrimary : t.colors.onSurfaceVariant,
            fontSize: t.typography.label.fontSize,
            fontFamily: t.typography.fontFamily,
            fontWeight: '500',
          },
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  chip: { borderWidth: 1, justifyContent: 'center', alignItems: 'center' },
  text: {},
});
