// screens/RegisterScreen.tsx
// - TS7006 fix: onChangeText 파라미터에 (v: string) 명시
// - 필드별 유효성 검사 + 에러 텍스트/테두리 강조
// - 신체정보 섹션 항상 표시 (애니메이션/조건부 렌더 제거)
// - 비번 재입력 없음, 신체정보는 선택 입력

import React, { useEffect, useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  View,
  ScrollView,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styled from 'styled-components/native';
import type { DefaultTheme } from 'styled-components/native';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useAuth } from '../src/context/AuthContext';
import appTheme from '../src/styles/theme';
import { useNavigation } from '@react-navigation/native';

/* ---------- Layout / UI ---------- */
const Bg = styled(LinearGradient).attrs((p: { theme: DefaultTheme }) => ({
  colors: ['#FFF7FF', '#F6F0FF'],
  start: { x: 0, y: 0 }, end: { x: 0, y: 1 },
}))` flex: 1; `;

const Page = styled(SafeAreaView)` flex: 1; `;

const Container = styled(ScrollView).attrs({
  contentContainerStyle: {
    paddingTop: 20,
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  keyboardShouldPersistTaps: 'handled',
})` flex: 1; `;

const Center = styled.View` align-items: center; margin: 12px 0 18px; `;
const AppMark = styled(LinearGradient).attrs((p: { theme: DefaultTheme }) => ({
  colors: [p.theme.colors.gradientFrom, p.theme.colors.gradientTo],
  start: { x: 0, y: 0 }, end: { x: 1, y: 1 },
}))` width: 64px; height: 64px; border-radius: 16px; align-items: center; justify-content: center; `;
const AppMarkText = styled.Text` color: #fff; font-weight: 800; font-size: 20px; `;
const AppTitle = styled.Text` margin-top: 16px; color: ${(p: { theme: DefaultTheme }) => p.theme.colors.text}; font-size: 28px; font-weight: 900; `;
const AppSub = styled.Text` color: ${(p: { theme: DefaultTheme }) => p.theme.colors.muted}; margin-top: 6px; `;

const Card = styled.View`
  background: ${(p: { theme: DefaultTheme }) => p.theme.colors.surface};
  border-radius: 18px; padding: 18px;
`;

const HRow = styled.View` align-items: center; gap: 6px; margin-bottom: 8px; `;
const Title = styled.Text` color: #6e56cf; font-weight: 900; font-size: 16px; `;
const Subtitle = styled.Text` color: ${(p: { theme: DefaultTheme }) => p.theme.colors.muted}; font-size: 13px; text-align: center; `;

const Label = styled.Text` color: ${(p: { theme: DefaultTheme }) => p.theme.colors.text}; font-weight: 800; margin: 12px 0 6px; `;
const Help = styled.Text` color: #9aa0a6; font-size: 12px; margin-top: 2px; `;
const ErrorText = styled.Text` color: #ef4444; font-size: 12px; margin-top: 6px; `;

type Errorable = { $error?: boolean };
const InputRow = styled.View<Errorable>`
  background: #f4f4f7;
  border-radius: 12px;
  padding: 12px;
  flex-direction: row;
  align-items: center;
  gap: 10px;
  border-width: 1px;
  border-color: ${({ $error }: Errorable) => ($error ? '#ef4444' : 'transparent')};
`;
const TextInput = styled.TextInput` flex: 1; color: ${(p: { theme: DefaultTheme }) => p.theme.colors.text}; `;
const EyeBtn = styled.Pressable` padding: 4px; `;

/* ---------- Goals ---------- */
type GoalTP = { $active?: boolean };

const GoalGrid = styled.View` flex-direction: row; flex-wrap: wrap; gap: 12px; `;

const GoalWrap = styled(Animated.View)`
  flex: 1;
  min-width: 48%;
`;

const GoalBtn = styled.Pressable<GoalTP>`
  width: 100%;
  border-radius: 12px; padding: 14px;
  background: ${({ $active }: GoalTP) => ($active ? '#F3EFFF' : '#FFFFFF')};
  border-width: 1px; border-color: ${({ $active }: GoalTP) => ($active ? '#6E56CF' : '#E5E7F0')};
  align-items: center; gap: 6px;
`;

const GoalEmoji = styled.Text` font-size: 18px; `;
const GoalText = styled.Text<GoalTP>`
  color: ${({ $active }: GoalTP) => ($active ? '#6E56CF' : '#333')};
  font-weight: 700;
`;

const Grid3 = styled.View` flex-direction: row; gap: 10px; margin-top: 10px; `;
const NumBox = styled(InputRow)` flex: 1; `;

const GBtn = styled.Pressable``;
const GFill = styled(LinearGradient).attrs((p: { theme: DefaultTheme }) => ({
  colors: [p.theme.colors.gradientFrom, p.theme.colors.gradientTo],
  start: { x: 0, y: 0 }, end: { x: 1, y: 1 },
}))` height: 48px; border-radius: 12px; align-items: center; justify-content: center; `;
const GText = styled.Text` color: #fff; font-weight: 800; `;

const Link = styled.Text` color: #6e56cf; font-weight: 700; margin-top: 8px; text-align: center; `;
const Muted = styled.Text` color: #9aa0a6; text-align: center; `;

/* ---------- Data ---------- */
const GOAL_OPTIONS = [
  { key: '체중 감량', emoji: '⚖️' },
  { key: '근육 증가',  emoji: '🏋️' },
  { key: '건강 관리',  emoji: '❤️' },
  { key: '체력 향상',  emoji: '🤸' },
] as const;
type GoalKey = typeof GOAL_OPTIONS[number]['key'];

/* ---------- Helpers ---------- */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const hasLetter = /[A-Za-z]/;
const hasNumber = /[0-9]/;

function parseNum(v: string) {
  const n = Number(v.replace(',', '.'));
  return Number.isFinite(n) ? n : NaN;
}

/* ---------- Screen ---------- */
export default function RegisterScreen() {
  const { register, isLoading } = useAuth();
  const nav = useNavigation();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const [pw, setPw] = useState('');
  const [showPw, setShowPw] = useState(false);

  const [goal, setGoal] = useState<GoalKey | undefined>(undefined);

  // 선택 입력
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [targetWeight, setTargetWeight] = useState('');

  type Errors = Partial<{
    name: string;
    email: string;
    password: string;
    height: string;
    weight: string;
    targetWeight: string;
  }>;
  const [errors, setErrors] = useState<Errors>({});

  /* 목표 카드 스프링 */
  const goalAnimsRef = useRef<Record<GoalKey, Animated.Value>>(
    GOAL_OPTIONS.reduce((acc, cur) => {
      acc[cur.key] = new Animated.Value(0);
      return acc;
    }, {} as Record<GoalKey, Animated.Value>)
  );
  const goalAnims = goalAnimsRef.current;

  useEffect(() => {
    GOAL_OPTIONS.forEach(({ key }) => {
      Animated.spring(goalAnims[key], {
        toValue: key === goal ? 1 : 0,
        friction: 6,
        tension: 160,
        useNativeDriver: true,
      }).start();
    });
  }, [goal, goalAnims]);

  /* Submit */
  const onSubmit = () => {
    const next: Errors = {};

    if (!name.trim()) next.name = '이름을 입력해주세요.';
    if (!email.trim()) next.email = '이메일을 입력해주세요.';
    else if (!EMAIL_RE.test(email.trim())) next.email = '이메일 형식이 올바르지 않아요.';

    if (!pw) next.password = '비밀번호를 입력해주세요.';
    else if (pw.length < 8 || !hasLetter.test(pw) || !hasNumber.test(pw))
      next.password = '8자 이상, 영문과 숫자를 포함해 주세요.';

    if (height.trim()) {
      const h = parseNum(height);
      if (Number.isNaN(h)) next.height = '숫자만 입력해 주세요.';
      else if (h < 100 || h > 250) next.height = '키는 100–250cm 사이로 입력해 주세요.';
    }
    if (weight.trim()) {
      const w = parseNum(weight);
      if (Number.isNaN(w)) next.weight = '숫자만 입력해 주세요.';
      else if (w < 30 || w > 250) next.weight = '현재 체중은 30–250kg 사이가 좋아요.';
    }
    if (targetWeight.trim()) {
      const t = parseNum(targetWeight);
      if (Number.isNaN(t)) next.targetWeight = '숫자만 입력해 주세요.';
      else if (t < 20 || t > 300) next.targetWeight = '목표 체중은 20–300kg 사이로 입력해 주세요.';
    }

    setErrors(next);
    if (Object.keys(next).length > 0) return;

    const h = parseNum(height), w = parseNum(weight), t = parseNum(targetWeight);

    // ✅ Supabase AuthContext는 인자 1개만 받음
    register({
      name: name.trim(),
      email: email.trim(),
      password: pw,
      goal,
      height: height.trim() ? (Number.isNaN(h) ? undefined : h) : undefined,
      weight: weight.trim() ? (Number.isNaN(w) ? undefined : w) : undefined,
      targetWeight: targetWeight.trim() ? (Number.isNaN(t) ? undefined : t) : undefined,
    });
  };

  const clearErr = (k: keyof Errors) => () => {
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }));
  };

  return (
    <Bg>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 12 : 0}
      >
        <Page>
          <Container>
            <Center>
              <AppMark><AppMarkText>다</AppMarkText></AppMark>
              <AppTitle>다짐</AppTitle>
              <AppSub>AI와 함께하는 건강한 다짐</AppSub>
            </Center>

            <Card style={appTheme.shadow.card}>
              <HRow>
                <Ionicons name="sparkles" size={18} color="#6E56CF" />
                <Title>회원가입</Title>
              </HRow>
              <Subtitle>건강한 여정을 시작해보세요</Subtitle>

              {/* 이름 */}
              <Label>이름</Label>
              <InputRow $error={!!errors.name}>
                <Ionicons name="person-outline" size={16} color="#6E56CF" />
                <TextInput
                  placeholder="이름을 입력하세요"
                  placeholderTextColor="#AAB0BC"
                  value={name}
                  onChangeText={(v: string) => { setName(v); if (errors.name) clearErr('name')(); }}
                  returnKeyType="next"
                />
              </InputRow>
              {errors.name ? <ErrorText>{errors.name}</ErrorText> : null}

              {/* 이메일 */}
              <Label>이메일</Label>
              <InputRow $error={!!errors.email}>
                <Ionicons name="mail-outline" size={16} color="#6E56CF" />
                <TextInput
                  placeholder="이메일을 입력하세요"
                  placeholderTextColor="#AAB0BC"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  value={email}
                  onChangeText={(v: string) => { setEmail(v); if (errors.email) clearErr('email')(); }}
                  returnKeyType="next"
                />
              </InputRow>
              {errors.email ? <ErrorText>{errors.email}</ErrorText> : null}

              {/* 비밀번호 */}
              <Label>비밀번호</Label>
              <InputRow $error={!!errors.password}>
                <Ionicons name="lock-closed-outline" size={16} color="#6E56CF" />
                <TextInput
                  placeholder="8자 이상, 영문/숫자 조합을 권장해요"
                  placeholderTextColor="#AAB0BC"
                  secureTextEntry={!showPw}
                  value={pw}
                  onChangeText={(v: string) => { setPw(v); if (errors.password) clearErr('password')(); }}
                />
                <EyeBtn onPress={() => setShowPw((v) => !v)}>
                  <Ionicons name={showPw ? 'eye' : 'eye-off'} size={18} color="#6E56CF" />
                </EyeBtn>
              </InputRow>
              {errors.password ? <ErrorText>{errors.password}</ErrorText> : <Help>신체 정보는 선택 입력이며 언제든 수정할 수 있어요.</Help>}

              {/* 건강 목표 */}
              <Label style={{ marginTop: 14 }}>건강 목표</Label>
              <GoalGrid>
                {GOAL_OPTIONS.map(({ key, emoji }) => {
                  const active = goal === key;
                  const scale = goalAnims[key].interpolate({ inputRange: [0, 1], outputRange: [1, 1.03] });
                  return (
                    <GoalWrap key={key} style={{ transform: [{ scale }] }}>
                      <GoalBtn
                        $active={active}
                        onPress={() => setGoal(key)}
                        android_ripple={{ color: '#ece9ff' }}
                      >
                        <GoalEmoji>{emoji}</GoalEmoji>
                        <GoalText $active={active}>{key}</GoalText>
                      </GoalBtn>
                    </GoalWrap>
                  );
                })}
              </GoalGrid>

              {/* 신체 정보 섹션: 항상 표시 */}
              <View style={{ marginTop: 14 }}>
                <Label>신체 정보 (선택)</Label>
                <Help>입력 안 해도 가입 가능해요. 나중에 프로필에서 수정할 수 있어요.</Help>
                <Grid3>
                  <View style={{ flex: 1 }}>
                    <Label>키 (cm)</Label>
                    <NumBox $error={!!errors.height}>
                      <TextInput
                        keyboardType="numeric"
                        value={height}
                        onChangeText={(v: string) => { setHeight(v); if (errors.height) clearErr('height')(); }}
                        placeholder="예: 170"
                        placeholderTextColor="#AAB0BC"
                      />
                    </NumBox>
                    {errors.height ? <ErrorText>{errors.height}</ErrorText> : null}
                  </View>
                  <View style={{ flex: 1 }}>
                    <Label>현재 체중 (kg)</Label>
                    <NumBox $error={!!errors.weight}>
                      <TextInput
                        keyboardType="numeric"
                        value={weight}
                        onChangeText={(v: string) => { setWeight(v); if (errors.weight) clearErr('weight')(); }}
                        placeholder="예: 70"
                        placeholderTextColor="#AAB0BC"
                      />
                    </NumBox>
                    {errors.weight ? <ErrorText>{errors.weight}</ErrorText> : null}
                  </View>
                  <View style={{ flex: 1 }}>
                    <Label>목표 체중 (kg)</Label>
                    <NumBox $error={!!errors.targetWeight}>
                      <TextInput
                        keyboardType="numeric"
                        value={targetWeight}
                        onChangeText={(v: string) => { setTargetWeight(v); if (errors.targetWeight) clearErr('targetWeight')(); }}
                        placeholder="예: 65"
                        placeholderTextColor="#AAB0BC"
                      />
                    </NumBox>
                    {errors.targetWeight ? <ErrorText>{errors.targetWeight}</ErrorText> : null}
                  </View>
                </Grid3>
              </View>

              {/* CTA */}
              <GBtn onPress={onSubmit} disabled={isLoading} style={{ marginTop: 16 }}>
                <GFill><GText>{isLoading ? '처리 중...' : '다짐 시작하기'}</GText></GFill>
              </GBtn>

              {/* 로그인 링크 */}
              <View style={{ marginTop: 12 }}>
                <Muted>이미 계정이 있으신가요?</Muted>
                <Pressable onPress={() => nav.goBack()}>
                  <Link>로그인하기</Link>
                </Pressable>
              </View>
            </Card>
          </Container>
        </Page>
      </KeyboardAvoidingView>
    </Bg>
  );
}
