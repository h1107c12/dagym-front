// screens/LoginScreen.tsx
import React, { useMemo, useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Switch,
  View,
  Animated,
  Modal,
  Easing,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styled from 'styled-components/native';
import type { DefaultTheme } from 'styled-components/native';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from '@expo/vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../src/context/AuthContext';
import appTheme from '../src/styles/theme';
import { useNavigation } from '@react-navigation/native';
import ErrorInline from './ErrorInline';

/* ---------- Layout ---------- */
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

/* ---------- Empty Modal ---------- */
const Backdrop = styled(Pressable)` position: absolute; inset: 0; background-color: rgba(0,0,0,0.45); `;
const ModalCard = styled(Animated.View)`
  width: 86%;
  max-width: 420px;
  align-self: center;
  border-radius: 18px;
  padding: 18px;
  background: #ffffff;
  overflow: hidden;
`;
const ModalIconWrap = styled(LinearGradient).attrs((p: { theme: DefaultTheme }) => ({
  colors: [p.theme.colors.gradientFrom, p.theme.colors.gradientTo],
  start: { x: 0, y: 0 }, end: { x: 1, y: 1 },
}))` width: 56px; height: 56px; border-radius: 28px; align-items: center; justify-content: center; align-self: center; `;
const ModalTitle = styled.Text` margin-top: 12px; font-weight: 900; font-size: 18px; text-align: center; color: #222; `;
const ModalDesc = styled.Text` margin-top: 6px; font-size: 13px; line-height: 18px; text-align: center; color: #6b7280; `;
const ModalBtn = styled(Pressable)` margin-top: 14px; align-self: center; width: 100%; `;
const ModalBtnFill = styled(GFill)` height: 42px; `;
const Spacer = styled.View` height: 10px; `;

const REMEMBER_KEY = 'auth:remember';

export default function LoginScreen() {
  const { signIn } = useAuth();
  const nav = useNavigation();

  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [remember, setRemember] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // 빈칸 모달
  const [showEmptyModal, setShowEmptyModal] = useState(false);
  const overlayAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.96)).current;

  const openEmptyModal = () => {
    setShowEmptyModal(true);
    overlayAnim.setValue(0);
    scaleAnim.setValue(0.96);
    Animated.parallel([
      Animated.timing(overlayAnim, { toValue: 1, duration: 160, easing: Easing.out(Easing.quad), useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, friction: 7, tension: 120, useNativeDriver: true }),
    ]).start();
  };
  const closeEmptyModal = () => {
    Animated.parallel([
      Animated.timing(overlayAnim, { toValue: 0, duration: 120, easing: Easing.in(Easing.quad), useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 0.96, duration: 120, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
    ]).start(({ finished }) => { if (finished) setShowEmptyModal(false); });
  };
  const overlayStyle = useMemo(() => ({ opacity: overlayAnim }), [overlayAnim]);
  const cardStyle = useMemo(() => ({ transform: [{ scale: scaleAnim }] }), [scaleAnim]);

  // 에러 상태 (카드 내부 상단)
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const clearError = () => setErrorMsg(null);

  const onLogin = async () => {
    const emailTrimmed = email.trim();
    if (!emailTrimmed || !pw) {
      openEmptyModal();
      return;
    }
    setSubmitting(true);
    clearError();
    try {
      await signIn(emailTrimmed, pw);
      await AsyncStorage.setItem(REMEMBER_KEY, remember ? 'true' : 'false');
    } catch (e: any) {
      const status: number | undefined = typeof e?.status === 'number' ? e.status : undefined;
      if (status === 400 || status === 401) setErrorMsg('이메일 또는 비밀번호가 올바르지 않습니다');
      else setErrorMsg('서버와 통신하지 못했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setSubmitting(false);
    }
  };

  // 타이핑 시작하면 에러 즉시 숨김
  const onChangeEmail = (v: string) => { if (errorMsg) clearError(); setEmail(v); };
  const onChangePw    = (v: string) => { if (errorMsg) clearError(); setPw(v); };

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
            <Subtitle>만나서 반가워요!</Subtitle>

            {/* 👇 폼 내부 상단 에러 박스 */}
            <View style={{ marginTop: 12 }}>
              <ErrorInline visible={!!errorMsg} message={errorMsg ?? ''} onClose={clearError} />
              {/* 여백은 일반 View로만 (애니메이션 X) */}
              {errorMsg ? <View style={{ height: 12 }} /> : null}
            </View>

            <Label>이메일</Label>
            <InputRow>
              <Ionicons name="mail-outline" size={16} color="#6E56CF" />
              <TextInput
                placeholder="이메일을 입력하세요"
                placeholderTextColor="#AAB0BC"
                autoCapitalize="none"
                keyboardType="email-address"
                value={email}
                onChangeText={onChangeEmail}
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
                onChangeText={onChangePw}
              />
              <EyeBtn onPress={() => setShowPw((v) => !v)}>
                <Ionicons name={showPw ? 'eye' : 'eye-off'} size={18} color="#6E56CF" />
              </EyeBtn>
            </InputRow>

            <View style={{ marginTop: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <Muted>로그인 유지</Muted>
              <Switch value={remember} onValueChange={setRemember} />
            </View>

            <GBtn onPress={onLogin} disabled={submitting} style={{ marginTop: 12 }}>
              <GFill><GText>{submitting ? '로그인 중...' : '로그인'}</GText></GFill>
            </GBtn>

            <View style={{ alignItems: 'center', marginTop: 14, gap: 6 }}>
              <Muted>아직 계정이 없으신가요?</Muted>
              <Pressable onPress={() => nav.navigate('Register' as never)}>
                <Link>회원가입하기</Link>
              </Pressable>
              <Muted style={{ marginTop: 4 }}>비밀번호를 잊으셨나요?</Muted>
            </View>
          </Card>
        </Page>
      </KeyboardAvoidingView>

      {/* ---------- Empty fields modal ---------- */}
      <Modal
        visible={showEmptyModal}
        transparent
        animationType="none"
        statusBarTranslucent
        onRequestClose={closeEmptyModal}
      >
        <Animated.View style={[{ flex: 1 }, overlayStyle]}>
          <Backdrop onPress={closeEmptyModal} />
        </Animated.View>

        <View style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, justifyContent: 'center' }}>
          <ModalCard style={cardStyle}>
            <ModalIconWrap>
              <Ionicons name="alert-circle" size={26} color="#fff" />
            </ModalIconWrap>
            <ModalTitle>로그인 실패</ModalTitle>
            <ModalDesc>
              이메일과 비밀번호를 모두 입력해주세요.{'\n'}
              건강한 다짐을 위해 정확한 정보가 필요해요! 💪
            </ModalDesc>
            <ModalBtn onPress={closeEmptyModal}>
              <ModalBtnFill>
                <GText>확인</GText>
              </ModalBtnFill>
            </ModalBtn>
            <Spacer />
          </ModalCard>
        </View>
      </Modal>
    </Bg>
  );
}
