import React, { useEffect, useRef, useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, ScrollView, Modal, Alert, Image } from 'react-native';
import { useTheme } from '../theme';
import { useAuth } from '../contexts/AuthContext';
import { useLang } from '../contexts/LanguageContext';
import { tp, td } from '../i18n/translations';
import { getImageUrl } from '../utils/imageProxy';
import * as api from '../services';

const AMAP_KEY = 'f437d8e1df9e233e62b78cad68860eb6';

function loadAmapScript(): Promise<any> {
  return new Promise((resolve, reject) => {
    const w = window as any;
    if (w.AMap) { resolve(w.AMap); return; }
    const cb = '_amap_cb_' + Date.now();
    (w as any)[cb] = () => { resolve(w.AMap); };
    const script = document.createElement('script');
    script.src = `https://webapi.amap.com/maps?v=2.0&key=${AMAP_KEY}&callback=${cb}`;
    script.onerror = () => reject(new Error('AMap script failed'));
    document.head.appendChild(script);
  });
}

const TYPE_FILTERS = [
  { key: null, i18n: 'all' as const },
  { key: 'Attraction', i18n: 'attractions' as const },
  { key: 'Hotel', i18n: 'hotels' as const },
  { key: 'Restaurant', i18n: 'food' as const },
  { key: 'Nature', i18n: 'nature' as const },
  { key: 'Shopping', i18n: 'shopping' as const },
];

const pinColors: Record<string, string> = {
  blue: '#2563EB', green: '#059669', amber: '#D97706', red: '#DC2626',
};

