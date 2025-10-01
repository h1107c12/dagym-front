// src/lib/supabase.ts
import 'react-native-url-polyfill/auto';
import 'react-native-get-random-values';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';

// 1) app.json > expo.extra 에서 먼저 읽고
// 2) 없다면 하드코딩 값으로 폴백 (당신이 준 URL/anon key)
const extra: any =
  Constants?.expoConfig?.extra ??
  Constants?.manifest?.extra ??
  {};

const supabaseUrl: string =
  extra.SUPABASE_URL ?? 'https://lvocdjtueqawkrqgtwaj.supabase.co';

const supabaseAnonKey: string =
  extra.SUPABASE_ANON_KEY ??
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx2b2NkanR1ZXFhd2tycWd0d2FqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkyNjIzMDUsImV4cCI6MjA3NDgzODMwNX0.D3DCo4wQlatEYXdHIzhMxXxL26qUIURz2onXyGhcf6E';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('[Supabase] URL/Anon Key가 없습니다. app.json > extra 확인하세요.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false, // RN 필수
  },
});

export default supabase;
