import { View, Text, TouchableOpacity, Modal, StyleSheet, Pressable } from 'react-native';
import { useTheme } from '../theme';
import { Button } from './Button';

interface Props {
  visible: boolean;
  onClose: () => void;
  title: string;
  rating: number;
  reviewCount: number;
  distance: string;
  description: string;
  onAdd?: () => void;
}

export function BottomSheet({ visible, onClose, title, rating, reviewCount, distance, description, onAdd }: Props) {
  const t = useTheme();

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={s.backdrop} onPress={onClose}>
        <View />
      </Pressable>
      <View
        style={[
          s.sheet,
          {
            backgroundColor: t.colors.surface,
            borderTopLeftRadius: t.radius.lg,
            borderTopRightRadius: t.radius.lg,
            padding: t.spacing.xl,
            paddingBottom: t.spacing['3xl'],
          },
        ]}
      >
        <View style={[s.handle, { backgroundColor: t.colors.outline, borderRadius: t.radius.full, marginBottom: t.spacing.lg }]} />
        <Text style={[s.title, { fontFamily: t.typography.fontFamily, fontWeight: '600', fontSize: t.typography.title.fontSize, color: t.colors.onSurface }]}>
          {title}
        </Text>
        <View style={s.meta}>
          <Text style={[s.stars, { color: t.colors.tertiary }]}>&#x2605; {rating.toFixed(1)}</Text>
          <Text style={[s.reviews, { fontFamily: t.typography.fontFamily, fontSize: t.typography.bodySm.fontSize, color: t.colors.onSurfaceVariant }]}>
            ({reviewCount.toLocaleString()} reviews)
          </Text>
          <Text style={[s.dist, { fontFamily: t.typography.fontFamily, fontSize: t.typography.bodySm.fontSize, color: t.colors.onSurfaceVariant }]}>
            &middot; {distance}
          </Text>
        </View>
        <Text style={[s.desc, { fontFamily: t.typography.fontFamily, fontSize: t.typography.body.fontSize, color: t.colors.onSurfaceVariant, lineHeight: 22 }]}>
          {description}
        </Text>
        {onAdd && <Button title="Add to Itinerary" onPress={onAdd} block style={{ marginTop: t.spacing.lg }} />}
      </View>
    </Modal>
  );
}

const s = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.35)' },
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  handle: { width: 36, height: 4, alignSelf: 'center' },
  title: {},
  meta: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 6 },
  stars: { fontWeight: '600' },
  reviews: {},
  dist: {},
  desc: { marginTop: 12 },
});
