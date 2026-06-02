import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useState, useEffect, useCallback } from 'react';
import { useTheme } from '../theme';
import { ChecklistCard, ArticleCard, ReviewCard, Button, LoadingOverlay, ErrorBanner, EmptyState } from '../components';
import * as api from '../services';

interface Props {
  navigation: any;
}

export function GuidesScreen({ navigation }: Props) {
  const t = useTheme();
  const [checklist, setChecklist] = useState<api.ChecklistItem[]>([]);
  const [articles, setArticles] = useState<api.Article[]>([]);
  const [reviews, setReviews] = useState<api.Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [cl, ar, rv] = await Promise.all([
        api.getChecklist(),
        api.getArticles(),
        api.getReviews(),
      ]);
      setChecklist(cl);
      setArticles(ar);
      setReviews(rv);
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Failed to load guides');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const toggleChecklist = async (id: string) => {
    const item = checklist.find((i) => i.id === id);
    if (!item) return;
    setChecklist((items) =>
      items.map((i) => (i.id === id ? { ...i, completed: !i.completed } : i))
    );
    try {
      await api.updateChecklistItem(id, { completed: !item.completed });
    } catch {
      setChecklist((items) =>
        items.map((i) => (i.id === id ? { ...i, completed: item.completed } : i))
      );
    }
  };

  if (loading) return <LoadingOverlay message="Loading guides..." />;
  if (error) return <ErrorBanner message={error} onRetry={loadAll} />;

  return (
    <View style={[s.screen, { backgroundColor: t.colors.background }]}>
      <View style={[s.header, { backgroundColor: t.colors.surface, borderBottomColor: t.colors.outline, paddingHorizontal: t.spacing.lg, paddingTop: t.spacing['2xl'], paddingBottom: t.spacing.md }]}>
        <View style={s.headerRow}>
          <Text style={[s.title, { fontFamily: t.typography.fontFamily, fontWeight: '600', fontSize: t.typography.bodyLg.fontSize, color: t.colors.onSurface }]}>
            Guides & Help
          </Text>
          <View style={{ flex: 1 }} />
          <Text style={[s.helpIcon, { color: t.colors.onSurface, fontSize: 22 }]}>{'❓'}</Text>
        </View>
      </View>

      <ScrollView style={s.scroll} showsVerticalScrollIndicator={false}>
        <View style={{ paddingHorizontal: t.spacing.lg, marginTop: t.spacing.lg }}>
          <ChecklistCard items={checklist} onToggle={toggleChecklist} />
        </View>

        <Text style={[s.sectionTitle, { fontFamily: t.typography.fontFamily, fontWeight: '600', fontSize: t.typography.headline.fontSize, color: t.colors.onSurface, marginTop: t.spacing['2xl'], paddingHorizontal: t.spacing.lg }]}>
          Curated Guides
        </Text>
        <Text style={[s.more, { fontFamily: t.typography.fontFamily, fontSize: t.typography.bodySm.fontSize, color: t.colors.primary, paddingHorizontal: t.spacing.lg }]}>More</Text>
        <View style={{ paddingHorizontal: t.spacing.lg, marginTop: t.spacing.md, gap: t.spacing.md }}>
          {articles.length > 0 ? (
            articles.map((article) => (
              <ArticleCard key={article.id} article={{ ...article, gradient: [article.gradientStart, article.gradientEnd] }} />
            ))
          ) : (
            <EmptyState icon="📖" message="No articles available yet" />
          )}
        </View>

        <Text style={[s.sectionTitle, { fontFamily: t.typography.fontFamily, fontWeight: '600', fontSize: t.typography.headline.fontSize, color: t.colors.onSurface, marginTop: t.spacing['2xl'], paddingHorizontal: t.spacing.lg }]}>
          Support
        </Text>
        <View style={{ paddingHorizontal: t.spacing.lg, marginTop: t.spacing.md, gap: t.spacing.md }}>
          <Button title={'🎧 Contact Customer Service'} onPress={() => {}} block />
          <Button title={'❓ Help Center & FAQs'} onPress={() => {}} variant="secondary" block />
        </View>

        <Text style={[s.sectionTitle, { fontFamily: t.typography.fontFamily, fontWeight: '600', fontSize: t.typography.headline.fontSize, color: t.colors.onSurface, marginTop: t.spacing['2xl'], paddingHorizontal: t.spacing.lg }]}>
          Community Tips
        </Text>
        <View style={{ paddingHorizontal: t.spacing.lg, marginTop: t.spacing.md, gap: t.spacing.md }}>
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))
          ) : (
            <EmptyState icon="💬" message="No community tips yet" />
          )}
        </View>

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
  helpIcon: {},
  scroll: { flex: 1 },
  sectionTitle: {},
  more: { marginTop: 2 },
});
