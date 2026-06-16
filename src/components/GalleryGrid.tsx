import { View, Text, Image, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../theme';
import { getImageUrl } from '../utils/imageProxy';

interface Props {
  items: { id: string; title: string; gradient: string[]; imageUrl?: string | null }[];
}

export function GalleryGrid({ items }: Props) {
  const t = useTheme();

  return (
    <View style={s.grid}>
      {items.map((item) => (
        <View key={item.id} style={[s.item, { borderRadius: t.radius.md, overflow: 'hidden', height: 100 }]}>
          {item.imageUrl ? (
            <Image source={{ uri: getImageUrl(item.imageUrl) || '' }} style={s.gradient} />
          ) : (
            <LinearGradient colors={item.gradient as unknown as readonly [string, string]} style={s.gradient}>
              <Text style={[s.title, { fontFamily: t.typography.fontFamily, fontWeight: '600', fontSize: t.typography.bodySm.fontSize, color: '#fff' }]}>
                {item.title}
              </Text>
            </LinearGradient>
          )}
        </View>
      ))}
    </View>
  );
}

const s = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  item: { width: '48%' as any, flexGrow: 1, flexBasis: '48%' as any },
  gradient: { flex: 1, justifyContent: 'flex-end', padding: 10 },
  title: {},
});
