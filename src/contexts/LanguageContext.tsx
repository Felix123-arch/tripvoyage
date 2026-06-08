import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Platform } from 'react-native';
import { Lang, t as translate } from '../i18n/translations';
import { useAuth } from './AuthContext';
import { getItem, setItem } from '../utils/storage';

interface LanguageState {
  lang: Lang;
  t: (key: string) => string;
  setLang: (lang: Lang) => void;
}

const LanguageContext = createContext<LanguageState>({
  lang: 'en',
  t: (key: string) => key,
  setLang: () => {},
});

const LANG_KEY = 'tripvoyage_lang';

async function getStoredLang(): Promise<Lang | null> {
  const stored = await getItem(LANG_KEY);
  if (stored === 'zh' || stored === 'en') return stored;
  return null;
}

async function storeLang(lang: Lang) {
  await setItem(LANG_KEY, lang);
}

// Map user language string to Lang
function userLangToCode(langStr?: string): Lang | null {
  if (!langStr) return null;
  if (langStr.startsWith('中文')) return 'zh';
  if (langStr === 'English') return 'en';
  return null;
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [lang, setLangState] = useState<Lang>('en');

  useEffect(() => {
    (async () => {
      const stored = await getStoredLang();
      if (stored) {
        setLangState(stored);
      } else if (Platform.OS === 'web' && navigator.language.startsWith('zh')) {
        setLangState('zh');
      }
    })();
  }, []);

  // Sync with user profile language
  useEffect(() => {
    if (user?.language) {
      const code = userLangToCode(user.language);
      if (code && code !== lang) {
        setLangState(code);
        storeLang(code);
      }
    }
  }, [user?.language]);

  const setLang = useCallback((newLang: Lang) => {
    setLangState(newLang);
    storeLang(newLang).catch(() => {});
  }, []);

  const t = useCallback((key: string) => translate(lang, key), [lang]);

  return (
    <LanguageContext.Provider value={{ lang, t, setLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  return useContext(LanguageContext);
}
