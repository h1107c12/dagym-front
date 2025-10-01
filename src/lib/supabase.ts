// src/lib/supabase.ts
import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'YOUR_SUPABASE_URL'; // 여기에 Supabase URL을 입력하세요.
const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY'; // 여기에 Supabase anon key를 입력하세요.

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage, // 세션을 저장할 스토리지 지정
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});