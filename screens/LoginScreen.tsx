import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, Switch, View } from 'react-native';
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

const Page = styled(SafeAreaView)` flex: 1; padding: 20px 16px; justify-content: center; `;
const Center = styled.View` align-items: center; margin-bottom: 18px; `;
const AppMark = styled(LinearGradient).attrs((p: { theme: DefaultTheme }) => ({
  colors: [p.theme.colors.gradientFrom, p.theme.colors.gradientTo],
  start: { x: 0, y: 0 }, end: { x: 1, y: 1 },
}))` width: 64px; height: 64px; border-radius: 16px; align-items: center; justify-content: center; `;
const AppMarkText = styled.Text` color: #fff; font-weight: 800; font-size: 20px; `;
const AppTitle = styled.Text` margin-top: 16px; color: ${(p: { theme: DefaultTheme }) => p.theme.colors.text}; font-size: 28px; font-weight: 900; `;
const AppSub = styled.Text` color: ${(p: { theme: DefaultTheme }) => p.theme.colors.muted}; margin-top: 6px; `;

const Card = styled.View` background: ${(p: { theme: DefaultTheme }) => p.theme.colors.surface}; border-radius: 18px; padding: 18px; `;
const CardTitleRow = styled.View` align-items: center; gap: 6px; margin-bottom: 8px; `;
const Title = styled.Text` color: #6e56cf; font-weight: 900; font-size: 16px; `;
const Subtitle = styled.Text` color: ${(p: { theme: DefaultTheme }) => p.theme.colors.muted}; font-size: 13px; text-align: center; `;

const Label = styled.Text` color: ${(p: { theme: DefaultTheme }) => p.theme.colors.text}; font-weight: 800; margin: 12px 0 6px; `;
const InputRow = styled.View` background: #f4f4f7; border-radius: 12px; padding: 12px; flex-direction: row; align-items: center; gap: 10px; `;
const TextInput = styled.TextInput` flex: 1; color: ${(p: { theme: DefaultTheme }) => p.theme.colors.text}; `;
const EyeBtn = styled.Pressable` padding: 4px; `;

const GBtn = styled.Pressable``;
const GFill = styled(LinearGradient).attrs((p: { theme: DefaultTheme }) => ({
  colors: [p.theme.colors.gradientFrom, p.theme.colors.gradientTo],
  start: { x: 0, y: 0 }, end: { x: 1, y: 1 },
}))` height: 44px; border-radius: 12px; align-items: center; justify-content: center; `;
const GText = styled.Text` color: #fff; font-weight: 800; `;

const Link = styled.Text` color: #6e56cf; font-weight: 700; `;
const Muted = styled.Text` color: #9aa0a6; `;

const DemoCard = styled.View` background: #eef3ff; border-radius: 16px; padding: 16px; margin-top: 14px; border: 1px solid #cfe0ff; `;
const DemoBtn = styled.Pressable` background: #ffffff; border: 1px solid #dbe2ff; padding: 10px 14px; border-radius: 10px; align-self: center; margin-top: 10px; `;
const DemoText = styled.Text` color: #3b57f0; font-weight: 800; `;

export default function LoginScreen() {
  const { isLoading, signIn } = useAuth();
  const nav = useNavigation();                // ✅ 여기에서 훅 호출
  const [email, setEmail] = useState('');
  theconst [pw, setPw] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [remember, setRemember] = useState(true);

  const onLogin = () => signIn(email.trim(), pw, remember);

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
            <CardTitleRow>
              <Ionicons name="sparkles" size={18} color="#6E56CF" />
              <Title>로그인</Title>
            </CardTitleRow>
            <Subtitle>다시 만나서 반가워요!</Subtitle>

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

            <Label>비밀번호</Label>
            <InputRow>
              <Ionicons name="lock-closed-outline" size={16} color="#6E56CF" />
              <TextInput
                placeholder="비밀번호를 입력하세요"
                placeholderTextColor="#AAB0BC"
                secureTextEntry={!showPw}
                value={pw}
                onChangeText={setPw}
              />
              <EyeBtn onPress={() => setShowPw((v) => !v)}>
                <Ionicons name={showPw ? 'eye' : 'eye-off'} size={18} color="#6E56CF" />
              </EyeBtn>
            </InputRow>

            {/* 로그인 유지 */}
            <View style={{ marginTop: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <Muted>로그인 유지</Muted>
              <Switch value={remember} onValueChange={setRemember} />
            </View>

            <GBtn onPress={onLogin} disabled={isLoading} style={{ marginTop: 12 }}>
              <GFill><GText>{isLoading ? '로그인 중...' : '로그인'}</GText></GFill>
            </GBtn>

            {/* ✅ 이 블록은 컴포넌트 내부에 있어야 함 */}
            <View style={{ alignItems: 'center', marginTop: 14, gap: 6 }}>
              <Muted>아직 계정이 없으신가요?</Muted>
              <Pressable onPress={() => nav.navigate('Register' as never)}>
                <Link>회원가입하기</Link>
              </Pressable>
              <Muted style={{ marginTop: 4 }}>비밀번호를 잊으셨나요?</Muted>
            </View>
          </Card>

          <DemoCard style={appTheme.shadow.card}>
            <Muted style={{ textAlign: 'center' }}>빠른 체험을 위한 데모 로그인</Muted>
            <DemoBtn onPress={() => signIn('demo@fitmind.ai', '1234', true)}>
              <DemoText>체험하기</DemoText>
            </DemoBtn>
          </DemoCard>
        </Page>
      </KeyboardAvoidingView>
    </Bg>
  );
}
