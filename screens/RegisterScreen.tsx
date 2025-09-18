// screens/RegisterScreen.tsx (goal grid vanish fix + animations intact)

import React, { useEffect, useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  View,
  Alert,
  ScrollView,
  Animated,
  Easing,
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
  start: { x: 0, y: 0 }, end: { x: 1, y: 1 },
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
const InputRow = styled.View` background: #f4f4f7; border-radius: 12px; padding: 12px; flex-direction: row; align-items: center; gap: 10px; `;
const TextInput = styled.TextInput` flex: 1; color: ${(p: { theme: DefaultTheme }) => p.theme.colors.text}; `;
const EyeBtn = styled.Pressable` padding: 4px; `;

/* ---------- Goals ---------- */
type GoalTP = { $active?: boolean };

const GoalGrid = styled.View` flex-direction: row; flex-wrap: wrap; gap: 12px; `;

/* 래퍼가 그리드의 직접 자식이라 폭을 가져야 함 */
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

/* ---------- Screen ---------- */
export default function RegisterScreen() {
  const { register, isLoading } = useAuth();
  const nav = useNavigation();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [showPw, setShowPw] = useState(false);

  // 초기엔 목표 미선택 → 신체정보 섹션 숨김
  const [goal, setGoal] = useState<GoalKey | undefined>(undefined);

  // 선택 입력: 비워두고 가이드
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [targetWeight, setTargetWeight] = useState('');

  /* ---- 신체정보 섹션 애니메이션 ---- */
  const sectionAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(sectionAnim, {
      toValue: goal ? 1 : 0,
      duration: 200,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();
  }, [goal, sectionAnim]);

  const sectionStyle = {
    opacity: sectionAnim,
    transform: [{ translateY: sectionAnim.interpolate({ inputRange: [0, 1], outputRange: [-6, 0] }) }],
  } as const;

  /* ---- 목표 카드 스프링 애니메이션 ---- */
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

  const onSubmit = () => {
    if (!name || !email || !pw) {
      return Alert.alert('안내', '이름/이메일/비밀번호는 필수 입력 항목입니다.');
    }
    const h = Number(height), w = Number(weight), t = Number(targetWeight);

    register(
      {
        name,
        email,
        password: pw,
        goal, // 선택값(없어도 가입 가능)
        height: isFinite(h) ? h : undefined,
        weight: isFinite(w) ? w : undefined,
        targetWeight: isFinite(t) ? t : undefined,
      },
      false
    );
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
              <InputRow>
                <Ionicons name="person-outline" size={16} color="#6E56CF" />
                <TextInput
                  placeholder="이름을 입력하세요"
                  placeholderTextColor="#AAB0BC"
                  value={name}
                  onChangeText={setName}
                  returnKeyType="next"
                />
              </InputRow>

              {/* 이메일 */}
              <Label>이메일</Label>
              <InputRow>
                <Ionicons name="mail-outline" size={16} color="#6E56CF" />
                <TextInput
                  placeholder="이메일을 입력하세요"
                  placeholderTextColor="#AAB0BC"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  value={email}
                  onChangeText={setEmail}
                  returnKeyType="next"
                />
              </InputRow>

              {/* 비밀번호 */}
              <Label>비밀번호</Label>
              <InputRow>
                <Ionicons name="lock-closed-outline" size={16} color="#6E56CF" />
                <TextInput
                  placeholder="8자 이상, 영문/숫자 조합을 권장해요"
                  placeholderTextColor="#AAB0BC"
                  secureTextEntry={!showPw}
                  value={pw}
                  onChangeText={setPw}
                />
                <EyeBtn onPress={() => setShowPw((v) => !v)}>
                  <Ionicons name={showPw ? 'eye' : 'eye-off'} size={18} color="#6E56CF" />
                </EyeBtn>
              </InputRow>

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

              {/* 신체 정보 섹션: 목표 선택 시에만 애니메이션 등장 */}
              {goal !== undefined ? (
                <Animated.View style={[{ marginTop: 14 }, sectionStyle]}>
                  <Label>신체 정보 (선택)</Label>
                  <Help>신체정보는 나중에 프로필에서 변경 가능합니다!</Help>
                  <Grid3>
                    <View style={{ flex: 1 }}>
                      <Label>키 (cm)</Label>
                      <NumBox>
                        <TextInput
                          keyboardType="numeric"
                          value={height}
                          onChangeText={setHeight}
                          placeholder="예: 170"
                          placeholderTextColor="#AAB0BC"
                        />
                      </NumBox>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Label>현재 체중 (kg)</Label>
                      <NumBox>
                        <TextInput
                          keyboardType="numeric"
                          value={weight}
                          onChangeText={setWeight}
                          placeholder="예: 70"
                          placeholderTextColor="#AAB0BC"
                        />
                      </NumBox>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Label>목표 체중 (kg)</Label>
                      <NumBox>
                        <TextInput
                          keyboardType="numeric"
                          value={targetWeight}
                          onChangeText={setTargetWeight}
                          placeholder="예: 65"
                          placeholderTextColor="#AAB0BC"
                        />
                      </NumBox>
                    </View>
                  </Grid3>
                </Animated.View>
              ) : null}

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
