import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../theme';
import type { Weather } from '../data';

interface Props {
  weather: Weather;
}

export function WeatherCard({ weather }: Props) {
  const t = useTheme();

  return (
    <View style={[s.card, { borderRadius: t.radius.md, padding: t.spacing.lg }]}>
      <Text style={[s.icon, { fontFamily: t.typography.fontFamily }]}>&#x2600;&#xFE0F;</Text>
      <View>
        <Text style={[s.location, { fontFamily: t.typography.fontFamily, fontSize: t.typography.body.fontSize, color: 'rgba(255,255,255,0.9)' }]}>
          {weather.location}
        </Text>
        <Text style={[s.temp, { fontFamily: t.typography.fontFamily, fontWeight: '700', fontSize: 36, color: '#fff' }]}>
          {weather.temperature}
        </Text>
        <Text style={[s.condition, { fontFamily: t.typography.fontFamily, fontSize: t.typography.bodySm.fontSize, color: 'rgba(255,255,255,0.85)' }]}>
          {weather.condition} &middot; {weather.description}
        </Text>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  card: {
    backgroundColor: '#2563EB',
    backgroundImage: 'linear-gradient(135deg, #2563EB, #7C3AED)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  } as any,
  icon: { fontSize: 40 },
  location: {},
  temp: {},
  condition: {},
});
