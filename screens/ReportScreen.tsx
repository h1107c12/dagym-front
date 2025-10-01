// screens/ReportScreen.tsx
import React, { useMemo, useState, useEffect } from 'react';
import { ScrollView, View, Animated, Easing } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styled from 'styled-components/native';
import type { DefaultTheme } from 'styled-components/native';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from '@expo/vector-icons/Ionicons';
import Svg, {
  Polyline,
  Line as SvgLine,
  Circle,
  Rect,
  G,
  Text as SvgText,
} from 'react-native-svg';

type TTheme = { theme: DefaultTheme };

const Page = styled(SafeAreaView)`flex:1;background:${(p:TTheme)=>p.theme.colors.background};`;
const Container = styled(ScrollView).attrs({
  contentContainerStyle:{ paddingTop:20, paddingHorizontal:16, paddingBottom:24 },
})`flex:1;`;

/* 메인 컬러 그라데이션(테마 사용) */
const Hero = styled(LinearGradient).attrs((p:{theme:DefaultTheme})=>({
  colors:[p.theme.colors.gradientFrom, p.theme.colors.gradientTo],
  start:{x:0,y:0}, end:{x:1,y:1},
}))`border-radius:16px;padding:16px;margin-bottom:16px;`;

const HeroTitle = styled.Text`color:#fff;font-weight:800;margin-bottom:4px;`;
const HeroMeta  = styled.Text`color:rgba(255,255,255,.9);`;
const HeroBig   = styled.Text`color:#fff;font-weight:800;font-size:20px;`;

const Grid = styled.View`flex-direction:row;flex-wrap:wrap;gap:12px;`;
const Card = styled.View`
  background:${(p:TTheme)=>p.theme.colors.surface};
  border-radius:16px;padding:16px;width:48%;
`;
const Title = styled.Text`font-weight:800;margin-bottom:6px;color:${(p:TTheme)=>p.theme.colors.text};`;
const Sub = styled.Text`color:#7a7a90;`;

/* 프로그레스 바: 기본색을 primary로 */
const ProgressTrack = styled.View`height:6px;background:#eee;border-radius:999px;margin-top:8px;`;
const ProgressFill  = styled.View<{w:number;color?:string}>`
  height:100%;width:${p=>p.w}%;border-radius:999px;background:${(p:TTheme & {color?:string})=>p.color ?? p.theme.colors.primary};
`;

const ChartCard = styled.View`
  background:${(p:TTheme)=>p.theme.colors.surface};
  border-radius:16px;padding:16px;margin-top:12px;
`;
const SectionHeader = styled.View`flex-direction:row;align-items:center;gap:6px;margin-bottom:12px;`;
const SectionTitle  = styled.Text`font-weight:900;color:${(p:TTheme)=>p.theme.colors.text};`;

const CoachCard = styled(LinearGradient).attrs({
  colors:['#ecfdf5','#e6fffb'], start:{x:0,y:0}, end:{x:1,y:1},
})`border-radius:16px;padding:16px;margin-top:12px;border-width:1px;border-color:#a7f3d0;`;

const weeklyData = [
  { day:'월', weight:72.5, exercise:45 },
  { day:'화', weight:72.3, exercise:30 },
  { day:'수', weight:72.1, exercise:60 },
  { day:'목', weight:72.0, exercise:0  },
  { day:'금', weight:71.8, exercise:45 },
  { day:'토', weight:71.9, exercise:0  },
  { day:'일', weight:71.7, exercise:40 },
];

const monthlyStats = {
  weightLoss:  { label:'체중 감량',   value:2.3, unit:'kg',   target:5 },
  avgCalories: { label:'평균 칼로리', value:1863, unit:'kcal', target:1800 },
  workoutDays: { label:'운동 일수',   value:18,  unit:'일',   target:20 },
  bodyFat:     { label:'체지방 감소', value:2.1, unit:'%',   target:3 },
};

/* chart dims */
const CHART_H = 208;
const PAD = { l: 64, r: 16, t: 20, b: 36 };

/* Animated SVG components */
const AnimatedPolyline = Animated.createAnimatedComponent(Polyline);
const AnimatedRect     = Animated.createAnimatedComponent(Rect);

