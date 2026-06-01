import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../theme';
import { Badge } from './Badge';
import type { Activity, BadgeVariant } from '../data';

interface Props {
  activity: Activity;
}

const iconMap: Record<string, string> = {
  flight: '✈️',
  hotel: '🏨',
  landmark: '📍',
  food: '☕',
  nature: '⛰️',
  transport: '🚌',
};

const bgMap: Record<string, string> = {
  flight: '#DBEAFE',
  hotel: '#D1FAE5',
  landmark: '#FEF3C7',
  food: '#FCE7F3',
  nature: '#DBEAFE',
  transport: '#E2E8F0',
};

const badgeLabelMap: Record<string, string> = {
  success: 'Confirmed',
  warning: 'Action Required',
  info: 'Pending',
};

export function EventCard({ activity }: Props) {
  const t = useTheme();

  return (
    <View style={[s.row, { paddingVertical: t.spacing.sm }]}>
      <View style={[s.iconWrap, { backgroundColor: bgMap[activity.type] || t.colors.primaryContainer, borderRadius: t.radius.sm, width: 40, height: 40 }]}>
        <Text style={s.emoji}>{iconMap[activity.type] || '📍'}</Text>
      </View>
      <View style={[s.body, { marginLeft: t.spacing.md }]}>
        <View style={s.titleRow}>
          <Text style={[s.title, { fontFamily: t.typography.fontFamily, fontWeight: '600', fontSize: t.typography.body.fontSize, color: t.colors.onSurface }]} numberOfLines={1}>
            {activity.title}
          </Text>
          {activity.badge && (
            <Badge variant={activity.badge as BadgeVariant} label={badgeLabelMap[activity.badge] || activity.badge} />
          )}
        </View>
        {activity.location && (
          <Text style={[s.sub, { fontFamily: t.typography.fontFamily, fontSize: t.typography.bodySm.fontSize, color: t.colors.onSurfaceVariant }]}>
            {activity.location}
          </Text>
        )}
        <Text style={[s.sub, { fontFamily: t.typography.fontFamily, fontSize: t.typography.bodySm.fontSize, color: t.colors.onSurfaceVariant }]}>
          {activity.time}
          {activity.description ? ` · ${activity.description}` : ''}
        </Text>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  row: { flexDirection: 'row' },
  iconWrap: { alignItems: 'center', justifyContent: 'center' },
  emoji: { fontSize: 18 },
  body: { flex: 1 },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { flex: 1, marginRight: 8 },
  sub: { marginTop: 1 },
});
