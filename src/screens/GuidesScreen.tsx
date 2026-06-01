import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useState } from 'react';
import { useTheme } from '../theme';
import { ChecklistCard, ArticleCard, ReviewCard, Button } from '../components';
import { mockChecklist, mockArticles, mockReviews } from '../data';
import type { ChecklistItem } from '../data';

interface Props {
  navigation: any;
}

export function GuidesScreen({ navigation }: Props) {
  const t = useTheme();
  const [checklist, setChecklist] = useState<ChecklistItem[]>(mockChecklist);

  const toggleChecklist = (id: string) => {
    setChecklist((items) =>
      items.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  return (
    <View style={[s.screen, { backgroundColor: t.colors.background }]}>
      <View style={[s.header, { backgroundColor: t.colors.surface, borderBottomColor: t.colors.outline, paddingHorizontal: t.spacing.lg, paddingTop: t.spacing['2xl'], paddingBottom: t.spacing.md }]}>
        <View style={s.headerRow}>
          <Text style={[s.title, { fontFamily: t.typography.fontFamily, fontWeight: '600', fontSize: t.typography.bodyLg.fontSize, color: t.colors.onSurface }]}>
            Guides & Help
          </Text>
          <View style={{ flex: 1 }} />
          <Text style={[s.helpIcon, { color: t.colors.onSurface, fontSize: 22 }]}>&#x2753;</Text>
        </View>
      </View>

      <ScrollView style={s.scroll} showsVerticalScrollIndicator={false}>
        <View style={{ paddingHorizontal: t.spacing.lg, marginTop: t.spacing.lg }}>
          <ChecklistCard items={checklist} onToggle={toggleChecklist} />
        </View>

        <Text style={[s.sectionTitle, { fontFamily: t.typography.fontFamily, fontWeight: '600', fontSize: t.typography.headline.fontSize, color: t.colors.onSurface, marginTop: t.spacing['2xl'], paddingHorizontal: t.spacing.lg }]}>
          Curated Guides
        </Text>
        <Text style={[s.more, { fontFamily: t.typography.fontFamily, fontSize: t.typography.bodySm.fontSize, color: t.colors.primary, paddingHorizontal: t.spacing.lg }]}>
          More
        </Text>
        <View style={{ paddingHorizontal: t.spacing.lg, marginTop: t.spacing.md, gap: t.spacing.md }}>
          {mockArticles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </View>

        <Text style={[s.sectionTitle, { fontFamily: t.typography.fontFamily, fontWeight: '600', fontSize: t.typography.headline.fontSize, color: t.colors.onSurface, marginTop: t.spacing['2xl'], paddingHorizontal: t.spacing.lg }]}>
          Support
        </Text>
        <View style={{ paddingHorizontal: t.spacing.lg, marginTop: t.spacing.md, gap: t.spacing.md }}>
          <Button title="&#x1F3A7; Contact Customer Service" onPress={() => {}} block />
          <Button title="&#x2753; Help Center & FAQs" onPress={() => {}} variant="secondary" block />
        </View>

        <Text style={[s.sectionTitle, { fontFamily: t.typography.fontFamily, fontWeight: '600', fontSize: t.typography.headline.fontSize, color: t.colors.onSurface, marginTop: t.spacing['2xl'], paddingHorizontal: t.spacing.lg }]}>
          Community Tips
        </Text>
        <View style={{ paddingHorizontal: t.spacing.lg, marginTop: t.spacing.md, gap: t.spacing.md }}>
          {mockReviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
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
