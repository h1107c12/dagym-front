// screens/HomeScreen.tsx
import React from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styled from 'styled-components/native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import type { DefaultTheme } from 'styled-components/native';
import appTheme from '../src/styles/theme';

const Page = styled(SafeAreaView)`
  flex: 1;
  background-color: ${(p: { theme: DefaultTheme }) => p.theme.colors.background};
`;

const Container = styled(ScrollView)`
  flex: 1;
  padding: 12px 16px 24px 16px;
`;

/* ---------- 헤더 ---------- */
const Header = styled.View`
  padding: 4px 4px 8px 4px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const BrandRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 10px;
`;

const Logo = styled.View`
  width: 32px;
  height: 32px;
  border-radius: 16px;
  background: #6e56cf;
  align-items: center;
  justify-content: center;
`;

const LogoText = styled.Text`
  color: white;
  font-weight: 800;
  font-size: 12px;
`;

const BrandTextCol = styled.View``;

const BrandTitle = styled.Text`
  color: ${(p: { theme: DefaultTheme }) => p.theme.colors.text};
  font-size: 18px;
  font-weight: 800;
`;

const BrandSubtitle = styled.Text`
  color: ${(p: { theme: DefaultTheme }) => p.theme.colors.muted};
  font-size: 12px;
`;

const HeaderRight = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 12px;
`;

const Streak = styled.View`
  background: #e7f6e7;
  padding: 6px 10px;
  border-radius: 999px;
  flex-direction: row;
  align-items: center;
  gap: 6px;
`;

const StreakText = styled.Text`
  color: #2b7a0b;
  font-weight: 700;
  font-size: 12px;
`;

/* ---------- 섹션 공통 ---------- */
const SectionCard = styled.View`
  background: ${(p: { theme: DefaultTheme }) => p.theme.colors.surface};
  border-radius: 16px;
  padding: 16px;
`;

const SectionTitleRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 8px;
  margin: 8px 0 10px 2px;
`;

const SectionTitle = styled.Text`
  color: ${(p: { theme: DefaultTheme }) => p.theme.colors.text};
  font-size: 14px;
  font-weight: 800;
`;

/* ---------- 히어로(그라데이션) ---------- */
const HeroCard = styled(LinearGradient).attrs((p: { theme: DefaultTheme }) => ({
  colors: [p.theme.colors.gradientFrom, p.theme.colors.gradientTo],
  start: { x: 0, y: 0 },
  end: { x: 1, y: 1 },
}))`
  border-radius: ${(p: { theme: DefaultTheme }) => p.theme.radius.xl}px;
  padding: 18px;
  margin-top: 10px;
`;

const HeroRow = styled.View`
  flex-direction: row;
  align-items: flex-start;
  gap: 12px;
`;

const HeroTitle = styled.Text`
  color: #ffffff;
  font-weight: 800;
  font-size: 16px;
  margin-bottom: 2px;
`;

const HeroSub = styled.Text`
  color: #ffffff;
  opacity: 0.95;
  font-size: 13px;
`;

/* ---------- KPI 카드 ---------- */
const KPIWrap = styled.View`
  flex-direction: row;
  gap: 12px;
  margin-top: 14px;
`;

const KPI = styled.View`
  flex: 1;
  background: ${(p: { theme: DefaultTheme }) => p.theme.colors.surface};
  border-radius: 16px;
  padding: 14px;
`;

const KpiTop = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const KpiTitleRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 8px;
`;

const KpiTitle = styled.Text`
  color: ${(p: { theme: DefaultTheme }) => p.theme.colors.muted};
  font-size: 12px;
  font-weight: 700;
`;

const ValueRow = styled.View`
  margin-top: 8px;
  flex-direction: row;
  align-items: flex-end;
  gap: 6px;
`;

const KpiValue = styled.Text`
  color: ${(p: { theme: DefaultTheme }) => p.theme.colors.text};
  font-size: 28px;
  font-weight: 900;
`;

const KpiUnit = styled.Text`
  color: ${(p: { theme: DefaultTheme }) => p.theme.colors.muted};
  font-size: 12px;
`;

const Bar = styled.View`
  height: 8px;
  background: #efeff5;
  border-radius: 8px;
  margin-top: 8px;
`;

type FillProps = { w: number; color?: string };
const Fill = styled.View<FillProps>`
  height: 100%;
  width: ${(p: FillProps) => p.w}%;
  background: ${(p: FillProps) => p.color ?? '#121212'};
  border-radius: 8px;
`;

/* ---------- 추천 섹션 ---------- */
const RecoOuter = styled(SectionCard)`
  margin-top: 14px;
`;

type RecoBoxProps = { bg: string };
const RecoBox = styled.View<RecoBoxProps>`
  background: ${(p: RecoBoxProps) => p.bg};
  border-radius: 14px;
  padding: 14px;
  margin-top: 10px;
