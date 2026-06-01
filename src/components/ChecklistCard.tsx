import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../theme';
import type { ChecklistItem } from '../data';

interface Props {
  items: ChecklistItem[];
  onToggle: (id: string) => void;
}

export function ChecklistCard({ items, onToggle }: Props) {
  const t = useTheme();
  const completed = items.filter((i) => i.completed).length;
  const total = items.length;
  const pct = total > 0 ? (completed / total) * 100 : 0;

  return (
    <View
      style={[
        s.card,
        {
          backgroundColor: t.colors.surface,
          borderRadius: t.radius.md,
          padding: t.spacing.lg,
          borderColor: t.colors.outline,
          borderWidth: 1,
        },
      ]}
    >
      <Text style={[s.heading, { fontFamily: t.typography.fontFamily, fontWeight: '600', fontSize: t.typography.body.fontSize, color: t.colors.onSurface }]}>
        Pre-Trip Checklist
      </Text>
      <Text style={[s.progress, { fontFamily: t.typography.fontFamily, fontSize: t.typography.bodySm.fontSize, color: t.colors.onSurfaceVariant }]}>
        {completed} of {total} Complete
      </Text>
      <View style={[s.track, { backgroundColor: t.colors.outline, borderRadius: t.radius.full, height: 6, marginVertical: t.spacing.md }]}>
        <View
          style={[
            s.fill,
            {
              backgroundColor: t.colors.primary,
              borderRadius: t.radius.full,
              width: `${pct}%`,
            },
          ]}
        />
      </View>
      {items.map((item) => (
        <TouchableOpacity
          key={item.id}
          onPress={() => onToggle(item.id)}
          activeOpacity={0.7}
          style={[s.row, { paddingVertical: t.spacing.sm + 2 }]}
        >
          <View
            style={[
              s.dot,
              {
                backgroundColor: item.completed ? t.colors.secondary : t.colors.outline,
                borderColor: item.completed ? t.colors.secondary : t.colors.outline,
                borderRadius: t.radius.sm,
                width: 22,
                height: 22,
              },
            ]}
          >
            {item.completed && <Text style={s.check}>&#x2713;</Text>}
          </View>
          <Text
            style={[
              s.label,
              {
                fontFamily: t.typography.fontFamily,
                fontSize: t.typography.body.fontSize,
                color: item.completed ? t.colors.onSurfaceVariant : t.colors.onSurface,
                textDecorationLine: item.completed ? 'line-through' : 'none',
              },
            ]}
          >
            {item.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const s = StyleSheet.create({
  card: {},
  heading: {},
  progress: { marginTop: 2 },
  track: { overflow: 'hidden' },
  fill: { height: '100%' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  dot: { alignItems: 'center', justifyContent: 'center', borderWidth: 1.5 },
  check: { color: '#fff', fontSize: 13, fontWeight: '700' },
  label: { flex: 1 },
});
