import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../theme';
import { useLang } from '../contexts/LanguageContext';
import { EventCard } from './EventCard';
import type { Day } from '../data';

interface Props {
  days: Day[];
}

export function Timeline({ days }: Props) {
  const t = useTheme();
  const { t: tx } = useLang();

  return (
    <View>
      {days.map((day, di) => (
        <View key={day.dayNumber} style={s.dayBlock}>
          <View style={s.dayHeader}>
            <View style={[s.dot, { backgroundColor: t.colors.primary, width: 12, height: 12, borderRadius: 6 }]} />
            <Text style={[s.dayLabel, { fontFamily: t.typography.fontFamily, fontWeight: '600', fontSize: t.typography.body.fontSize, color: t.colors.onSurface, marginLeft: t.spacing.lg }]}>
              {tx('day')} {day.dayNumber}
            </Text>
            <Text style={[s.date, { fontFamily: t.typography.fontFamily, fontSize: t.typography.bodySm.fontSize, color: t.colors.onSurfaceVariant, marginLeft: t.spacing.md }]}>
              {day.date}
            </Text>
          </View>
          {di < days.length - 1 && (
            <View style={[s.line, { backgroundColor: t.colors.outline, width: 2, left: 5, marginLeft: t.spacing.lg + 5 }]} />
          )}
          <View style={[s.activities, { marginLeft: t.spacing['3xl'] }]}>
            {day.activities.map((activity) => (
              <EventCard key={activity.id} activity={activity} />
            ))}
          </View>
        </View>
      ))}
    </View>
  );
}

const s = StyleSheet.create({
  dayBlock: {},
  dayHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8, marginLeft: 16 },
  dot: {},
  dayLabel: {},
  date: {},
  line: { position: 'absolute', top: 20, bottom: 0, height: '100%' },
  activities: { gap: 4, paddingBottom: 4 },
});
