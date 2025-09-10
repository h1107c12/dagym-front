import React from 'react';
import { ScrollView, View } from 'react-native';
import styled from 'styled-components/native';

const Container = styled(ScrollView)`
  flex: 1;
  padding: 20px 16px;
`;

const Hero = styled.View`
  background: #8a63d2;
  border-radius: 16px;
  padding: 16px;
  margin-bottom: 16px;
`;

const HeroTitle = styled.Text`
  color: white;
  font-weight: 800;
  margin-bottom: 4px;
`;

const HeroValue = styled.Text`
  color: white;
  font-weight: 800;
  font-size: 20px;
`;

const Grid = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  gap: 12px;
`;

const Card = styled.View`
  background: white;
  border-radius: 16px;
  padding: 16px;
  width: 48%;
`;

const Title = styled.Text`
  font-weight: 800;
  margin-bottom: 6px;
`;

const Sub = styled.Text`
  color: #7a7a90;
`;

const ChartCard = styled.View`
  background: white;
  border-radius: 16px;
  padding: 16px;
  margin-top: 12px;
`;

const Dot = styled.View`
  width: 6px;
  height: 6px;
  border-radius: 3px;
  background: #6e56cf;
`;

export default function ReportScreen() {
  return (
    <Container>
      <Hero>
        <HeroTitle>8월 진행 리포트</HeroTitle>
        <Sub style={{ color: '#EDE7FF', marginBottom: 8 }}>목표 달성도 82%</Sub>
        <HeroValue>-2.3kg · 18일</HeroValue>
      </Hero>

      <Grid>
        <Card>
          <Title>체중 감량</Title>
          <HeroValue style={{ color: '#121212', fontSize: 18 }}>2.3 kg</HeroValue>
          <Sub>목표: 5kg</Sub>
        </Card>
        <Card>
          <Title>평균 칼로리</Title>
          <HeroValue style={{ color: '#121212', fontSize: 18 }}>1863 kcal</HeroValue>
          <Sub>목표: 1800kcal</Sub>
        </Card>
        <Card>
          <Title>운동 일수</Title>
          <HeroValue style={{ color: '#121212', fontSize: 18 }}>18 일</HeroValue>
          <Sub>목표: 20일</Sub>
        </Card>
        <Card>
          <Title>체지방 감소</Title>
          <HeroValue style={{ color: '#121212', fontSize: 18 }}>2.1 %</HeroValue>
          <Sub>목표: 3%</Sub>
        </Card>
      </Grid>

      <ChartCard>
        <Title>주간 체중 변화</Title>
        <View style={{ height: 160, justifyContent: 'space-between', paddingVertical: 8 }}>
          {[0, 1, 2, 3, 4, 5, 6].map((d) => (
            <View key={d} style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Dot />
              <View style={{ height: 1, backgroundColor: '#EEE', flex: 1 }} />
            </View>
          ))}
        </View>
        <Sub>실데이터 연결 전 기본 UI</Sub>
      </ChartCard>
    </Container>
  );
}
