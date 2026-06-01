import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../theme';
import type { MemoryItem } from '../data';

interface Props {
  items: MemoryItem[];
}

export function GalleryGrid({ items }: Props) {
  const t = useTheme();

  return (
    <View style={s.grid}>
      {items.map((item) => (
        <View
          key={item.id}
          style={[s.item, { borderRadius: t.radius.md, overflow: 'hidden', height: 100 }]}
        >
          <LinearGradient colors={item.gradient as unknown as readonly [string, string]} style={s.gradient}>
            <Text style={[s.title, { fontFamily: t.typography.fontFamily, fontWeight: '600', fontSize: t.typography.bodySm.fontSize, color: '#fff' }]}>
              {item.title}
            </Text>
          </LinearGradient>
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
