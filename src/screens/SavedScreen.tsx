import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert, Modal } from 'react-native';
import { useState, useEffect, useCallback } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../theme';
import { useLang } from '../contexts/LanguageContext';
import { td } from '../i18n/translations';
import { SegmentControl, GalleryGrid, Badge, LoadingOverlay, ErrorBanner, EmptyState } from '../components';
import { useAuth } from '../contexts/AuthContext';
import * as api from '../services';

interface Props {
  navigation: any;
}

const YEARS = ['allYears', '2026', '2025', '2024', '2023', '2022'];
const REGIONS = ['allRegions', 'asia', 'europe', 'northAmerica', 'southAmerica', 'oceania', 'africa'];
const REGION_API_VALUES = ['All Regions', 'Asia', 'Europe', 'North America', 'South America', 'Oceania', 'Africa'];

export function SavedScreen({ navigation }: Props) {
  const t = useTheme();
  const { isAuthenticated } = useAuth();
  const { t: tx, lang } = useLang();
  const [tab, setTab] = useState(0);
  const [pastTrips, setPastTrips] = useState<api.Itinerary[]>([]);
  const [savedDestinations, setSavedDestinations] = useState<api.SavedDestination[]>([]);
  const [wishlistItems, setWishlistItems] = useState<api.WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters (use translation keys)
  const [yearFilter, setYearFilter] = useState('allYears');
  const [regionFilter, setRegionFilter] = useState('allRegions');
  const [showYearPicker, setShowYearPicker] = useState(false);
  const [showRegionPicker, setShowRegionPicker] = useState(false);

  const loadAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [trips, saved, wishlist] = await Promise.all([
        api.getItineraries('completed').catch(() => [] as api.Itinerary[]),
        isAuthenticated ? api.getSaved().catch(() => [] as api.SavedDestination[]) : Promise.resolve([] as api.SavedDestination[]),
        isAuthenticated ? api.getWishlist().catch(() => [] as api.WishlistItem[]) : Promise.resolve([] as api.WishlistItem[]),
      ]);
      setPastTrips(trips);
      setSavedDestinations(saved);
      setWishlistItems(wishlist);
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Failed to load');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const handleUnsave = async (savedId: string) => {
    try {
      await api.unsaveDestination(savedId);
      setSavedDestinations((prev) => prev.filter((s) => s.id !== savedId));
    } catch {
      Alert.alert('Error', 'Failed to remove saved destination.');
    }
  };

  const handleRemoveWishlist = async (wishlistId: string) => {
    try {
      await api.removeFromWishlist(wishlistId);
      setWishlistItems((prev) => prev.filter((w) => w.id !== wishlistId));
    } catch {
      Alert.alert('Error', 'Failed to remove from wishlist.');
    }
  };

  const handleTripPress = (trip: api.Itinerary) => {
    const destName = td(lang, trip.destination)?.name || trip.destination;
    const days = trip.days?.length || 0;
    const activities = trip.days?.reduce((sum: number, d: any) => sum + (d.activities?.length || 0), 0) || 0;
    Alert.alert(
      destName,
      `${trip.startDate} - ${trip.endDate} (${trip.year})\n${days} ${tx('day')} · ${activities} ${tx('addActivity')}\n${tx('status')}: ${tx(trip.status)}`,
      [{ text: tx('close'), style: 'default' }]
    );
  };

  // Filter trips by year and region
  const regionApiValue = REGION_API_VALUES[REGIONS.indexOf(regionFilter)] || 'All Regions';
  const filteredTrips = pastTrips.filter((trip) => {
    if (yearFilter !== 'allYears' && String(trip.year) !== yearFilter) return false;
    if (regionApiValue !== 'All Regions') {
      const regionMap: Record<string, string[]> = {
        'Asia': ['Tokyo', 'Kyoto', 'Beijing', 'Shanghai', 'Bali', 'Phuket', 'Istanbul', 'Chengdu', 'Dubai', 'Maldives'],
        'Europe': ['Paris', 'Santorini', 'Barcelona', 'Rome', 'Amsterdam', 'Swiss Alps', 'Reykjavik'],
        'North America': ['New York City', 'Banff'],
        'South America': ['Rio de Janeiro', 'Machu Picchu'],
        'Oceania': ['Sydney', 'Queenstown'],
        'Africa': ['Marrakech'],
      };
      const regionDestinations = regionMap[regionApiValue] || [];
      if (!regionDestinations.some((d) => trip.destination.includes(d))) return false;
    }
    return true;
  });

  const memoryItems = filteredTrips.slice(0, 6).map((trip, i) => ({
    id: trip.id,
    title: trip.destination,
    gradient: [['#065F46', '#10B981'], ['#1E40AF', '#3B82F6'], ['#991B1B', '#EF4444'], ['#92400E', '#F59E0B'], ['#5B21B6', '#8B5CF6'], ['#064E3B', '#34D399']][i % 6] as string[],
  }));

  return (
    <View style={[s.screen, { backgroundColor: t.colors.background }]}>
      <View style={[s.header, { backgroundColor: t.colors.surface, borderBottomColor: t.colors.outline, paddingHorizontal: t.spacing.lg, paddingTop: t.spacing['2xl'], paddingBottom: t.spacing.md }]}>
        <View style={s.headerRow}>
          <Text style={[s.title, { fontFamily: t.typography.fontFamily, fontWeight: '600', fontSize: t.typography.bodyLg.fontSize, color: t.colors.onSurface }]}>
            {tx('myTravels')}
          </Text>
        </View>
      </View>

      {loading ? (
        <LoadingOverlay message={tx('loadingTravels')} />
      ) : error ? (
        <ErrorBanner message={error} onRetry={loadAll} />
      ) : (
        <ScrollView style={s.scroll} showsVerticalScrollIndicator={false}>
          <View style={{ paddingHorizontal: t.spacing.lg, marginTop: t.spacing.lg }}>
            <SegmentControl options={[tx('pastTrips'), tx('saved'), tx('wishlist')]} activeIndex={tab} onChange={setTab} />
          </View>

          {/* Tab 0: Past Trips */}
          {tab === 0 && (
            <>
              <View style={[s.filterRow, { paddingHorizontal: t.spacing.lg, marginTop: t.spacing.lg, gap: t.spacing.sm }]}>
                <Text style={[s.filterLabel, { fontSize: t.typography.bodySm.fontSize, color: t.colors.onSurfaceVariant }]}>{tx('filter')}</Text>
                <TouchableOpacity
                  style={[s.filterBtn, { backgroundColor: t.colors.surface, borderColor: t.colors.outline, borderRadius: t.radius.sm, paddingHorizontal: t.spacing.md, paddingVertical: t.spacing.sm }]}
                  onPress={() => { setShowYearPicker(true); setShowRegionPicker(false); }}
                >
                  <Text style={{ fontSize: t.typography.label.fontSize, color: t.colors.onSurface }}>{tx(yearFilter)} {'▼'}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[s.filterBtn, { backgroundColor: t.colors.surface, borderColor: t.colors.outline, borderRadius: t.radius.sm, paddingHorizontal: t.spacing.md, paddingVertical: t.spacing.sm }]}
                  onPress={() => { setShowRegionPicker(true); setShowYearPicker(false); }}
                >
                  <Text style={{ fontSize: t.typography.label.fontSize, color: t.colors.onSurface }}>{tx(regionFilter)} {'▼'}</Text>
                </TouchableOpacity>
              </View>

              {filteredTrips.length === 0 ? (
                <EmptyState icon="✈️" message={tx('noPastTripsFilter')} />
              ) : (
                <View style={{ paddingHorizontal: t.spacing.lg, marginTop: t.spacing.md, gap: t.spacing.md }}>
                  {filteredTrips.map((trip) => (
                    <TouchableOpacity
                      key={trip.id}
                      activeOpacity={0.8}
                      onPress={() => handleTripPress(trip)}
                      style={[s.tripCard, { backgroundColor: t.colors.surface, borderRadius: t.radius.md, borderColor: t.colors.outline, borderWidth: 1 }]}
                    >
                      <LinearGradient
                        colors={['#065F46', '#10B981']}
                        style={[s.tripThumb, { borderRadius: t.radius.sm, width: 64, height: 64 }]}
                      >
                        <Text style={s.tripThumbIcon}>{'🌍'}</Text>
                      </LinearGradient>
                      <View style={[s.tripInfo, { marginLeft: t.spacing.md }]}>
                        <Text style={{ fontWeight: '600', fontSize: t.typography.body.fontSize, color: t.colors.onSurface }}>
                          {td(lang, trip.destination)?.name || trip.destination}
                        </Text>
                        <Text style={{ fontSize: t.typography.bodySm.fontSize, color: t.colors.onSurfaceVariant }}>
                          {trip.startDate} - {trip.endDate}
                        </Text>
                      </View>
                      <Badge variant={trip.status === 'completed' ? 'success' : 'info'} label={tx(trip.status)} />
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              {memoryItems.length > 0 && (
                <>
                  <Text style={[s.sectionTitle, { fontWeight: '600', fontSize: t.typography.headline.fontSize, color: t.colors.onSurface, marginTop: t.spacing['2xl'], paddingHorizontal: t.spacing.lg }]}>
                    {tx('memoryGallery')}
                  </Text>
                  <TouchableOpacity onPress={() => setTab(0)}>
                    <Text style={{ fontSize: t.typography.bodySm.fontSize, color: t.colors.primary, paddingHorizontal: t.spacing.lg, marginTop: 2 }}>
                      {tx('viewAll')}
                    </Text>
                  </TouchableOpacity>
                  <View style={{ paddingHorizontal: t.spacing.lg, marginTop: t.spacing.md }}>
                    <TouchableOpacity onPress={() => setTab(0)}>
                      <GalleryGrid items={memoryItems} />
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </>
          )}

          {/* Tab 1: Saved Destinations */}
          {tab === 1 && (
            <>
              {savedDestinations.length === 0 ? (
                <EmptyState icon="🔖" title={tx('noSaved')} message={tx('noSavedMsg')} />
              ) : (
                <View style={{ paddingHorizontal: t.spacing.lg, marginTop: t.spacing.md, gap: t.spacing.md }}>
                  {savedDestinations.map((saved) => {
                    const dest = saved.destination;
                    return (
                      <View key={saved.id} style={[s.tripCard, { backgroundColor: t.colors.surface, borderRadius: t.radius.md, borderColor: t.colors.outline, borderWidth: 1 }]}>
                        <LinearGradient
                          colors={dest ? [dest.gradientStart, dest.gradientEnd] : ['#6366F1', '#8B5CF6']}
                          style={[s.tripThumb, { borderRadius: t.radius.sm, width: 64, height: 64 }]}
                        >
                          <Text style={s.tripThumbIcon}>{'📍'}</Text>
                        </LinearGradient>
                        <View style={[s.tripInfo, { marginLeft: t.spacing.md }]}>
                          <Text style={{ fontWeight: '600', fontSize: t.typography.body.fontSize, color: t.colors.onSurface }}>
                            {dest?.name || 'Unknown'}
                          </Text>
                          <Text style={{ fontSize: t.typography.bodySm.fontSize, color: t.colors.onSurfaceVariant }}>
                            {dest?.category || ''} {dest ? `· ⭐ ${dest.rating.toFixed(1)}` : ''}
                          </Text>
                        </View>
                        <TouchableOpacity onPress={() => handleUnsave(saved.id)}
                          style={{ paddingHorizontal: 8, paddingVertical: 4 }}>
                          <Text style={{ color: t.colors.error, fontSize: 20 }}>♥</Text>
                        </TouchableOpacity>
                      </View>
                    );
                  })}
                </View>
              )}
            </>
          )}

          {/* Tab 2: Wishlist */}
          {tab === 2 && (
            <>
              {wishlistItems.length === 0 ? (
                <EmptyState icon="⭐" title={tx('wishlistEmpty')} message={tx('wishlistEmptyMsg')} />
              ) : (
                <View style={{ paddingHorizontal: t.spacing.lg, marginTop: t.spacing.md, gap: t.spacing.md }}>
                  {wishlistItems.map((item) => (
                    <View key={item.id} style={[s.tripCard, { backgroundColor: t.colors.surface, borderRadius: t.radius.md, borderColor: t.colors.outline, borderWidth: 1 }]}>
                      <LinearGradient
                        colors={['#F59E0B', '#EF4444']}
                        style={[s.tripThumb, { borderRadius: t.radius.sm, width: 64, height: 64 }]}
                      >
                        <Text style={s.tripThumbIcon}>{'⭐'}</Text>
                      </LinearGradient>
                      <View style={[s.tripInfo, { marginLeft: t.spacing.md }]}>
                        <Text style={{ fontWeight: '600', fontSize: t.typography.body.fontSize, color: t.colors.onSurface }}>
                          {item.destination}
                        </Text>
                        {item.notes ? (
                          <Text style={{ fontSize: t.typography.bodySm.fontSize, color: t.colors.onSurfaceVariant }}>
                            {item.notes}
                          </Text>
                        ) : null}
                      </View>
                      <TouchableOpacity onPress={() => handleRemoveWishlist(item.id)}
                        style={{ paddingHorizontal: 8, paddingVertical: 4 }}>
                        <Text style={{ color: t.colors.error, fontSize: 16 }}>✕</Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}
            </>
          )}

          <View style={{ height: t.spacing['4xl'] }} />
        </ScrollView>
      )}

      {/* Year Picker Modal */}
      <Modal visible={showYearPicker} transparent animationType="fade">
        <TouchableOpacity style={{ flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.4)', padding: 40 }} activeOpacity={1} onPress={() => setShowYearPicker(false)}>
          <View style={{ backgroundColor: t.colors.surface, borderRadius: t.radius.lg, padding: 20 }} onStartShouldSetResponder={() => true}>
            <Text style={{ fontWeight: '700', fontSize: 18, color: t.colors.onSurface, textAlign: 'center', marginBottom: 12 }}>{tx('selectYear')}</Text>
            {YEARS.map((y) => (
              <TouchableOpacity key={y} onPress={() => { setYearFilter(y); setShowYearPicker(false); }}
                style={{ paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: t.colors.outline }}>
                <Text style={{ color: yearFilter === y ? t.colors.primary : t.colors.onSurface, fontWeight: yearFilter === y ? '700' : '400', fontSize: 15, textAlign: 'center' }}>
                  {tx(y)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Region Picker Modal */}
      <Modal visible={showRegionPicker} transparent animationType="fade">
        <TouchableOpacity style={{ flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.4)', padding: 40 }} activeOpacity={1} onPress={() => setShowRegionPicker(false)}>
          <View style={{ backgroundColor: t.colors.surface, borderRadius: t.radius.lg, padding: 20 }} onStartShouldSetResponder={() => true}>
            <Text style={{ fontWeight: '700', fontSize: 18, color: t.colors.onSurface, textAlign: 'center', marginBottom: 12 }}>{tx('selectRegion')}</Text>
            {REGIONS.map((r) => (
              <TouchableOpacity key={r} onPress={() => { setRegionFilter(r); setShowRegionPicker(false); }}
                style={{ paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: t.colors.outline }}>
                <Text style={{ color: regionFilter === r ? t.colors.primary : t.colors.onSurface, fontWeight: regionFilter === r ? '700' : '400', fontSize: 15, textAlign: 'center' }}>
                  {tx(r)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1 },
  header: { borderBottomWidth: 1 },
  headerRow: { flexDirection: 'row', alignItems: 'center' },
  title: {},
  scroll: { flex: 1 },
  filterRow: { flexDirection: 'row', alignItems: 'center' },
  filterLabel: {},
  filterBtn: { borderWidth: 1 },
  sectionTitle: {},
  tripCard: { flexDirection: 'row', alignItems: 'center', padding: 12 },
  tripThumb: { alignItems: 'center', justifyContent: 'center' },
  tripThumbIcon: { fontSize: 24 },
  tripInfo: { flex: 1 },
});
