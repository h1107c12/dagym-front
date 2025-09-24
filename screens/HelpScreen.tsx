// screens/HelpScreen.tsx
import React, { useEffect, useState, useRef } from 'react';
import {
  ScrollView,
  View,
  Pressable,
  LayoutAnimation,
  Platform,
  UIManager,
  Linking,
  Animated,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styled from 'styled-components/native';
import type { DefaultTheme } from 'styled-components/native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

/* ---------- types ---------- */
type TTheme = { theme: DefaultTheme };

/* ---------- layout ---------- */
const Page = styled(SafeAreaView)`flex:1;background:${(p: TTheme) => p.theme.colors.background};`;

const TopBar = styled.View`
  padding: 8px 12px 0 12px;
  flex-direction: row;
  align-items: center;
`;
const BackBtn = styled.Pressable`
  width: 36px; height: 36px; border-radius: 18px;
  align-items: center; justify-content: center;
  background: #f3f4f7; margin-right: 6px;
`;
const HeaderTextCol = styled.View``;
const HeaderTitle = styled.Text`color:${(p: TTheme) => p.theme.colors.text};font-size:18px;font-weight:900;`;
const HeaderSub = styled.Text`color:${(p: TTheme) => p.theme.colors.muted};margin-top:2px;`;

const Container = styled(ScrollView).attrs({
  contentContainerStyle: { padding: 16, paddingBottom: 32 },
})`flex:1;`;

/* ---------- card ---------- */
const Card = styled.View`
  background:${(p: TTheme) => p.theme.colors.surface};
  border-radius:16px; padding:14px; margin-bottom:12px;
`;
const TitleRow = styled.View`flex-direction:row; align-items:center; gap:8px; margin-bottom:10px;`;
const Title = styled.Text`color:${(p: TTheme) => p.theme.colors.text}; font-weight:900;`;

/* ---------- small ui elements ---------- */
const Badge = styled.View<{ fg?: string; bg?: string }>`
  padding: 4px 8px; border-radius: 999px;
  align-self:flex-start;
  background: ${(p) => p.bg ?? '#F3F4F7'};
`;
const BadgeText = styled.Text<{ color?: string }>`
  color: ${(p) => p.color ?? '#7a7a90'};
  font-size: 11px; font-weight: 800;
`;

const GhostBtn = styled.Pressable`
  background:#ffffff; border:1px solid #e6e6ef;
  padding:10px 12px; border-radius:10px; flex-direction:row; align-items:center; gap:8px;
`;
const Divider = styled.View`height:1px;background:#eee;margin:6px -2px;`;

/* ---------- FAQ item ---------- */
type FAQItemProps = { question: string; answer: string };
function FAQItem({ question, answer }: FAQItemProps) {
  const [open, setOpen] = useState(false);
  const rotate = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(rotate, {
      toValue: open ? 1 : 0,
      duration: 180,
      useNativeDriver: true,
    }).start();
  }, [open, rotate]);

  const onToggle = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpen((v) => !v);
  };

  const spin = rotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  return (
    <View style={{ borderRadius: 10, overflow: 'hidden' }}>
      <Pressable
        onPress={onToggle}
        style={{
          padding: 10,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#F8F8FB',
          borderWidth: 1,
          borderColor: '#EEE',
        }}
      >
        <View style={{ flex: 1, paddingRight: 10 }}>
          <HeaderSub style={{ color: '#121212' }}>{question}</HeaderSub>
        </View>
        <Animated.View style={{ transform: [{ rotate: spin }] }}>
          <Ionicons name="chevron-down" size={16} color="#7a7a90" />
        </Animated.View>
      </Pressable>

      {open && (
        <View style={{ padding: 10, backgroundColor: '#FFF', borderLeftWidth: 1, borderRightWidth: 1, borderBottomWidth: 1, borderColor: '#EEE' }}>
          <HeaderSub style={{ lineHeight: 20 }}>{answer}</HeaderSub>
        </View>
      )}
    </View>
  );
}

