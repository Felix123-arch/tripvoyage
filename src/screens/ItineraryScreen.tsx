import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Modal, TextInput, Alert, Platform } from 'react-native';
import { useState, useEffect, useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../theme';
import { useLang } from '../contexts/LanguageContext';
import { td } from '../i18n/translations';
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
  const { isAuthenticated, isGuest } = useAuth();
  const { t: tx, lang } = useLang();
  const [itineraries, setItineraries] = useState<api.Itinerary[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [weatherIndex, setWeatherIndex] = useState(0);
  const [weatherData, setWeatherData] = useState<{label: string; temp: string; cond: string}[]>([]);

  // Create itinerary modal
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDestination, setNewDestination] = useState('');
  const [newStartDate, setNewStartDate] = useState('');
  const [newEndDate, setNewEndDate] = useState('');
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [createFields, setCreateFields] = useState<Record<string, string>>({});

  // Edit itinerary modal
  const [showEdit, setShowEdit] = useState(false);
  const [editName, setEditName] = useState('');
  const [editStartDate, setEditStartDate] = useState('');
  const [editEndDate, setEditEndDate] = useState('');
  const [editing, setEditing] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [editFields, setEditFields] = useState<Record<string, string>>({});

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
      // Fetch real weather for each itinerary via backend proxy
      const withWeather = await Promise.all(
        list.map(async (it) => {
          try {
            const { data } = await (await import('../services/api')).default.get('/weather', { params: { city: it.destination } });
            if (data.temp) {
              return { ...it, weatherTemp: data.temp, weatherCond: data.condition, weatherDesc: data.condition };
            }
            return it;
          } catch {
            return it;
          }
        })
      );
      setItineraries(withWeather);
      // Build per-location weather data for carousel
      const it = withWeather[0];
      if (it) {
        const locations: {label: string; loc: string}[] = [{ label: td(lang, it.destination)?.name || it.destination, loc: it.destination }];
        it.days?.forEach((day: any) => {
          day.activities?.forEach((act: any) => {
            if (act.location && !locations.find((l) => l.loc === act.location)) {
              locations.push({ label: act.location + (act.title ? ` (${act.title.slice(0,8)})` : ''), loc: act.location });
            }
          });
        });
        // Fetch weather for each location (max 5)
        const limitedLocations = locations.slice(0, 5);
        const weatherItems: {label: string; temp: string; cond: string}[] = [];
        for (const loc of limitedLocations) {
          try {
            const { data } = await (await import('../services/api')).default.get('/weather', { params: { city: loc.loc } });
            weatherItems.push({ label: loc.label, temp: data.temp || '--', cond: data.condition || '' });
          } catch { weatherItems.push({ label: loc.label, temp: '--', cond: '' }); }
          // Small delay between requests
          await new Promise((r) => setTimeout(r, 300));
        }
        setWeatherData(weatherItems.filter((w) => w.temp !== '--'));
      }
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || tx('failedLoadItin'));
    } finally {
      setLoading(false);
    }
  }, []);

  // Rotate weather every 3 seconds
  useEffect(() => {
    if (weatherData.length <= 1) return;
    const timer = setInterval(() => {
      setWeatherIndex((i) => (i + 1) % weatherData.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [weatherData.length]);

  useEffect(() => {
    loadItineraries();
  }, [loadItineraries]);

  // Reload weather when switching itineraries
  useEffect(() => {
    const it = itineraries[activeIndex];
    if (!it) return;
    (async () => {
      const locations: {label: string; loc: string}[] = [{ label: td(lang, it.destination)?.name || it.destination, loc: it.destination }];
      it.days?.forEach((day: any) => {
        day.activities?.forEach((act: any) => {
          if (act.location && !locations.find((l) => l.loc === act.location)) {
            locations.push({ label: act.location + (act.title ? ` (${act.title.slice(0,8)})` : ''), loc: act.location });
          }
        });
      });
      const limitedLocations = locations.slice(0, 5);
      const weatherItems: {label: string; temp: string; cond: string}[] = [];
      for (const loc of limitedLocations) {
        try {
          const { data } = await (await import('../services/api')).default.get('/weather', { params: { city: loc.loc } });
          weatherItems.push({ label: loc.label, temp: data.temp || '--', cond: data.condition || '' });
        } catch { weatherItems.push({ label: loc.label, temp: '--', cond: '' }); }
        await new Promise((r) => setTimeout(r, 300));
      }
      setWeatherData(weatherItems.filter((w) => w.temp !== '--'));
      setWeatherIndex(0);
    })();
  }, [activeIndex]);

  // Reload when tab is focused (after adding activity from map, etc.)
  useEffect(() => {
    const unsub = navigation.addListener?.('focus', () => {
      loadItineraries();
    });
    return unsub;
  }, [navigation, loadItineraries]);

  // Handle addDestination param from DestinationDetailScreen
  useEffect(() => {
    if (route?.params?.addDestination) {
      const dest = route.params.addDestination as api.Destination;
      setNewDestination(dest.name);
      setNewName(`${dest.name} ${lang === 'zh' ? '之旅' : 'Trip'}`);
      setShowCreate(true);
      // Clear the param so it doesn't trigger again
      route.params.addDestination = undefined;
    }
  }, [route?.params?.addDestination, lang]);

  const handleCreate = async () => {
    const f: Record<string, string> = {};
    if (!newName.trim()) f.name = tx('fieldRequired');
    if (!newDestination.trim()) f.dest = tx('fieldRequired');
    if (!newStartDate) f.start = tx('fieldRequired');
    if (!newEndDate) f.end = tx('fieldRequired');
    if (Object.keys(f).length > 0) { setCreateFields(f); return; }
    setCreateFields({});
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
      setActiveIndex(0);
      // Reset form and close modal
      setNewName(''); setNewDestination(''); setNewStartDate(''); setNewEndDate('');
      setTimeout(() => setShowCreate(false), 100);
    } catch (err: any) {
      setCreateError(err.response?.data?.error || 'Failed to create itinerary');
    } finally {
      setCreating(false);
    }
  };

  const handleAddActivity = async () => {
    if (!actTitle.trim()) {
      setActivityError(tx('fillAllFields'));
      return;
    }
    const itinerary = itineraries[activeIndex];
    if (!itinerary) return;
    if (itinerary.days.length === 0) {
      // Auto-create first day if missing (legacy data or server issue)
      setActivityError(tx('noDays') || 'No days in itinerary.');
      return;
    }

    const day = itinerary.days.find((d) => d.dayNumber === actDayNum) || itinerary.days[0];
    if (!day) {
      setActivityError(tx('dayNotFound') || 'Day not found.');
      return;
    }

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

  const handleOpenEdit = () => {
    const it = itineraries[activeIndex];
    if (!it) return;
    setEditName(it.name);
    setEditStartDate(it.startDate);
    setEditEndDate(it.endDate);
    setEditError(null);
    setShowEdit(true);
  };

  const handleSaveEdit = async () => {
    const it = itineraries[activeIndex];
    if (!it) return;
    const f: Record<string, string> = {};
    if (!editName.trim()) f.name = tx('fieldRequired');
    if (Object.keys(f).length > 0) { setEditFields(f); return; }
    setEditFields({});
    setEditing(true);
    setEditError(null);
    try {
      const updated = await api.updateItinerary(it.id, {
        name: editName.trim(),
        startDate: editStartDate,
        endDate: editEndDate,
      });
      setItineraries((prev) =>
        prev.map((x) => (x.id === it.id ? { ...x, ...updated } : x))
      );
      setShowEdit(false);
    } catch (err: any) {
      setEditError(err.response?.data?.error || tx('failedSave'));
    } finally {
      setEditing(false);
    }
  };

  const handleDelete = () => {
    const it = itineraries[activeIndex];
    if (!it) return;
    if (Platform.OS === 'web') {
      if (!window.confirm(tx('deleteConfirm'))) return;
    }
    api.deleteItinerary(it.id)
      .then(() => {
        setItineraries((prev) => prev.filter((x) => x.id !== it.id));
        setActiveIndex(0);
      })
      .catch((err: any) => {
        if (Platform.OS === 'web') {
          window.alert(err.response?.data?.error || tx('failedSave'));
        } else {
          Alert.alert(tx('error'), err.response?.data?.error || err.message || tx('failedSave'));
        }
      });
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

  if (!isAuthenticated && !isGuest) {
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
          <TextInput placeholder={tx('tripName')} value={newName} onChangeText={(v) => { setNewName(v); setCreateFields({}); }}
            style={[s.input, { fontFamily: t.typography.fontFamily, borderColor: createFields.name ? t.colors.error : t.colors.outline, borderRadius: t.radius.sm, color: t.colors.onSurface }]}
            placeholderTextColor={t.colors.onSurfaceMuted} />
          {createFields.name ? <Text style={{ color: t.colors.error, fontSize: 11, marginTop: -6 }}>{createFields.name}</Text> : null}
          <TextInput placeholder={tx('destination')} value={newDestination} onChangeText={(v) => { setNewDestination(v); setCreateFields({}); }}
            style={[s.input, { fontFamily: t.typography.fontFamily, borderColor: createFields.dest ? t.colors.error : t.colors.outline, borderRadius: t.radius.sm, color: t.colors.onSurface }]}
            placeholderTextColor={t.colors.onSurfaceMuted} />
          {createFields.dest ? <Text style={{ color: t.colors.error, fontSize: 11, marginTop: -6 }}>{createFields.dest}</Text> : null}
          <View style={s.dateRow}>
            <TextInput placeholder={tx('startDate')} value={newStartDate} onChangeText={(v) => { setNewStartDate(v); setCreateFields({}); }}
              style={[s.input, s.dateInput, { fontFamily: t.typography.fontFamily, borderColor: createFields.start ? t.colors.error : t.colors.outline, borderRadius: t.radius.sm, color: t.colors.onSurface }]}
              placeholderTextColor={t.colors.onSurfaceMuted} />
            <TextInput placeholder={tx('endDate')} value={newEndDate} onChangeText={(v) => { setNewEndDate(v); setCreateFields({}); }}
              style={[s.input, s.dateInput, { fontFamily: t.typography.fontFamily, borderColor: createFields.end ? t.colors.error : t.colors.outline, borderRadius: t.radius.sm, color: t.colors.onSurface }]}
              placeholderTextColor={t.colors.onSurfaceMuted} />
          </View>
          {(createFields.start || createFields.end) ? <Text style={{ color: t.colors.error, fontSize: 11, marginTop: -6 }}>{createFields.start || createFields.end}</Text> : null}
          {createError && <Text style={{ color: t.colors.error, fontSize: 13, marginBottom: 8 }}>{createError}</Text>}
          <View style={s.modalBtns}>
            <TouchableOpacity onPress={() => { setShowCreate(false); setCreateError(null); setCreateFields({}); }}
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
              {td(lang, itinerary.destination)?.name || itinerary.destination} · {itinerary.startDate} - {itinerary.endDate}
            </Text>
          </View>
          <TouchableOpacity onPress={handleOpenEdit} style={{ marginRight: 12 }}>
            <Text style={{ color: t.colors.primary, fontSize: 16, fontWeight: '600' }}>{tx('edit')}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Main', { screen: 'Map', params: { itineraryRoutes: itinerary } })} style={{ marginRight: 12 }}>
            <Text style={{ color: t.colors.secondary, fontSize: 16, fontWeight: '600' }}>🗺</Text>
          </TouchableOpacity>
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
            colors={(() => {
              const temp = parseInt(weatherData[weatherIndex]?.temp || itinerary.weatherTemp || '20');
              if (temp >= 35) return ['#DC2626', '#EA580C'] as const;
              if (temp >= 30) return ['#EA580C', '#F59E0B'] as const;
              if (temp >= 25) return ['#F59E0B', '#84CC16'] as const;
              if (temp >= 20) return ['#10B981', '#06B6D4'] as const;
              if (temp >= 15) return ['#06B6D4', '#3B82F6'] as const;
              if (temp >= 10) return ['#3B82F6', '#6366F1'] as const;
              if (temp >= 5)  return ['#6366F1', '#8B5CF6'] as const;
              return ['#8B5CF6', '#A78BFA'] as const;
            })()}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
            style={[s.weatherWrap, { borderRadius: t.radius.md, padding: t.spacing.lg }]}
          >
            <View style={s.weatherRow}>
              <Text style={s.weatherIcon}>{(() => {
                const cond = (weatherData[weatherIndex]?.cond || itinerary.weatherCond || '').toLowerCase();
                if (cond.includes('rain') || cond.includes('drizzle') || cond.includes('shower')) return '🌧️';
                if (cond.includes('snow') || cond.includes('ice') || cond.includes('sleet')) return '❄️';
                if (cond.includes('cloud') || cond.includes('overcast')) return '⛅';
                if (cond.includes('fog') || cond.includes('mist') || cond.includes('haze')) return '🌫️';
                if (cond.includes('thunder') || cond.includes('storm')) return '⛈️';
                if (cond.includes('clear') || cond.includes('sunny') || cond.includes('fair')) return '☀️';
                const temp2 = parseInt(weatherData[weatherIndex]?.temp || '20');
                if (temp2 >= 25) return '☀️';
                if (temp2 >= 15) return '⛅';
                if (temp2 >= 5)  return '🌤️';
                return '❄️';
              })()}</Text>
              <View>
                <Text style={[s.weatherLoc, { fontFamily: t.typography.fontFamily, fontSize: t.typography.body.fontSize, color: 'rgba(255,255,255,0.9)' }]}>
                  {weatherData[weatherIndex]?.label || td(lang, itinerary.destination)?.name || itinerary.destination}
                </Text>
                <Text style={[s.weatherTemp, { fontFamily: t.typography.fontFamily, fontWeight: '700', fontSize: 36, color: '#fff' }]}>
                  {weatherData[weatherIndex]?.temp || itinerary.weatherTemp || '22'}°C
                </Text>
                <Text style={[s.weatherCond, { fontFamily: t.typography.fontFamily, fontSize: t.typography.bodySm.fontSize, color: 'rgba(255,255,255,0.85)' }]}>
                  {weatherData[weatherIndex]?.cond || itinerary.weatherCond || tx('sunny')} · {weatherData.length > 1 ? `${weatherIndex + 1}/${weatherData.length}` : tx('perfectForExploring')}
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
            <Text style={{ color: t.colors.primary, fontWeight: '600', fontSize: 14, textAlign: 'center' }}>{tx('anotherTrip')}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={async () => {
            const it = itineraries[activeIndex];
            if (!it) return;
            if (window.confirm(tx('completeConfirm'))) {
              try {
                await api.updateItinerary(it.id, { status: 'completed' });
                setItineraries((prev) => prev.filter((x) => x.id !== it.id));
                setActiveIndex(0);
              } catch { Alert.alert(tx('error'), tx('failedSave')); }
            }
          }}
            style={[s.newTripBtn, { borderColor: t.colors.secondary, borderRadius: t.radius.md, borderWidth: 1, marginTop: t.spacing.sm }]}>
            <Text style={{ color: t.colors.secondary, fontWeight: '600', fontSize: 14, textAlign: 'center' }}>{tx('markComplete')}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleDelete}
            style={[s.newTripBtn, { borderColor: t.colors.error, borderRadius: t.radius.md, borderWidth: 1, marginTop: t.spacing.sm }]}>
            <Text style={{ color: t.colors.error, fontWeight: '600', fontSize: 14, textAlign: 'center' }}>{tx('deleteItinerary')}</Text>
          </TouchableOpacity>
        </View>
        <View style={{ height: t.spacing['4xl'] }} />
      </ScrollView>

      {/* Create Itinerary Modal */}
      <Modal visible={showCreate} animationType="slide" transparent>
        {renderCreateModal()}
      </Modal>

      {/* Edit Itinerary Modal */}
      <Modal visible={showEdit} animationType="slide" transparent>
        <View style={[s.modalOverlay, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
          <View style={[s.modalContent, { backgroundColor: t.colors.surface, borderRadius: t.radius.lg }]}>
            <Text style={[s.modalTitle, { fontFamily: t.typography.fontFamily, fontWeight: '700', fontSize: 20, color: t.colors.onSurface }]}>
              {tx('editItinerary')}
            </Text>
            <TextInput placeholder={tx('tripName')} value={editName} onChangeText={(v) => { setEditName(v); setEditFields({}); }}
              style={[s.input, { fontFamily: t.typography.fontFamily, borderColor: editFields.name ? t.colors.error : t.colors.outline, borderRadius: t.radius.sm, color: t.colors.onSurface }]}
              placeholderTextColor={t.colors.onSurfaceMuted} />
            {editFields.name ? <Text style={{ color: t.colors.error, fontSize: 11, marginTop: -6 }}>{editFields.name}</Text> : null}
            <View style={s.dateRow}>
              <TextInput placeholder={tx('startDate')} value={editStartDate} onChangeText={setEditStartDate}
                style={[s.input, s.dateInput, { fontFamily: t.typography.fontFamily, borderColor: t.colors.outline, borderRadius: t.radius.sm, color: t.colors.onSurface }]}
                placeholderTextColor={t.colors.onSurfaceMuted} />
              <TextInput placeholder={tx('endDate')} value={editEndDate} onChangeText={setEditEndDate}
                style={[s.input, s.dateInput, { fontFamily: t.typography.fontFamily, borderColor: t.colors.outline, borderRadius: t.radius.sm, color: t.colors.onSurface }]}
                placeholderTextColor={t.colors.onSurfaceMuted} />
            </View>
            {editError && <Text style={{ color: t.colors.error, fontSize: 13, marginBottom: 8 }}>{editError}</Text>}
            <View style={s.modalBtns}>
              <TouchableOpacity onPress={() => { setShowEdit(false); setEditFields({}); }}
                style={[s.modalBtn, { borderColor: t.colors.outline, borderRadius: t.radius.sm, borderWidth: 1 }]}>
                <Text style={{ color: t.colors.onSurface, fontWeight: '500' }}>{tx('cancel')}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSaveEdit} disabled={editing}
                style={[s.modalBtn, { backgroundColor: t.colors.primary, borderRadius: t.radius.sm }]}>
                <Text style={{ color: '#FFF', fontWeight: '600' }}>{editing ? tx('saving') : tx('save')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
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
