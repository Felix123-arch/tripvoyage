import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Modal, TextInput, Alert, Platform } from 'react-native';
import { useState, useEffect, useCallback } from 'react';
import { useTheme } from '../theme';
import { useLang } from '../contexts/LanguageContext';
import { Timeline, Button, LoadingOverlay, ErrorBanner, EmptyState } from '../components';
import { LinearGradient } from 'expo-linear-gradient';
import * as api from '../services';
import { useAuth } from '../contexts/AuthContext';

interface Props {
  navigation: any;
  route?: any;
}

const ACTIVITY_TYPES = ['sightseeing', 'dining', 'transport', 'hotel', 'shopping', 'other'];
const ACTIVITY_LABELS: Record<string, string> = {
  sightseeing: '🏛', dining: '🍽', transport: '🚗',
  hotel: '🏨', shopping: '🛍', other: '📌',
};

export function ItineraryScreen({ navigation, route }: Props) {
  const t = useTheme();
  const { isAuthenticated } = useAuth();
  const { t: tx } = useLang();
  const [itineraries, setItineraries] = useState<api.Itinerary[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Create itinerary modal
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDestination, setNewDestination] = useState('');
  const [newStartDate, setNewStartDate] = useState('');
  const [newEndDate, setNewEndDate] = useState('');
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  // Add activity modal
  const [showAddActivity, setShowAddActivity] = useState(false);
  const [actTitle, setActTitle] = useState('');
  const [actType, setActType] = useState('sightseeing');
  const [actDayNum, setActDayNum] = useState(1);
  const [actTime, setActTime] = useState('');
  const [actLocation, setActLocation] = useState('');
  const [actDesc, setActDesc] = useState('');
  const [addingActivity, setAddingActivity] = useState(false);
  const [activityError, setActivityError] = useState<string | null>(null);

  const loadItineraries = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await api.getItineraries('upcoming');
      setItineraries(list);
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Failed to load itineraries');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadItineraries();
  }, [loadItineraries]);

  // Handle addDestination param from DestinationDetailScreen
  useEffect(() => {
    if (route?.params?.addDestination) {
      const dest = route.params.addDestination as api.Destination;
      setNewDestination(dest.name);
      setNewName(`Trip to ${dest.name}`);
      setShowCreate(true);
      // Clear the param so it doesn't trigger again
      route.params.addDestination = undefined;
    }
  }, [route?.params?.addDestination]);

  const handleCreate = async () => {
    if (!newName.trim() || !newDestination.trim() || !newStartDate || !newEndDate) {
      setCreateError(tx('fillAllFields'));
      return;
    }
    setCreating(true);
    setCreateError(null);
    try {
      const itinerary = await api.createItinerary({
        name: newName.trim(),
        destination: newDestination.trim(),
        startDate: newStartDate,
        endDate: newEndDate,
        year: parseInt(newStartDate.split('-')[0]) || new Date().getFullYear(),
      });
      setItineraries((prev) => [itinerary, ...prev]);
      setShowCreate(false);
      setNewName('');
      setNewDestination('');
      setNewStartDate('');
      setNewEndDate('');
      setActiveIndex(0);
    } catch (err: any) {
      setCreateError(err.response?.data?.error || 'Failed to create itinerary');
    } finally {
      setCreating(false);
    }
  };

  const handleAddActivity = async () => {
    if (!actTitle.trim()) {
      setActivityError('Please enter an activity title.');
      return;
    }
    const itinerary = itineraries[activeIndex];
    if (!itinerary || itinerary.days.length === 0) return;

    const day = itinerary.days.find((d) => d.dayNumber === actDayNum) || itinerary.days[0];
    if (!day) return;

    setAddingActivity(true);
    setActivityError(null);
    try {
      const data: any = {
        title: actTitle.trim(),
        type: actType,
        time: actTime || undefined,
        location: actLocation || undefined,
        description: actDesc || undefined,
        status: 'confirmed',
      };

      const newActivity = await api.addActivity(itinerary.id, day.id, data);

      // Update local state
      setItineraries((prev) =>
        prev.map((it) => {
          if (it.id !== itinerary.id) return it;
          return {
            ...it,
            days: it.days.map((d) => {
              if (d.id !== day.id) return d;
              return { ...d, activities: [...d.activities, newActivity] };
            }),
          };
        })
      );

      setShowAddActivity(false);
      setActTitle('');
      setActTime('');
      setActLocation('');
      setActDesc('');
    } catch (err: any) {
      setActivityError(err.response?.data?.error || 'Failed to add activity');
    } finally {
      setAddingActivity(false);
    }
  };

  const handleBookTransport = () => {
    setActTitle('Transport');
    setActType('transport');
    setActTime('');
    setActLocation('');
    setActDesc('');
    setActivityError(null);
    setShowAddActivity(true);
  };

  const handleShare = async () => {
    const itinerary = itineraries[activeIndex];
    if (!itinerary) return;

    const text = `🌍 ${itinerary.name} - ${itinerary.destination}\n📅 ${itinerary.startDate} to ${itinerary.endDate}\n\nTripVoyage Itinerary`;

    if (Platform.OS === 'web' && navigator.share) {
      try {
        await navigator.share({ title: itinerary.name, text });
      } catch {}
    } else if (Platform.OS === 'web') {
      try {
        await navigator.clipboard.writeText(text);
        Alert.alert(tx('copiedTitle'), tx('copiedMsg'));
      } catch {
        Alert.alert('Share', text);
      }
    } else {
      Alert.alert('Share', text);
    }
  };

  const handleCreateFromHome = () => {
    setShowCreate(true);
  };

  if (!isAuthenticated) {
    return (
      <EmptyState icon="🔒" title={tx('loginTitle')} message={tx('loginToView')} />
    );
  }

  if (loading) return <LoadingOverlay message={tx('loadingItinerary')} />;
  if (error) return <ErrorBanner message={error} onRetry={loadItineraries} />;

  if (itineraries.length === 0) {
    return (
      <View style={[s.screen, { backgroundColor: t.colors.background }]}>
        <View style={[s.header, { backgroundColor: t.colors.surface, borderBottomColor: t.colors.outline, paddingHorizontal: t.spacing.lg, paddingTop: t.spacing['2xl'], paddingBottom: t.spacing.md }]}>
          <Text style={[s.title, { fontFamily: t.typography.fontFamily, fontWeight: '600', fontSize: t.typography.bodyLg.fontSize, color: t.colors.onSurface }]}>
            {tx('myItineraries')}
          </Text>
        </View>
        <EmptyState icon="📋" title={tx('noTripsYet')} message={tx('createFirstTrip')} />
        <View style={{ paddingHorizontal: 40, marginBottom: 40 }}>
          <Button title={tx('newTrip')} onPress={() => setShowCreate(true)} block />
        </View>
        {/* Create Modal */}
        <Modal visible={showCreate} animationType="slide" transparent>
          {renderCreateModal()}
        </Modal>
      </View>
    );
  }

  const itinerary = itineraries[activeIndex];

  const days = itinerary ? itinerary.days.map((day) => ({
    dayNumber: day.dayNumber,
    date: day.date,
    activities: day.activities.map((a) => ({
      id: a.id,
      type: a.type as any,
      title: a.title,
      time: a.time || '',
      location: a.location || '',
      description: a.description || '',
      status: (a.status as 'confirmed' | 'action_required' | 'pending') || 'confirmed',
      badge: (a.badge as any) || undefined,
    })),
  })) : [];

  function renderCreateModal() {
    return (
      <View style={[s.modalOverlay, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
        <View style={[s.modalContent, { backgroundColor: t.colors.surface, borderRadius: t.radius.lg }]}>
          <Text style={[s.modalTitle, { fontFamily: t.typography.fontFamily, fontWeight: '700', fontSize: 20, color: t.colors.onSurface }]}>
            {tx('createTripTitle')}
          </Text>
          <TextInput placeholder={tx('tripName')} value={newName} onChangeText={setNewName}
            style={[s.input, { fontFamily: t.typography.fontFamily, borderColor: t.colors.outline, borderRadius: t.radius.sm, color: t.colors.onSurface }]}
            placeholderTextColor={t.colors.onSurfaceMuted} />
          <TextInput placeholder={tx('destination')} value={newDestination} onChangeText={setNewDestination}
            style={[s.input, { fontFamily: t.typography.fontFamily, borderColor: t.colors.outline, borderRadius: t.radius.sm, color: t.colors.onSurface }]}
            placeholderTextColor={t.colors.onSurfaceMuted} />
          <View style={s.dateRow}>
            <TextInput placeholder={tx('startDate')} value={newStartDate} onChangeText={setNewStartDate}
              style={[s.input, s.dateInput, { fontFamily: t.typography.fontFamily, borderColor: t.colors.outline, borderRadius: t.radius.sm, color: t.colors.onSurface }]}
              placeholderTextColor={t.colors.onSurfaceMuted} />
            <TextInput placeholder={tx('endDate')} value={newEndDate} onChangeText={setNewEndDate}
              style={[s.input, s.dateInput, { fontFamily: t.typography.fontFamily, borderColor: t.colors.outline, borderRadius: t.radius.sm, color: t.colors.onSurface }]}
              placeholderTextColor={t.colors.onSurfaceMuted} />
          </View>
          {createError && <Text style={{ color: t.colors.error, fontSize: 13, marginBottom: 8 }}>{createError}</Text>}
          <View style={s.modalBtns}>
            <TouchableOpacity onPress={() => { setShowCreate(false); setCreateError(null); }}
              style={[s.modalBtn, { borderColor: t.colors.outline, borderRadius: t.radius.sm, borderWidth: 1 }]}>
              <Text style={{ color: t.colors.onSurface, fontWeight: '500' }}>{tx('cancel')}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleCreate} disabled={creating}
              style={[s.modalBtn, { backgroundColor: t.colors.primary, borderRadius: t.radius.sm }]}>
              <Text style={{ color: '#FFF', fontWeight: '600' }}>{creating ? tx('creating') : tx('create')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  function renderAddActivityModal() {
    return (
      <View style={[s.modalOverlay, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 20 }}>
          <View style={[s.modalContent, { backgroundColor: t.colors.surface, borderRadius: t.radius.lg }]}>
            <Text style={[s.modalTitle, { fontFamily: t.typography.fontFamily, fontWeight: '700', fontSize: 20, color: t.colors.onSurface }]}>
              {tx('addActivityTitle')}
            </Text>
            <TextInput placeholder={tx('activityTitle')} value={actTitle} onChangeText={setActTitle}
              style={[s.input, { fontFamily: t.typography.fontFamily, borderColor: t.colors.outline, borderRadius: t.radius.sm, color: t.colors.onSurface }]}
              placeholderTextColor={t.colors.onSurfaceMuted} />
            <Text style={[s.inputLabel, { color: t.colors.onSurfaceMuted }]}>{tx('type')}</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
              {ACTIVITY_TYPES.map((type) => (
                <TouchableOpacity key={type} onPress={() => setActType(type)}
                  style={[s.typeChip, { backgroundColor: actType === type ? t.colors.primary : t.colors.surface, borderColor: t.colors.outline, borderWidth: actType === type ? 0 : 1, borderRadius: t.radius.full, marginRight: 8 }]}>
                  <Text style={{ color: actType === type ? '#FFF' : t.colors.onSurface, fontSize: 13, fontWeight: '500' }}>
                    {ACTIVITY_LABELS[type]} {tx(type)}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <View style={s.dateRow}>
              <View style={{ flex: 1 }}>
                <Text style={[s.inputLabel, { color: t.colors.onSurfaceMuted }]}>{tx('day')}</Text>
                <TextInput value={String(actDayNum)} onChangeText={(v) => setActDayNum(Number(v) || 1)} keyboardType="numeric"
                  style={[s.input, { fontFamily: t.typography.fontFamily, borderColor: t.colors.outline, borderRadius: t.radius.sm, color: t.colors.onSurface }]}
                  placeholderTextColor={t.colors.onSurfaceMuted} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[s.inputLabel, { color: t.colors.onSurfaceMuted }]}>{tx('time')}</Text>
                <TextInput placeholder="10:00 AM" value={actTime} onChangeText={setActTime}
                  style={[s.input, { fontFamily: t.typography.fontFamily, borderColor: t.colors.outline, borderRadius: t.radius.sm, color: t.colors.onSurface }]}
                  placeholderTextColor={t.colors.onSurfaceMuted} />
              </View>
            </View>
            <TextInput placeholder={tx('location')} value={actLocation} onChangeText={setActLocation}
              style={[s.input, { fontFamily: t.typography.fontFamily, borderColor: t.colors.outline, borderRadius: t.radius.sm, color: t.colors.onSurface }]}
              placeholderTextColor={t.colors.onSurfaceMuted} />
            <TextInput placeholder={tx('description')} value={actDesc} onChangeText={setActDesc} multiline
              style={[s.input, s.textArea, { fontFamily: t.typography.fontFamily, borderColor: t.colors.outline, borderRadius: t.radius.sm, color: t.colors.onSurface }]}
              placeholderTextColor={t.colors.onSurfaceMuted} />
            {activityError && <Text style={{ color: t.colors.error, fontSize: 13, marginBottom: 8 }}>{activityError}</Text>}
            <View style={s.modalBtns}>
              <TouchableOpacity onPress={() => { setShowAddActivity(false); setActivityError(null); }}
                style={[s.modalBtn, { borderColor: t.colors.outline, borderRadius: t.radius.sm, borderWidth: 1 }]}>
                <Text style={{ color: t.colors.onSurface, fontWeight: '500' }}>{tx('cancel')}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleAddActivity} disabled={addingActivity}
                style={[s.modalBtn, { backgroundColor: t.colors.primary, borderRadius: t.radius.sm }]}>
                <Text style={{ color: '#FFF', fontWeight: '600' }}>{addingActivity ? tx('adding') : tx('add')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={[s.screen, { backgroundColor: t.colors.background }]}>
      <View style={[s.header, { backgroundColor: t.colors.surface, borderBottomColor: t.colors.outline, paddingHorizontal: t.spacing.lg, paddingTop: t.spacing['2xl'], paddingBottom: t.spacing.md }]}>
        <View style={s.headerRow}>
          <Text style={[s.back, { color: t.colors.primary, fontFamily: t.typography.fontFamily, fontSize: 28 }]} onPress={() => navigation.goBack()}>
            {'←'}
          </Text>
          <View style={s.headerCenter}>
            <Text style={[s.title, { fontFamily: t.typography.fontFamily, fontWeight: '600', fontSize: t.typography.bodyLg.fontSize, color: t.colors.onSurface }]}>
              {itinerary.name}
            </Text>
            <Text style={[s.subtitle, { fontFamily: t.typography.fontFamily, fontSize: t.typography.caption.fontSize, color: t.colors.onSurfaceVariant }]}>
              {itinerary.startDate} - {itinerary.endDate}, {itinerary.year}
            </Text>
          </View>
          <TouchableOpacity onPress={handleShare}>
            <Text style={[s.share, { color: t.colors.onSurface, fontSize: 22 }]}>{'📤'}</Text>
          </TouchableOpacity>
        </View>
        {/* Itinerary selector */}
        {itineraries.length > 1 && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 8 }}>
            {itineraries.map((it, i) => (
              <TouchableOpacity key={it.id} onPress={() => setActiveIndex(i)}
                style={[s.itChip, { backgroundColor: i === activeIndex ? t.colors.primary : t.colors.surface, borderColor: t.colors.outline, borderWidth: i === activeIndex ? 0 : 1, borderRadius: t.radius.full, marginRight: 8 }]}>
                <Text style={{ color: i === activeIndex ? '#FFF' : t.colors.onSurface, fontSize: 12, fontWeight: '500' }} numberOfLines={1}>
                  {it.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>

      <ScrollView style={s.scroll} showsVerticalScrollIndicator={false}>
        <View style={{ paddingHorizontal: t.spacing.lg, marginTop: t.spacing.lg }}>
          <LinearGradient
            colors={['#2563EB', '#7C3AED']}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
            style={[s.weatherWrap, { borderRadius: t.radius.md, padding: t.spacing.lg }]}
          >
            <View style={s.weatherRow}>
              <Text style={s.weatherIcon}>{'☀️'}</Text>
              <View>
                <Text style={[s.weatherLoc, { fontFamily: t.typography.fontFamily, fontSize: t.typography.body.fontSize, color: 'rgba(255,255,255,0.9)' }]}>
                  {itinerary.destination}
                </Text>
                <Text style={[s.weatherTemp, { fontFamily: t.typography.fontFamily, fontWeight: '700', fontSize: 36, color: '#fff' }]}>
                  {itinerary.weatherTemp || '22'}°C
                </Text>
                <Text style={[s.weatherCond, { fontFamily: t.typography.fontFamily, fontSize: t.typography.bodySm.fontSize, color: 'rgba(255,255,255,0.85)' }]}>
                  {itinerary.weatherCond || 'Sunny'} · {itinerary.weatherDesc || 'Perfect for exploring'}
                </Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        <View style={{ paddingHorizontal: t.spacing.lg, marginTop: t.spacing.xl }}>
          <Timeline days={days} />
        </View>

        <View style={{ paddingHorizontal: t.spacing.lg, marginTop: t.spacing.xl }}>
          <View style={s.fabRow}>
            <Button title={tx('addActivity')} onPress={() => setShowAddActivity(true)} size="sm" style={{ flex: 1 }} />
            <Button title={tx('share')} onPress={handleShare} variant="secondary" size="sm" style={{ flex: 1 }} />
            <Button title={tx('bookTransport')} onPress={handleBookTransport} variant="secondary" size="sm" style={{ flex: 1 }} />
          </View>
          <TouchableOpacity onPress={() => setShowCreate(true)}
            style={[s.newTripBtn, { borderColor: t.colors.outline, borderRadius: t.radius.md, borderWidth: 1, marginTop: t.spacing.md }]}>
            <Text style={{ color: t.colors.primary, fontWeight: '600', fontSize: 14, textAlign: 'center' }}>+ Create Another Trip</Text>
          </TouchableOpacity>
        </View>
        <View style={{ height: t.spacing['4xl'] }} />
      </ScrollView>

      {/* Create Itinerary Modal */}
      <Modal visible={showCreate} animationType="slide" transparent>
        {renderCreateModal()}
      </Modal>

      {/* Add Activity Modal */}
      <Modal visible={showAddActivity} animationType="slide" transparent>
        {renderAddActivityModal()}
      </Modal>
    </View>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1 },
  header: { borderBottomWidth: 1 },
  headerRow: { flexDirection: 'row', alignItems: 'center' },
  back: {},
  headerCenter: { flex: 1, alignItems: 'center' },
  title: {},
  subtitle: { marginTop: 1 },
  share: {},
  itChip: { paddingHorizontal: 12, paddingVertical: 6 },
  scroll: { flex: 1 },
  weatherWrap: {},
  weatherRow: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  weatherIcon: { fontSize: 40 },
  weatherLoc: {},
  weatherTemp: {},
  weatherCond: {},
  fabRow: { flexDirection: 'row', gap: 8 },
  newTripBtn: { paddingVertical: 12 },
  // Modal styles
  modalOverlay: { flex: 1, justifyContent: 'center', padding: 20 },
  modalContent: { padding: 24, maxHeight: '90%' },
  modalTitle: { marginBottom: 16, textAlign: 'center' },
  input: { borderWidth: 1, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14, marginBottom: 10 },
  textArea: { minHeight: 64, textAlignVertical: 'top' },
  inputLabel: { fontSize: 12, marginBottom: 4, fontWeight: '500' },
  dateRow: { flexDirection: 'row', gap: 10 },
  dateInput: { flex: 1 },
  typeChip: { paddingHorizontal: 14, paddingVertical: 8 },
  modalBtns: { flexDirection: 'row', gap: 10, marginTop: 4 },
  modalBtn: { flex: 1, height: 44, justifyContent: 'center', alignItems: 'center' },
});