`;

const RecoTitle = styled.Text`
  color: ${(p: { theme: DefaultTheme }) => p.theme.colors.text};
  font-size: 14px;
  font-weight: 800;
  margin-bottom: 6px;
`;

const RecoText = styled.Text`
  color: ${(p: { theme: DefaultTheme }) => p.theme.colors.muted};
  font-size: 13px;
`;

const ChipRow = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 10px;
`;

type ChipProps = { fg?: string; bg?: string };
const Chip = styled.Text<ChipProps>`
  color: ${(p: ChipProps) => p.fg ?? '#6E56CF'};
  background: ${(p: ChipProps) => p.bg ?? '#F3EFFF'};
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 12px;
`;

export default function HomeScreen() {
  return (
    <Page>
      <Container contentContainerStyle={{ paddingBottom: 40 }}>
        {/* 헤더 */}
        <Header>
          <BrandRow>
            <Logo style={appTheme.shadow.card}>
              <LogoText>FM</LogoText>
            </Logo>
            <BrandTextCol>
              <BrandTitle>daGYM</BrandTitle>
              <BrandSubtitle>AI 트레이너와 함께하는 헬스 여정</BrandSubtitle>
            </BrandTextCol>
          </BrandRow>

          <HeaderRight>
            <Streak>
              <Ionicons name="flame" size={14} color="#2B7A0B" />
              <StreakText>7일 연속</StreakText>
            </Streak>
            <Ionicons name="notifications-outline" size={22} color="#121212" />
            <Ionicons name="person-circle-outline" size={26} color="#121212" />
          </HeaderRight>
        </Header>

        {/* 히어로 카드 */}
        <HeroCard style={appTheme.shadow.card}>
          <HeroRow>
            <View
              style={{
                width: 36,
                height: 36,
                borderRadius: 18,
                backgroundColor: 'rgba(255,255,255,0.25)',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Ionicons name="flash" size={20} color="#fff" />
            </View>
            <View style={{ flex: 1 }}>
              <HeroTitle>AI 트레이너</HeroTitle>
              <HeroSub>당신의 전담 헬스 코치</HeroSub>
              <View style={{ height: 8 }} />
              <HeroSub>안녕하세요! 오늘도 목표 달성을 위해 함께 해보아요. 💪</HeroSub>
            </View>
          </HeroRow>
        </HeroCard>

        {/* KPI 카드 2개 */}
        <KPIWrap>
          <KPI style={appTheme.shadow.card}>
            <KpiTop>
              <KpiTitleRow>
                <Ionicons name="nutrition-outline" size={16} color="#6E56CF" />
                <KpiTitle>칼로리 섭취</KpiTitle>
              </KpiTitleRow>
            </KpiTop>

            <ValueRow>
              <KpiValue>1,430</KpiValue>
              <KpiUnit>/ 2,000 kcal</KpiUnit>
            </ValueRow>
            <Bar><Fill w={72} /></Bar>
          </KPI>

          <KPI style={appTheme.shadow.card}>
            <KpiTop>
              <KpiTitleRow>
                <Ionicons name="time-outline" size={16} color="#6E56CF" />
                <KpiTitle>운동 시간</KpiTitle>
              </KpiTitleRow>
            </KpiTop>

            <ValueRow>
              <KpiValue>45</KpiValue>
              <KpiUnit>/ 60 분</KpiUnit>
            </ValueRow>
            <Bar><Fill w={75} /></Bar>
          </KPI>
        </KPIWrap>

        {/* 추천 섹션 */}
        <RecoOuter style={appTheme.shadow.card}>
          <SectionTitleRow>
            <Ionicons name="sparkles" size={16} color="#6E56CF" />
            <SectionTitle>AI 맞춤 추천</SectionTitle>
          </SectionTitleRow>

          <RecoBox bg="#FCEBFA">
            <RecoTitle>오늘의 식단 추천</RecoTitle>
            <RecoText>현재 칼로리 섭취량을 고려하여 저녁 식단을 추천드려요</RecoText>
            <ChipRow>
              <Chip>연어 스테이크</Chip>
              <Chip>브로콜리</Chip>
              <Chip>현미밥</Chip>
            </ChipRow>
          </RecoBox>

          <RecoBox bg="#EAF3FF">
            <RecoTitle>추천 운동</RecoTitle>
            <RecoText>목표 달성을 위해 15분 간의 고강도 운동을 추천합니다</RecoText>
            <ChipRow>
              <Chip>버피</Chip>
              <Chip>플랭크</Chip>
              <Chip>스쿼트</Chip>
            </ChipRow>
          </RecoBox>
        </RecoOuter>
      </Container>
    </Page>
  );
}