export function MapScreen({ navigation, route }: Props) {
  const t = useTheme();
  const { isAuthenticated } = useAuth();
  const { t: tx, lang } = useLang();
  const itineraryRoutes = route?.params?.itineraryRoutes;
  const [mapLoaded, setMapLoaded] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [pins, setPins] = useState<api.MapPinData[]>([]);
  const [destinations, setDestinations] = useState<api.Destination[]>([]);
  const [selectedPin, setSelectedPin] = useState<api.MapPinData | null>(null);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [loadingData, setLoadingData] = useState(true);

  // Add to itinerary states
  const [itineraries, setItineraries] = useState<api.Itinerary[]>([]);
  const [showItineraryModal, setShowItineraryModal] = useState(false);
  const [addingToItinerary, setAddingToItinerary] = useState(false);
  const [imgFailed, setImgFailed] = useState(false);

  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstance = useRef<any>(null);
  const amapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  const loadPins = useCallback(async () => {
    setLoadingData(true);
    try {
      const [pinData, destData] = await Promise.all([
        api.getMapPins(),
        api.getDestinations(),
      ]);
      setPins(pinData);
      setDestinations(destData);
    } catch {}
    setLoadingData(false);
  }, []);

  useEffect(() => { loadPins(); }, [loadPins]);

  // Draw itinerary routes on map
  useEffect(() => {
    if (!mapLoaded || !amapRef.current || !mapInstance.current || !itineraryRoutes) return;
    const { AMap, map } = { AMap: amapRef.current, map: mapInstance.current };
    const route = itineraryRoutes;

    // Collect all pins that match itinerary activities
    const routePinNames = new Set<string>();
    route.days?.forEach((day: any) => {
      day.activities?.forEach((act: any) => {
        if (act.location) routePinNames.add(act.location);
      });
    });

    // Find matching pins by location/name
    const routePins = pins.filter((p) =>
      routePinNames.has(p.name) || Array.from(routePinNames).some((n) => p.name.includes(n) || n.includes(p.name))
    );

    if (routePins.length < 2) return;

    // Center map on first pin
    map.setCenter([routePins[0].lng, routePins[0].lat]);
    map.setZoom(5);

    // Draw colored lines between consecutive pins
    const colors = ['#2563EB', '#059669', '#D97706', '#DC2626', '#7C3AED', '#0891B2'];
    const path = routePins.map((p) => [p.lng, p.lat]);
    const line = new (AMap as any).Polyline({
      path,
      strokeColor: '#2563EB',
      strokeWeight: 3,
      strokeOpacity: 0.7,
      strokeStyle: 'solid',
      showDir: true,
    });
    map.add(line);
    (map as any)._routeLine = line;

    // Add numbered markers
    routePins.forEach((p, i) => {
      const el = document.createElement('div');
      el.innerHTML = `<div style="background:#2563EB;color:white;width:24px;height:24px;border-radius:12px;display:flex;align-items:center;justify-content:center;font-weight:bold;font-size:12px;border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3);">${i + 1}</div>`;
      const marker = new (AMap as any).Marker({
        position: [p.lng, p.lat],
        content: el.firstChild,
        offset: new (AMap as any).Pixel(-12, -12),
      });
      marker.on('click', () => setSelectedPin(p));
      map.add(marker);
      markersRef.current.push(marker);
    });

    map.setFitView(null, false, [60, 60, 60, 60]);
  }, [mapLoaded, itineraryRoutes, pins]);
  useEffect(() => { setImgFailed(false); }, [selectedPin]); // Reset on new pin

  // Get image for a pin: use pin's own image, or fall back to destination image
  const getPinImage = (pin: api.MapPinData): string | null => {
    if (pin.imageUrl) return getImageUrl(pin.imageUrl);
    if (pin.destinationId) {
      const dest = destinations.find((d) => d.id === pin.destinationId);
      if (dest?.imageUrl) return getImageUrl(dest.imageUrl);
    }
    return null;
  };

  const handleAddToItinerary = async () => {
    if (!isAuthenticated) {
      Alert.alert(tx('loginRequired'), tx('loginToSave'));
      return;
    }
    if (!selectedPin) return;
    setAddingToItinerary(true);
    try {
      const list = await api.getItineraries('upcoming');
      if (list.length === 0) {
        const go = window.confirm(tx('noItineraryMsg') + '\n\n' + tx('goItineraryQ'));
        if (go) navigation.navigate('Main', { screen: 'Itinerary' });
        return;
      }
      setItineraries(list);
      setShowItineraryModal(true);
    } catch (err: any) {
      Alert.alert(tx('error'), tx('failedLoad'));
    } finally {
      setAddingToItinerary(false);
    }
  };

  // Show route from user's location to the pin
  const showRoute = (pin: api.MapPinData | null) => {
    if (!pin || !mapInstance.current || !amapRef.current) return;
    const { AMap, map } = { AMap: amapRef.current, map: mapInstance.current };
    setSelectedPin(null);

    // Clear previous route
    if ((map as any)._routeLine) {
      map.remove((map as any)._routeLine);
    }

    const drawLine = (start: [number, number]) => {
      const end: [number, number] = [pin.lng, pin.lat];
      // Draw dashed line
      const line = new (AMap as any).Polyline({
        path: [start, end],
        strokeColor: '#2563EB',
        strokeWeight: 4,
        strokeOpacity: 0.8,
        strokeStyle: 'dashed',
        showDir: true,
      });
      map.add(line);
      (map as any)._routeLine = line;

      // Add markers for start/end
      const startMarker = new (AMap as any).Marker({
        position: start,
        content: '<div style="background:#2563EB;color:white;padding:4px 8px;border-radius:12px;font-size:12px;">📍 You</div>',
        offset: new (AMap as any).Pixel(-20, -40),
      });
      const endMarker = new (AMap as any).Marker({
        position: end,
        content: `<div style="background:#DC2626;color:white;padding:4px 8px;border-radius:12px;font-size:12px;">🎯 ${pin.name}</div>`,
        offset: new (AMap as any).Pixel(-20, -40),
      });
      map.add([startMarker, endMarker]);
      (map as any)._routeMarkers = [startMarker, endMarker];
      map.setFitView();

      // Offer external navigation
      setTimeout(() => {
        const go = window.confirm('Open in map app for turn-by-turn navigation?');
        if (go) {
          window.open(
            `https://uri.amap.com/navigation?to=${pin.lng},${pin.lat},${encodeURIComponent(pin.name)}&mode=car&callnative=1`,
            '_blank'
          );
        }
      }, 500);
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          // Clear old markers
          if ((map as any)._routeMarkers) {
            (map as any)._routeMarkers.forEach((m: any) => map.remove(m));
          }
          drawLine([pos.coords.longitude, pos.coords.latitude]);
        },
        () => {
          const center = map.getCenter();
          if (center) drawLine([center.lng, center.lat]);
        },
        { timeout: 5000 }
      );
    }
  };

  const handleAddToItineraryDay = async (itineraryId: string, dayId: string) => {
    if (!selectedPin) return;
    setAddingToItinerary(true);
    try {
      await api.addActivity(itineraryId, dayId, {
        title: tp(lang, selectedPin.name),
        type: selectedPin.placeType === 'Restaurant' ? 'dining' :
              selectedPin.placeType === 'Hotel' ? 'hotel' :
              selectedPin.placeType === 'Nature' ? 'sightseeing' :
              selectedPin.placeType === 'Shopping' ? 'shopping' : 'sightseeing',
        location: selectedPin.name,
        description: selectedPin.description,
        status: 'confirmed',
      });
      setShowItineraryModal(false);
      setSelectedPin(null);
      Alert.alert('Added!', `"${selectedPin.name}" has been added to your itinerary.`);
    } catch (err: any) {
      Alert.alert('Error', err.response?.data?.error || 'Failed to add activity.');
    } finally {
      setAddingToItinerary(false);
    }
  };

  // Init map
  useEffect(() => {
    let destroyed = false;
    (async () => {
      try {
        const AMap = await loadAmapScript();
        if (destroyed) return;

        const container = document.createElement('div');
        container.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;';
        mapContainerRef.current?.appendChild(container);

        const map = new AMap.Map(container, {
          zoom: 3, center: [105, 35],
          resizeEnable: true, dragEnable: true, zoomEnable: true,
          scrollWheel: true, doubleClickZoom: true,
        });

        amapRef.current = AMap;
        mapInstance.current = map;
        setMapLoaded(true);
      } catch (e: any) {
        if (!destroyed) setLoadError(e.message || 'Map load failed');
      }
    })();
    return () => { destroyed = true; };
  }, []);

  // Update markers
  useEffect(() => {
    if (!mapInstance.current || !amapRef.current) return;
    const { AMap, map } = { AMap: amapRef.current, map: mapInstance.current };

    markersRef.current.forEach((m: any) => { try { m.remove(); } catch {} });
    markersRef.current = [];

    const filtered = activeFilter ? pins.filter((p) => p.placeType === activeFilter) : pins;

    filtered.forEach((pin) => {
      const color = pinColors[pin.color] || '#2563EB';
      const el = document.createElement('div');
      el.style.cssText = `width:28px;height:28px;border-radius:50%;background:${color};border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);cursor:pointer;display:flex;align-items:center;justify-content:center;color:white;font-size:12px;font-weight:bold;`;
      el.textContent = pin.placeType === 'Hotel' ? '🏨' : pin.placeType === 'Restaurant' ? '🍴' : pin.placeType === 'Nature' ? '🌿' : pin.placeType === 'Shopping' ? '🛍' : '📍';

      const marker = new AMap.Marker({
        position: [pin.lng, pin.lat], content: el, offset: new AMap.Pixel(-14, -14),
      });
      marker.on('click', () => setSelectedPin(pin));
      map.add(marker);
      markersRef.current.push(marker);
    });
  }, [pins, activeFilter, mapLoaded]);

  if (loadError) {
    return (
      <View style={[s.screen, { backgroundColor: t.colors.background }]}>
        <View style={[s.header, { backgroundColor: t.colors.surface, borderBottomColor: t.colors.outline, paddingHorizontal: t.spacing.lg, paddingTop: t.spacing['2xl'], paddingBottom: t.spacing.md }]}>
          <View style={s.headerRow}>
            <TouchableOpacity onPress={() => navigation.goBack()}><Text style={{ fontSize: 20, color: t.colors.primary }}>{'←'}</Text></TouchableOpacity>
            <Text style={{ fontSize: 22, marginLeft: 8 }}>{'📍'}</Text>
            <Text style={[s.title, { fontFamily: t.typography.fontFamily, fontWeight: '600', fontSize: t.typography.bodyLg.fontSize, color: t.colors.onSurface, marginLeft: t.spacing.sm }]}>Map</Text>
          </View>
        </View>
        <View style={[s.center, { flex: 1 }]}>
          <Text style={{ fontSize: 40 }}>{'🗺️'}</Text>
          <Text style={{ color: '#DC2626', fontSize: 15, marginTop: 12, textAlign: 'center', paddingHorizontal: 32 }}>{loadError}</Text>
          <TouchableOpacity onPress={() => { setLoadError(null); window.location.reload(); }} style={{ marginTop: 16, paddingHorizontal: 24, paddingVertical: 10, backgroundColor: t.colors.primary, borderRadius: 8 }}>
            <Text style={{ color: '#FFF', fontWeight: '600' }}>Retry</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={[s.screen, { backgroundColor: t.colors.background }]}>
      <View style={[s.header, { backgroundColor: t.colors.surface, borderBottomColor: t.colors.outline, paddingHorizontal: t.spacing.lg, paddingTop: t.spacing['2xl'], paddingBottom: t.spacing.md }]}>
        <View style={s.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ paddingRight: 8 }}>
            <Text style={{ fontSize: 20, color: t.colors.primary }}>{'←'}</Text>
          </TouchableOpacity>
          <Text style={{ fontSize: 22 }}>{'📍'}</Text>
          <Text style={[s.title, { fontFamily: t.typography.fontFamily, fontWeight: '600', fontSize: t.typography.bodyLg.fontSize, color: t.colors.onSurface, marginLeft: t.spacing.sm }]}>Map</Text>
          <View style={{ flex: 1 }} />
        </View>
      </View>

      <View style={{ flex: 1, position: 'relative' }}>
        {!mapLoaded && (
          <View style={[s.center, { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 10, backgroundColor: t.colors.background }]}>
            <ActivityIndicator size="large" color={t.colors.primary} />
            <Text style={{ marginTop: 12, color: t.colors.onSurfaceMuted }}>Loading map...</Text>
          </View>
        )}
        <div ref={mapContainerRef} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, width: '100%', height: '100%' }} />

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ position: 'absolute', top: 12, left: 0, right: 0, zIndex: 5 }} contentContainerStyle={{ gap: 8, paddingHorizontal: 16 }}>
          {TYPE_FILTERS.map((f) => (
            <TouchableOpacity key={f.i18n} style={[s.filterChip, { backgroundColor: activeFilter === f.key ? t.colors.primary : t.colors.surface, borderRadius: t.radius.full, borderColor: t.colors.outline, borderWidth: activeFilter === f.key ? 0 : 1 }]} onPress={() => setActiveFilter(f.key)}>
              <Text style={{ color: activeFilter === f.key ? '#FFF' : t.colors.onSurface, fontSize: 13, fontWeight: '500' }}>{tx(f.i18n)}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {selectedPin && (
        <View style={[s.bottomSheet, { backgroundColor: t.colors.surface, borderTopLeftRadius: 20, borderTopRightRadius: 20 }]}>
          <View style={[s.sheetHandle, { backgroundColor: t.colors.outline }]} />
          {/* Pin Image */}
          {(() => {
            const img = getPinImage(selectedPin);
            if (img && !imgFailed) {
              return (
                <View style={{ width: '100%', height: 180, borderRadius: 12, overflow: 'hidden', marginBottom: 12 }}>
                  <Image source={{ uri: img }}
                    style={{ width: '100%', height: '100%' }}
                    resizeMode="cover"
                    onError={() => setImgFailed(true)}
                  />
                </View>
              );
            }
            return (
              <View style={[s.sheetImgPlaceholder, { backgroundColor: selectedPin.color === 'green' ? '#D1FAE5' : selectedPin.color === 'amber' ? '#FEF3C7' : selectedPin.color === 'red' ? '#FEE2E2' : '#DBEAFE', borderRadius: 12, marginBottom: 12 }]}>
                <Text style={{ fontSize: 48 }}>{selectedPin.placeType === 'Hotel' ? '🏨' : selectedPin.placeType === 'Restaurant' ? '🍴' : selectedPin.placeType === 'Nature' ? '🌿' : selectedPin.placeType === 'Shopping' ? '🛍' : '📍'}</Text>
                <Text style={{ fontSize: 12, color: '#6B7280', marginTop: 4 }}>{selectedPin.name}</Text>
              </View>
            );
          })()}
          <View style={s.sheetHeader}>
            <View style={{ flex: 1 }}>
              <Text style={[s.sheetName, { fontWeight: '700', fontSize: 18, color: t.colors.onSurface }]}>{tp(lang, selectedPin.name)}</Text>
              <View style={s.sheetMeta}>
                <Text style={{ color: t.colors.tertiary, fontSize: 15 }}>{'★'.repeat(Math.round(selectedPin.rating))}</Text>
                <Text style={{ color: t.colors.onSurface, fontWeight: '600' }}>{selectedPin.rating.toFixed(1)}</Text>
                <Text style={{ color: t.colors.onSurfaceMuted, fontSize: 13 }}>({selectedPin.reviewCount.toLocaleString()} {tx('reviews')})</Text>
              </View>
            </View>
            <Text style={{ color: t.colors.primary, fontWeight: '600' }}>{selectedPin.distance}</Text>
          </View>
          <Text style={{ fontSize: 14, color: t.colors.onSurfaceVariant, lineHeight: 20, marginBottom: 8 }}>
            {(() => {
              const dest = destinations.find((d) => d.id === selectedPin.destinationId);
              return (dest ? td(lang, dest.name)?.desc : null) || tp(lang, selectedPin.description);
            })()}
          </Text>
          <Text style={{ color: t.colors.onSurfaceMuted, fontSize: 12, marginBottom: 16 }}>{tp(lang, selectedPin.placeType)}</Text>
          <View style={s.sheetActions}>
            <TouchableOpacity
              style={[s.addBtn, { backgroundColor: t.colors.primary, borderRadius: t.radius.md }]}
              onPress={handleAddToItinerary}
              disabled={addingToItinerary}
            >
              <Text style={{ color: '#FFF', fontWeight: '600', fontSize: 15 }}>
                {addingToItinerary ? 'Loading...' : 'Add to Itinerary'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[s.routeBtn, { backgroundColor: t.colors.secondary, borderRadius: t.radius.md }]}
              onPress={() => showRoute(selectedPin)}
            >
              <Text style={{ color: '#FFF', fontWeight: '600', fontSize: 15 }}>Show Route</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[s.closeBtn, { borderColor: t.colors.outline, borderRadius: t.radius.md, borderWidth: 1 }]} onPress={() => setSelectedPin(null)}>
              <Text style={{ color: t.colors.onSurface }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Itinerary Selection Modal */}
      <Modal visible={showItineraryModal} transparent animationType="slide">
        <View style={{ flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)', padding: 20 }}>
          <View style={{ backgroundColor: t.colors.surface, borderRadius: 16, padding: 24, maxHeight: '80%' }}>
            <Text style={{ fontWeight: '700', fontSize: 20, color: t.colors.onSurface, textAlign: 'center', marginBottom: 16 }}>
              Add "{selectedPin?.name}" to...
            </Text>
            <ScrollView style={{ maxHeight: 400 }}>
              {itineraries.map((it) => (
                <View key={it.id} style={{ marginBottom: 16 }}>
                  <Text style={{ fontWeight: '600', fontSize: 15, color: t.colors.onSurface, marginBottom: 8 }}>
                    {it.name} ({it.destination})
                  </Text>
                  {it.days.map((day) => (
                    <TouchableOpacity
                      key={day.id}
                      style={{ paddingVertical: 10, paddingHorizontal: 12, borderRadius: 8, marginBottom: 4, backgroundColor: t.colors.background }}
                      onPress={() => handleAddToItineraryDay(it.id, day.id)}
                      disabled={addingToItinerary}
                    >
                      <Text style={{ color: t.colors.primary, fontWeight: '500', fontSize: 14 }}>
                        Day {day.dayNumber} — {day.date}
                      </Text>
                      <Text style={{ color: t.colors.onSurfaceMuted, fontSize: 12 }}>
                        {day.activities.length} activities
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={{ marginTop: 16, paddingVertical: 12, alignItems: 'center', borderTopWidth: 1, borderTopColor: t.colors.outline }}
              onPress={() => setShowItineraryModal(false)}
            >
              <Text style={{ color: t.colors.onSurfaceMuted, fontWeight: '500', fontSize: 15 }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

interface Props { navigation: any; route?: any; }

const s = StyleSheet.create({
  screen: { flex: 1 },
  header: { borderBottomWidth: 1, zIndex: 10 },
  headerRow: { flexDirection: 'row', alignItems: 'center' },
  title: {},
  center: { justifyContent: 'center', alignItems: 'center' },
  filterChip: { paddingHorizontal: 16, paddingVertical: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 3, elevation: 2 },
  bottomSheet: { paddingHorizontal: 20, paddingBottom: 32, paddingTop: 12, shadowColor: '#000', shadowOffset: { width: 0, height: -3 }, shadowOpacity: 0.1, shadowRadius: 10, elevation: 10 },
  sheetHandle: { width: 40, height: 4, borderRadius: 2, alignSelf: 'center', marginBottom: 16 },
  sheetHeader: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12 },
  sheetMeta: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
  sheetName: {},
  sheetActions: { flexDirection: 'row', gap: 12 },
  addBtn: { flex: 1, height: 46, justifyContent: 'center', alignItems: 'center' },
  routeBtn: { flex: 1, height: 46, justifyContent: 'center', alignItems: 'center' },
  closeBtn: { width: 80, height: 46, justifyContent: 'center', alignItems: 'center' },
  sheetImgPlaceholder: { width: '100%', height: 180, alignItems: 'center', justifyContent: 'center' },
});
