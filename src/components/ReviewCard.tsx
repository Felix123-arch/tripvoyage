import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../theme';
import type { Review } from '../data';

interface Props {
  review: Review;
}

export function ReviewCard({ review }: Props) {
  const t = useTheme();

  return (
    <View
      style={[
        s.card,
        {
          backgroundColor: t.colors.surface,
          borderLeftColor: t.colors.primary,
          borderLeftWidth: 3,
          borderRadius: t.radius.md,
          borderColor: t.colors.outline,
          borderWidth: 1,
          padding: t.spacing.lg,
        },
      ]}
    >
      <Text style={[s.author, { fontFamily: t.typography.fontFamily, fontWeight: '600', fontSize: t.typography.body.fontSize, color: t.colors.onSurface }]}>
        {review.authorName}
      </Text>
      <Text style={[s.role, { fontFamily: t.typography.fontFamily, fontSize: t.typography.caption.fontSize, color: t.colors.onSurfaceMuted }]}>
        {review.authorRole}
      </Text>
      <Text style={[s.text, { fontFamily: t.typography.fontFamily, fontSize: t.typography.body.fontSize, color: t.colors.onSurfaceVariant, lineHeight: 21, marginTop: t.spacing.sm }]}>
        &ldquo;{review.text}&rdquo;
      </Text>
      <View style={[s.footer, { marginTop: t.spacing.md }]}>
        <Text style={[s.location, { fontFamily: t.typography.fontFamily, fontSize: t.typography.bodySm.fontSize, color: t.colors.onSurfaceMuted }]}>
          {review.location}
        </Text>
        <Text style={[s.helpful, { fontFamily: t.typography.fontFamily, fontSize: t.typography.bodySm.fontSize, color: t.colors.onSurfaceMuted }]}>
          {review.helpfulVotes} found helpful
        </Text>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  card: {},
  author: {},
  role: {},
  text: { fontStyle: 'italic' },
  footer: { flexDirection: 'row', justifyContent: 'space-between' },
  location: {},
  helpful: {},
});
