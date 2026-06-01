import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useTheme } from '../theme';

interface Props {
  options: string[];
  activeIndex: number;
  onChange: (index: number) => void;
}

export function SegmentControl({ options, activeIndex, onChange }: Props) {
  const t = useTheme();

  return (
    <View
      style={[
        s.row,
        {
          backgroundColor: t.colors.surfaceContainer,
          borderRadius: t.radius.md,
          padding: 4,
        },
      ]}
    >
      {options.map((opt, i) => (
        <TouchableOpacity
          key={opt}
          onPress={() => onChange(i)}
          activeOpacity={0.8}
          style={[
            s.btn,
            {
              borderRadius: t.radius.sm,
              paddingVertical: t.spacing.sm,
              backgroundColor: i === activeIndex ? t.colors.surface : 'transparent',
              ...(i === activeIndex ? t.elevation[1] : {}),
            },
          ]}
        >
          <Text
            style={[
              s.text,
              {
                fontFamily: t.typography.fontFamily,
                fontSize: t.typography.label.fontSize,
                fontWeight: '500' as const,
                color: i === activeIndex ? t.colors.onSurface : t.colors.onSurfaceVariant,
              },
            ]}
          >
            {opt}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const s = StyleSheet.create({
  row: { flexDirection: 'row' },
  btn: { flex: 1, alignItems: 'center' },
  text: {},
});
