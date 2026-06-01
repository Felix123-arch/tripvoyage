import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../theme';
import type { BadgeVariant } from '../data';

interface Props {
  variant: BadgeVariant;
  label: string;
}

export function Badge({ variant, label }: Props) {
  const t = useTheme();

  const config: Record<BadgeVariant, { bg: string; color: string }> = {
    success: { bg: t.colors.secondaryContainer, color: t.colors.onSecondaryContainer },
    warning: { bg: t.colors.tertiaryContainer, color: t.colors.onTertiaryContainer },
    info: { bg: t.colors.primaryContainer, color: t.colors.onPrimaryContainer },
  };

  const c = config[variant];

  return (
    <View style={[s.badge, { backgroundColor: c.bg, borderRadius: t.radius.full }]}>
      <Text
        style={[
          s.text,
          { color: c.color, fontSize: t.typography.caption.fontSize, fontFamily: t.typography.fontFamily },
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

const s = StyleSheet.create({
  badge: { paddingHorizontal: 10, paddingVertical: 3, alignSelf: 'flex-start' },
  text: { fontWeight: '500' },
});