/* ---------- screen ---------- */
export default function HelpScreen() {
  const nav = useNavigation();

  useEffect(() => {
    if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }, []);

  const appVersion = '1.0.0';
  const buildNumber = '2024.12.20';

  const guides = [
    {
      title: '식단 기록하는 방법',
      description: 'AI 추천을 받기 위한 정확한 식단 기록법',
      icon: '🍽️',
      steps: ['식단 탭 진입', '식사 시간 선택', '음식 검색 또는 직접 입력', '분량 조절 후 저장'],
    },
    {
      title: '운동 기록하는 방법',
      description: '운동 성과를 체계적으로 관리하는 방법',
      icon: '💪',
      steps: ['운동 탭 진입', '운동 종류 선택', '세트, 횟수, 무게 입력', '운동 완료 체크'],
    },
    {
      title: '목표 달성하는 팁',
      description: '다짐 앱으로 건강 목표를 효과적으로 달성하는 방법',
      icon: '🎯',
      steps: ['현실적인 목표 설정', '꾸준한 기록 습관', 'AI 피드백 활용', '주간 리포트 점검'],
    },
  ] as const;

  const faq = [
    {
      cat: { label: '시작하기', color: '#7c3aed', bg: '#f3e8ff', icon: 'phone-portrait-outline' as const },
      items: [
        {
          q: '다짐 앱을 처음 사용하는데 어떻게 시작하나요?',
          a: '회원가입 후 기본 정보(키, 체중, 목표)를 입력하면 AI가 맞춤형 식단과 운동을 추천해드립니다. 홈 화면에서 오늘의 목표를 확인하고 기록을 시작해보세요!',
        },
        {
          q: '목표 설정은 어떻게 하나요?',
          a: '프로필 설정에서 체중 감량, 근육 증가, 건강 관리, 체력 향상 중 하나를 선택할 수 있습니다. 언제든지 변경 가능하며, AI가 새로운 목표에 맞는 추천을 제공합니다.',
        },
        {
          q: '개인정보는 안전한가요?',
          a: '모든 개인정보는 암호화되어 안전하게 보관됩니다. 관련 법령을 준수하며 사용자 동의 없이 제3자에게 정보를 제공하지 않습니다.',
        },
      ],
    },
    {
      cat: { label: '주요 기능', color: '#2563eb', bg: '#dbeafe', icon: 'flash-outline' as const },
      items: [
        {
          q: 'AI 식단 추천은 어떻게 작동하나요?',
          a: '사용자의 목표, 신체 정보, 알레르기, 선호도를 종합 분석하여 맞춤형 식단을 추천합니다. 칼로리와 영양소 균형을 고려합니다.',
        },
        {
          q: '운동 루틴은 어떻게 생성되나요?',
          a: '체력, 목표, 보유 장비, 운동 경험을 바탕으로 AI가 최적화된 운동 루틴을 생성합니다. 난이도 조절도 가능합니다.',
        },
        {
          q: '진행 상황은 어떻게 확인하나요?',
          a: '리포트 탭에서 일간, 주간, 월간 통계를 확인할 수 있습니다. 체중 변화, 운동량, 칼로리 섭취 등을 그래프로 보여드립니다.',
        },
        {
          q: '알림 설정은 어떻게 하나요?',
          a: '설정에서 식사 시간, 운동 시간, 물 마시기 등의 알림을 자유롭게 설정할 수 있습니다.',
        },
      ],
    },
    {
      cat: { label: '문제 해결', color: '#ea580c', bg: '#ffedd5', icon: 'chatbubbles-outline' as const },
      items: [
        {
          q: '앱이 느리거나 멈춰요',
          a: '앱을 완전히 종료하고 다시 실행하거나 기기를 재시작해보세요. 지속되면 앱 업데이트 또는 고객센터로 문의해주세요.',
        },
        {
          q: '데이터가 동기화되지 않아요',
          a: '인터넷 연결을 확인하고 앱을 최신 버전으로 업데이트하세요. 설정에서 수동 동기화도 가능합니다.',
        },
        {
          q: 'AI 추천이 부정확해요',
          a: '프로필, 선호도, 알레르기 정보를 최신 상태로 유지하세요. 기록이 쌓일수록 추천 정확도가 올라갑니다.',
        },
        {
          q: '계정에 로그인할 수 없어요',
          a: '이메일/비밀번호 확인 후 재설정을 시도하세요. 계속 문제면 고객센터로 문의해주세요.',
        },
      ],
    },
  ] as const;

  const openMail = () => Linking.openURL('mailto:support@dagym.co.kr').catch(() => Alert.alert('이메일 열기 실패'));
  const callPhone = () => Linking.openURL('tel:15881234').catch(() => Alert.alert('전화 걸기 실패'));

  return (
    <Page>
      {/* 헤더 */}
      <TopBar>
        <BackBtn onPress={() => (nav as any).goBack()}>
          <Ionicons name="chevron-back" size={22} color="#6E56CF" />
        </BackBtn>
        <HeaderTextCol>
          <HeaderTitle>도움말 및 지원</HeaderTitle>
          <HeaderSub>무엇을 도와드릴까요?</HeaderSub>
        </HeaderTextCol>
      </TopBar>

      <Container>
        {/* 빠른 도움말 */}
        <Card>
          <TitleRow>
            <Ionicons name="information-circle-outline" size={16} color="#3b82f6" />
            <Title>빠른 도움이 필요하신가요?</Title>
          </TitleRow>

          <View style={{ gap: 8 }}>
            <GhostBtn onPress={() => Alert.alert('채팅 상담', '실시간 채팅 상담 화면을 연결해 주세요.')}>
              <Ionicons name="chatbubble-ellipses-outline" size={16} color="#3b82f6" />
              <HeaderSub style={{ color: '#121212' }}>실시간 채팅 상담</HeaderSub>
            </GhostBtn>

            <GhostBtn onPress={callPhone}>
              <Ionicons name="call-outline" size={16} color="#10b981" />
              <HeaderSub style={{ color: '#121212' }}>전화 상담 (1588-1234)</HeaderSub>
            </GhostBtn>
          </View>
        </Card>

        {/* 사용 가이드 */}
        <Card>
          <TitleRow>
            <Ionicons name="book-outline" size={16} color="#6E56CF" />
            <Title>사용 가이드</Title>
          </TitleRow>

          <View style={{ gap: 10 }}>
            {guides.map((g, i) => (
              <View
                key={i}
                style={{
                  padding: 12,
                  borderRadius: 12,
                  backgroundColor: '#F7F7FB',
                  borderWidth: 1,
                  borderColor: '#EDEDF5',
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 10 }}>
                  <View style={{ width: 28 }}>
                    <HeaderSub style={{ fontSize: 18 }}>{g.icon}</HeaderSub>
                  </View>
                  <View style={{ flex: 1 }}>
                    <HeaderTitle style={{ fontSize: 14 }}>{g.title}</HeaderTitle>
                    <HeaderSub style={{ marginTop: 2 }}>{g.description}</HeaderSub>

                    <View style={{ marginTop: 8, gap: 6 }}>
                      {g.steps.map((s, idx) => (
                        <View key={idx} style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                          <Badge bg="#EEF2FF">
                            <BadgeText color="#6E56CF">{idx + 1}</BadgeText>
                          </Badge>
                          <HeaderSub style={{ color: '#121212' }}>{s}</HeaderSub>
                        </View>
                      ))}
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </Card>

        {/* 자주 묻는 질문 */}
        <Card>
          <TitleRow>
            <Ionicons name="help-circle-outline" size={16} color="#6E56CF" />
            <Title>자주 묻는 질문</Title>
            <Badge style={{ marginLeft: 8 }} bg="#EEF2FF">
              <BadgeText color="#6E56CF">FAQ</BadgeText>
            </Badge>
          </TitleRow>

          <View style={{ gap: 14 }}>
            {faq.map((group, gi) => (
              <View key={gi}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <View style={{ width: 24, height: 24, borderRadius: 8, backgroundColor: group.cat.bg, alignItems: 'center', justifyContent: 'center' }}>
                    <Ionicons name={group.cat.icon} size={14} color={group.cat.color} />
                  </View>
                  <HeaderTitle style={{ fontSize: 14 }}>{group.cat.label}</HeaderTitle>
                </View>

                <View style={{ gap: 8, marginLeft: 8 }}>
                  {group.items.map((it, ii) => (
                    <FAQItem key={ii} question={it.q} answer={it.a} />
                  ))}
                </View>

                {gi < faq.length - 1 && <Divider />}
              </View>
            ))}
          </View>
        </Card>

        {/* 고객 지원 */}
        <Card>
          <TitleRow>
            <Ionicons name="people-outline" size={16} color="#10b981" />
            <Title>고객 지원</Title>
          </TitleRow>

          <View style={{ gap: 8 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12, borderRadius: 12, backgroundColor: '#F6EEFF', borderWidth: 1, borderColor: '#EADCFD' }}>
              <Ionicons name="chatbubbles-outline" size={16} color="#8B5CF6" />
              <View style={{ flex: 1 }}>
                <HeaderTitle style={{ fontSize: 14 }}>실시간 채팅 상담</HeaderTitle>
                <HeaderSub>평일 09:00-18:00 (즉시 응답)</HeaderSub>
              </View>
              <Badge bg="#F3E8FF">
                <BadgeText color="#7C3AED">LIVE</BadgeText>
              </Badge>
            </View>

            <Pressable
              onPress={openMail}
              style={{ flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12, borderRadius: 12, backgroundColor: '#EAF2FF', borderWidth: 1, borderColor: '#D7E6FF' }}
            >
              <Ionicons name="mail-outline" size={16} color="#3B82F6" />
              <View style={{ flex: 1 }}>
                <HeaderTitle style={{ fontSize: 14 }}>이메일 문의</HeaderTitle>
                <HeaderSub>support@dagym.co.kr</HeaderSub>
              </View>
              <Ionicons name="open-outline" size={16} color="#7a7a90" />
            </Pressable>

            <Pressable
              onPress={callPhone}
              style={{ flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12, borderRadius: 12, backgroundColor: '#EAF8EE', borderWidth: 1, borderColor: '#CFEEDB' }}
            >
              <Ionicons name="call-outline" size={16} color="#10B981" />
              <View style={{ flex: 1 }}>
                <HeaderTitle style={{ fontSize: 14 }}>전화 상담</HeaderTitle>
                <HeaderSub>1588-1234 (평일 09:00-18:00)</HeaderSub>
              </View>
            </Pressable>
          </View>
        </Card>

        {/* 앱 정보 */}
        <Card>
          <TitleRow>
            <Ionicons name="phone-portrait-outline" size={16} color="#6E56CF" />
            <Title>앱 정보</Title>
          </TitleRow>

          <View style={{ gap: 10 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <HeaderSub>앱 버전</HeaderSub>
              <Badge bg="#F3F4F7"><BadgeText>{appVersion}</BadgeText></Badge>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <HeaderSub>빌드 번호</HeaderSub>
              <Badge bg="#F3F4F7"><BadgeText>{buildNumber}</BadgeText></Badge>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <HeaderSub>개발사</HeaderSub>
              <HeaderTitle style={{ fontSize: 13 }}>다짐팀</HeaderTitle>
            </View>

            <Divider />

            <View style={{ alignItems: 'center', gap: 6 }}>
              <View style={{ flexDirection: 'row', gap: 6 }}>
                <Badge bg="#F3F4F7"><BadgeText>★ 평점 4.9</BadgeText></Badge>
                <Badge bg="#F3F4F7"><BadgeText>다운로드 10만+</BadgeText></Badge>
              </View>
              <HeaderSub style={{ fontSize: 12 }}>건강한 습관을 만드는 AI 헬스 코칭 서비스</HeaderSub>
            </View>
          </View>
        </Card>
      </Container>
    </Page>
  );
}
