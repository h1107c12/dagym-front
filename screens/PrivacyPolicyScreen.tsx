// screens/PrivacyPolicyScreen.tsx
import React from 'react';
import { ScrollView, View, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styled from 'styled-components/native';
import type { DefaultTheme } from 'styled-components/native';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

type TTheme = { theme: DefaultTheme };

const Page = styled(SafeAreaView)`
  flex: 1;
  background-color: ${(p: TTheme) => p.theme.colors.background};
`;

const Container = styled(ScrollView).attrs({
  contentContainerStyle: { padding: 16, paddingBottom: 28 },
})`
  flex: 1;
`;

const HeaderRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
`;

const BackBtn = styled(Pressable)`
  padding: 6px;
  border-radius: 10px;
`;

const TitleRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 8px;
`;

const GIcon = styled(LinearGradient).attrs({
  colors: ['#8B5CF6', '#EC4899'],
  start: { x: 0, y: 0 },
  end: { x: 1, y: 1 },
})`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  align-items: center;
  justify-content: center;
`;

const Title = styled.Text`
  color: ${(p: TTheme) => p.theme.colors.text};
  font-weight: 700;
  font-size: 16px;
`;

/* --- card --- */
const Card = styled.View`
  background: ${(p: TTheme) => p.theme.colors.surface};
  border-radius: 14px;
  padding: 14px;
  border-width: 1px;
  border-color: ${(p: TTheme) => p.theme.colors.border};
`;

const CardHeader = styled.View`
  margin-bottom: 8px;
`;

const CardTitle = styled.Text`
  color: ${(p: TTheme) => p.theme.colors.text};
  font-weight: 800;
`;

/* 👇 Badge: props 통째로 받아 사용 (방법 1) */
type BadgeProps = { fg?: string; bg?: string };
const Badge = styled.Text<BadgeProps>`
  color: ${(props: BadgeProps) => props.fg ?? '#7c3aed'};
  background: ${(props: BadgeProps) => props.bg ?? '#f3e8ff'};
  padding: 4px 8px;
  border-radius: 999px;
  font-weight: 700;
  font-size: 11px;
`;

/* --- utils --- */
const Muted = styled.Text`
  color: ${(p: TTheme) => p.theme.colors.muted};
`;

const Separator = styled.View`
  height: 1px;
  background: #eee;
  margin: 8px 0;
`;

const BulletRow = styled.View`
  flex-direction: row;
  gap: 8px;
  align-items: flex-start;
  margin-bottom: 4px;
`;

const Dot = styled.View`
  width: 4px;
  height: 4px;
  border-radius: 2px;
  background: #9aa0a6;
  margin-top: 7px;
`;

/* --- color helpers --- */
const colorMap = {
  purple: { bg: '#F3E8FF', fg: '#7C3AED' },
  blue: { bg: '#DBEAFE', fg: '#2563EB' },
  cyan: { bg: '#CFFAFE', fg: '#0891B2' },
  green: { bg: '#DCFCE7', fg: '#16A34A' },
  orange: { bg: '#FFEDD5', fg: '#EA580C' },
} as const;

type SectionItem = { category: string; details: string[] };
type Section = {
  id: string;
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  color: keyof typeof colorMap;
  items: SectionItem[];
};

export default function PrivacyPolicyScreen() {
  const nav = useNavigation();
  const lastUpdated = '2024년 12월 20일';

  const sections: Section[] = [
    {
      id: 'collection',
      icon: 'eye-outline',
      title: '개인정보 수집 및 이용',
      color: 'purple',
      items: [
        {
          category: '필수 수집 정보',
          details: [
            '이메일 주소 (로그인 및 계정 관리)',
            '닉네임 (서비스 이용)',
            '신체 정보 (키, 체중, 나이)',
            '운동 목표 및 선호도',
          ],
        },
        {
          category: '선택 수집 정보',
          details: [
            '프로필 사진',
            '식품 알레르기 정보',
            '운동 장비 보유 현황',
            '건강 상태 정보',
          ],
        },
        {
          category: '자동 수집 정보',
          details: ['앱 사용 기록', '운동 및 식단 기록', '접속 로그', '디바이스 정보'],
        },
      ],
    },
    {
      id: 'usage',
      icon: 'checkmark-circle-outline',
      title: '개인정보 이용 목적',
      color: 'blue',
      items: [
        {
          category: '맞춤형 서비스 제공',
          details: [
            'AI 기반 식단 추천',
            '개인별 운동 루틴 생성',
            '건강 목표 달성 코칭',
            '진행 상황 분석 및 피드백',
          ],
        },
        {
          category: '서비스 운영',
          details: [
            '회원 가입 및 관리',
            '고객 지원 서비스',
            '서비스 개선 및 개발',
            '통계 분석 및 연구',
          ],
        },
      ],
    },
    {
      id: 'sharing',
      icon: 'lock-closed-outline',
      title: '제3자 제공 및 위탁',
      color: 'cyan',
      items: [
        {
          category: '제3자 제공',
          details: [
            '사용자 동의 없이 제3자에게 개인정보를 제공하지 않습니다',
            '법적 요구가 있는 경우에만 예외적으로 제공',
          ],
        },
        {
          category: '업무 위탁',
          details: ['OpenAI (AI 분석 서비스)', 'Supabase (데이터 저장 및 관리)', '클라우드 서비스 제공업체'],
        },
      ],
    },
    {
      id: 'retention',
      icon: 'time-outline',
      title: '보관 및 파기',
      color: 'green',
      items: [
        {
          category: '보관 기간',
          details: [
            '회원 탈퇴 시까지 보관',
            '탈퇴 후 30일 이내 모든 데이터 완전 삭제',
            '법정 보관 의무가 있는 경우에만 예외',
          ],
        },
        {
          category: '파기 방법',
          details: [
            '전자적 파일: 복구 불가능하게 완전 삭제',
            '물리적 문서: 분쇄 또는 소각',
            '정기적인 데이터 정리 실시',
          ],
        },
      ],
    },
    {
      id: 'rights',
      icon: 'shield-checkmark-outline',
      title: '사용자 권리',
      color: 'orange',
      items: [
        {
          category: '권리 행사',
          details: [
            '개인정보 열람 및 정정 요구',
            '개인정보 삭제 요구',
            '개인정보 처리 정지 요구',
            '손해배상 청구권',
          ],
        },
        {
          category: '권리 행사 방법',
          details: [
            '앱 내 설정 메뉴를 통한 직접 관리',
            '고객센터를 통한 요청',
            '이메일을 통한 문의',
            '유선 상담을 통한 요청',
          ],
        },
      ],
    },
  ];

  return (
    <Page>
      <Container>
        {/* 헤더 */}
        <HeaderRow>
          <BackBtn onPress={() => (nav as any).goBack()}>
            <Ionicons name="chevron-back" size={22} color="#121212" />
          </BackBtn>

          <TitleRow>
            <GIcon start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
              <Ionicons name="shield-outline" size={16} color="#fff" />
            </GIcon>
            <Title>개인정보 보호방침</Title>
          </TitleRow>
        </HeaderRow>

        {/* 업데이트 정보 */}
        <Card style={{ borderColor: '#E9D5FF', backgroundColor: '#FAF5FF' }}>
          <CardHeader>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Ionicons name="alert-circle-outline" size={16} color="#7C3AED" />
                <Title style={{ color: '#5B21B6', fontWeight: '700', fontSize: 14 }}>
                  최종 업데이트
                </Title>
              </View>
              <Badge bg="#F3E8FF" fg="#7C3AED">
                {lastUpdated}
              </Badge>
            </View>
          </CardHeader>
          <Muted style={{ marginTop: 2, color: '#6B21A8' }}>
            다짐(daGYM)은 사용자의 개인정보 보호를 최우선으로 생각하며, 관련 법령을 준수하여 개인정보를
            안전하게 관리합니다.
          </Muted>
        </Card>

        {/* 섹션들 */}
        <View style={{ height: 8 }} />
        {sections.map((section, idx) => {
          const col = colorMap[section.color];
          return (
            <Card key={section.id} style={{ marginBottom: 12 }}>
              <CardHeader>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <View
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: 6,
                      backgroundColor: col.bg,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Ionicons name={section.icon} size={13} color={col.fg} />
                  </View>
                  <CardTitle>{section.title}</CardTitle>
                  <View style={{ marginLeft: 'auto' }}>
                    <Badge bg="#fff" fg="#7a7a90">
                      {idx + 1}
                    </Badge>
                  </View>
                </View>
              </CardHeader>

              <View style={{ gap: 12 }}>
                {section.items.map((item, i) => (
                  <View key={`${section.id}-${i}`}>
                    <Title style={{ marginBottom: 6 }}>{item.category}</Title>
                    <View>
                      {item.details.map((detail, j) => (
                        <BulletRow key={`${section.id}-${i}-${j}`}>
                          <Dot />
                          <Muted style={{ flex: 1 }}>{detail}</Muted>
                        </BulletRow>
                      ))}
                    </View>
                    {i < section.items.length - 1 && <Separator />}
                  </View>
                ))}
              </View>
            </Card>
          );
        })}

        {/* 연락처 카드 */}
        <Card style={{ backgroundColor: '#F8FAFC', borderColor: '#E2E8F0', marginTop: 4 }}>
          <CardHeader>
            <CardTitle style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Ionicons name="call-outline" size={18} color="#334155" />
              개인정보 보호 문의
            </CardTitle>
          </CardHeader>

          <View style={{ gap: 8 }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 10,
                backgroundColor: '#fff',
                borderRadius: 12,
                padding: 12,
                borderWidth: 1,
                borderColor: '#E5E7EB',
              }}
            >
              <Ionicons name="mail-outline" size={16} color="#3B82F6" />
              <View style={{ flex: 1 }}>
                <Title style={{ marginBottom: 0 }}>이메일 문의</Title>
                <Muted>privacy@dagym.co.kr</Muted>
              </View>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 10,
                backgroundColor: '#fff',
                borderRadius: 12,
                padding: 12,
                borderWidth: 1,
                borderColor: '#E5E7EB',
              }}
            >
              <Ionicons name="call" size={16} color="#10B981" />
              <View style={{ flex: 1 }}>
                <Title style={{ marginBottom: 0 }}>전화 문의</Title>
                <Muted>1588-1234 (평일 09:00-18:00)</Muted>
              </View>
            </View>
          </View>
        </Card>

        <View style={{ height: 16 }} />
      </Container>
    </Page>
  );
}
