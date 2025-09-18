import React from 'react';
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styled from 'styled-components/native';
import type { DefaultTheme } from 'styled-components/native';

const Page = styled(SafeAreaView)`
  flex: 1;
  background-color: ${(p: { theme: DefaultTheme }) => p.theme.colors.background};
`;

const Container = styled(ScrollView).attrs({
  contentContainerStyle: {
    paddingTop: 20,        // ✅ 상단 여백 (식단탭과 동일)
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
})`
  flex: 1;
`;

const Banner = styled.View`
  background: #ff6b3d;
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
  color: white;
  font-weight: 800;
  font-size: 16px;
`;

const Percent = styled.Text`
  color: white;
  font-weight: 800;
  font-size: 18px;
`;

const Sub = styled.Text`
  color: #ffe7de;
  font-size: 12px;
`;

const Bar = styled.View`
  height: 8px;
  background: #ffdacb;
  border-radius: 8px;
  margin-top: 8px;
`;

const Fill = styled.View`
  height: 8px;
  width: 17%;
  background: white;
  border-radius: 8px;
`;

const Section = styled.View`
  background: white;
  border-radius: 16px;
  padding: 16px;
  margin-bottom: 12px;
`;

const Item = styled.View`
  background: #f6f7fb;
  border-radius: 12px;
  padding: 12px;
  margin-top: 8px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const Btn = styled.TouchableOpacity`
  background: #12131a;
  padding: 8px 12px;
  border-radius: 10px;
`;

const BtnText = styled.Text`
  color: white;
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
          <Bar><Fill /></Bar>
        </Banner>

        <Section>
          <BannerTitle style={{ color: '#121212' }}>이번 주 운동 현황</BannerTitle>
          <Sub style={{ color: '#7a7a90', marginTop: 8 }}>월·화 완료, 수 진행 중</Sub>
        </Section>

        {[
          { title: '1. 워업', items: ['팔돌리기', '어깨 스트레칭', '무릎 들기'] },
          { title: '2. 상체 근력', items: ['푸시업', '랫풀다운', '덤벨컬'] },
        ].map(({ title, items }) => (
          <Section key={title}>
            <BannerTitle style={{ color: '#121212' }}>{title}</BannerTitle>
            {items.map((name) => (
              <Item key={name}>
                <Sub style={{ color: '#121212' }}>{name} · 30초</Sub>
                <Btn><BtnText>시작</BtnText></Btn>
              </Item>
            ))}
          </Section>
        ))}
      </Container>
    </Page>
  );
}
