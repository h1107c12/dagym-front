import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, View, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styled from 'styled-components/native';
import type { DefaultTheme } from 'styled-components/native';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useAuth } from '../src/context/AuthContext';
import appTheme from '../src/styles/theme';
import { useNavigation } from '@react-navigation/native';

const Bg = styled(LinearGradient).attrs((p: { theme: DefaultTheme }) => ({
  colors: ['#FFF7FF', '#F6F0FF'],
  start: { x: 0, y: 0 }, end: { x: 0, y: 1 },
}))` flex: 1; `;

const Page = styled(SafeAreaView)` flex: 1; padding: 20px 16px; `;
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
const InputRow = styled.View` background: #f4f4f7; border-radius: 12px; padding: 12px; flex-direction: row; align-items: center; gap: 10px; `;
const TextInput = styled.TextInput` flex: 1; color: ${(p: { theme: DefaultTheme }) => p.theme.colors.text}; `;
const EyeBtn = styled.Pressable` padding: 4px; `;

const GoalGrid = styled.View` flex-direction: row; flex-wrap: wrap; gap: 12px; `;
const GoalBtn = styled.Pressable<{ active?: boolean }>`
  flex: 1; min-width: 46%;
  border-radius: 12px; padding: 14px;
  background: ${(p) => (p.active ? '#F3EFFF' : '#FFFFFF')};
  border-width: 1px; border-color: ${(p) => (p.active ? '#6E56CF' : '#E5E7F0')};
  align-items: center; gap: 6px;
`;
const GoalText = styled.Text<{ active?: boolean }>` color: ${(p) => (p.active ? '#6E56CF' : '#333')}; font-weight: 700; `;

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

export default function RegisterScreen() {
  const { register, isLoading } = useAuth();
  const nav = useNavigation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [pw2, setPw2] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [showPw2, setShowPw2] = useState(false);
  const [goal, setGoal] = useState<'체중 감량' | '근육 증가' | '건강 관리' | '체력 향상' | undefined>('체중 감량');
  const [height, setHeight] = useState('170');
  const [weight, setWeight] = useState('70');
  const [targetWeight, setTargetWeight] = useState('65');

  const onSubmit = () => {
    if (!name || !email || !pw) return Alert.alert('안내', '필수 항목을 입력하세요.');
    if (pw !== pw2) return Alert.alert('안내', '비밀번호가 일치하지 않습니다.');
    const h = Number(height), w = Number(weight), t = Number(targetWeight);
    register(
      {
        name,
        email,
        password: pw,
        goal,
        height: isFinite(h) ? h : undefined,
        weight: isFinite(w) ? w : undefined,
        targetWeight: isFinite(t) ? t : undefined,
      },
      true // 기본으로 로그인 유지
    );
  };

  return (
    <Bg>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <Page>
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

            <Label>이름</Label>
            <InputRow>
              <Ionicons name="person-outline" size={16} color="#6E56CF" />
              <TextInput placeholder="이름을 입력하세요" placeholderTextColor="#AAB0BC" value={name} onChangeText={setName} />
            </InputRow>

            <Label>이메일</Label>
            <InputRow>
              <Ionicons name="mail-outline" size={16} color="#6E56CF" />
              <TextInput
                placeholder="이메일을 입력하세요" placeholderTextColor="#AAB0BC"
                autoCapitalize="none" keyboardType="email-address"
                value={email} onChangeText={setEmail}
              />
            </InputRow>

            <Label>비밀번호</Label>
            <InputRow>
              <Ionicons name="lock-closed-outline" size={16} color="#6E56CF" />
              <TextInput placeholder="비밀번호를 입력하세요" placeholderTextColor="#AAB0BC" secureTextEntry={!showPw} value={pw} onChangeText={setPw} />
              <EyeBtn onPress={() => setShowPw((v) => !v)}>
                <Ionicons name={showPw ? 'eye' : 'eye-off'} size={18} color="#6E56CF" />
              </EyeBtn>
            </InputRow>

            <Label>비밀번호 확인</Label>
            <InputRow>
              <Ionicons name="lock-closed-outline" size={16} color="#6E56CF" />
              <TextInput placeholder="비밀번호를 다시 입력하세요" placeholderTextColor="#AAB0BC" secureTextEntry={!showPw2} value={pw2} onChangeText={setPw2} />
              <EyeBtn onPress={() => setShowPw2((v) => !v)}>
                <Ionicons name={showPw2 ? 'eye' : 'eye-off'} size={18} color="#6E56CF" />
              </EyeBtn>
            </InputRow>

            <Label>건강 목표</Label>
            <GoalGrid>
              {(['체중 감량','근육 증가','건강 관리','체력 향상'] as const).map((g) => (
                <GoalBtn key={g} active={goal === g} onPress={() => setGoal(g)}>
                  <GoalText active={goal === g}>{g}</GoalText>
                </GoalBtn>
              ))}
            </GoalGrid>

            <Grid3>
              <View style={{ flex: 1 }}>
                <Label>키 (cm)</Label>
                <NumBox>
                  <TextInput keyboardType="numeric" value={height} onChangeText={setHeight} placeholder="170" placeholderTextColor="#AAB0BC" />
                </NumBox>
              </View>
              <View style={{ flex: 1 }}>
                <Label>현재 체중</Label>
                <NumBox>
                  <TextInput keyboardType="numeric" value={weight} onChangeText={setWeight} placeholder="70" placeholderTextColor="#AAB0BC" />
                </NumBox>
              </View>
              <View style={{ flex: 1 }}>
                <Label>목표 체중</Label>
                <NumBox>
                  <TextInput keyboardType="numeric" value={targetWeight} onChangeText={setTargetWeight} placeholder="65" placeholderTextColor="#AAB0BC" />
                </NumBox>
              </View>
            </Grid3>

            <GBtn onPress={onSubmit} disabled={isLoading} style={{ marginTop: 14 }}>
              <GFill><GText>{isLoading ? '처리 중...' : '다짐 시작하기'}</GText></GFill>
            </GBtn>

            <View style={{ marginTop: 12 }}>
              <Muted>이미 계정이 있으신가요?</Muted>
              <Pressable onPress={() => nav.goBack()}>
                <Link>로그인하기</Link>
              </Pressable>
            </View>
          </Card>
        </Page>
      </KeyboardAvoidingView>
    </Bg>
  );
}
