import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useTheme } from '../theme';
import type { BudgetLevel } from '../data';

interface Props {
  value: BudgetLevel;
  onChange: (val: BudgetLevel) => void;
}

const levels: BudgetLevel[] = ['$', '$$', '$$$'];

export function BudgetSelector({ value, onChange }: Props) {
  const t = useTheme();

  return (
    <View style={s.row}>
      {levels.map((lvl) => (
        <TouchableOpacity
          key={lvl}
          onPress={() => onChange(lvl)}
          activeOpacity={0.7}
          style={[
            s.btn,
            {
              backgroundColor: value === lvl ? t.colors.secondary : t.colors.surfaceContainer,
              borderRadius: t.radius.sm,
              paddingVertical: t.spacing.md,
            },
          ]}
        >
          <Text
            style={[
              s.text,
              {
                fontFamily: t.typography.fontFamily,
                fontWeight: '600',
                fontSize: t.typography.bodyLg.fontSize,
                color: value === lvl ? t.colors.onPrimary : t.colors.onSurfaceVariant,
              },
            ]}
          >
            {lvl}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const s = StyleSheet.create({
  row: { flexDirection: 'row', gap: 8 },
  btn: { flex: 1, alignItems: 'center' },
  text: {},
});
