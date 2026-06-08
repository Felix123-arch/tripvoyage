import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { useLang } from '../contexts/LanguageContext';
import { useTheme } from '../theme';

interface Props {
  navigation: any;
}

export function RegisterScreen({ navigation }: Props) {
  const theme = useTheme();
  const { register, skipLogin } = useAuth();
  const { t: tx } = useLang();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!displayName.trim() || !email.trim() || !password) {
      Alert.alert(tx('error'), tx('fillAllFields'));
      return;
    }
    if (password !== confirm) {
      Alert.alert(tx('error'), tx('passwordsMismatch'));
      return;
    }
    if (password.length < 8) {
      Alert.alert(tx('error'), tx('passwordMinLength'));
      return;
    }
    setLoading(true);
    try {
      await register({ email: email.trim(), password, displayName: displayName.trim() });
    } catch (err: any) {
      const msg = err.response?.data?.error || err.message || tx('registerFailed');
      Alert.alert(tx('error'), msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        <Text style={[styles.logo, { color: theme.colors.primary }]}>TripVoyage</Text>
        <Text style={[styles.tagline, { color: theme.colors.onSurfaceVariant }]}>{tx('registerTagline')}</Text>

        <View style={styles.form}>
          <TextInput
            style={[styles.input, { backgroundColor: theme.colors.surface, borderColor: theme.colors.outline, color: theme.colors.onSurface }]}
            placeholder={tx('displayName')}
            placeholderTextColor={theme.colors.onSurfaceMuted}
            value={displayName}
            onChangeText={setDisplayName}
            autoCapitalize="words"
          />
          <TextInput
            style={[styles.input, { backgroundColor: theme.colors.surface, borderColor: theme.colors.outline, color: theme.colors.onSurface }]}
            placeholder={tx('email')}
            placeholderTextColor={theme.colors.onSurfaceMuted}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
          <TextInput
            style={[styles.input, { backgroundColor: theme.colors.surface, borderColor: theme.colors.outline, color: theme.colors.onSurface }]}
            placeholder={tx('password') + ' (' + tx('passwordMinLength') + ')'}
            placeholderTextColor={theme.colors.onSurfaceMuted}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <TextInput
            style={[styles.input, { backgroundColor: theme.colors.surface, borderColor: theme.colors.outline, color: theme.colors.onSurface }]}
            placeholder={tx('confirmPassword')}
            placeholderTextColor={theme.colors.onSurfaceMuted}
            value={confirm}
            onChangeText={setConfirm}
            secureTextEntry
          />

          <TouchableOpacity
            style={[styles.button, { backgroundColor: theme.colors.primary, borderRadius: theme.radius.md, opacity: loading ? 0.7 : 1 }]}
            onPress={handleRegister}
            disabled={loading}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>{loading ? tx('registering') : tx('createAccount')}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.linkBtn, { borderColor: theme.colors.outline, borderRadius: theme.radius.md }]}
            onPress={() => navigation.goBack()}
          >
            <Text style={[styles.linkText, { color: theme.colors.primary }]}>{tx('alreadyAccount')}</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={skipLogin} style={styles.skipBtn}>
            <Text style={[styles.skipText, { color: theme.colors.onSurfaceMuted }]}>{tx('continueGuest')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, justifyContent: 'center', paddingHorizontal: 32 },
  logo: { fontSize: 32, fontWeight: '700', textAlign: 'center', marginBottom: 8 },
  tagline: { fontSize: 15, textAlign: 'center', marginBottom: 40 },
  form: { gap: 14 },
  input: {
    height: 48,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  button: {
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 4,
  },
  buttonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
  linkBtn: {
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  linkText: { fontSize: 15, fontWeight: '500' },
  skipBtn: { alignItems: 'center', paddingVertical: 12 },
  skipText: { fontSize: 14 },
});
