import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useState, useEffect, useCallback } from 'react';
import { useTheme } from '../theme';
import { useLang } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { td } from '../i18n/translations';
import { SearchBar, Chip, Card, Button, LoadingOverlay, ErrorBanner, EmptyState } from '../components';
import * as api from '../services';

interface Props {
  navigation: any;
}

const CAT_KEYS = ['allCat', 'beach', 'mountain', 'cityBreak', 'family', 'adventure', 'relaxation'] as const;
const CAT_VALUES = ['All', 'Beach', 'Mountain', 'City Break', 'Family', 'Adventure', 'Relaxation'];

export function HomeScreen({ navigation }: Props) {
  const t = useTheme();
  const { t: tx, lang } = useLang();
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [destinations, setDestinations] = useState<api.Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentTrip, setCurrentTrip] = useState<{ name: string; startDate: string; endDate: string } | null>(null);

  const loadDestinations = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params: any = {};
      if (activeCategory !== 'All') params.category = activeCategory;
      if (search.trim()) params.search = search.trim();
      let data = await api.getDestinations(params);
      // Personalized ranking: boost destinations matching user preferences + travel history
      const prefs = (user?.preferences || []).map((p: any) => typeof p === 'string' ? p.toLowerCase() : p.preference?.toLowerCase() || '');
      // Load past trips to learn favorite categories
      let pastCategories: string[] = [];
      try {
        const pastTrips = await api.getItineraries('completed');
        pastCategories = pastTrips.map((t) => t.destination).filter(Boolean);
      } catch {}
      // Combined scoring
      const boostSet = new Set([
        ...prefs,
        ...pastCategories.map((c) => c.toLowerCase()),
      ]);
      if (boostSet.size > 0) {
        data = [...data].sort((a, b) => {
          const aMatch = boostSet.has(a.category.toLowerCase()) || Array.from(boostSet).some((kw) => a.description.toLowerCase().includes(kw) || a.name.toLowerCase().includes(kw)) ? 1 : 0;
          const bMatch = boostSet.has(b.category.toLowerCase()) || Array.from(boostSet).some((kw) => b.description.toLowerCase().includes(kw) || b.name.toLowerCase().includes(kw)) ? 1 : 0;
          if (aMatch !== bMatch) return bMatch - aMatch;
          return b.rating - a.rating;
        });
      }
      setDestinations(data);
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || tx('failedLoadDest'));
    } finally {
      setLoading(false);
    }
  }, [activeCategory, search, user?.preferences]);

  useEffect(() => {
    loadDestinations();
  }, [loadDestinations]);

  useEffect(() => {
    api.getItineraries('upcoming')
      .then((list) => {
        if (list.length > 0) {
          setCurrentTrip({ name: list[0].name, startDate: list[0].startDate, endDate: list[0].endDate });
        }
      })
      .catch(() => {
        // Trip info is optional — silent failure is ok, user still sees destinations
      });
  }, []);

  return (
    <View style={[s.screen, { backgroundColor: t.colors.background }]}>
      <View style={[s.header, { backgroundColor: t.colors.surface, borderBottomColor: t.colors.outline, paddingHorizontal: t.spacing.lg, paddingTop: t.spacing['2xl'], paddingBottom: t.spacing.md }]}>
        <View style={s.headerRow}>
          <View style={[s.logo, { backgroundColor: t.colors.primaryContainer, borderRadius: t.radius.sm, width: 32, height: 32 }]}>
            <Text style={s.logoIcon}>{'⛰️'}</Text>
          </View>
          <Text style={[s.logoText, { fontFamily: t.typography.fontFamily, fontWeight: '700', fontSize: t.typography.title.fontSize, color: t.colors.onSurface }]}>
            TripVoyage
          </Text>
          <View style={{ flex: 1 }} />
          <TouchableOpacity onPress={() => Alert.alert(tx('notifications'), tx('noNotifications'))}>
            <Text style={[s.bell, { color: t.colors.onSurface }]}>{'🔔'}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={s.scroll} showsVerticalScrollIndicator={false}>
        <View style={{ paddingHorizontal: t.spacing.lg, marginTop: t.spacing.lg }}>
          <SearchBar value={search} onChangeText={setSearch} placeholder={tx('searchPlaceholder')} />
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: t.spacing.lg, marginTop: t.spacing.lg, gap: t.spacing.sm }}
        >
          {CAT_KEYS.map((key, i) => (
            <Chip key={key} label={tx(key)} active={activeCategory === CAT_VALUES[i]} onPress={() => setActiveCategory(CAT_VALUES[i])} />
          ))}
        </ScrollView>

        <Text style={[s.sectionTitle, { fontFamily: t.typography.fontFamily, fontWeight: '600', fontSize: t.typography.headline.fontSize, color: t.colors.onSurface, marginTop: t.spacing['2xl'], paddingHorizontal: t.spacing.lg }]}>
          {tx('recommended')}
        </Text>

        {loading ? (
          <LoadingOverlay message={tx('loadingDestinations')} />
        ) : error ? (
          <ErrorBanner message={error} onRetry={loadDestinations} />
        ) : destinations.length === 0 ? (
          <EmptyState icon="🔍" message={tx('noDestinations')} />
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: t.spacing.lg, marginTop: t.spacing.md, gap: t.spacing.md }}
          >
            {destinations.map((dest) => {
              const dt = td(lang, dest.name);
              return (
                <Card
                  key={dest.id}
                  name={dt?.name || dest.name}
                  description={dt?.desc || dest.description}
                  rating={dest.rating}
                  reviewCount={dest.reviewCount}
                  gradient={[dest.gradientStart, dest.gradientEnd]}
                  imageUrl={dest.imageUrl}
                  onPress={() => navigation.navigate('DestinationDetail', { destination: dest })}
                />
              );
            })}
          </ScrollView>
        )}

        <Text style={[s.sectionTitle, { fontFamily: t.typography.fontFamily, fontWeight: '600', fontSize: t.typography.headline.fontSize, color: t.colors.onSurface, marginTop: t.spacing['2xl'], paddingHorizontal: t.spacing.lg }]}>
          {tx('quickActions')}
        </Text>
        <View style={[s.quickRow, { paddingHorizontal: t.spacing.lg, marginTop: t.spacing.md }]}>
          <View style={s.quickLeft}>
            <Button title={tx('createItinerary')} onPress={() => navigation.navigate('Itinerary')} block />
          </View>
          <View style={[s.quickRight, { gap: t.spacing.sm }]}>
            <View style={[s.tripSnippet, { backgroundColor: t.colors.surface, borderRadius: t.radius.md, padding: t.spacing.md, borderColor: t.colors.outline, borderWidth: 1 }]}>
              <Text style={[s.tripLabel, { fontFamily: t.typography.fontFamily, fontSize: t.typography.caption.fontSize, color: t.colors.onSurfaceMuted }]}>
                {tx('currentTrip')}
              </Text>
              <Text style={[s.tripName, { fontFamily: t.typography.fontFamily, fontWeight: '700', fontSize: t.typography.body.fontSize, color: t.colors.onSurface }]}>
                {currentTrip?.name || tx('noUpcomingTrips')}
              </Text>
              {currentTrip && (
                <Text style={[s.tripDates, { fontFamily: t.typography.fontFamily, fontSize: t.typography.caption.fontSize, color: t.colors.onSurfaceVariant }]}>
                  {currentTrip.startDate} - {currentTrip.endDate}
                </Text>
              )}
            </View>
            <Button title={tx('exploreMap')} onPress={() => navigation.navigate('Map')} variant="outline" block />
          </View>
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
  logo: { alignItems: 'center', justifyContent: 'center' },
  logoIcon: { fontSize: 16 },
  logoText: { marginLeft: 8 },
  bell: { fontSize: 22 },
  scroll: { flex: 1 },
  sectionTitle: {},
  quickRow: { flexDirection: 'row', gap: 12 },
  quickLeft: { flex: 1, justifyContent: 'center' },
  quickRight: { flex: 1 },
  tripSnippet: {},
  tripLabel: {},
  tripName: { marginTop: 2 },
  tripDates: { marginTop: 1 },
});
