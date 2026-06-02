import { View, Text, ScrollView, StyleSheet, Alert } from 'react-native';
import { useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../theme';
import { Tag, BudgetSelector, Toggle, Button } from '../components';
import { useAuth } from '../contexts/AuthContext';

interface Props {
  navigation: any;
}

const allPreferences = ['Adventure', 'Relaxation', 'Foodie', 'Culture', 'Nature', 'Shopping'];

export function ProfileScreen({ navigation }: Props) {
  const t = useTheme();
  const { user, logout, updateProfile } = useAuth();

  const [preferences, setPreferences] = useState<string[]>(
    (user?.preferences || []).map((p: any) => typeof p === 'string' ? p : p.preference)
  );
  const [budget, setBudget] = useState<'$' | '$$' | '$$$'>((user?.budgetLevel as '$' | '$$' | '$$$') || '$$');
  const [settings, setSettings] = useState({
    language: user?.language || 'English',
    currency: user?.currency || 'USD ($)',
    flightAlerts: user?.flightAlerts ?? true,
    itineraryReminders: user?.itineraryReminders ?? true,
    darkMode: user?.darkMode ?? false,
  });

  const togglePreference = (pref: string) => {
    const next = preferences.includes(pref)
      ? preferences.filter((p) => p !== pref)
      : [...preferences, pref];
    setPreferences(next);
    updateProfile({ preferences: next }).catch(() => {});
  };

  const handleBudgetChange = (b: '$' | '$$' | '$$$') => {
    setBudget(b);
    updateProfile({ budgetLevel: b }).catch(() => {});
  };

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings((s) => {
      const next = { ...s, [key]: !s[key] };
      updateProfile({ [key]: next[key] }).catch(() => {});
      return next;
    });
  };

  const handleLogout = () => {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log Out', style: 'destructive', onPress: logout },
    ]);
  };

  return (
    <View style={[s.screen, { backgroundColor: t.colors.background }]}>
      <View style={[s.header, { backgroundColor: t.colors.surface, borderBottomColor: t.colors.outline, paddingHorizontal: t.spacing.lg, paddingTop: t.spacing['2xl'], paddingBottom: t.spacing.md }]}>
        <View style={s.headerRow}>
          <Text style={[s.title, { fontFamily: t.typography.fontFamily, fontWeight: '600', fontSize: t.typography.bodyLg.fontSize, color: t.colors.onSurface }]}>
            Profile
          </Text>
          <View style={{ flex: 1 }} />
          <Text style={[s.settingsIcon, { color: t.colors.onSurface, fontSize: 22 }]}>{'⚙'}</Text>
        </View>
      </View>

      <ScrollView style={s.scroll} showsVerticalScrollIndicator={false}>
        <View style={[s.profileSection, { padding: t.spacing.lg }]}>
          <LinearGradient
            colors={['#2563EB', '#7C3AED']}
            style={[s.avatar, { borderRadius: t.radius.full, width: 72, height: 72 }]}
          >
            <Text style={s.avatarText}>{user?.initials || '?'}</Text>
          </LinearGradient>
          <Text style={[s.name, { fontFamily: t.typography.fontFamily, fontWeight: '600', fontSize: t.typography.title.fontSize, color: t.colors.onSurface }]}>
            {user?.displayName || 'Guest'}
          </Text>
          <Text style={[s.email, { fontFamily: t.typography.fontFamily, fontSize: t.typography.bodySm.fontSize, color: t.colors.onSurfaceVariant }]}>
            {user?.email || 'Not logged in'}
          </Text>
        </View>

        <Text style={[s.sectionTitle, { fontFamily: t.typography.fontFamily, fontWeight: '600', fontSize: t.typography.body.fontSize, color: t.colors.onSurface, paddingHorizontal: t.spacing.lg }]}>
          Travel Preferences
        </Text>
        <View style={[s.tagGrid, { paddingHorizontal: t.spacing.lg, marginTop: t.spacing.sm, gap: t.spacing.sm }]}>
          {allPreferences.map((pref) => (
            <Tag key={pref} label={pref} selected={preferences.includes(pref)} onPress={() => togglePreference(pref)} />
          ))}
        </View>

        <Text style={[s.sectionTitle, { fontFamily: t.typography.fontFamily, fontWeight: '600', fontSize: t.typography.body.fontSize, color: t.colors.onSurface, paddingHorizontal: t.spacing.lg, marginTop: t.spacing['2xl'] }]}>
          Budget Level
        </Text>
        <View style={{ paddingHorizontal: t.spacing.lg, marginTop: t.spacing.sm }}>
          <BudgetSelector value={budget} onChange={handleBudgetChange} />
        </View>

        <Text style={[s.sectionTitle, { fontFamily: t.typography.fontFamily, fontWeight: '600', fontSize: t.typography.body.fontSize, color: t.colors.onSurface, paddingHorizontal: t.spacing.lg, marginTop: t.spacing['2xl'] }]}>
          Settings
        </Text>
        <View style={[s.settingsCard, { backgroundColor: t.colors.surface, borderColor: t.colors.outline, borderRadius: t.radius.md, borderWidth: 1, marginHorizontal: t.spacing.lg, marginTop: t.spacing.sm }]}>
          <View style={[s.settingRow, { borderBottomColor: t.colors.outlineVariant, padding: t.spacing.lg }]}>
            <Text style={[s.settingLabel, { fontFamily: t.typography.fontFamily, fontSize: t.typography.body.fontSize, color: t.colors.onSurface }]}>Language</Text>
            <Text style={[s.settingValue, { fontFamily: t.typography.fontFamily, fontSize: t.typography.body.fontSize, color: t.colors.onSurfaceVariant }]}>{settings.language} {'▼'}</Text>
          </View>
          <View style={[s.settingRow, { borderBottomColor: t.colors.outlineVariant, padding: t.spacing.lg }]}>
            <Text style={[s.settingLabel, { fontFamily: t.typography.fontFamily, fontSize: t.typography.body.fontSize, color: t.colors.onSurface }]}>Currency</Text>
            <Text style={[s.settingValue, { fontFamily: t.typography.fontFamily, fontSize: t.typography.body.fontSize, color: t.colors.onSurfaceVariant }]}>{settings.currency} {'▼'}</Text>
          </View>
          <View style={[s.settingRow, { borderBottomColor: t.colors.outlineVariant, padding: t.spacing.lg }]}>
            <Text style={[s.settingLabel, { fontFamily: t.typography.fontFamily, fontSize: t.typography.body.fontSize, color: t.colors.onSurface }]}>Flight Alerts</Text>
            <Toggle value={settings.flightAlerts} onToggle={() => toggleSetting('flightAlerts')} />
          </View>
          <View style={[s.settingRow, { borderBottomColor: t.colors.outlineVariant, padding: t.spacing.lg }]}>
            <Text style={[s.settingLabel, { fontFamily: t.typography.fontFamily, fontSize: t.typography.body.fontSize, color: t.colors.onSurface }]}>Itinerary Reminders</Text>
            <Toggle value={settings.itineraryReminders} onToggle={() => toggleSetting('itineraryReminders')} />
          </View>
          <View style={[s.settingRow, { padding: t.spacing.lg }]}>
            <Text style={[s.settingLabel, { fontFamily: t.typography.fontFamily, fontSize: t.typography.body.fontSize, color: t.colors.onSurface }]}>Dark Mode</Text>
            <Toggle value={settings.darkMode} onToggle={() => toggleSetting('darkMode')} />
          </View>
        </View>

        <View style={{ paddingHorizontal: t.spacing.lg, marginTop: t.spacing.lg }}>
          <Button title={'📝 Take User Survey'} onPress={() => navigation.navigate('Questionnaire')} variant="secondary" block />
        </View>

        <View style={{ paddingHorizontal: t.spacing.lg, marginTop: t.spacing.lg }}>
          <Button title={'🚪 Log Out'} onPress={handleLogout} variant="danger" block />
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
  settingsIcon: {},
  scroll: { flex: 1 },
  profileSection: { alignItems: 'center' },
  avatar: { alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#fff', fontFamily: 'Inter', fontWeight: '700', fontSize: 24 },
  name: { marginTop: 12 },
  email: { marginTop: 2 },
  sectionTitle: {},
  tagGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  settingsCard: {},
  settingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1 },
  settingLabel: {},
  settingValue: {},
});
