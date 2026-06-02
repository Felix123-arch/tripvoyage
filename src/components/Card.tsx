import React, { useState } from 'react';
import { TouchableOpacity, View, Text, Image, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../theme';

interface Props {
  name: string;
  description: string;
  rating: number;
  reviewCount: number;
  gradient: string[];
  imageUrl?: string | null;
  onPress?: () => void;
}

export function Card({ name, description, rating, reviewCount, gradient, imageUrl, onPress }: Props) {
  const t = useTheme();
  const [imgFailed, setImgFailed] = useState(false);

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.9}
      style={[s.card, { borderRadius: t.radius.md, backgroundColor: t.colors.surface, minWidth: 220, maxWidth: 260 }, t.elevation[1] as any]}
    >
      {imageUrl && !imgFailed ? (
        <Image
          source={{ uri: imageUrl }}
          style={[s.media, { borderTopLeftRadius: t.radius.md, borderTopRightRadius: t.radius.md }]}
          resizeMode="cover"
          onError={() => setImgFailed(true)}
        />
      ) : (
        <LinearGradient
          colors={gradient as unknown as readonly [string, string]}
          style={[s.media, { borderTopLeftRadius: t.radius.md, borderTopRightRadius: t.radius.md }]}
        >
          <Text style={[s.mediaIcon, { fontFamily: t.typography.fontFamily }]}>&#x1F4F7;</Text>
        </LinearGradient>
      )}
      <View style={[s.body, { padding: t.spacing.md }]}>
        <Text style={[s.name, { fontFamily: t.typography.fontFamily, fontWeight: '600', fontSize: t.typography.body.fontSize, color: t.colors.onSurface }]} numberOfLines={1}>
          {name}
        </Text>
        <Text style={[s.desc, { fontFamily: t.typography.fontFamily, fontSize: t.typography.bodySm.fontSize, color: t.colors.onSurfaceVariant }]} numberOfLines={1}>
          {description}
        </Text>
        <View style={s.ratingRow}>
          <Text style={[s.star, { color: t.colors.tertiary }]}>&#x2605;</Text>
          <Text style={[s.ratingText, { fontFamily: t.typography.fontFamily, fontSize: t.typography.bodySm.fontSize, color: t.colors.onSurface }]}>
            {rating.toFixed(1)}
          </Text>
          <Text style={[s.reviewCount, { fontFamily: t.typography.fontFamily, fontSize: t.typography.caption.fontSize, color: t.colors.onSurfaceMuted }]}>
            ({reviewCount.toLocaleString()} reviews)
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  card: { overflow: 'hidden' },
  media: { height: 130, alignItems: 'center', justifyContent: 'center' },
  mediaIcon: { fontSize: 32 },
  body: { gap: 3 },
  name: {},
  desc: {},
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  star: { fontSize: 14 },
  ratingText: { fontWeight: '600' },
  reviewCount: {},
});
