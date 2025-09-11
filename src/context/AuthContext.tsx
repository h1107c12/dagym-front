import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Profile = {
  name: string;
  email: string;
  goal?: '체중 감량' | '근육 증가' | '건강 관리' | '체력 향상';
  height?: number;
  weight?: number;
  targetWeight?: number;
};

type AuthContextType = {
  isLoading: boolean;
  isSignedIn: boolean;
  profile?: Profile | null;
  signIn: (email: string, password: string, remember: boolean) => Promise<void>;
  register: (data: Profile & { password: string }, remember: boolean) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

const TOKEN_KEY = 'auth:token';
const REMEMBER_KEY = 'auth:remember';
const PROFILE_KEY = 'auth:profile';

async function mockLogin(email: string, password: string): Promise<string> {
  // TODO: 실제 API 연동으로 교체
  await new Promise((r) => setTimeout(r, 500));
  if (!email || !password) throw new Error('이메일/비밀번호를 입력하세요.');
  return 'demo_token_' + Date.now();
}

async function mockRegister(): Promise<void> {
  // TODO: 실제 회원가입 API로 교체
  await new Promise((r) => setTimeout(r, 600));
}

export function AuthProvider({ children }: React.PropsWithChildren) {
  const [isLoading, setLoading] = useState(true);
  const [isSignedIn, setSignedIn] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const [token, remember, savedProfile] = await Promise.all([
          AsyncStorage.getItem(TOKEN_KEY),
          AsyncStorage.getItem(REMEMBER_KEY),
          AsyncStorage.getItem(PROFILE_KEY),
        ]);
        setSignedIn(Boolean(token && remember === 'true'));
        setProfile(savedProfile ? JSON.parse(savedProfile) : null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const signIn = async (email: string, password: string, remember: boolean) => {
    setLoading(true);
    try {
      const token = await mockLogin(email, password);
      await AsyncStorage.multiSet([
        [TOKEN_KEY, token],
        [REMEMBER_KEY, remember ? 'true' : 'false'],
      ]);
      // 프로필이 없다면 최소 email만 채워두기
      const existing = await AsyncStorage.getItem(PROFILE_KEY);
      if (!existing) {
        const prof: Profile = { email, name: email.split('@')[0] };
        await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(prof));
        setProfile(prof);
      } else {
        setProfile(JSON.parse(existing));
      }
      setSignedIn(true);
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: Profile & { password: string }, remember: boolean) => {
    setLoading(true);
    try {
      await mockRegister();
      const token = await mockLogin(data.email, data.password);
      const { password, ...profileForStore } = data;
      await AsyncStorage.multiSet([
        [TOKEN_KEY, token],
        [REMEMBER_KEY, remember ? 'true' : 'false'],
        [PROFILE_KEY, JSON.stringify(profileForStore)],
      ]);
      setProfile(profileForStore);
      setSignedIn(true);
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      await AsyncStorage.multiRemove([TOKEN_KEY, REMEMBER_KEY]);
      setSignedIn(false);
    } finally {
      setLoading(false);
    }
  };

  const value = useMemo(
    () => ({ isLoading, isSignedIn, profile, signIn, register, signOut }),
    [isLoading, isSignedIn, profile]
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
