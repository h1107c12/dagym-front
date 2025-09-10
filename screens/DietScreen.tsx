import React from 'react';
import { ScrollView, Image } from 'react-native';
import styled from 'styled-components/native';

const Container = styled(ScrollView)`
  flex: 1;
  padding: 20px 16px;
`;

const Banner = styled.View`
  background: #0bb37d;
  border-radius: 16px;
  padding: 16px;
  margin-bottom: 16px;
`;

const BannerTitle = styled.Text`
  color: white;
  font-weight: 800;
  margin-bottom: 6px;
`;

const BannerText = styled.Text`
  color: white;
`;

const Card = styled.View`
  background: white;
  border-radius: 16px;
  padding: 16px;
  margin-bottom: 16px;
`;

const Row = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-top: 6px;
  align-items: center;
`;

const Title = styled.Text`
  font-weight: 800;
`;

const Stat = styled.Text`
  color: #7a7a90;
  font-size: 12px;
`;

const TagRow = styled.View`
  flex-direction: row;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 8px;
`;

const Tag = styled.Text`
  background: #eef9ff;
  color: #0b76d1;
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 12px;
`;

const AddBtn = styled.TouchableOpacity`
  background: #12131a;
  padding: 12px;
  border-radius: 12px;
  align-items: center;
  margin-top: 12px;
`;

const AddText = styled.Text`
  color: white;
  font-weight: 700;
`;

const NutrWrap = styled.View`
  background: white;
  border-radius: 16px;
  padding: 16px;
  margin-bottom: 12px;
`;

const Bar = styled.View`
  height: 8px;
  background: #efeff5;
  border-radius: 8px;
  margin-top: 6px;
`;

type FillProps = { w: number; color?: string };

const Fill = styled.View<FillProps>`
  height: 100%;
  width: ${(p: FillProps) => p.w}%;
  background: ${(p: FillProps) => (p.color ?? '#6e56cf')};
  border-radius: 8px;
`;


const shadow = {
  elevation: 2,
  shadowColor: '#000',
  shadowOpacity: 0.05,
  shadowRadius: 8,
  shadowOffset: { width: 0, height: 2 },
} as const;

const nutrients: [label: string, v: number, max: number, color: string][] = [
  ['단백질', 45, 120, '#6e56cf'],
  ['탄수화물', 120, 200, '#0b76d1'],
  ['지방', 35, 50, '#ff8a00'],
  ['식이섬유', 15, 25, '#13a10e'],
];

export default function DietScreen() {
  return (
    <Container>
      <Banner>
        <BannerTitle>AI 영양 분석</BannerTitle>
        <BannerText>현재 단백질 섭취가 부족합니다. 단백질이 풍부한 식단을 추천드려요.</BannerText>
      </Banner>

      <NutrWrap style={shadow}>
        <Title style={{ marginBottom: 12 }}>오늘의 영양소 섭취</Title>
        {nutrients.map(([label, v, max, color]) => {
          const pct = Math.min(100, Math.round((v / max) * 100));
          return (
            <Card key={label} style={{ ...shadow, padding: 12, marginBottom: 8 }}>
              <Row>
                <Title style={{ fontSize: 14 }}>{label}</Title>
                <Stat>{v}/{max}g</Stat>
              </Row>
              <Bar><Fill w={pct} color={color} /></Bar>
            </Card>
          );
        })}
      </NutrWrap>

      <Title>AI 추천 식단</Title>

      {[1, 2, 3].map((i) => (
        <Card key={i} style={shadow}>
          <Row style={{ gap: 12 }}>
            <Image
              source={{ uri: 'https://picsum.photos/seed/diet' + i + '/80' }}
              style={{ width: 64, height: 64, borderRadius: 12 }}
            />
            <Title style={{ flex: 1 }}>단백질 볼 샐러드</Title>
            <Stat>320 kcal</Stat>
          </Row>
          <TagRow>
            <Tag>고단백</Tag><Tag>저칼로리</Tag><Tag>글루텐프리</Tag>
          </TagRow>
          <AddBtn><AddText>식단에 추가</AddText></AddBtn>
        </Card>
      ))}
    </Container>
  );
}
