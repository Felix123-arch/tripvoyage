import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useState, useEffect, useCallback } from 'react';
import { useTheme } from '../theme';
import { WeatherCard, Timeline, Button, LoadingOverlay, ErrorBanner, EmptyState } from '../components';
import { LinearGradient } from 'expo-linear-gradient';
import * as api from '../services';

interface Props {
  navigation: any;
}

export function ItineraryScreen({ navigation }: Props) {
  const t = useTheme();
  const [itinerary, setItinerary] = useState<api.Itinerary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadItinerary = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await api.getItineraries('upcoming');
      if (list.length > 0) {
        setItinerary(list[0]);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Failed to load itinerary');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadItinerary();
  }, [loadItinerary]);

  if (loading) return <LoadingOverlay message="Loading itinerary..." />;
  if (error) return <ErrorBanner message={error} onRetry={loadItinerary} />;
  if (!itinerary) return <EmptyState icon="📋" title="No Itinerary" message="Create your first trip itinerary to get started!" />;

  const days = itinerary.days.map((day) => ({
    dayNumber: day.dayNumber,
    date: day.date,
    activities: day.activities.map((a) => ({
      id: a.id,
      type: a.type as any,
      title: a.title,
      time: a.time || '',
      location: a.location || '',
      description: a.description || '',
      status: (a.status as 'confirmed' | 'action_required' | 'pending') || 'confirmed',
      badge: (a.badge as any) || undefined,
    })),
  }));

  return (
    <View style={[s.screen, { backgroundColor: t.colors.background }]}>
      <View style={[s.header, { backgroundColor: t.colors.surface, borderBottomColor: t.colors.outline, paddingHorizontal: t.spacing.lg, paddingTop: t.spacing['2xl'], paddingBottom: t.spacing.md }]}>
        <View style={s.headerRow}>
          <Text style={[s.back, { color: t.colors.primary, fontFamily: t.typography.fontFamily, fontSize: 28 }]} onPress={() => navigation.goBack()}>
            {'←'}
          </Text>
          <View style={s.headerCenter}>
            <Text style={[s.title, { fontFamily: t.typography.fontFamily, fontWeight: '600', fontSize: t.typography.bodyLg.fontSize, color: t.colors.onSurface }]}>
              {itinerary.name}
            </Text>
            <Text style={[s.subtitle, { fontFamily: t.typography.fontFamily, fontSize: t.typography.caption.fontSize, color: t.colors.onSurfaceVariant }]}>
              {itinerary.startDate} - {itinerary.endDate}, {itinerary.year}
            </Text>
          </View>
          <Text style={[s.share, { color: t.colors.onSurface, fontSize: 22 }]}>{'📤'}</Text>
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
              <Text style={s.weatherIcon}>{'☀️'}</Text>
              <View>
                <Text style={[s.weatherLoc, { fontFamily: t.typography.fontFamily, fontSize: t.typography.body.fontSize, color: 'rgba(255,255,255,0.9)' }]}>
                  {itinerary.destination}
                </Text>
                <Text style={[s.weatherTemp, { fontFamily: t.typography.fontFamily, fontWeight: '700', fontSize: 36, color: '#fff' }]}>
                  {itinerary.weatherTemp || '22'}°C
                </Text>
                <Text style={[s.weatherCond, { fontFamily: t.typography.fontFamily, fontSize: t.typography.bodySm.fontSize, color: 'rgba(255,255,255,0.85)' }]}>
                  {itinerary.weatherCond || 'Sunny'} · {itinerary.weatherDesc || 'Perfect for exploring'}
                </Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        <View style={{ paddingHorizontal: t.spacing.lg, marginTop: t.spacing.xl }}>
          <Timeline days={days} />
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
