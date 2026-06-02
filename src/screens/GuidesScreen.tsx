import { View, Text, ScrollView, StyleSheet, Alert, Modal, TouchableOpacity } from 'react-native';
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
  const [selectedArticle, setSelectedArticle] = useState<api.Article | null>(null);
  const [showArticleModal, setShowArticleModal] = useState(false);

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

  const handleArticlePress = async (article: api.Article) => {
    try {
      const full = await api.getArticleById(article.id);
      setSelectedArticle(full);
      setShowArticleModal(true);
    } catch (err: any) {
      setSelectedArticle(article);
      setShowArticleModal(true);
    }
  };

  const handleContactSupport = () => {
    Alert.alert(
      'Customer Support',
      '📧 Email: support@tripvoyage.app\n📞 Phone: +1 (555) 123-4567\n\nOur team typically responds within 24 hours.',
      [{ text: 'OK' }]
    );
  };

  const handleHelpCenter = () => {
    const faqs = [
      '🔹 How to create an itinerary?\n   Go to Itinerary tab → "Create New Itinerary" → fill in details.',
      '🔹 How to save a destination?\n   Click any destination → tap "♡ Save". Find saved items in the Saved tab.',
      '🔹 How to use the map?\n   Go to Map tab → browse markers → tap for details → "Add to Itinerary".',
      '🔹 Can I change my preferences?\n   Yes! Go to Profile tab to update travel preferences and settings.',
      '🔹 Is my data secure?\n   Yes, we use encrypted connections and never share your data.',
    ].join('\n\n');
    Alert.alert('Help Center & FAQs', faqs, [{ text: 'Got it!' }]);
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
          <TouchableOpacity onPress={handleHelpCenter}>
            <Text style={[s.helpIcon, { color: t.colors.onSurface, fontSize: 22 }]}>{'❓'}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={s.scroll} showsVerticalScrollIndicator={false}>
        <View style={{ paddingHorizontal: t.spacing.lg, marginTop: t.spacing.lg }}>
          <ChecklistCard items={checklist} onToggle={toggleChecklist} />
        </View>

        <Text style={[s.sectionTitle, { fontFamily: t.typography.fontFamily, fontWeight: '600', fontSize: t.typography.headline.fontSize, color: t.colors.onSurface, marginTop: t.spacing['2xl'], paddingHorizontal: t.spacing.lg }]}>
          Curated Guides
        </Text>
        <View style={{ paddingHorizontal: t.spacing.lg, marginTop: t.spacing.md, gap: t.spacing.md }}>
          {articles.length > 0 ? (
            articles.map((article) => (
              <ArticleCard
                key={article.id}
                article={{ ...article, gradient: [article.gradientStart, article.gradientEnd] }}
                onPress={() => handleArticlePress(article)}
              />
            ))
          ) : (
            <EmptyState icon="📖" message="No articles available yet" />
          )}
        </View>

        <Text style={[s.sectionTitle, { fontFamily: t.typography.fontFamily, fontWeight: '600', fontSize: t.typography.headline.fontSize, color: t.colors.onSurface, marginTop: t.spacing['2xl'], paddingHorizontal: t.spacing.lg }]}>
          Support
        </Text>
        <View style={{ paddingHorizontal: t.spacing.lg, marginTop: t.spacing.md, gap: t.spacing.md }}>
          <Button title={'🎧 Contact Customer Service'} onPress={handleContactSupport} block />
          <Button title={'❓ Help Center & FAQs'} onPress={handleHelpCenter} variant="secondary" block />
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

      {/* Article Detail Modal */}
      <Modal visible={showArticleModal} transparent animationType="slide">
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}>
          <View style={{ backgroundColor: t.colors.surface, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 24, maxHeight: '80%' }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <Text style={{ fontWeight: '700', fontSize: 20, color: t.colors.onSurface, flex: 1 }}>{selectedArticle?.title}</Text>
              <TouchableOpacity onPress={() => setShowArticleModal(false)} style={{ paddingLeft: 16 }}>
                <Text style={{ fontSize: 20, color: t.colors.onSurfaceMuted }}>✕</Text>
              </TouchableOpacity>
            </View>
            <ScrollView>
              <Text style={{ fontSize: 14, color: t.colors.onSurfaceVariant, lineHeight: 22 }}>
                {selectedArticle?.body || selectedArticle?.description || 'Full article content coming soon.'}
              </Text>
              {selectedArticle?.readTimeMinutes && (
                <Text style={{ marginTop: 16, fontSize: 12, color: t.colors.onSurfaceMuted }}>
                  {selectedArticle.readTimeMinutes} min read
                </Text>
              )}
            </ScrollView>
            <TouchableOpacity onPress={() => setShowArticleModal(false)}
              style={{ marginTop: 16, paddingVertical: 12, backgroundColor: t.colors.primary, borderRadius: 8, alignItems: 'center' }}>
              <Text style={{ color: '#FFF', fontWeight: '600' }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
