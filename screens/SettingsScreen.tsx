// screens/SettingsScreen.tsx
import React, { useState } from 'react';
import { ScrollView, View, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styled from 'styled-components/native';
import type { DefaultTheme } from 'styled-components/native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation, type NavigationProp } from '@react-navigation/native';
import type { RootStackParamList } from '../App'; // ✅ App.tsx의 스택 타입 활용

/* ---------- types ---------- */
type TTheme = { theme: DefaultTheme };
type Mode = 'light' | 'dark' | 'system';

/* ---------- layout ---------- */
const Page = styled(SafeAreaView)`flex:1;background:${(p: TTheme) => p.theme.colors.background};`;

/* 상단 헤더(뒤로가기) */
const TopBar = styled.View`
  padding: 8px 12px 0 12px;
  flex-direction: row;
  align-items: center;
`;
const BackBtn = styled.Pressable`
  width: 36px; height: 36px; border-radius: 18px;
  align-items: center; justify-content: center;
  background: #f3f4f7;
  margin-right: 6px;
`;
const HeaderTextCol = styled.View``;
const HeaderTitle = styled.Text`color:${(p: TTheme) => p.theme.colors.text};font-size:18px;font-weight:900;`;
const HeaderSub = styled.Text`color:${(p: TTheme) => p.theme.colors.muted};margin-top:2px;`;

const Container = styled(ScrollView).attrs({
  contentContainerStyle: { padding: 16, paddingBottom: 32 },
})`flex:1;`;

/* ---------- cards & titles ---------- */
const Card = styled.View`
  background:${(p: TTheme) => p.theme.colors.surface};
  border-radius:16px;padding:14px;
  margin-bottom:12px;
`;
const TitleRow = styled.View`flex-direction:row;align-items:center;gap:8px;margin-bottom:10px;`;
const Title = styled.Text`color:${(p: TTheme) => p.theme.colors.text};font-weight:900;`;

/* ---------- profile header ---------- */
const ProfileRow = styled.View`flex-direction:row;align-items:center;gap:12px;`;
const Avatar = styled.View`
  width:44px;height:44px;border-radius:22px;
  background:#e9ddff;align-items:center;justify-content:center;
`;
const Name = styled.Text`color:${(p: TTheme) => p.theme.colors.text};font-weight:900;`;
const Sub = styled.Text`color:#7a7a90;margin-top:2px;`;

/* ---------- pressable rows (full-row touch, no right icons) ---------- */
type RowPressProps = { active?: boolean };
const RowPress = styled.Pressable<RowPressProps>`
  flex-direction:row;align-items:center;gap:10px;padding:12px;border-radius:12px;
  background:${(p: RowPressProps) => (p.active ? '#f7f5ff' : 'transparent')};
`;
const Bullet = styled.View<RowPressProps>`
  width:8px;height:8px;border-radius:4px;
  background:${(p: RowPressProps) => (p.active ? '#6E56CF' : '#E0E0EA')};
  margin-right:2px;
`;
const LabelCol = styled.View`flex:1;`;
const Label = styled.Text`color:${(p: TTheme) => p.theme.colors.text};font-weight:900;`;
const Desc = styled.Text`color:#7a7a90;margin-top:2px;`;
const Divider = styled.View`height:1px;background:#eee;margin:6px -2px;`;

/* ---------- screen ---------- */
export default function SettingsScreen() {
  const nav = useNavigation<NavigationProp<RootStackParamList>>();
  const [mode, setMode] = useState<Mode>('light');

  const onPick = (m: Mode) => {
    setMode(m);
    // TODO: ThemeProvider와 연동해서 실제 테마 적용
  };

  return (
    <Page>
      {/* 상단 뒤로가기 헤더 */}
      <TopBar>
        <BackBtn onPress={() => nav.goBack()}>
          <Ionicons name="chevron-back" size={22} color="#6E56CF" />
        </BackBtn>
        <HeaderTextCol>
          <HeaderTitle>설정</HeaderTitle>
          <HeaderSub>앱 환경을 개인화하세요</HeaderSub>
        </HeaderTextCol>
      </TopBar>

      <Container>
        {/* 프로필 카드 */}
        <Card>
          <ProfileRow>
            <Avatar>
              <Ionicons name="person" size={22} color="#6E56CF" />
            </Avatar>
            <View style={{ flex: 1 }}>
              <Name>다짐 사용자</Name>
              <Sub>목표 미설정</Sub>
            </View>
          </ProfileRow>
        </Card>

        {/* 테마 설정 */}
        <Card>
          <TitleRow>
            <Ionicons name="color-palette-outline" size={16} color="#6E56CF" />
            <Title>테마 설정</Title>
          </TitleRow>

          <RowPress active={mode === 'light'} onPress={() => onPick('light')}>
            <Bullet active={mode === 'light'} />
            <Ionicons name="sunny-outline" size={18} color="#6E56CF" />
            <LabelCol>
              <Label>라이트 모드</Label>
              <Desc>밝은 테마로 표시됩니다</Desc>
            </LabelCol>
          </RowPress>

          <RowPress active={mode === 'dark'} onPress={() => onPick('dark')}>
            <Bullet active={mode === 'dark'} />
            <Ionicons name="moon-outline" size={18} color="#6E56CF" />
            <LabelCol>
              <Label>다크 모드</Label>
              <Desc>어두운 테마로 표시됩니다</Desc>
            </LabelCol>
          </RowPress>

          <RowPress active={mode === 'system'} onPress={() => onPick('system')}>
            <Bullet active={mode === 'system'} />
            <Ionicons name="phone-portrait-outline" size={18} color="#6E56CF" />
            <LabelCol>
              <Label>시스템 기본값</Label>
              <Desc>기기 설정을 따라갑니다</Desc>
            </LabelCol>
          </RowPress>
        </Card>

        {/* 알림 설정 (예시) */}
        <Card>
          <TitleRow>
            <Ionicons name="notifications-outline" size={16} color="#6E56CF" />
            <Title>알림 설정</Title>
          </TitleRow>

          <RowPress onPress={() => Alert.alert('운동 알림', '운동 알림 설정 화면 연결')}>
            <Ionicons name="barbell-outline" size={18} color="#6E56CF" />
            <LabelCol>
              <Label>운동 알림</Label>
              <Desc>운동 시간을 알려드려요</Desc>
            </LabelCol>
          </RowPress>

          <RowPress onPress={() => Alert.alert('식단 알림', '식단 알림 설정 화면 연결')}>
            <Ionicons name="restaurant-outline" size={18} color="#6E56CF" />
            <LabelCol>
              <Label>식단 알림</Label>
              <Desc>식사 시간을 알려드려요</Desc>
            </LabelCol>
          </RowPress>

          <RowPress onPress={() => Alert.alert('진행 상황 알림', '주간 리포트 알림 설정')}>
            <Ionicons name="trending-up-outline" size={18} color="#6E56CF" />
            <LabelCol>
              <Label>진행 상황 알림</Label>
              <Desc>주간 리포트를 알려드려요</Desc>
            </LabelCol>
          </RowPress>

          <RowPress onPress={() => Alert.alert('건강 팁 알림', '건강 팁 알림 설정')}>
            <Ionicons name="medkit-outline" size={18} color="#6E56CF" />
            <LabelCol>
              <Label>건강 팁 알림</Label>
              <Desc>유용한 건강 정보를 알려드려요</Desc>
            </LabelCol>
          </RowPress>
        </Card>

        {/* 기타 */}
        <Card>
          <TitleRow>
            <Ionicons name="ellipsis-horizontal-circle-outline" size={16} color="#6E56CF" />
            <Title>기타</Title>
          </TitleRow>

          {/* ✅ 개인정보 보호: 실제 화면으로 네비게이션 */}
          <RowPress onPress={() => nav.navigate('PrivacyPolicy')}>
            <Ionicons name="shield-checkmark-outline" size={18} color="#6E56CF" />
            <LabelCol>
              <Label>개인정보 보호</Label>
              <Desc>데이터 보호 및 프라이버시 설정</Desc>
            </LabelCol>
          </RowPress>

          {/* ✅ 도움말 및 지원: HelpScreen으로 이동 (루트 이름 'Help' 가정) */}
          <RowPress onPress={() => nav.navigate('Help')}>
            <Ionicons name="help-circle-outline" size={18} color="#6E56CF" />
            <LabelCol>
              <Label>도움말 및 지원</Label>
              <Desc>사용 가이드 / FAQ / 고객 지원</Desc>
            </LabelCol>
          </RowPress>

          <RowPress onPress={() => Alert.alert('앱 정보', '버전 1.0.0')}>
            <Ionicons name="information-circle-outline" size={18} color="#6E56CF" />
            <LabelCol>
              <Label>앱 정보</Label>
              <Desc>버전 1.0.0</Desc>
            </LabelCol>
          </RowPress>
        </Card>
      </Container>
    </Page>
  );
}
