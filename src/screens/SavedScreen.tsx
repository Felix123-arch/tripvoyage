import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../theme';
import { SegmentControl, GalleryGrid, Badge } from '../components';
import { mockPastTrips, mockMemories } from '../data';

interface Props {
  navigation: any;
}

export function SavedScreen({ navigation }: Props) {
  const t = useTheme();
  const [tab, setTab] = useState(0);
  const [yearFilter, setYearFilter] = useState('All Years');
  const [regionFilter, setRegionFilter] = useState('All Regions');

  return (
    <View style={[s.screen, { backgroundColor: t.colors.background }]}>
      <View style={[s.header, { backgroundColor: t.colors.surface, borderBottomColor: t.colors.outline, paddingHorizontal: t.spacing.lg, paddingTop: t.spacing['2xl'], paddingBottom: t.spacing.md }]}>
        <View style={s.headerRow}>
          <Text style={[s.title, { fontFamily: t.typography.fontFamily, fontWeight: '600', fontSize: t.typography.bodyLg.fontSize, color: t.colors.onSurface }]}>
            My Travels
          </Text>
          <View style={{ flex: 1 }} />
          <Text style={[s.filterIcon, { color: t.colors.onSurface, fontSize: 22 }]}>&#x2699;</Text>
        </View>
      </View>

      <ScrollView style={s.scroll} showsVerticalScrollIndicator={false}>
        <View style={{ paddingHorizontal: t.spacing.lg, marginTop: t.spacing.lg }}>
          <SegmentControl options={['Past Trips', 'Saved', 'Wishlist']} activeIndex={tab} onChange={setTab} />
        </View>

        {tab === 0 && (
          <>
            <View style={[s.filterRow, { paddingHorizontal: t.spacing.lg, marginTop: t.spacing.lg, gap: t.spacing.sm }]}>
              <Text style={[s.filterLabel, { fontFamily: t.typography.fontFamily, fontSize: t.typography.bodySm.fontSize, color: t.colors.onSurfaceVariant }]}>
                Filter:
              </Text>
              <TouchableOpacity style={[s.filterBtn, { backgroundColor: t.colors.surface, borderColor: t.colors.outline, borderRadius: t.radius.sm, paddingHorizontal: t.spacing.md, paddingVertical: t.spacing.sm }]}>
                <Text style={[s.filterText, { fontFamily: t.typography.fontFamily, fontSize: t.typography.label.fontSize, color: t.colors.onSurface }]}>
                  {yearFilter} &#x25BC;
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={[s.filterBtn, { backgroundColor: t.colors.surface, borderColor: t.colors.outline, borderRadius: t.radius.sm, paddingHorizontal: t.spacing.md, paddingVertical: t.spacing.sm }]}>
                <Text style={[s.filterText, { fontFamily: t.typography.fontFamily, fontSize: t.typography.label.fontSize, color: t.colors.onSurface }]}>
                  {regionFilter} &#x25BC;
                </Text>
              </TouchableOpacity>
            </View>

            <View style={{ paddingHorizontal: t.spacing.lg, marginTop: t.spacing.md, gap: t.spacing.md }}>
              {mockPastTrips.map((trip) => (
                <TouchableOpacity
                  key={trip.id}
                  activeOpacity={0.8}
                  style={[s.tripCard, { backgroundColor: t.colors.surface, borderRadius: t.radius.md, borderColor: t.colors.outline, borderWidth: 1 }]}
                >
                  <LinearGradient
                    colors={trip.gradient as unknown as readonly [string, string]}
                    style={[s.tripThumb, { borderRadius: t.radius.sm, width: 64, height: 64 }]}
                  >
                    <Text style={s.tripThumbIcon}>&#x1F30D;</Text>
                  </LinearGradient>
                  <View style={[s.tripInfo, { marginLeft: t.spacing.md }]}>
                    <Text style={[s.tripDest, { fontFamily: t.typography.fontFamily, fontWeight: '600', fontSize: t.typography.body.fontSize, color: t.colors.onSurface }]}>
                      {trip.destination}
                    </Text>
                    <Text style={[s.tripDate, { fontFamily: t.typography.fontFamily, fontSize: t.typography.bodySm.fontSize, color: t.colors.onSurfaceVariant }]}>
                      {trip.startDate} - {trip.endDate}, {trip.year}
                    </Text>
                    <Text style={[s.tripDuration, { fontFamily: t.typography.fontFamily, fontSize: t.typography.caption.fontSize, color: t.colors.onSurfaceMuted }]}>
                      {trip.durationDays} days
                    </Text>
                  </View>
                  <Badge variant="success" label="Completed" />
                </TouchableOpacity>
              ))}
            </View>

            <Text style={[s.sectionTitle, { fontFamily: t.typography.fontFamily, fontWeight: '600', fontSize: t.typography.headline.fontSize, color: t.colors.onSurface, marginTop: t.spacing['2xl'], paddingHorizontal: t.spacing.lg }]}>
              Memory Gallery
            </Text>
            <Text style={[s.viewAll, { fontFamily: t.typography.fontFamily, fontSize: t.typography.bodySm.fontSize, color: t.colors.primary, paddingHorizontal: t.spacing.lg }]}>
              View All
            </Text>
            <View style={{ paddingHorizontal: t.spacing.lg, marginTop: t.spacing.md }}>
              <GalleryGrid items={mockMemories} />
            </View>
          </>
        )}

        {tab !== 0 && (
          <View style={[s.empty, { padding: t.spacing['3xl'] }]}>
            <Text style={[s.emptyText, { fontFamily: t.typography.fontFamily, fontSize: t.typography.body.fontSize, color: t.colors.onSurfaceMuted, textAlign: 'center' }]}>
              {tab === 1 ? 'No saved trips yet' : 'Your wishlist is empty'}
            </Text>
          </View>
        )}

        <View style={{ height: t.spacing['4xl'] }} />
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1 },
  header: { borderBottomWidth: 1 },
  headerRow: { flexDirection: 'row', alignItems: 'center' },
  title: {},
  filterIcon: {},
  scroll: { flex: 1 },
  filterRow: { flexDirection: 'row', alignItems: 'center' },
  filterLabel: {},
  filterBtn: { borderWidth: 1 },
  filterText: {},
  tripCard: { flexDirection: 'row', alignItems: 'center', padding: 12 },
  tripThumb: { alignItems: 'center', justifyContent: 'center' },
  tripThumbIcon: { fontSize: 24 },
  tripInfo: { flex: 1 },
  tripDest: {},
  tripDate: { marginTop: 1 },
  tripDuration: { marginTop: 1 },
  sectionTitle: {},
  viewAll: { marginTop: 2 },
  empty: { alignItems: 'center' },
  emptyText: {},
});
