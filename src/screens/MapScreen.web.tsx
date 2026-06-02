import React, { useEffect, useRef, useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import AMapLoader from '@amap/amap-jsapi-loader';
import { useTheme } from '../theme';
import * as api from '../services';

const AMAP_KEY = '42831c6bf2790eb64446139596d3911e';
const AMAP_VERSION = '2.0';

interface Props {
  navigation: any;
}

const typeFilters = [
  { key: null, label: 'All' },
  { key: 'Attraction', label: 'Attractions' },
  { key: 'Hotel', label: 'Hotels' },
  { key: 'Restaurant', label: 'Food' },
  { key: 'Nature', label: 'Nature' },
  { key: 'Shopping', label: 'Shopping' },
];

const pinColors: Record<string, string> = {
  blue: '#2563EB',
  green: '#059669',
  amber: '#D97706',
  red: '#DC2626',
};

type PinDetail = api.MapPinData & {};

export function MapScreen({ navigation }: Props) {
  const t = useTheme();
  const containerId = 'amap-container';

  const [mapLoaded, setMapLoaded] = useState(false);
  const [pins, setPins] = useState<PinDetail[]>([]);
  const [selectedPin, setSelectedPin] = useState<PinDetail | null>(null);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const mapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  const loadPins = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getMapPins();
      setPins(data);
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Failed to load map data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPins();
  }, [loadPins]);

  useEffect(() => {
    let destroyed = false;

    AMapLoader.load({ key: AMAP_KEY, version: AMAP_VERSION })
      .then((AMap: any) => {
        if (destroyed) return;

        const container = document.getElementById(containerId);
        if (!container) return;

        const map = new AMap.Map(container, {
          zoom: 3,
          center: [105, 35],
          viewMode: '3D',
          resizeEnable: true,
          dragEnable: true,
          zoomEnable: true,
          scrollWheel: true,
          doubleClickZoom: true,
        });

        mapRef.current = { AMap, map };
        setMapLoaded(true);
      })
      .catch((err: any) => {
        console.error('AMap load error:', err);
        if (!destroyed) setError('Failed to load map');
      });

    return () => {
      destroyed = true;
      markersRef.current.forEach((m: any) => { try { m.remove(); } catch {} });
      markersRef.current = [];
      if (mapRef.current?.map) {
        try { mapRef.current.map.destroy(); } catch {}
        mapRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current || !mapLoaded || loading) return;

    const { AMap, map } = mapRef.current;

    markersRef.current.forEach((m: any) => { try { m.remove(); } catch {} });
    markersRef.current = [];

    const filtered = activeFilter ? pins.filter((p) => p.placeType === activeFilter) : pins;

    filtered.forEach((pin) => {
      const color = pinColors[pin.color] || '#2563EB';

      const markerEl = document.createElement('div');
      markerEl.style.cssText = `
        width: 28px; height: 28px; border-radius: 50%;
        background: ${color}; border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        cursor: pointer; display: flex; align-items: center; justify-content: center;
        color: white; font-size: 11px; font-weight: bold;
      `;
      markerEl.textContent = pin.placeType === 'Hotel' ? '🏨' : pin.placeType === 'Restaurant' ? '🍴' : pin.placeType === 'Nature' ? '🌿' : pin.placeType === 'Shopping' ? '🛍' : '📍';

      const marker = new AMap.Marker({
        position: [pin.lng, pin.lat],
        content: markerEl,
        offset: new AMap.Pixel(-14, -14),
      });

      marker.on('click', () => {
        setSelectedPin(pin);
      });

      map.add(marker);
      markersRef.current.push(marker);
    });
  }, [pins, activeFilter, mapLoaded, loading]);

  return (
    <View style={[s.screen, { backgroundColor: t.colors.background }]}>
      <View style={[s.header, { backgroundColor: t.colors.surface, borderBottomColor: t.colors.outline, paddingHorizontal: t.spacing.lg, paddingTop: t.spacing['2xl'], paddingBottom: t.spacing.md }]}>
        <View style={s.headerRow}>
          <Text style={{ fontSize: 22 }}>{'📍'}</Text>
          <Text style={[s.title, { fontFamily: t.typography.fontFamily, fontWeight: '600', fontSize: t.typography.bodyLg.fontSize, color: t.colors.onSurface, marginLeft: t.spacing.sm }]}>
            Explore Map
          </Text>
          <View style={{ flex: 1 }} />
          <Text style={{ fontSize: 22, color: t.colors.onSurface }}>{'🔍'}</Text>
        </View>
      </View>

      {loading && !mapLoaded ? (
        <View style={[s.center, { backgroundColor: t.colors.background }]}>
          <ActivityIndicator size="large" color={t.colors.primary} />
          <Text style={{ marginTop: 12, color: t.colors.onSurfaceMuted }}>Loading map...</Text>
        </View>
      ) : error ? (
        <View style={[s.center, { backgroundColor: t.colors.background }]}>
          <Text style={{ fontSize: 40, marginBottom: 12 }}>{'🗺️'}</Text>
          <Text style={{ color: '#DC2626', fontSize: 15, textAlign: 'center', paddingHorizontal: 32 }}>{error}</Text>
          <TouchableOpacity
            onPress={loadPins}
            style={{ marginTop: 16, paddingHorizontal: 24, paddingVertical: 10, backgroundColor: t.colors.primary, borderRadius: 8 }}
          >
            <Text style={{ color: '#FFF', fontWeight: '600' }}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={s.mapWrapper}>
          <View id={containerId} style={s.mapContainer} />

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={[s.filterBar, { backgroundColor: 'transparent' }]}
            contentContainerStyle={{ gap: 8, paddingHorizontal: t.spacing.lg }}
          >
            {typeFilters.map((f) => (
              <TouchableOpacity
                key={f.label}
                style={[s.filterChip, {
                  backgroundColor: activeFilter === f.key ? t.colors.primary : t.colors.surface,
                  borderRadius: t.radius.full,
                  borderColor: t.colors.outline,
                  borderWidth: activeFilter === f.key ? 0 : 1,
                }]}
                onPress={() => setActiveFilter(f.key)}
              >
                <Text style={{ color: activeFilter === f.key ? '#FFF' : t.colors.onSurface, fontSize: 13, fontWeight: '500' }}>
                  {f.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <TouchableOpacity
            style={[s.routeBtn, { backgroundColor: t.colors.surface, borderRadius: t.radius.full, paddingHorizontal: t.spacing.lg, paddingVertical: t.spacing.sm }]}
            activeOpacity={0.8}
          >
            <Text style={[s.routeText, { fontFamily: t.typography.fontFamily, fontWeight: '500', fontSize: t.typography.label.fontSize, color: t.colors.onSurface }]}>
              {'↔ Show Route'}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {selectedPin && (
        <View style={[s.bottomSheet, { backgroundColor: t.colors.surface, borderTopLeftRadius: 20, borderTopRightRadius: 20 }]}>
          <View style={[s.sheetHandle, { backgroundColor: t.colors.outline }]} />
          <View style={s.sheetHeader}>
            <View style={{ flex: 1 }}>
              <Text style={[s.sheetName, { fontFamily: t.typography.fontFamily, fontWeight: '700', fontSize: 18, color: t.colors.onSurface }]}>
                {selectedPin.name}
              </Text>
              <View style={s.sheetMeta}>
                <Text style={{ color: t.colors.tertiary, fontSize: 15 }}>{'★'.repeat(Math.round(selectedPin.rating))}</Text>
                <Text style={[s.sheetRating, { color: t.colors.onSurface, fontFamily: t.typography.fontFamily, fontWeight: '600' }]}>
                  {selectedPin.rating.toFixed(1)}
                </Text>
                <Text style={{ color: t.colors.onSurfaceMuted, fontSize: 13 }}>
                  ({selectedPin.reviewCount.toLocaleString()} reviews)
                </Text>
              </View>
            </View>
            <Text style={[s.sheetDistance, { color: t.colors.primary, fontWeight: '600', fontFamily: t.typography.fontFamily }]}>
              {selectedPin.distance}
            </Text>
          </View>
          <Text style={[s.sheetDesc, { fontFamily: t.typography.fontFamily, fontSize: 14, color: t.colors.onSurfaceVariant, lineHeight: 20 }]}>
            {selectedPin.description}
          </Text>
          <Text style={[s.sheetType, { color: t.colors.onSurfaceMuted, fontSize: 12, fontFamily: t.typography.fontFamily }]}>
            {selectedPin.placeType} • {selectedPin.color === 'green' ? 'Highly Rated' : selectedPin.color === 'blue' ? 'Popular' : 'Recommended'}
          </Text>
          <View style={s.sheetActions}>
            <TouchableOpacity
              style={[s.addBtn, { backgroundColor: t.colors.primary, borderRadius: t.radius.md }]}
              onPress={() => setSelectedPin(null)}
            >
              <Text style={{ color: '#FFF', fontWeight: '600', fontSize: 15 }}>Add to Itinerary</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[s.closeBtn, { borderColor: t.colors.outline, borderRadius: t.radius.md, borderWidth: 1 }]}
              onPress={() => setSelectedPin(null)}
            >
              <Text style={{ color: t.colors.onSurface }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1 },
  header: { borderBottomWidth: 1, zIndex: 10 },
  headerRow: { flexDirection: 'row', alignItems: 'center' },
  title: {},
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  mapWrapper: { flex: 1, position: 'relative' },
  mapContainer: { ...StyleSheet.absoluteFillObject },
  filterBar: {
    position: 'absolute', top: 12, left: 0, right: 0,
    paddingVertical: 4,
  },
  filterChip: {
    paddingHorizontal: 16, paddingVertical: 8,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1, shadowRadius: 3, elevation: 2,
  },
  routeBtn: {
    position: 'absolute', bottom: 24, right: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15, shadowRadius: 8, elevation: 5,
  },
  routeText: {},
  bottomSheet: {
    paddingHorizontal: 20, paddingBottom: 32, paddingTop: 12,
    shadowColor: '#000', shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1, shadowRadius: 10, elevation: 10,
  },
  sheetHandle: { width: 40, height: 4, borderRadius: 2, alignSelf: 'center', marginBottom: 16 },
  sheetHeader: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12 },
  sheetMeta: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
  sheetRating: { fontSize: 15 },
  sheetName: {},
  sheetDistance: { fontSize: 14, marginTop: 2 },
  sheetDesc: { marginBottom: 8 },
  sheetType: { marginBottom: 16 },
  sheetActions: { flexDirection: 'row', gap: 12 },
  addBtn: { flex: 1, height: 46, justifyContent: 'center', alignItems: 'center' },
  closeBtn: { width: 80, height: 46, justifyContent: 'center', alignItems: 'center' },
});
