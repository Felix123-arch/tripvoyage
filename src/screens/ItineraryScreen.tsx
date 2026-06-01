import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useTheme } from '../theme';
import { WeatherCard, Timeline, Button } from '../components';
import { mockItinerary } from '../data';
import { LinearGradient } from 'expo-linear-gradient';

interface Props {
  navigation: any;
}

export function ItineraryScreen({ navigation }: Props) {
  const t = useTheme();

  return (
    <View style={[s.screen, { backgroundColor: t.colors.background }]}>
      <View style={[s.header, { backgroundColor: t.colors.surface, borderBottomColor: t.colors.outline, paddingHorizontal: t.spacing.lg, paddingTop: t.spacing['2xl'], paddingBottom: t.spacing.md }]}>
        <View style={s.headerRow}>
          <Text style={[s.back, { color: t.colors.primary, fontFamily: t.typography.fontFamily, fontSize: 28 }]} onPress={() => navigation.goBack()}>
            &#x2190;
          </Text>
          <View style={s.headerCenter}>
            <Text style={[s.title, { fontFamily: t.typography.fontFamily, fontWeight: '600', fontSize: t.typography.bodyLg.fontSize, color: t.colors.onSurface }]}>
              {mockItinerary.name}
            </Text>
            <Text style={[s.subtitle, { fontFamily: t.typography.fontFamily, fontSize: t.typography.caption.fontSize, color: t.colors.onSurfaceVariant }]}>
              {mockItinerary.startDate} - {mockItinerary.endDate}, {mockItinerary.year}
            </Text>
          </View>
          <Text style={[s.share, { color: t.colors.onSurface, fontSize: 22 }]}>&#x1F4E4;</Text>
        </View>
      </View>

      <ScrollView style={s.scroll} showsVerticalScrollIndicator={false}>
        <View style={{ paddingHorizontal: t.spacing.lg, marginTop: t.spacing.lg }}>
          <LinearGradient
            colors={['#2563EB', '#7C3AED']}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
            style={[s.weatherWrap, { borderRadius: t.radius.md, padding: t.spacing.lg }]}
          >
            <View style={s.weatherRow}>
              <Text style={s.weatherIcon}>&#x2600;&#xFE0F;</Text>
              <View>
                <Text style={[s.weatherLoc, { fontFamily: t.typography.fontFamily, fontSize: t.typography.body.fontSize, color: 'rgba(255,255,255,0.9)' }]}>
                  {mockItinerary.weather.location}
                </Text>
                <Text style={[s.weatherTemp, { fontFamily: t.typography.fontFamily, fontWeight: '700', fontSize: 36, color: '#fff' }]}>
                  {mockItinerary.weather.temperature}
                </Text>
                <Text style={[s.weatherCond, { fontFamily: t.typography.fontFamily, fontSize: t.typography.bodySm.fontSize, color: 'rgba(255,255,255,0.85)' }]}>
                  {mockItinerary.weather.condition} &middot; {mockItinerary.weather.description}
                </Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        <View style={{ paddingHorizontal: t.spacing.lg, marginTop: t.spacing.xl }}>
          <Timeline days={mockItinerary.days} />
        </View>

        <View style={[s.fabRow, { paddingHorizontal: t.spacing.lg, marginTop: t.spacing.xl, gap: t.spacing.sm }]}>
          <Button title="+ Add Activity" onPress={() => {}} size="sm" style={{ flex: 1 }} />
          <Button title="Share" onPress={() => {}} variant="secondary" size="sm" style={{ flex: 1 }} />
          <Button title="Book Transport" onPress={() => {}} variant="secondary" size="sm" style={{ flex: 1 }} />
        </View>
        <View style={{ height: t.spacing['4xl'] }} />
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1 },
  header: { borderBottomWidth: 1 },
  headerRow: { flexDirection: 'row', alignItems: 'center' },
  back: {},
  headerCenter: { flex: 1, alignItems: 'center' },
  title: {},
  subtitle: { marginTop: 1 },
  share: {},
  scroll: { flex: 1 },
  weatherWrap: {},
  weatherRow: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  weatherIcon: { fontSize: 40 },
  weatherLoc: {},
  weatherTemp: {},
  weatherCond: {},
  fabRow: { flexDirection: 'row' },
});
