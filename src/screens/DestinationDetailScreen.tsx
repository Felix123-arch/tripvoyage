import React, { useEffect, useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  Image, TextInput, Alert, ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../theme';
import { useAuth } from '../contexts/AuthContext';
import * as api from '../services';
import { Button } from '../components';

interface Props {
  navigation: any;
  route: any;
}

export function DestinationDetailScreen({ navigation, route }: Props) {
  const t = useTheme();
  const { isAuthenticated } = useAuth();
  const { destination } = route.params as { destination: api.Destination };
  const [imgFailed, setImgFailed] = useState(false);
  const [reviews, setReviews] = useState<api.Review[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [saving, setSaving] = useState(false);
  const [wishlisting, setWishlisting] = useState(false);
  const [savedId, setSavedId] = useState<string | null>(null);
  const [wishlistId, setWishlistId] = useState<string | null>(null);
  const [reviewText, setReviewText] = useState('');
  const [reviewName, setReviewName] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState<string | null>(null);

  // Load reviews
  useEffect(() => {
    api.getReviews(destination.id)
      .then(setReviews)
      .catch(() => {})
      .finally(() => setLoadingReviews(false));
  }, [destination.id]);

  // Check if already saved/wishlisted
  useEffect(() => {
    if (!isAuthenticated) return;
    api.getSaved()
      .then((items) => {
        const found = items.find((i) => i.destinationId === destination.id || i.destination?.id === destination.id);
        if (found) setSavedId(found.id);
      })
      .catch(() => { /* Optional — defaults to unsaved state */ });
    api.getWishlist()
      .then((items) => {
        const found = items.find((i) => i.destination === destination.name);
        if (found) setWishlistId(found.id);
      })
      .catch(() => { /* Optional — defaults to not-in-wishlist state */ });
  }, [destination.id, destination.name, isAuthenticated]);

  const handleSave = async () => {
    if (!isAuthenticated) {
      Alert.alert('Login Required', 'Please log in to save destinations.');
      return;
    }
    setSaving(true);
    try {
      if (savedId) {
        await api.unsaveDestination(savedId);
        setSavedId(null);
      } else {
        const result = await api.saveDestination(destination.id);
        setSavedId(result.id);
      }
    } catch (err: any) {
      Alert.alert('Error', err.response?.data?.error || 'Failed to update saved status');
    } finally {
      setSaving(false);
    }
  };

  const handleWishlist = async () => {
    if (!isAuthenticated) {
      Alert.alert('Login Required', 'Please log in to use wishlist.');
      return;
    }
    setWishlisting(true);
    try {
      if (wishlistId) {
        await api.removeFromWishlist(wishlistId);
        setWishlistId(null);
      } else {
        const result = await api.addToWishlist({ destination: destination.name });
        setWishlistId(result.id);
      }
    } catch (err: any) {
      Alert.alert('Error', err.response?.data?.error || 'Failed to update wishlist');
    } finally {
      setWishlisting(false);
    }
  };

  const handleAddToItinerary = () => {
    navigation.navigate('Main', {
      screen: 'Itinerary',
      params: { addDestination: destination },
    });
  };

  const handleSubmitReview = async () => {
    if (!reviewText.trim() || !reviewName.trim()) {
      setReviewError('Please enter your name and review.');
      return;
    }
    setSubmittingReview(true);
    setReviewError(null);
    try {
      const newReview = await api.createReview({
        authorName: reviewName.trim(),
        text: reviewText.trim(),
        location: destination.name,
        destinationId: destination.id,
      });
      setReviews((prev) => [newReview, ...prev]);
      setReviewText('');
      setReviewName('');
    } catch (err: any) {
      setReviewError(err.response?.data?.error || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <View style={[s.screen, { backgroundColor: t.colors.background }]}>
      {/* Header */}
      <View style={[s.header, { backgroundColor: t.colors.surface, borderBottomColor: t.colors.outline, paddingHorizontal: t.spacing.lg, paddingTop: t.spacing['2xl'], paddingBottom: t.spacing.md }]}>
        <View style={s.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ paddingRight: 12 }}>
            <Text style={{ fontSize: 22, color: t.colors.primary }}>{'←'}</Text>
          </TouchableOpacity>
          <Text style={[s.headerTitle, { fontFamily: t.typography.fontFamily, fontWeight: '700', fontSize: t.typography.bodyLg.fontSize, color: t.colors.onSurface }]} numberOfLines={1}>
            {destination.name}
          </Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero Image */}
        {destination.imageUrl && !imgFailed ? (
          <Image
            source={{ uri: destination.imageUrl }}
            style={s.heroImage}
            resizeMode="cover"
            onError={() => setImgFailed(true)}
          />
        ) : (
          <LinearGradient
            colors={[destination.gradientStart, destination.gradientEnd]}
            style={s.heroGradient}
          >
            <Text style={{ fontSize: 60 }}>{'🏙️'}</Text>
          </LinearGradient>
        )}

        <View style={{ padding: t.spacing.lg }}>
          {/* Title & Category */}
          <View style={s.titleRow}>
            <View style={{ flex: 1 }}>
              <Text style={[s.name, { fontFamily: t.typography.fontFamily, fontWeight: '700', fontSize: t.typography.title.fontSize, color: t.colors.onSurface }]}>
                {destination.name}
              </Text>
              <Text style={[s.category, { fontFamily: t.typography.fontFamily, fontSize: t.typography.bodySm.fontSize, color: t.colors.primary }]}>
                {destination.category}
              </Text>
            </View>
            <View style={[s.ratingBadge, { backgroundColor: t.colors.tertiary, borderRadius: t.radius.md }]}>
              <Text style={{ color: '#FFF', fontWeight: '700', fontSize: 16 }}>{destination.rating.toFixed(1)}</Text>
            </View>
          </View>

          {/* Star rating */}
          <View style={s.ratingRow}>
            <Text style={{ color: t.colors.tertiary, fontSize: 16 }}>{'★'.repeat(Math.round(destination.rating))}{'☆'.repeat(5 - Math.round(destination.rating))}</Text>
            <Text style={{ color: t.colors.onSurfaceMuted, fontSize: 13 }}>({destination.reviewCount.toLocaleString()} reviews)</Text>
          </View>

          {/* Description */}
          <Text style={[s.description, { fontFamily: t.typography.fontFamily, fontSize: t.typography.body.fontSize, color: t.colors.onSurfaceVariant, lineHeight: 22 }]}>
            {destination.description}
          </Text>

          {/* Action Buttons */}
          <View style={s.actions}>
            <TouchableOpacity
              style={[s.actionBtn, { backgroundColor: savedId ? t.colors.error : t.colors.primary, borderRadius: t.radius.md }]}
              onPress={handleSave}
              disabled={saving}
            >
              <Text style={{ color: '#FFF', fontWeight: '600', fontSize: 14 }}>
                {saving ? '...' : savedId ? '♥ Saved' : '♡ Save'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[s.actionBtn, { backgroundColor: wishlistId ? t.colors.tertiary : t.colors.secondary, borderRadius: t.radius.md }]}
              onPress={handleWishlist}
              disabled={wishlisting}
            >
              <Text style={{ color: '#FFF', fontWeight: '600', fontSize: 14 }}>
                {wishlisting ? '...' : wishlistId ? '★ In Wishlist' : '☆ Wishlist'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[s.actionBtn, { backgroundColor: t.colors.surface, borderRadius: t.radius.md, borderColor: t.colors.primary, borderWidth: 1.5 }]}
              onPress={handleAddToItinerary}
            >
              <Text style={{ color: t.colors.primary, fontWeight: '600', fontSize: 14 }}>+ Itinerary</Text>
            </TouchableOpacity>
          </View>

          {/* Reviews Section */}
          <View style={{ marginTop: t.spacing['2xl'] }}>
            <Text style={[s.sectionTitle, { fontFamily: t.typography.fontFamily, fontWeight: '700', fontSize: t.typography.headline.fontSize, color: t.colors.onSurface }]}>
              Reviews ({reviews.length})
            </Text>

            {/* Add Review */}
            <View style={[s.reviewForm, { backgroundColor: t.colors.surface, borderRadius: t.radius.md, borderColor: t.colors.outline, borderWidth: 1 }]}>
              <TextInput
                placeholder="Your name"
                value={reviewName}
                onChangeText={setReviewName}
                style={[s.reviewInput, { fontFamily: t.typography.fontFamily, borderBottomColor: t.colors.outline, borderBottomWidth: 1, color: t.colors.onSurface }]}
                placeholderTextColor={t.colors.onSurfaceMuted}
              />
              <TextInput
                placeholder="Share your experience..."
                value={reviewText}
                onChangeText={setReviewText}
                multiline
                numberOfLines={3}
                style={[s.reviewInput, s.reviewTextArea, { fontFamily: t.typography.fontFamily, color: t.colors.onSurface }]}
                placeholderTextColor={t.colors.onSurfaceMuted}
              />
              {reviewError && (
                <Text style={{ color: t.colors.error, fontSize: 13, marginBottom: 8 }}>{reviewError}</Text>
              )}
              <TouchableOpacity
                style={[s.submitBtn, { backgroundColor: t.colors.primary, borderRadius: t.radius.sm }]}
                onPress={handleSubmitReview}
                disabled={submittingReview}
              >
                <Text style={{ color: '#FFF', fontWeight: '600', fontSize: 14 }}>
                  {submittingReview ? 'Submitting...' : 'Submit Review'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Review List */}
            {loadingReviews ? (
              <ActivityIndicator style={{ marginTop: 24 }} color={t.colors.primary} />
            ) : reviews.length === 0 ? (
              <Text style={{ color: t.colors.onSurfaceMuted, textAlign: 'center', marginTop: 24, fontSize: 14 }}>
                No reviews yet. Be the first to share your experience!
              </Text>
            ) : (
              reviews.map((review) => (
                <View key={review.id} style={[s.reviewCard, { backgroundColor: t.colors.surface, borderRadius: t.radius.md, borderColor: t.colors.outline, borderWidth: 1 }]}>
                  <View style={s.reviewHeader}>
                    <View style={[s.avatar, { backgroundColor: t.colors.primaryContainer, borderRadius: t.radius.full }]}>
                      <Text style={{ color: t.colors.primary, fontWeight: '700', fontSize: 14 }}>
                        {review.authorName.charAt(0).toUpperCase()}
                      </Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontWeight: '600', color: t.colors.onSurface, fontSize: 14 }}>{review.authorName}</Text>
                      <Text style={{ color: t.colors.onSurfaceMuted, fontSize: 12 }}>{review.location}</Text>
                    </View>
                    <Text style={{ color: t.colors.onSurfaceMuted, fontSize: 12 }}>👍 {review.helpfulVotes}</Text>
                  </View>
                  <Text style={{ color: t.colors.onSurfaceVariant, fontSize: 14, lineHeight: 20, marginTop: 8 }}>
                    {review.text}
                  </Text>
                </View>
              ))
            )}
          </View>

          <View style={{ height: t.spacing['4xl'] }} />
        </View>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1 },
  header: { borderBottomWidth: 1, zIndex: 10 },
  headerRow: { flexDirection: 'row', alignItems: 'center' },
  headerTitle: { marginLeft: 4 },
  heroImage: { width: '100%', height: 240 },
  heroGradient: { width: '100%', height: 240, alignItems: 'center', justifyContent: 'center' },
  titleRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginTop: 4 },
  name: {},
  category: { marginTop: 4 },
  ratingBadge: { paddingHorizontal: 12, paddingVertical: 6 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 8 },
  description: { marginTop: 16 },
  actions: { flexDirection: 'row', gap: 8, marginTop: 20 },
  actionBtn: { flex: 1, height: 44, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 8 },
  sectionTitle: { marginBottom: 12 },
  reviewForm: { padding: 12, marginBottom: 16 },
  reviewInput: { paddingVertical: 10, paddingHorizontal: 4, fontSize: 14 },
  reviewTextArea: { minHeight: 72, textAlignVertical: 'top' },
  submitBtn: { height: 40, justifyContent: 'center', alignItems: 'center', marginTop: 8 },
  reviewCard: { padding: 12, marginBottom: 10 },
  reviewHeader: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  avatar: { width: 36, height: 36, justifyContent: 'center', alignItems: 'center' },
});
