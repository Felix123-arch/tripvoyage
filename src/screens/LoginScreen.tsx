import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { useLang } from '../contexts/LanguageContext';
import { useTheme } from '../theme';

interface Props {
  navigation: any;
}

export function LoginScreen({ navigation }: Props) {
  const theme = useTheme();
  const { login, skipLogin } = useAuth();
  const { t: tx } = useLang();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert(tx('error'), tx('emailPasswordRequired'));
      return;
    }
    setLoading(true);
    try {
      await login(email.trim(), password);
    } catch (err: any) {
      const msg = err.response?.data?.error || err.message || tx('loginFailed');
      Alert.alert(tx('loginError'), msg);
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
        <Text style={[styles.tagline, { color: theme.colors.onSurfaceVariant }]}>
          {tx('tagline')}
        </Text>

        <View style={styles.form}>
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
            placeholder={tx('password')}
            placeholderTextColor={theme.colors.onSurfaceMuted}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity
            style={[styles.button, { backgroundColor: theme.colors.primary, borderRadius: theme.radius.md, opacity: loading ? 0.7 : 1 }]}
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>{loading ? tx('loggingIn') : tx('logIn')}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.linkBtn, { borderColor: theme.colors.outline, borderRadius: theme.radius.md }]}
            onPress={() => navigation.navigate('Register')}
          >
            <Text style={[styles.linkText, { color: theme.colors.primary }]}>{tx('createAccount')}</Text>
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
