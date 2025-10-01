// screens/WorkoutScreen.tsx
import React from 'react';
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styled from 'styled-components/native';
import type { DefaultTheme } from 'styled-components/native';
import { LinearGradient } from 'expo-linear-gradient';

type TTheme = { theme: DefaultTheme };

const Page = styled(SafeAreaView)`
  flex: 1;
  background-color: ${(p: TTheme) => p.theme.colors.background};
`;

const Container = styled(ScrollView).attrs({
  contentContainerStyle: {
    paddingTop: 20, // 상단 여백 (식단탭과 동일)
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
})`
  flex: 1;
`;

/* 메인 배너: 앱 테마 그라데이션 사용 */
const Banner = styled(LinearGradient).attrs((p: { theme: DefaultTheme }) => ({
  colors: [p.theme.colors.gradientFrom, p.theme.colors.gradientTo],
  start: { x: 0, y: 0 },
  end: { x: 1, y: 1 },
}))`
  border-radius: 16px;
  padding: 16px;
  margin-bottom: 16px;
`;

const BannerRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-end;
`;

const BannerTitle = styled.Text`
  color: #ffffff;
  font-weight: 800;
  font-size: 16px;
`;

const Percent = styled.Text`
  color: #ffffff;
  font-weight: 800;
  font-size: 18px;
`;

const Sub = styled.Text`
  color: rgba(255, 255, 255, 0.9);
  font-size: 12px;
`;

const Bar = styled.View`
  height: 8px;
  background: rgba(255, 255, 255, 0.35);
  border-radius: 8px;
  margin-top: 8px;
`;

const Fill = styled.View`
  height: 8px;
  width: 17%;
  background: #ffffff;
  border-radius: 8px;
`;

const Section = styled.View`
  background: ${(p: TTheme) => p.theme.colors.surface};
  border-radius: 16px;
  padding: 16px;
  margin-bottom: 12px;
`;

const SectionTitle = styled.Text`
  color: ${(p: TTheme) => p.theme.colors.text};
  font-weight: 800;
`;

const SectionSub = styled.Text`
  color: ${(p: TTheme) => p.theme.colors.muted};
  font-size: 12px;
`;

const Item = styled.View`
  background: #eef4fd; /* 메인컬러(#99B7E8) 톤에 맞춘 라이트 틴트 */
  border-radius: 12px;
  padding: 12px;
  margin-top: 8px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const Btn = styled.TouchableOpacity`
  background: ${(p: TTheme) => p.theme.colors.primary};
  padding: 8px 12px;
  border-radius: 10px;
`;

const BtnText = styled.Text`
  color: #ffffff;
  font-weight: 700;
`;

export default function WorkoutScreen() {
  return (
    <Page>
      <Container>
        <Banner>
          <BannerRow>
            <BannerTitle>오늘의 운동</BannerTitle>
            <Percent>17% 완료</Percent>
          </BannerRow>
          <Sub>전신 근력 운동 · 45분</Sub>
          <Bar>
            <Fill />
          </Bar>
        </Banner>

        <Section>
          <SectionTitle>이번 주 운동 현황</SectionTitle>
          <SectionSub style={{ marginTop: 8 }}>월·화 완료, 수 진행 중</SectionSub>
        </Section>

        {[
          { title: '1. 워업', items: ['팔돌리기', '어깨 스트레칭', '무릎 들기'] },
          { title: '2. 상체 근력', items: ['푸시업', '랫풀다운', '덤벨컬'] },
        ].map(({ title, items }) => (
          <Section key={title}>
            <SectionTitle>{title}</SectionTitle>
            {items.map((name) => (
              <Item key={name}>
                <SectionSub style={{ color: '#121212' }}>{name} · 30초</SectionSub>
                <Btn>
                  <BtnText>시작</BtnText>
                </Btn>
              </Item>
            ))}
          </Section>
        ))}
      </Container>
    </Page>
  );
}
