// screens/DietScreen.tsx
import React, { useMemo } from 'react';
import { ScrollView, Image, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styled, { useTheme } from 'styled-components/native';
import type { DefaultTheme } from 'styled-components/native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';

import Card from '../src/components/Card';
import SectionHeader from '../src/components/SectionHeader';
import Chip from '../src/components/Chip';
import ProgressBar from '../src/components/ProgressBar';
import appTheme from '../src/styles/theme';

type TTheme = { theme: DefaultTheme };

const Page = styled(SafeAreaView)`
  flex: 1;
  background-color: ${(p: TTheme) => p.theme.colors.background};
`;

const Container = styled(ScrollView)`
  flex: 1;
  padding: 20px 16px;
`;

/* 메인 배너: 테마 그라데이션 사용 */
const Banner = styled(LinearGradient).attrs((p: { theme: DefaultTheme }) => ({
  colors: [p.theme.colors.gradientFrom, p.theme.colors.gradientTo],
  start: { x: 0, y: 0 },
  end: { x: 1, y: 1 },
}))`
  border-radius: 16px;
  padding: 16px;
  margin-bottom: 16px;
`;

const BannerTitle = styled.Text`
  color: #ffffff;
  font-weight: 800;
  font-size: 16px;
  margin-bottom: 6px;
`;

const BannerText = styled.Text`
  color: rgba(255,255,255,0.9);
  font-size: 13px;
`;

const Title = styled.Text`
  color: ${(p: TTheme) => p.theme.colors.text};
  font-weight: 800;
`;

const Row = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const Stat = styled.Text`
  color: ${(p: TTheme) => p.theme.colors.muted};
  font-size: 12px;
`;

const MacroCard = styled(Card)`
  padding: 12px;
  margin-bottom: 8px;
`;

const AddBtn = styled.TouchableOpacity`
  background: ${(p: TTheme) => p.theme.colors.primary};
  padding: 12px;
  border-radius: 12px;
  align-items: center;
  margin-top: 12px;
`;

const AddText = styled.Text`
  color: white;
  font-weight: 700;
`;

const MealRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 12px;
`;

const meals = [
  { title: '단백질 볼 샐러드', kcal: 320, img: 'https://picsum.photos/seed/diet1/80' },
  { title: '닭가슴살 스테이크', kcal: 410, img: 'https://picsum.photos/seed/diet2/80' },
  { title: '토마토 파스타(라이트)', kcal: 510, img: 'https://picsum.photos/seed/diet3/80' },
];

export default function DietScreen() {
  const theme = useTheme() as DefaultTheme;

  // 영양소 바 색상: 메인 컬러와 톤 맞춘 팔레트
  const nutrients = useMemo(
    () =>
      [
        ['단백질', 45, 120, theme.colors.primary], // 메인 컬러
        ['탄수화물', 120, 200, '#5A8FD9'],        // gradientTo와 톤 맞춤
        ['지방', 35, 50, '#FFB86C'],              // 따뜻한 보조색
        ['식이섬유', 15, 25, '#7CC7A4'],          // 민트톤 보조색
      ] as [label: string, v: number, max: number, color: string][],
    [theme.colors.primary]
  );

  return (
    <Page>
      <Container>
        {/* AI 배너 */}
        <Banner style={appTheme.shadow.card}>
          <Row>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Ionicons name="sparkles" size={18} color="#fff" />
              <BannerTitle>AI 영양 분석</BannerTitle>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#fff" />
          </Row>
          <BannerText>
            현재 단백질 섭취가 부족합니다. 단백질이 풍부한 식단을 추천드려요.
          </BannerText>
        </Banner>

        {/* 오늘의 영양소 섭취 */}
        <Card style={appTheme.shadow.card}>
          <Title style={{ marginBottom: 12 }}>오늘의 영양소 섭취</Title>
          {nutrients.map(([label, v, max, color]) => {
            const pct = Math.min(100, Math.round((v / max) * 100));
            return (
              <MacroCard key={label} style={appTheme.shadow.card}>
                <Row>
                  <Title style={{ fontSize: 14 }}>{label}</Title>
                  <Stat>
                    {v}/{max}g
                  </Stat>
                </Row>
                <ProgressBar percent={pct} color={color} style={{ marginTop: 6 }} />
              </MacroCard>
            );
          })}
        </Card>

        {/* AI 추천 식단 */}
        <Card style={[appTheme.shadow.card, { marginTop: 12 }]}>
          <SectionHeader title="AI 추천 식단" icon="restaurant" />
          {meals.map((m) => (
            <Card key={m.title} style={[appTheme.shadow.card, { padding: 12, marginBottom: 8 }]}>
              <MealRow>
                <Image source={{ uri: m.img }} style={{ width: 64, height: 64, borderRadius: 12 }} />
                <Title style={{ flex: 1, fontSize: 14 }}>{m.title}</Title>
                <Stat>{m.kcal} kcal</Stat>
              </MealRow>

              <View style={{ height: 8 }} />

              <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
                <Chip>고단백</Chip>
                <Chip>저칼로리</Chip>
                <Chip>글루텐프리</Chip>
              </View>

              <AddBtn>
                <AddText>식단에 추가</AddText>
              </AddBtn>
            </Card>
          ))}
        </Card>
      </Container>
    </Page>
  );
}
