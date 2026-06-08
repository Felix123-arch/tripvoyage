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
  const { login, register, skipLogin } = useAuth();
  const { t: tx } = useLang();
  const [tab, setTab] = useState<'email' | 'phone'>('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{email?: string; password?: string; phone?: string; code?: string}>({});

  const handleEmailLogin = async () => {
    const errors: any = {};
    if (!email.trim()) errors.email = tx('fieldRequired');
    if (!password.trim()) errors.password = tx('fieldRequired');
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});
    setLoginError('');
    setLoading(true);
    try {
      await login(email.trim(), password);
    } catch (err: any) {
      const msg = err.response?.data?.error || err.message || tx('loginFailed');
      setLoginError(msg === 'Invalid credentials' ? tx('wrongCredentials') : msg);
    } finally {
      setLoading(false);
    }
  };

  const handleSendCode = async () => {
    if (!phone.trim() || phone.length < 10) {
      Alert.alert(tx('error'), tx('phoneRequired'));
      return;
    }
    // Mock: simulate sending code
    setCodeSent(true);
    Alert.alert(tx('codeSent'), '123456');
  };

  const handlePhoneLogin = async () => {
    const errors: any = {};
    if (!phone.trim() || phone.length < 10) errors.phone = tx('phoneRequired');
    if (!code.trim()) errors.code = tx('fieldRequired');
    if (code.length !== 6) errors.code = tx('invalidCode');
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});
    setLoginError('');
    setLoading(true);
    try {
      try {
        await login(`${phone.trim()}@phone.tripvoyage.app`, 'phone-user');
      } catch {
        try {
          await register({ email: `${phone.trim()}@phone.tripvoyage.app`, password: 'phone-user', displayName: `User ${phone.slice(-4)}` });
        } catch {
          setLoginError(tx('loginFailed'));
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    Alert.alert(provider, tx('socialComing'));
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        <Text style={[styles.logo, { color: theme.colors.primary }]}>TripVoyage</Text>
        <Text style={[styles.tagline, { color: theme.colors.onSurfaceVariant }]}>{tx('tagline')}</Text>

        {/* Login Method Tabs */}
        <View style={[styles.tabRow, { borderColor: theme.colors.outline }]}>
          <TouchableOpacity style={[styles.tab, tab === 'email' && { borderBottomColor: theme.colors.primary, borderBottomWidth: 2 }]} onPress={() => setTab('email')}>
            <Text style={{ color: tab === 'email' ? theme.colors.primary : theme.colors.onSurfaceMuted, fontWeight: '600', fontSize: 15 }}>{tx('email')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.tab, tab === 'phone' && { borderBottomColor: theme.colors.primary, borderBottomWidth: 2 }]} onPress={() => setTab('phone')}>
            <Text style={{ color: tab === 'phone' ? theme.colors.primary : theme.colors.onSurfaceMuted, fontWeight: '600', fontSize: 15 }}>{tx('phone')}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.form}>
          {loginError ? (
            <View style={[styles.errorBanner, { backgroundColor: theme.colors.errorContainer, borderRadius: theme.radius.sm }]}>
              <Text style={{ color: theme.colors.error, fontSize: 13, textAlign: 'center' }}>{loginError}</Text>
            </View>
          ) : null}
          {tab === 'email' ? (
            <>
              <TextInput
                style={[styles.input, { backgroundColor: theme.colors.surface, borderColor: fieldErrors.email ? theme.colors.error : theme.colors.outline, color: theme.colors.onSurface }]}
                placeholder={tx('email')} placeholderTextColor={theme.colors.onSurfaceMuted}
                value={email} onChangeText={(v) => { setEmail(v); setFieldErrors({}); setLoginError(''); }}
                keyboardType="email-address" autoCapitalize="none"
              />
              {fieldErrors.email ? <Text style={{ color: theme.colors.error, fontSize: 12, marginTop: -8 }}>{fieldErrors.email}</Text> : null}
              <TextInput
                style={[styles.input, { backgroundColor: theme.colors.surface, borderColor: fieldErrors.password ? theme.colors.error : theme.colors.outline, color: theme.colors.onSurface }]}
                placeholder={tx('password')} placeholderTextColor={theme.colors.onSurfaceMuted}
                value={password} onChangeText={(v) => { setPassword(v); setFieldErrors({}); setLoginError(''); }}
                secureTextEntry
              />
              {fieldErrors.password ? <Text style={{ color: theme.colors.error, fontSize: 12, marginTop: -8 }}>{fieldErrors.password}</Text> : null}
            </>
          ) : (
            <>
              <TextInput
                style={[styles.input, { backgroundColor: theme.colors.surface, borderColor: fieldErrors.phone ? theme.colors.error : theme.colors.outline, color: theme.colors.onSurface }]}
                placeholder={tx('phonePlaceholder')} placeholderTextColor={theme.colors.onSurfaceMuted}
                value={phone} onChangeText={(v) => { setPhone(v); setFieldErrors({}); setLoginError(''); }}
                keyboardType="phone-pad"
              />
              {fieldErrors.phone ? <Text style={{ color: theme.colors.error, fontSize: 12, marginTop: -8 }}>{fieldErrors.phone}</Text> : null}
              <View style={{ flexDirection: 'row', gap: 8 }}>
                <TextInput
                  style={[styles.input, { flex: 1, backgroundColor: theme.colors.surface, borderColor: fieldErrors.code ? theme.colors.error : theme.colors.outline, color: theme.colors.onSurface }]}
                  placeholder={tx('verifyCode')} placeholderTextColor={theme.colors.onSurfaceMuted}
                  value={code} onChangeText={(v) => { setCode(v); setFieldErrors({}); setLoginError(''); }}
                  keyboardType="number-pad" maxLength={6}
                />
                <TouchableOpacity style={[styles.codeBtn, { backgroundColor: codeSent ? theme.colors.onSurfaceMuted : theme.colors.primary, borderRadius: theme.radius.md }]} onPress={handleSendCode} disabled={codeSent}>
                  <Text style={{ color: '#FFF', fontWeight: '600', fontSize: 13 }}>{codeSent ? tx('codeResend') : tx('sendCode')}</Text>
                </TouchableOpacity>
              </View>
              {fieldErrors.code ? <Text style={{ color: theme.colors.error, fontSize: 12, marginTop: -8 }}>{fieldErrors.code}</Text> : null}
            </>
          )}

          <TouchableOpacity style={[styles.button, { backgroundColor: theme.colors.primary, borderRadius: theme.radius.md, opacity: loading ? 0.7 : 1 }]} onPress={tab === 'email' ? handleEmailLogin : handlePhoneLogin} disabled={loading} activeOpacity={0.8}>
            <Text style={styles.buttonText}>{loading ? tx('loggingIn') : tx('logIn')}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.linkBtn, { borderColor: theme.colors.outline, borderRadius: theme.radius.md }]} onPress={() => navigation.navigate('Register')}>
            <Text style={[styles.linkText, { color: theme.colors.primary }]}>{tx('createAccount')}</Text>
          </TouchableOpacity>

          {/* Social Login */}
          <View style={styles.socialSection}>
            <Text style={{ color: theme.colors.onSurfaceMuted, fontSize: 12, marginBottom: 12, textAlign: 'center' }}>{tx('socialLogin')}</Text>
            <View style={styles.socialRow}>
              <TouchableOpacity style={[styles.socialBtnWide, { backgroundColor: '#07C160' }]} onPress={() => handleSocialLogin('WeChat')}>
                <Text style={{ color: '#FFF', fontWeight: '700', fontSize: 14 }}>💬 WeChat</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.socialBtnWide, { backgroundColor: '#000000' }]} onPress={() => handleSocialLogin('Douyin')}>
                <Text style={{ color: '#FFF', fontWeight: '700', fontSize: 14 }}>🎵 Douyin</Text>
              </TouchableOpacity>
            </View>
          </View>

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
  tagline: { fontSize: 15, textAlign: 'center', marginBottom: 24 },
  tabRow: { flexDirection: 'row', borderBottomWidth: 1, marginBottom: 20 },
  tab: { flex: 1, paddingVertical: 10, alignItems: 'center' },
  form: { gap: 12 },
  input: { height: 48, borderWidth: 1, borderRadius: 12, paddingHorizontal: 16, fontSize: 16 },
  codeBtn: { width: 100, height: 48, justifyContent: 'center', alignItems: 'center' },
  button: { height: 48, justifyContent: 'center', alignItems: 'center' },
  buttonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
  linkBtn: { height: 48, justifyContent: 'center', alignItems: 'center', borderWidth: 1 },
  linkText: { fontSize: 15, fontWeight: '500' },
  socialSection: { marginTop: 16 },
  socialRow: { flexDirection: 'row', justifyContent: 'center', gap: 12 },
  socialBtnWide: { flex: 1, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
  socialBtn: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center' },
  errorBanner: { padding: 10, marginBottom: 4 },
  skipBtn: { alignItems: 'center', paddingVertical: 12 },
  skipText: { fontSize: 14 },
});
