import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useState, useEffect, useCallback } from 'react';
import { useTheme } from '../theme';
import { MapPin, BottomSheet, LoadingOverlay, ErrorBanner } from '../components';
import * as api from '../services';

interface Props {
  navigation: any;
}

export function MapScreen({ navigation }: Props) {
  const t = useTheme();
  const [pins, setPins] = useState<api.MapPinData[]>([]);
  const [selectedPin, setSelectedPin] = useState<api.MapPinData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPins = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getMapPins();
      setPins(data);
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Failed to load map');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPins();
  }, [loadPins]);

  return (
    <View style={[s.screen, { backgroundColor: t.colors.background }]}>
      <View style={[s.header, { backgroundColor: t.colors.surface, borderBottomColor: t.colors.outline, paddingHorizontal: t.spacing.lg, paddingTop: t.spacing['2xl'], paddingBottom: t.spacing.md }]}>
        <View style={s.headerRow}>
          <Text style={[s.pinIcon, { fontSize: 22 }]}>{'📍'}</Text>
          <Text style={[s.title, { fontFamily: t.typography.fontFamily, fontWeight: '600', fontSize: t.typography.bodyLg.fontSize, color: t.colors.onSurface, marginLeft: t.spacing.sm }]}>
            Explore Map
          </Text>
          <View style={{ flex: 1 }} />
          <Text style={[s.searchIcon, { fontSize: 22, color: t.colors.onSurface }]}>{'🔍'}</Text>
        </View>
      </View>

      {loading ? (
        <LoadingOverlay message="Loading map..." />
      ) : error ? (
        <ErrorBanner message={error} onRetry={loadPins} />
      ) : (
        <View style={s.mapContainer}>
          <View style={s.mapBg}>
            <View style={[s.mapGradient1, { backgroundColor: '#BFDBFE', opacity: 0.5, borderRadius: 200, width: 200, height: 200, top: '10%', left: '5%' }]} />
            <View style={[s.mapGradient2, { backgroundColor: '#D1FAE5', opacity: 0.5, borderRadius: 150, width: 150, height: 150, top: '40%', left: '50%' }]} />
            <View style={[s.mapGradient3, { backgroundColor: '#EFF6FF', opacity: 0.6, borderRadius: 180, width: 180, height: 180, top: '50%', left: '10%' }]} />
            <View style={[s.mapGradient4, { backgroundColor: '#F0FDF4', opacity: 0.5, borderRadius: 120, width: 120, height: 120, top: '20%', right: '10%' }]} />
          </View>

          {pins.map((pin) => {
            // Compute position from lat/lng for the fake map background
            // lat range ~25-65 → top 5%-95%, lng range ~-10-175 → left 5%-95%
            const topPct = Math.max(5, Math.min(95, ((65 - pin.lat) / 40) * 90 + 5));
            const leftPct = Math.max(5, Math.min(95, ((pin.lng - (-10)) / 185) * 90 + 5));
            return (
              <MapPin
                key={pin.id}
                color={pin.color as 'blue' | 'green' | 'amber' | 'red'}
                top={`${topPct}%` as any}
                left={`${leftPct}%` as any}
                onPress={() => setSelectedPin(pin)}
              />
            );
          })}

          <TouchableOpacity
            style={[s.routeBtn, { backgroundColor: t.colors.surface, borderRadius: t.radius.full, paddingHorizontal: t.spacing.lg, paddingVertical: t.spacing.sm }]}
            activeOpacity={0.8}
            onPress={() => {
              if (pins.length > 0) {
                setSelectedPin(pins[0]);
              }
            }}
          >
            <Text style={[s.routeText, { fontFamily: t.typography.fontFamily, fontWeight: '500', fontSize: t.typography.label.fontSize, color: t.colors.onSurface }]}>
              {'↔ Show Route'}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {selectedPin && (
        <BottomSheet
          visible={!!selectedPin}
          onClose={() => setSelectedPin(null)}
          title={selectedPin.name}
          rating={selectedPin.rating}
          reviewCount={selectedPin.reviewCount}
          distance={selectedPin.distance}
          description={selectedPin.description}
          onAdd={() => setSelectedPin(null)}
        />
      )}
    </View>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1 },
  header: { borderBottomWidth: 1 },
  headerRow: { flexDirection: 'row', alignItems: 'center' },
  pinIcon: {},
  title: {},
  searchIcon: {},
  mapContainer: { flex: 1, position: 'relative' },
  mapBg: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#EFF6FF' },
  mapGradient1: { position: 'absolute' },
  mapGradient2: { position: 'absolute' },
  mapGradient3: { position: 'absolute' },
  mapGradient4: { position: 'absolute' },
  routeBtn: {
    position: 'absolute', top: 12, right: 12,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12, shadowRadius: 6, elevation: 4,
  },
  routeText: {},
});
