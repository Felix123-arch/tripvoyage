import { View, Text, ScrollView, StyleSheet, Alert, Modal, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../theme';
import { Tag, BudgetSelector, Toggle, Button } from '../components';
import { useAuth } from '../contexts/AuthContext';

interface Props {
  navigation: any;
}

const allPreferences = ['Adventure', 'Relaxation', 'Foodie', 'Culture', 'Nature', 'Shopping'];

const LANGUAGE_OPTIONS = ['English', '中文（简体）', '中文（繁體）', '日本語', '한국어', 'Español', 'Français', 'Deutsch'];
const CURRENCY_OPTIONS = [
  { label: 'USD ($)', value: 'USD' },
  { label: 'EUR (€)', value: 'EUR' },
  { label: 'CNY (¥)', value: 'CNY' },
  { label: 'JPY (¥)', value: 'JPY' },
  { label: 'GBP (£)', value: 'GBP' },
  { label: 'KRW (₩)', value: 'KRW' },
];

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
  const [showLangPicker, setShowLangPicker] = useState(false);
  const [showCurrPicker, setShowCurrPicker] = useState(false);

  const handleUpdate = async (data: any) => {
    try {
      await updateProfile(data);
    } catch (err: any) {
      Alert.alert('Update Failed', err.response?.data?.error || 'Could not save changes. Please try again.');
    }
  };

  const togglePreference = (pref: string) => {
    const next = preferences.includes(pref)
      ? preferences.filter((p) => p !== pref)
      : [...preferences, pref];
    setPreferences(next);
    handleUpdate({ preferences: next });
  };

  const handleBudgetChange = (b: '$' | '$$' | '$$$') => {
    setBudget(b);
    handleUpdate({ budgetLevel: b });
  };

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings((s) => {
      const next = { ...s, [key]: !s[key] };
      handleUpdate({ [key]: next[key] });
      return next;
    });
  };

  const handleLanguageChange = (lang: string) => {
    setSettings((s) => ({ ...s, language: lang }));
    setShowLangPicker(false);
    handleUpdate({ language: lang });
  };

  const handleCurrencyChange = (curr: { label: string; value: string }) => {
    setSettings((s) => ({ ...s, currency: curr.label }));
    setShowCurrPicker(false);
    handleUpdate({ currency: curr.value });
  };

  const handleLogout = () => {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log Out', style: 'destructive', onPress: logout },
    ]);
  };

  const currentCurrencyLabel = settings.currency;

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
          {/* Language - now tappable */}
          <TouchableOpacity
            style={[s.settingRow, { borderBottomColor: t.colors.outline, borderBottomWidth: 1, padding: t.spacing.lg }]}
            onPress={() => setShowLangPicker(true)}
          >
            <Text style={[s.settingLabel, { fontSize: t.typography.body.fontSize, color: t.colors.onSurface }]}>Language</Text>
            <Text style={[s.settingValue, { fontSize: t.typography.body.fontSize, color: t.colors.onSurfaceVariant }]}>{settings.language} {'▼'}</Text>
          </TouchableOpacity>
          {/* Currency - now tappable */}
          <TouchableOpacity
            style={[s.settingRow, { borderBottomColor: t.colors.outline, borderBottomWidth: 1, padding: t.spacing.lg }]}
            onPress={() => setShowCurrPicker(true)}
          >
            <Text style={[s.settingLabel, { fontSize: t.typography.body.fontSize, color: t.colors.onSurface }]}>Currency</Text>
            <Text style={[s.settingValue, { fontSize: t.typography.body.fontSize, color: t.colors.onSurfaceVariant }]}>{currentCurrencyLabel} {'▼'}</Text>
          </TouchableOpacity>
          <View style={[s.settingRow, { borderBottomColor: t.colors.outline, borderBottomWidth: 1, padding: t.spacing.lg }]}>
            <Text style={[s.settingLabel, { fontSize: t.typography.body.fontSize, color: t.colors.onSurface }]}>Flight Alerts</Text>
            <Toggle value={settings.flightAlerts} onToggle={() => toggleSetting('flightAlerts')} />
          </View>
          <View style={[s.settingRow, { borderBottomColor: t.colors.outline, borderBottomWidth: 1, padding: t.spacing.lg }]}>
            <Text style={[s.settingLabel, { fontSize: t.typography.body.fontSize, color: t.colors.onSurface }]}>Itinerary Reminders</Text>
            <Toggle value={settings.itineraryReminders} onToggle={() => toggleSetting('itineraryReminders')} />
          </View>
          <View style={[s.settingRow, { padding: t.spacing.lg }]}>
            <Text style={[s.settingLabel, { fontSize: t.typography.body.fontSize, color: t.colors.onSurface }]}>Dark Mode</Text>
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

      {/* Language Picker Modal */}
      <Modal visible={showLangPicker} transparent animationType="fade">
        <TouchableOpacity style={{ flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.4)', padding: 40 }} activeOpacity={1} onPress={() => setShowLangPicker(false)}>
          <View style={{ backgroundColor: t.colors.surface, borderRadius: t.radius.lg, padding: 20 }} onStartShouldSetResponder={() => true}>
            <Text style={{ fontWeight: '700', fontSize: 18, color: t.colors.onSurface, textAlign: 'center', marginBottom: 12 }}>Select Language</Text>
            {LANGUAGE_OPTIONS.map((lang) => (
              <TouchableOpacity key={lang} onPress={() => handleLanguageChange(lang)}
                style={{ paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: t.colors.outline }}>
                <Text style={{ color: settings.language === lang ? t.colors.primary : t.colors.onSurface, fontWeight: settings.language === lang ? '700' : '400', fontSize: 15, textAlign: 'center' }}>
                  {lang} {settings.language === lang ? '✓' : ''}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Currency Picker Modal */}
      <Modal visible={showCurrPicker} transparent animationType="fade">
        <TouchableOpacity style={{ flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.4)', padding: 40 }} activeOpacity={1} onPress={() => setShowCurrPicker(false)}>
          <View style={{ backgroundColor: t.colors.surface, borderRadius: t.radius.lg, padding: 20 }} onStartShouldSetResponder={() => true}>
            <Text style={{ fontWeight: '700', fontSize: 18, color: t.colors.onSurface, textAlign: 'center', marginBottom: 12 }}>Select Currency</Text>
            {CURRENCY_OPTIONS.map((curr) => (
              <TouchableOpacity key={curr.value} onPress={() => handleCurrencyChange(curr)}
                style={{ paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: t.colors.outline }}>
                <Text style={{ color: currentCurrencyLabel === curr.label ? t.colors.primary : t.colors.onSurface, fontWeight: currentCurrencyLabel === curr.label ? '700' : '400', fontSize: 15, textAlign: 'center' }}>
                  {curr.label} {currentCurrencyLabel === curr.label ? '✓' : ''}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
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
  settingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  settingLabel: {},
  settingValue: {},
});
