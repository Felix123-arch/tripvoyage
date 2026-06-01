import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useState } from 'react';
import { useTheme } from '../theme';
import { MapPin, BottomSheet } from '../components';
import { mockMapPins } from '../data';

interface Props {
  navigation: any;
}

export function MapScreen({ navigation }: Props) {
  const t = useTheme();
  const [selectedPin, setSelectedPin] = useState<typeof mockMapPins[0] | null>(null);

  return (
    <View style={[s.screen, { backgroundColor: t.colors.background }]}>
      <View style={[s.header, { backgroundColor: t.colors.surface, borderBottomColor: t.colors.outline, paddingHorizontal: t.spacing.lg, paddingTop: t.spacing['2xl'], paddingBottom: t.spacing.md }]}>
        <View style={s.headerRow}>
          <Text style={[s.pinIcon, { fontSize: 22 }]}>&#x1F4CD;</Text>
          <Text style={[s.title, { fontFamily: t.typography.fontFamily, fontWeight: '600', fontSize: t.typography.bodyLg.fontSize, color: t.colors.onSurface, marginLeft: t.spacing.sm }]}>
            Explore Map
          </Text>
          <View style={{ flex: 1 }} />
          <Text style={[s.searchIcon, { fontSize: 22, color: t.colors.onSurface }]}>&#x1F50D;</Text>
        </View>
      </View>

      <View style={s.mapContainer}>
        <View style={s.mapBg}>
          <View style={[s.mapGradient1, { backgroundColor: '#BFDBFE', opacity: 0.5, borderRadius: 200, width: 200, height: 200, top: '10%', left: '5%' }]} />
          <View style={[s.mapGradient2, { backgroundColor: '#D1FAE5', opacity: 0.5, borderRadius: 150, width: 150, height: 150, top: '40%', left: '50%' }]} />
          <View style={[s.mapGradient3, { backgroundColor: '#EFF6FF', opacity: 0.6, borderRadius: 180, width: 180, height: 180, top: '50%', left: '10%' }]} />
          <View style={[s.mapGradient4, { backgroundColor: '#F0FDF4', opacity: 0.5, borderRadius: 120, width: 120, height: 120, top: '20%', right: '10%' }]} />
        </View>

        {mockMapPins.map((pin) => (
          <MapPin
            key={pin.id}
            color={pin.color}
            top={pin.position.top}
            left={pin.position.left}
            onPress={() => setSelectedPin(pin)}
          />
        ))}

        <TouchableOpacity
          style={[s.routeBtn, { backgroundColor: t.colors.surface, borderRadius: t.radius.full, paddingHorizontal: t.spacing.lg, paddingVertical: t.spacing.sm }]}
          activeOpacity={0.8}
        >
          <Text style={[s.routeText, { fontFamily: t.typography.fontFamily, fontWeight: '500', fontSize: t.typography.label.fontSize, color: t.colors.onSurface }]}>
            &#x2194; Show Route
          </Text>
        </TouchableOpacity>
      </View>

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
  mapBg: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: '#EFF6FF',
  },
  mapGradient1: { position: 'absolute' },
  mapGradient2: { position: 'absolute' },
  mapGradient3: { position: 'absolute' },
  mapGradient4: { position: 'absolute' },
  routeBtn: {
    position: 'absolute', top: 12, right: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
  },
  routeText: {},
});
