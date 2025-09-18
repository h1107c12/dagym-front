// screens/HomeScreen.tsx
import React, { useEffect, useRef, useState } from 'react';
import { ScrollView, View, Pressable, Modal, Alert, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styled, { useTheme } from 'styled-components/native';
import type { DefaultTheme } from 'styled-components/native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import appTheme from '../src/styles/theme';
import { useAuth } from '../src/context/AuthContext';

/* ---------- types ---------- */
type TTheme = { theme: DefaultTheme };

/* ---------- layout ---------- */
const Page = styled(SafeAreaView)`
  flex: 1;
  background-color: ${(p: TTheme) => p.theme.colors.background};
`;
const Container = styled(ScrollView).attrs({
  contentContainerStyle: { paddingBottom: 36 },
})`
  flex: 1;
  padding: 12px 16px 0 16px;
`;

/* ---------- header ---------- */
const Header = styled.View`
  padding: 6px 0 10px 0;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;
const BrandRow = styled.View` flex-direction: row; align-items: center; gap: 10px; `;
const Logo = styled(LinearGradient).attrs({
  colors: ['#8B5CF6', '#EC4899'],
  start: { x: 0, y: 0 }, end: { x: 1, y: 1 },
})`
  width: 34px; height: 34px; border-radius: 10px; align-items: center; justify-content: center;
`;
const LogoText = styled.Text` color:#fff; font-weight:900; font-size:14px; `;
const BrandCol = styled.View``;
const BrandTitle = styled.Text`
  color: ${(p: TTheme) => p.theme.colors.text};
  font-size: 18px; font-weight: 900;
`;
const BrandSubtitle = styled.Text`
  color: ${(p: TTheme) => p.theme.colors.muted};
  font-size: 12px;
`;
const HeaderRight = styled.View` flex-direction: row; align-items: center; gap: 12px; `;

const Streak = styled.View`
  background:#e8f7e8; padding:6px 10px; border-radius:999px; flex-direction:row; align-items:center; gap:6px;
`;
const StreakText = styled.Text` color:#2b7a0b; font-weight:700; font-size:12px; `;

/* ---------- top controls (search + theme) ---------- */
const TopControls = styled.View`
  flex-direction: row; align-items: center; gap: 10px; margin-bottom: 12px;
`;
const Search = styled.Pressable`
  flex: 1; background: #f3f4f7; border-radius: 999px; padding: 10px 14px;
  flex-direction: row; align-items: center; gap: 8px;
`;
const SearchText = styled.Text` color:#9aa0a6; font-size:13px; `;
const IconBtn = styled.Pressable`
  width: 36px; height: 36px; border-radius: 10px; background:#f3f4f7; align-items:center; justify-content:center;
`;
const BellWrap = styled(IconBtn)` position: relative; `;
const Dot = styled.View`
  position:absolute; top: -3px; right: -3px; min-width: 16px; height:16px; padding:0 3px;
  border-radius: 8px; background:#ef4444; align-items:center; justify-content:center;
`;
const DotText = styled.Text` color:#fff; font-size:10px; font-weight:800; `;

/* ---------- common card ---------- */
const SectionCard = styled.View`
  background: ${(p: TTheme) => p.theme.colors.surface};
  border-radius: 16px; padding: 16px;
`;

/* ---------- hero ---------- */
const HeroCard = styled(LinearGradient).attrs((p: { theme: DefaultTheme }) => ({
  colors: [p.theme.colors.gradientFrom, p.theme.colors.gradientTo],
  start: { x: 0, y: 0 }, end: { x: 1, y: 1 },
}))`
  border-radius: 18px; padding: 16px; margin-bottom: 14px;
`;
const LiveBadge = styled.View`
  position:absolute; right:10px; top:10px; background: rgba(255,255,255,0.22);
  padding:4px 8px; border-radius:8px;
`;
const LiveText = styled.Text` color:#fff; font-weight:800; font-size:11px; `;
const HeroTitle = styled.Text` color:#fff; font-weight:900; font-size:16px; `;
const HeroSub = styled.Text` color:#fff; opacity:.95; margin-top:6px; `;

/* ---------- section titles ---------- */
const TitleRow = styled.View` margin:6px 2px 8px 2px; flex-direction:row; align-items:center; gap:6px; `;
const Title = styled.Text` font-weight:900; color:${(p:TTheme)=>p.theme.colors.text}; `;

/* ---------- KPI ---------- */
const KPIWrap = styled.View` flex-direction:row; gap:12px; margin-bottom:10px; `;
const KPI = styled(SectionCard)` flex:1; `;
const KpiTop = styled.View` flex-direction:row; align-items:center; justify-content:space-between; `;
const KpiTitleRow = styled.View` flex-direction:row; align-items:center; gap:6px; `;
const KpiTitle = styled.Text` color:#7a7a90; font-size:12px; font-weight:700; `;
const KpiValueRow = styled.View` flex-direction:row; align-items:flex-end; gap:6px; margin-top:8px; `;
const KpiValue = styled.Text` font-size:24px; font-weight:900; color:${(p:TTheme)=>p.theme.colors.text}; `;
const KpiUnit = styled.Text` color:#7a7a90; font-size:12px; `;
const Bar = styled.View` height:8px; background:#efeff5; border-radius:8px; margin-top:8px; `;
const Fill = styled.View<{ w: number; color?: string }>`
  height: 100%; width: ${(p: { w: number }) => p.w}%;
  background: ${(p: { color?: string }) => p.color ?? '#6E56CF'}; border-radius: 8px;
`;
const Hint = styled.Text` color:#7a7a90; font-size:12px; margin-top:8px; `;

/* ---------- sleep ---------- */
const SleepCard = styled(SectionCard)` margin-top:4px; `;
const Badge = styled.Text`
  padding:4px 8px; background:#f3f4f7; border-radius:999px; color:#7a7a90; font-weight:700; font-size:11px;
`;

/* ---------- reco ---------- */
const RecoOuter = styled(SectionCard)` margin-top:14px; `;
const RecoHeader = styled(TitleRow)``;
const RecoBox = styled.View<{ bg: string }>`
  background: ${(p: { bg: string }) => p.bg};
  border-radius: 14px; padding: 14px; margin-top: 10px;
`;
const RecoTitle = styled.Text` font-weight:900; color:#121212; margin-bottom:6px; `;
const RecoDesc = styled.Text` color:#7a7a90; `;
const ChipRow = styled.View` flex-direction:row; flex-wrap:wrap; gap:8px; margin-top:10px; `;
const Chip = styled.Text<{ fg?: string; bg?: string }>`
  color: ${(p: { fg?: string }) => p.fg ?? '#6E56CF'};
  background: ${(p: { bg?: string }) => p.bg ?? '#F3EFFF'};
  padding: 6px 10px; border-radius: 999px; font-size: 12px; font-weight: 700;
`;
const RightBadge = styled.Text`
  position:absolute; right:10px; top:10px; background:#eadcff; color:#6E56CF;
  padding:4px 8px; border-radius:999px; font-size:11px; font-weight:800;
`;

/* ---------- account popover ---------- */
const Dim = styled.Pressable` flex:1; background:rgba(0,0,0,0.25); `;
const MenuWrap = styled.View` flex:1; align-items:flex-end; `;
const Menu = styled.View`
  margin-top: 70px; margin-right: 12px; width: 260px;
  background: ${(p:TTheme)=>p.theme.colors.surface}; border-radius: 12px; padding: 10px;
`;
const MenuHeader = styled.View` padding:8px 10px 10px 10px; `;
const MenuName = styled.Text` font-weight:900; color:${(p:TTheme)=>p.theme.colors.text}; `;
const MenuEmail = styled.Text` color:#7a7a90; margin-top:2px; `;
const SmallPill = styled.Text`
  align-self:flex-start; margin-top:6px; padding:3px 8px; border-radius:999px;
  background:#f3f4f7; color:#7a7a90; font-size:11px; font-weight:700;
`;
const MenuItem = styled.Pressable` flex-direction:row; align-items:center; justify-content:space-between; padding:12px 10px; border-radius:10px; `;
const MenuText = styled.Text` color:${(p:TTheme)=>p.theme.colors.text}; font-weight:800; `;
const Divider = styled.View` height:1px; background:#eee; margin:6px -10px; `;

/* ---------- logout confirm modal ---------- */
const CDim = styled.Pressable` flex:1; background: rgba(0,0,0,0.45); align-items:center; justify-content:center; `;
const ConfirmCard = styled.View`
  width: 88%; background: ${(p:TTheme)=>p.theme.colors.surface};
  border-radius: 18px; padding: 16px;
`;
const ConfirmTopIcon = styled(LinearGradient).attrs({
  colors: ['#fecdd3', '#fda4af'],
  start: { x: 0, y: 0 }, end: { x: 1, y: 1 },
})`
  width: 56px; height: 56px; border-radius: 999px; align-self:center; align-items:center; justify-content:center;
`;
const ConfirmTitle = styled.Text` text-align:center; margin-top:12px; font-size:16px; font-weight:900; color:${(p:TTheme)=>p.theme.colors.text}; `;
const UserBox = styled.View`
  background:#faf5ff; border:1px solid #eadcff; border-radius:12px; padding:12px; margin-top:12px;
`;
const UName = styled.Text` text-align:center; font-weight:900; color:${(p:TTheme)=>p.theme.colors.text}; `;
const UMail = styled.Text` text-align:center; color:#7a7a90; margin-top:2px; `;
const Row = styled.View` flex-direction:row; gap:6px; align-self:center; margin-top:8px; `;
const Pill = styled.View` background:#f3f4f7; padding:4px 8px; border-radius:999px; flex-direction:row; align-items:center; gap:6px; `;
const PillText = styled.Text` color:#7a7a90; font-weight:700; font-size:11px; `;
const ConfirmMsg = styled.Text` text-align:center; color:#7a7a90; margin-top:12px; `;
const BtnRow = styled.View` flex-direction:row; gap:10px; margin-top:12px; `;
const GhostBtn = styled.Pressable` flex:1; background:#f3f4f7; padding:12px; border-radius:12px; align-items:center; `;
const GhostText = styled.Text` color:#121212; font-weight:800; `;
const GBtn = styled.Pressable` flex:1; `;
const GFill = styled(LinearGradient).attrs((p:{theme:DefaultTheme}) => ({
  colors: [p.theme.colors.gradientFrom, p.theme.colors.gradientTo],
  start: { x: 0, y: 0 }, end: { x: 1, y: 1 },
}))` padding:12px; border-radius:12px; align-items:center; `;
const GText = styled.Text` color:#fff; font-weight:800; `;

/* ---------- component ---------- */
export default function HomeScreen() {
  const { signOut, user } = useAuth() as any;
  const theme = useTheme() as DefaultTheme & { mode?: 'light'|'dark'; toggleMode?: () => void };

  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  // confirm modal animation
  const fade = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.92)).current;
  useEffect(() => {
    if (confirmOpen) {
      fade.setValue(0); scale.setValue(0.92);
      Animated.parallel([
        Animated.timing(fade, { toValue: 1, duration: 160, useNativeDriver: true }),
        Animated.spring(scale, { toValue: 1, useNativeDriver: true, friction: 8 }),
      ]).start();
    }
  }, [confirmOpen]);

  const onToggleTheme = () => {
    if (theme?.toggleMode) theme.toggleMode();
    else Alert.alert('테마 전환', 'ThemeProvider에 toggleMode를 연결해 주세요.');
  };

  const askLogout = () => {
    setMenuOpen(false);
    setTimeout(() => setConfirmOpen(true), 120);
  };

  const doLogout = () => {
    setConfirmOpen(false);
    setTimeout(() => signOut(), 140);
  };

  return (
    <Page>
      <Container>
        {/* header */}
        <Header>
          <BrandRow>
            <Logo start={{x:0,y:0}} end={{x:1,y:1}}>
              <LogoText>다</LogoText>
            </Logo>
            <BrandCol>
              <BrandTitle>다짐</BrandTitle>
              <BrandSubtitle>9월 18일 (목) · 저녁</BrandSubtitle>
            </BrandCol>
          </BrandRow>

          <HeaderRight>
            <Streak>
              <Ionicons name="flame" size={14} color="#2B7A0B" />
              <StreakText>7일째</StreakText>
            </Streak>
            {/* 알림 */}
            <BellWrap onPress={() => Alert.alert('알림', '알림 화면을 연결해 주세요.')}>
              <Ionicons name="notifications-outline" size={18} color="#121212" />
              <Dot><DotText>3</DotText></Dot>
            </BellWrap>
            {/* 계정(아바타) */}
            <Pressable onPress={() => setMenuOpen(true)} hitSlop={8}>
              <Logo start={{x:0,y:0}} end={{x:1,y:1}}>
                <Ionicons name="person" size={18} color="#fff" />
              </Logo>
            </Pressable>
          </HeaderRight>
        </Header>

        {/* search + theme toggle */}
        <TopControls>
          <Search onPress={() => Alert.alert('검색', '검색 화면을 연결해 주세요.')}>
            <Ionicons name="search" size={16} color="#7a7a90" />
            <SearchText>검색</SearchText>
          </Search>
          <IconBtn onPress={onToggleTheme}>
            <Ionicons name={theme?.mode === 'dark' ? 'sunny' : 'moon'} size={18} color="#121212" />
          </IconBtn>
        </TopControls>

        {/* hero */}
        <HeroCard style={appTheme.shadow.card}>
          <LiveBadge><LiveText>LIVE</LiveText></LiveBadge>
          <View style={{ flexDirection:'row', alignItems:'center', gap:10 }}>
            <View style={{
              width:36,height:36,borderRadius:18,backgroundColor:'rgba(255,255,255,0.25)',
              alignItems:'center',justifyContent:'center',
            }}>
              <Ionicons name="flash" size={20} color="#fff" />
            </View>
            <View style={{ flex:1 }}>
              <HeroTitle>다짐 AI 코치</HeroTitle>
              <HeroSub>하루 수고하셨어요 다짐 사용자님! 오늘의 마무리는? 🌙</HeroSub>
            </View>
          </View>
        </HeroCard>

        {/* 오늘의 목표 */}
        <TitleRow>
          <Ionicons name="checkmark-circle-outline" size={16} color="#6E56CF" />
          <Title>오늘의 목표</Title>
        </TitleRow>

        <KPIWrap>
          <KPI style={appTheme.shadow.card}>
            <KpiTop>
              <KpiTitleRow>
                <Ionicons name="nutrition-outline" size={16} color="#6E56CF" />
                <KpiTitle>칼로리</KpiTitle>
              </KpiTitleRow>
              <Ionicons name="information-circle-outline" size={16} color="#C0C3CF" />
            </KpiTop>
            <KpiValueRow>
              <KpiValue>1,430</KpiValue><KpiUnit>/ 2,000 kcal</KpiUnit>
            </KpiValueRow>
            <Bar><Fill w={72} /></Bar>
            <Hint>좋은 페이스네요! 🔥</Hint>
          </KPI>

          <KPI style={appTheme.shadow.card}>
            <KpiTop>
              <KpiTitleRow>
                <Ionicons name="time-outline" size={16} color="#6E56CF" />
                <KpiTitle>운동</KpiTitle>
              </KpiTitleRow>
              <Ionicons name="information-circle-outline" size={16} color="#C0C3CF" />
            </KpiTop>
            <KpiValueRow>
              <KpiValue>45</KpiValue><KpiUnit>/ 60 분</KpiUnit>
            </KpiValueRow>
            <Bar><Fill w={75} color="#0b76d1" /></Bar>
            <Hint>거의 다 왔어요! 파이팅! 🏋️‍♀️</Hint>
          </KPI>
        </KPIWrap>

        <KPIWrap>
          <KPI style={appTheme.shadow.card}>
            <KpiTop>
              <KpiTitleRow>
                <Ionicons name="water-outline" size={16} color="#6E56CF" />
                <KpiTitle>수분</KpiTitle>
              </KpiTitleRow>
              <Ionicons name="information-circle-outline" size={16} color="#C0C3CF" />
            </KpiTop>
            <KpiValueRow>
              <KpiValue>1.8</KpiValue><KpiUnit>/ 2.5L</KpiUnit>
            </KpiValueRow>
            <Bar><Fill w={72} color="#13a10e" /></Bar>
            <Hint>좋은 습관이에요! 💧</Hint>
          </KPI>

          <KPI style={appTheme.shadow.card}>
            <KpiTop>
              <KpiTitleRow>
                <Ionicons name="walk-outline" size={16} color="#6E56CF" />
                <KpiTitle>걸음</KpiTitle>
              </KpiTitleRow>
              <Ionicons name="information-circle-outline" size={16} color="#C0C3CF" />
            </KpiTop>
            <KpiValueRow>
              <KpiValue>8,240</KpiValue><KpiUnit>/ 10,000</KpiUnit>
            </KpiValueRow>
            <Bar><Fill w={82} color="#6E56CF" /></Bar>
            <Hint>목표까지 얼마 안 남았어요! ✨</Hint>
          </KPI>
        </KPIWrap>

        {/* 어젯밤 수면 */}
        <SleepCard style={appTheme.shadow.card}>
          <View style={{ flexDirection:'row', alignItems:'center', justifyContent:'space-between' }}>
            <View style={{ flexDirection:'row', alignItems:'center', gap:6 }}>
              <Ionicons name="moon-outline" size={16} color="#6E56CF" />
              <Title>어젯밤 수면</Title>
            </View>
            <Badge>양호</Badge>
          </View>

          <View style={{ flexDirection:'row', alignItems:'flex-end', gap:8, marginTop:8 }}>
            <Title style={{ fontSize:22 }}>7.5</Title>
            <Title style={{ fontSize:14, color:'#7a7a90' }}>시간</Title>
          </View>

          <View style={{ marginTop:6, flexDirection:'row', justifyContent:'space-between' }}>
            <Title style={{ color:'#7a7a90', fontSize:12 }}>목표: 8시간</Title>
            <Title style={{ color:'#7a7a90', fontSize:12 }}>23:30 - 07:00</Title>
          </View>
        </SleepCard>

        {/* AI 맞춤 추천 */}
        <RecoOuter style={appTheme.shadow.card}>
          <RecoHeader>
            <Ionicons name="sparkles" size={16} color="#6E56CF" />
            <Title>AI 맞춤 추천</Title>
          </RecoHeader>

          <RecoBox bg="#F7E9FF">
            <RightBadge>실시간</RightBadge>
            <RecoTitle>저녁 식단 추천</RecoTitle>
            <RecoDesc>현재까지 1,430 kcal 섭취하셨어요. 균형잡힌 저녁식사로 목표를 달성해보세요!</RecoDesc>
            <ChipRow>
              <Chip>연어 스테이크</Chip><Chip>브로콜리</Chip><Chip>현미밥</Chip><Chip>아보카도</Chip>
            </ChipRow>
            <RecoDesc style={{ marginTop: 8 }}>예상 칼로리: 520 kcal · 단백질 풍부</RecoDesc>
          </RecoBox>

          <RecoBox bg="#EAF3FF">
            <RightBadge>15분 고강도</RightBadge>
            <RecoTitle>맞춤 운동</RecoTitle>
            <RecoDesc>15분의 운동이 더 필요해요. 짧고 강렬한 운동으로 마무리해주세요!</RecoDesc>
            <ChipRow>
              <Chip bg="#FFF3E6" fg="#FF8A00">버피 테스트</Chip>
              <Chip bg="#FFF3E6" fg="#FF8A00">플랭크</Chip>
              <Chip bg="#FFF3E6" fg="#FF8A00">스쿼트</Chip>
              <Chip bg="#FFF3E6" fg="#FF8A00">점핑잭</Chip>
            </ChipRow>
            <RecoDesc style={{ marginTop: 8 }}>칼로리 소모: ≈150 kcal · 전신운동</RecoDesc>
          </RecoBox>

          <RecoBox bg="#EAF8EE">
            <RecoTitle>오늘의 건강 팁</RecoTitle>
            <RecoDesc>물 섭취량이 목표에 가까워지고 있어요! 식사 30분 전후로는 물을 조금씩 마시면 소화에 도움이 됩니다.</RecoDesc>
          </RecoBox>
        </RecoOuter>
      </Container>

      {/* account popover */}
      <Modal visible={menuOpen} transparent animationType="fade" onRequestClose={() => setMenuOpen(false)}>
        <Dim onPress={() => setMenuOpen(false)}>
          <MenuWrap>
            <Menu style={appTheme.shadow.card}>
              <MenuHeader>
                <MenuName>{user?.name ?? '다짐 사용자'}</MenuName>
                <MenuEmail>{user?.email ?? 'user@example.com'}</MenuEmail>
                <SmallPill>목표 미설정</SmallPill>
              </MenuHeader>

              <Divider />

              <MenuItem onPress={() => Alert.alert('프로필', '프로필 관리 화면 연결')}>
                <MenuText>프로필 관리</MenuText>
                <Ionicons name="person-circle-outline" size={18} color="#7a7a90" />
              </MenuItem>
              <MenuItem onPress={() => Alert.alert('설정', '설정 화면 연결')}>
                <MenuText>설정</MenuText>
                <Ionicons name="settings-outline" size={18} color="#7a7a90" />
              </MenuItem>
              <MenuItem onPress={() => Alert.alert('개인정보 보호', '정책 화면 연결')}>
                <MenuText>개인정보 보호</MenuText>
                <Ionicons name="shield-checkmark-outline" size={18} color="#7a7a90" />
              </MenuItem>
              <MenuItem onPress={() => Alert.alert('도움말', '헬프/FAQ 화면 연결')}>
                <MenuText>도움말</MenuText>
                <Ionicons name="help-circle-outline" size={18} color="#7a7a90" />
              </MenuItem>

              <Divider />

              <MenuItem onPress={askLogout}>
                <MenuText style={{ color: '#ef4444' }}>로그아웃</MenuText>
                <Ionicons name="log-out-outline" size={18} color="#ef4444" />
              </MenuItem>
            </Menu>
          </MenuWrap>
        </Dim>
      </Modal>

      {/* logout confirm modal with animation */}
      <Modal visible={confirmOpen} transparent animationType="none" onRequestClose={() => setConfirmOpen(false)}>
        <CDim onPress={() => setConfirmOpen(false)}>
          <Animated.View style={{ transform: [{ scale }], opacity: fade, width: '100%', alignItems: 'center' }}>
            <ConfirmCard style={appTheme.shadow.card}>
              <ConfirmTopIcon start={{x:0,y:0}} end={{x:1,y:1}}>
                <Ionicons name="log-out-outline" size={24} color="#fff" />
              </ConfirmTopIcon>
              <ConfirmTitle>로그아웃 하시겠습니까?</ConfirmTitle>

              <UserBox>
                <UName>{user?.name ?? '다짐 사용자님'}</UName>
                <UMail>{user?.email ?? 'user@example.com'}</UMail>
                <Row>
                  <Pill>
                    <Ionicons name="flame" size={12} color="#ef4444" />
                    <PillText>7일 연속</PillText>
                  </Pill>
                  <Pill>
                    <Ionicons name="ellipse-outline" size={12} color="#7a7a90" />
                    <PillText>목표 미설정</PillText>
                  </Pill>
                </Row>
              </UserBox>

              <ConfirmMsg>정말로 로그아웃 하시겠어요?{'\n'}다시 로그인하여 건강한 다짐을 이어가세요! 💪</ConfirmMsg>

              <BtnRow>
                <GhostBtn onPress={() => setConfirmOpen(false)}>
                  <GhostText>취소하고 계속하기</GhostText>
                </GhostBtn>
                <GBtn onPress={doLogout}>
                  <GFill><GText>로그아웃</GText></GFill>
                </GBtn>
              </BtnRow>
            </ConfirmCard>
          </Animated.View>
        </CDim>
      </Modal>
    </Page>
  );
}