export default function ReportScreen() {
  const [wChartW, setWChartW] = useState(0);
  const [eChartW, setEChartW] = useState(0);

  const sx = (i:number,count:number,width:number)=>{
    const usable = width - PAD.l - PAD.r;
    return PAD.l + (usable*i)/(count-1);
  };
  const sy = (val:number,min:number,max:number)=>{
    const usable = CHART_H - PAD.t - PAD.b;
    const t = (val-min)/(max-min||1);
    return CHART_H - PAD.b - t*usable;
  };

  /* ===== 꺾은선(체중) 애니메이션 ===== */
  const yTicksWeight = [71, 71.5, 72, 72.5, 73];
  const wMin = yTicksWeight[0];
  const wMax = yTicksWeight[yTicksWeight.length-1];

  const weightPts = useMemo(()=>{
    if(!wChartW) return [] as {x:number;y:number}[];
    return weeklyData.map((d,i)=>({ x: sx(i,weeklyData.length,wChartW), y: sy(d.weight,wMin,wMax) }));
  },[wChartW]);

  // polyline 길이
  const pathLen = useMemo(()=>{
    if(weightPts.length<2) return 0;
    let L = 0;
    for(let i=1;i<weightPts.length;i++){
      const a=weightPts[i-1], b=weightPts[i];
      L += Math.hypot(b.x-a.x, b.y-a.y);
    }
    return L;
  },[weightPts]);

  // dashoffset 애니메이션 (왼→오)
  const dashOffset = useMemo(()=>new Animated.Value(0),[]);
  useEffect(()=>{
    if(pathLen>0){
      dashOffset.setValue(pathLen);
      Animated.timing(dashOffset,{
        toValue: 0,
        duration: 1100,
        easing: Easing.inOut(Easing.cubic),
        useNativeDriver: false,
      }).start();
    }
  },[pathLen, dashOffset]);

  /* ===== 막대(운동) 애니메이션 ===== */
  const barProgress = useMemo(()=>weeklyData.map(()=>new Animated.Value(0)),[]);
  useEffect(()=>{
    if(eChartW>0){
      Animated.stagger(
        90,
        barProgress.map(v=>Animated.timing(v,{
          toValue: 1,
          duration: 600,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: false,
        }))
      ).start();
    }
  },[eChartW, barProgress]);

  return (
    <Page>
      <Container>

        {/* HERO */}
        <Hero>
          <HeroTitle>8월 진행 리포트</HeroTitle>
          <HeroMeta>목표 달성도 82%</HeroMeta>
          <View style={{flexDirection:'row',gap:24,marginTop:8}}>
            <View><HeroBig>-2.3kg</HeroBig><HeroMeta>체중 감량</HeroMeta></View>
            <View><HeroBig>18일</HeroBig><HeroMeta>운동 일수</HeroMeta></View>
          </View>
        </Hero>

        {/* 4 stats */}
        <Grid>
          <Card>
            <Title>{monthlyStats.weightLoss.label}</Title>
            <HeroBig style={{color:'#121212',fontSize:18}}>
              {monthlyStats.weightLoss.value} {monthlyStats.weightLoss.unit}
            </HeroBig>
            <Sub>목표: {monthlyStats.weightLoss.target}{monthlyStats.weightLoss.unit}</Sub>
            <ProgressTrack>
              <ProgressFill w={(monthlyStats.weightLoss.value/monthlyStats.weightLoss.target)*100}/>
            </ProgressTrack>
          </Card>

          <Card>
            <Title>{monthlyStats.avgCalories.label}</Title>
            <HeroBig style={{color:'#121212',fontSize:18}}>
              {monthlyStats.avgCalories.value} {monthlyStats.avgCalories.unit}
            </HeroBig>
            <Sub>목표: {monthlyStats.avgCalories.target}{monthlyStats.avgCalories.unit}</Sub>
            <ProgressTrack>
              <ProgressFill w={(monthlyStats.avgCalories.value/monthlyStats.avgCalories.target)*100}/>
            </ProgressTrack>
          </Card>

          <Card>
            <Title>{monthlyStats.workoutDays.label}</Title>
            <HeroBig style={{color:'#121212',fontSize:18}}>
              {monthlyStats.workoutDays.value} {monthlyStats.workoutDays.unit}
            </HeroBig>
            <Sub>목표: {monthlyStats.workoutDays.target}{monthlyStats.workoutDays.unit}</Sub>
            <ProgressTrack>
              <ProgressFill w={(monthlyStats.workoutDays.value/monthlyStats.workoutDays.target)*100}/>
            </ProgressTrack>
          </Card>

          <Card>
            <Title>{monthlyStats.bodyFat.label}</Title>
            <HeroBig style={{color:'#121212',fontSize:18}}>
              {monthlyStats.bodyFat.value} {monthlyStats.bodyFat.unit}
            </HeroBig>
            <Sub>목표: {monthlyStats.bodyFat.target}{monthlyStats.bodyFat.unit}</Sub>
            <ProgressTrack>
              {/* 체지방은 경고 톤 유지 원하면 빨강, 아니면 primary로 바꿔도 됨 */}
              <ProgressFill w={(monthlyStats.bodyFat.value/monthlyStats.bodyFat.target)*100} color="#ef4444"/>
            </ProgressTrack>
          </Card>
        </Grid>

        {/* ===== 주간 체중 변화 (꺾은선 애니메이션) ===== */}
        <ChartCard>
          <SectionHeader>
            <Ionicons name="trending-down-outline" size={16} color="#99B7E8" />
            <SectionTitle>주간 체중 변화</SectionTitle>
          </SectionHeader>

          <View style={{width:'100%',alignItems:'center'}}
                onLayout={(e)=>setWChartW(e.nativeEvent.layout.width)}>
            {wChartW>0 && (
              <Svg width={wChartW} height={CHART_H}>
                {/* grid + y labels */}
                <G>
                  {yTicksWeight.map((v,i)=>{
                    const y = sy(v, wMin, wMax);
                    return (
                      <G key={i}>
                        <SvgLine x1={PAD.l} y1={y} x2={wChartW-PAD.r} y2={y} stroke="#eaeaea" strokeWidth={1}/>
                        <SvgText x={PAD.l-14} y={y+3} fill="#9aa0a6" fontSize={11} textAnchor="end">{v}</SvgText>
                      </G>
                    );
                  })}
                </G>
                {/* vertical grid */}
                <G>
                  {weeklyData.map((_,i)=>{
                    const x = sx(i,weeklyData.length,wChartW);
                    return <SvgLine key={i} x1={x} y1={PAD.t} x2={x} y2={CHART_H-PAD.b-6} stroke="#eaeaea" strokeWidth={1} strokeDasharray="4 4"/>;
                  })}
                </G>
                <SvgLine x1={PAD.l} y1={CHART_H-PAD.b-6} x2={wChartW-PAD.r} y2={CHART_H-PAD.b-6} stroke="#D7DBE7" strokeWidth={1.5}/>

                {/* x labels */}
                <G>
                  {weeklyData.map((d,i)=>(
                    <SvgText key={i} x={sx(i,weeklyData.length,wChartW)} y={CHART_H-PAD.b+16} fill="#9aa0a6" fontSize={12} textAnchor="middle">
                      {d.day}
                    </SvgText>
                  ))}
                </G>

                {/* line reveal: dashoffset 애니메이션 */}
                <AnimatedPolyline
                  points={weightPts.map(p=>`${p.x},${p.y}`).join(' ')}
                  fill="none"
                  stroke={(Hero as any).attrs?.theme?.colors?.primary ?? '#99B7E8'}
                  strokeWidth={3}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray={`${pathLen} ${pathLen}`}
                  strokeDashoffset={dashOffset as unknown as any}
                />
                {/* dots: 메인컬러 */}
                {weightPts.map((p,i)=>(
                  <Circle key={i} cx={p.x} cy={p.y} r={4} fill="#99B7E8" stroke="#fff" strokeWidth={1.2}/>
                ))}
              </Svg>
            )}
          </View>
        </ChartCard>

        {/* ===== 주간 운동 시간 (막대 애니메이션) ===== */}
        <ChartCard>
          <SectionHeader>
            <Ionicons name="calendar-outline" size={16} color="#99B7E8" />
            <SectionTitle>주간 운동 시간</SectionTitle>
          </SectionHeader>

          <View style={{width:'100%',alignItems:'center'}}
                onLayout={(e)=>setEChartW(e.nativeEvent.layout.width)}>
            {eChartW>0 && (
              <Svg width={eChartW} height={CHART_H}>
                {/* grid + y labels */}
                <G>
                  {[0,15,30,45,60].map((v,i)=>{
                    const y = sy(v,0,60);
                    return (
                      <G key={i}>
                        <SvgLine x1={PAD.l} y1={y} x2={eChartW-PAD.r} y2={y} stroke="#eaeaea" strokeWidth={1}/>
                        <SvgText x={PAD.l-14} y={y+3} fill="#9aa0a6" fontSize={11} textAnchor="end">{v}</SvgText>
                      </G>
                    );
                  })}
                </G>
                {/* vertical grid */}
                <G>
                  {weeklyData.map((_,i)=>{
                    const x = sx(i,weeklyData.length,eChartW);
                    return <SvgLine key={i} x1={x} y1={PAD.t} x2={x} y2={CHART_H-PAD.b-6} stroke="#eaeaea" strokeWidth={1} strokeDasharray="4 4"/>;
                  })}
                </G>
                <SvgLine x1={PAD.l} y1={CHART_H-PAD.b-6} x2={eChartW-PAD.r} y2={CHART_H-PAD.b-6} stroke="#D7DBE7" strokeWidth={1.5}/>

                {/* bars: 아래에서 위로 (메인컬러) */}
                {weeklyData.map((d,i)=>{
                  const x = sx(i,weeklyData.length,eChartW);
                  const barW = 22;
                  const yBase = CHART_H - PAD.b - 6;
                  const yTop  = sy(d.exercise,0,60);
                  const hTarget = Math.max(0, yBase - yTop);

                  const yAnim = barProgress[i].interpolate({ inputRange:[0,1], outputRange:[yBase, yTop] });
                  const hAnim = barProgress[i].interpolate({ inputRange:[0,1], outputRange:[0, hTarget] });

                  return (
                    <AnimatedRect
                      key={i}
                      x={x - barW/2}
                      y={yAnim as unknown as any}
                      width={barW}
                      height={hAnim as unknown as any}
                      fill="#99B7E8"
                      rx={4}
                    />
                  );
                })}

                {/* x labels */}
                <G>
                  {weeklyData.map((d,i)=>(
                    <SvgText key={i} x={sx(i,weeklyData.length,eChartW)} y={CHART_H-PAD.b+16} fill="#9aa0a6" fontSize={12} textAnchor="middle">
                      {d.day}
                    </SvgText>
                  ))}
                </G>
              </Svg>
            )}
          </View>
        </ChartCard>

        {/* Achievements */}
        <ChartCard>
          <Title>이번 달 달성 현황</Title>
          <View style={{flexDirection:'row',flexWrap:'wrap',gap:10,marginTop:8}}>
            {[{icon:'🏋️',name:'주 3회 운동',done:true},
              {icon:'🎯',name:'목표 칼로리 달성',done:true},
              {icon:'⚖️',name:'체중 감량 목표',done:false},
              {icon:'🔥',name:'연속 기록',done:true}].map((a,idx)=>(
              <View key={idx} style={{
                width:'48%',borderRadius:12,padding:12,borderWidth:2,
                borderColor:a.done?'#bbf7d0':'#e5e7eb', backgroundColor:a.done?'#f0fdf4':'#f9fafb',
              }}>
                <View style={{flexDirection:'row',alignItems:'center',gap:8}}>
                  <View style={{width:24,alignItems:'center'}}><Sub style={{fontSize:18}}>{a.icon}</Sub></View>
                  <View style={{flex:1}}>
                    <Title style={{fontSize:14}}>{a.name}</Title>
                    <Sub>{a.done ? '완료' : '진행중'}</Sub>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </ChartCard>

        {/* Coach */}
        <CoachCard>
          <Title>🤖 다짐 코치 피드백</Title>
          <View style={{marginTop:6}}>
            <Sub><Sub style={{fontWeight:'bold',color:'#065f46'}}>잘하고 있어요!</Sub> 이번 주 운동 참여율이 85%로 목표를 달성했습니다.</Sub>
            <Sub style={{marginTop:6}}>체중이 꾸준히 감소하고 있어요. 현재 속도로 가면 목표 체중에 3주 후 도달 예상됩니다.</Sub>
            <Sub style={{marginTop:6}}><Sub style={{fontWeight:'bold',color:'#065f46'}}>개선 포인트:</Sub> 주말 운동량이 부족해요. 가벼운 산책이나 스트레칭을 추천드립니다.</Sub>
          </View>
        </CoachCard>

      </Container>
    </Page>
  );
}
