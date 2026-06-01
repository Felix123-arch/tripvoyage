import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../theme';
import type { Article } from '../data';

interface Props {
  article: Article;
  onPress?: () => void;
}

export function ArticleCard({ article, onPress }: Props) {
  const t = useTheme();

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.9}
      style={[
        s.card,
        {
          backgroundColor: t.colors.surface,
          borderRadius: t.radius.md,
          borderColor: t.colors.outline,
          borderWidth: 1,
        },
      ]}
    >
      <LinearGradient
        colors={article.gradient as unknown as readonly [string, string]}
        style={[s.thumb, { borderRadius: t.radius.sm, width: 72, height: 64 }]}
      >
        <Text style={s.thumbIcon}>&#x1F4D6;</Text>
      </LinearGradient>
      <View style={[s.body, { marginLeft: t.spacing.md }]}>
        <Text style={[s.title, { fontFamily: t.typography.fontFamily, fontWeight: '600', fontSize: t.typography.body.fontSize, color: t.colors.onSurface }]} numberOfLines={1}>
          {article.title}
        </Text>
        <Text style={[s.desc, { fontFamily: t.typography.fontFamily, fontSize: t.typography.bodySm.fontSize, color: t.colors.onSurfaceVariant }]} numberOfLines={2}>
          {article.description}
        </Text>
        <Text style={[s.time, { fontFamily: t.typography.fontFamily, fontSize: t.typography.caption.fontSize, color: t.colors.onSurfaceMuted }]}>
          {article.readTimeMinutes} min read
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  card: { flexDirection: 'row', padding: 12 },
  thumb: { alignItems: 'center', justifyContent: 'center' },
  thumbIcon: { fontSize: 28 },
  body: { flex: 1, gap: 2 },
  title: {},
  desc: {},
  time: { marginTop: 2 },
});
