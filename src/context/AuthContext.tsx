// src/context/AuthContext.tsx
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

export type Profile = {
  id: string;
  email: string;
  name?: string;
  goal?: '체중 감량' | '근육 증가' | '건강 관리' | '체력 향상';
  height?: number;
  weight?: number;
  targetWeight?: number;
};

type AuthContextType = {
  isLoading: boolean;      // 앱 부팅 중 세션 로딩
  session: Session | null;
  profile: Profile | null;
  signIn: (email: string, password: string) => Promise<void>;
  register: (data: Omit<Profile, 'id' | 'email'> & { email: string; password: string }) => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

function extractProfileFromUser(user: User | null): Profile | null {
  if (!user) return null;
  const m = (user.user_metadata ?? {}) as Record<string, any>;
  return {
    id: user.id,
    email: user.email ?? '',
    name: (m.name as string) ?? undefined,
    goal: (m.goal as Profile['goal']) ?? undefined,
    height: typeof m.height === 'number' ? m.height : undefined,
    weight: typeof m.weight === 'number' ? m.weight : undefined,
    targetWeight: typeof m.targetWeight === 'number' ? m.targetWeight : undefined,
  };
}

export function AuthProvider({ children }: React.PropsWithChildren) {
  const [bootLoading, setBootLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);

  // 앱 시작 시 세션/프로필 로드
  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session ?? null);
      setProfile(extractProfileFromUser(data.session?.user ?? null));
      setBootLoading(false);
    })();

    // 세션/유저 업데이트 감지
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s ?? null);
      setProfile(extractProfileFromUser(s?.user ?? null));
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  // 수동 새로고침
  const refreshProfile = async () => {
    const { data, error } = await supabase.auth.getUser();
    if (!error) setProfile(extractProfileFromUser(data.user ?? null));
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    setSession(data.session ?? null);
    setProfile(extractProfileFromUser(data.user ?? null));
  };

  const register = async (data: Omit<Profile, 'id' | 'email'> & { email: string; password: string }) => {
    const { email, password, ...rest } = data;
    const { data: signUpData, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: rest }, // ← name/goal/height/weight/targetWeight 가 user_metadata 로 저장됨
    });
    if (error) throw error;
    setSession(signUpData.session ?? null);
    setProfile(extractProfileFromUser(signUpData.user ?? null));
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setProfile(null);
  };

  const value = useMemo(
    () => ({
      isLoading: bootLoading,
      session,
      profile,
      signIn,
      register,
      signOut,
      refreshProfile,
    }),
    [bootLoading, session, profile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
