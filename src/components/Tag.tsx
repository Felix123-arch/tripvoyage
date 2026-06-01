import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useTheme } from '../theme';

interface Props {
  label: string;
  selected: boolean;
  onPress: () => void;
}

export function Tag({ label, selected, onPress }: Props) {
  const t = useTheme();

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[
        s.tag,
        {
          backgroundColor: selected ? t.colors.primaryContainer : t.colors.surfaceContainer,
          borderRadius: t.radius.sm,
          paddingHorizontal: t.spacing.lg,
          paddingVertical: t.spacing.sm,
        },
      ]}
    >
      <Text
        style={[
          s.text,
          {
            color: selected ? t.colors.onPrimaryContainer : t.colors.onSurfaceVariant,
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
  tag: {},
  text: {},
});
