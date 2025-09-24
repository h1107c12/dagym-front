// screens/ReportScreen.tsx
import React, { useMemo, useRef, useState } from 'react';
import { ScrollView, View, Animated, Easing } from 'react-native';
import type { LayoutChangeEvent } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styled from 'styled-components/native';
import type { DefaultTheme } from 'styled-components/native';
import Svg, { G, Line as SvgLine, Polyline, Circle, Rect } from 'react-native-svg';

const Page = styled(SafeAreaView)`flex:1;background-color:${(p:{theme:DefaultTheme})=>p.theme.colors.background};`;
const Container = styled(ScrollView).attrs({
  contentContainerStyle:{ paddingTop:20, paddingHorizontal:16, paddingBottom:16 },
})`flex:1;`;

const Hero = styled.View`background:#8a63d2;border-radius:16px;padding:16px;margin-bottom:16px;`;
const HeroTitle = styled.Text`color:#fff;font-weight:800;margin-bottom:4px;`;
const HeroValue = styled.Text`color:#fff;font-weight:800;font-size:20px;`;

const Grid = styled.View`flex-direction:row;flex-wrap:wrap;gap:12px;`;
const Card = styled.View`background:#fff;border-radius:16px;padding:16px;width:48%;`;
const Title = styled.Text`font-weight:800;margin-bottom:6px;`;
const Sub = styled.Text`color:#7a7a90;`;

const ChartCard = styled.View`background:#fff;border-radius:16px;padding:16px;margin-top:12px;`;

/* -------------------- 더미 데이터 -------------------- */
const REPORT = {
  monthLabel: '9월 진행 리포트',
  achievementRate: 82,
  summary: { weightDeltaKg: -2.3, workoutDays: 18 },
  stats: {
    weightLossKg: { value: 2.3, target: 5 },
    avgCalories:  { value: 1863, target: 1800 },
    workoutDays:  { value: 18,   target: 20 },
    bodyFatDrop:  { value: 2.1,  target: 3 },
  },
  weekly: [
    { day: '월', weight: 72.5, exerciseMin: 45 },
    { day: '화', weight: 72.2, exerciseMin: 30 },
    { day: '수', weight: 72.0, exerciseMin: 60 },
    { day: '목', weight: 71.8, exerciseMin: 0  },
    { day: '금', weight: 71.9, exerciseMin: 45 },
    { day: '토', weight: 72.0, exerciseMin: 0  },
    { day: '일', weight: 71.7, exerciseMin: 38 },
  ],
} as const;
/* --------------------------------------------------- */

const AnimatedPolyline = Animated.createAnimatedComponent(Polyline);
const AnimatedCircle   = Animated.createAnimatedComponent(Circle);
const AnimatedRect     = Animated.createAnimatedComponent(Rect);

export default function ReportScreen() {
  const weightDelta = REPORT.summary.weightDeltaKg;
  const weightDeltaText = `${weightDelta > 0 ? '+' : ''}${weightDelta}kg · ${REPORT.summary.workoutDays}일`;

  const [wChart, setWChart] = useState(0);
  const [hChart, setHChart] = useState(0);
  const pad = 16;

  // line scale
  const weights = REPORT.weekly.map(d => d.weight);
  const minY = Math.floor(Math.min(...weights) * 10) / 10 - 0.2;
  const maxY = Math.ceil(Math.max(...weights) * 10) / 10 + 0.2;

  const toX = (i:number) => (REPORT.weekly.length<=1? pad : pad + (i * (wChart - pad*2)) / (REPORT.weekly.length - 1));
  const toY = (v:number) => {
    const t = (v - minY) / (maxY - minY);
    return hChart - pad - t * (hChart - pad*2);
  };

  const points = REPORT.weekly.map((d,i)=>({ x:toX(i), y:toY(d.weight) }));
  const pathPoints = points.map(p=>`${p.x},${p.y}`).join(' ');
  const totalLen = useMemo(()=>{
    let len = 0;
    for (let i=1;i<points.length;i++){
      const dx = points[i].x - points[i-1].x;
      const dy = points[i].y - points[i-1].y;
      len += Math.sqrt(dx*dx + dy*dy);
    }
    return len;
  },[wChart,hChart]);

  // bar scale
  const maxMin = Math.max(...REPORT.weekly.map(d=>d.exerciseMin), 60);
  const barW = useMemo(()=>{
    if (wChart<=0) return 0;
    const innerW = wChart - pad*2;
    return innerW / REPORT.weekly.length * 0.55;
  },[wChart]);

  // animations
  const lineProg = useRef(new Animated.Value(0)).current;
  const dotProgs = useRef(REPORT.weekly.map(()=>new Animated.Value(0))).current;
  const barProgs = useRef(REPORT.weekly.map(()=>new Animated.Value(0))).current;

  useFocusEffect(
    React.useCallback(()=>{
      if (wChart<=0 || hChart<=0) return;
      lineProg.setValue(0);
      dotProgs.forEach(v=>v.setValue(0));
      barProgs.forEach(v=>v.setValue(0));

      const dotAnims = dotProgs.map((v,i)=>Animated.timing(v,{toValue:1,duration:260,delay:60+i*70,useNativeDriver:true}));
      const barAnims = barProgs.map((v,i)=>Animated.timing(v,{toValue:1,duration:420,delay:80+i*60,easing:Easing.out(Easing.cubic),useNativeDriver:false}));

      Animated.parallel([
        Animated.timing(lineProg,{toValue:1,duration:800,easing:Easing.out(Easing.cubic),useNativeDriver:false}),
        Animated.stagger(40,dotAnims),
        Animated.stagger(30,barAnims),
      ]).start();
    },[wChart,hChart])
  );

  const dashOffset = lineProg.interpolate({ inputRange:[0,1], outputRange:[totalLen||1,0] });

  return (
    <Page>
      <Container>
        <Hero>
          <HeroTitle>{REPORT.monthLabel}</HeroTitle>
          <Sub style={{ color:'#EDE7FF', marginBottom:8 }}>목표 달성도 {REPORT.achievementRate}%</Sub>
          <HeroValue>{weightDeltaText}</HeroValue>
        </Hero>

        <Grid>
          <Card><Title>체중 감량</Title><HeroValue style={{color:'#121212',fontSize:18}}>{REPORT.stats.weightLossKg.value} kg</HeroValue><Sub>목표: {REPORT.stats.weightLossKg.target}kg</Sub></Card>
          <Card><Title>평균 칼로리</Title><HeroValue style={{color:'#121212',fontSize:18}}>{REPORT.stats.avgCalories.value} kcal</HeroValue><Sub>목표: {REPORT.stats.avgCalories.target}kcal</Sub></Card>
          <Card><Title>운동 일수</Title><HeroValue style={{color:'#121212',fontSize:18}}>{REPORT.stats.workoutDays.value} 일</HeroValue><Sub>목표: {REPORT.stats.workoutDays.target}일</Sub></Card>
          <Card><Title>체지방 감소</Title><HeroValue style={{color:'#121212',fontSize:18}}>{REPORT.stats.bodyFatDrop.value} %</HeroValue><Sub>목표: {REPORT.stats.bodyFatDrop.target}%</Sub></Card>
        </Grid>

        {/* 주간 체중 변화 */}
        <ChartCard
          onLayout={(e: LayoutChangeEvent) => {
            setWChart(e.nativeEvent.layout.width);
            setHChart(220);
          }}
        >
          <Title>주간 체중 변화</Title>

          {wChart>0 && (
            <Svg width={wChart} height={220}>
              <G>
                {[0,1,2,3,4].map(i=>{
                  const y = 16 + ((220 - 32) * i)/4;
                  return <SvgLine key={i} x1={16} y1={y} x2={wChart-16} y2={y} stroke="#EAEAF0" strokeDasharray="3 3" />;
                })}
              </G>

              <AnimatedPolyline
                points={pathPoints}
                fill="none"
                stroke="#6e56cf"
                strokeWidth={3}
                strokeLinecap="round"
                strokeDasharray={`${totalLen}, ${totalLen}`}
                strokeDashoffset={dashOffset as any}
              />

              {points.map((p,i)=>{
                const rAnim = dotProgs[i].interpolate({ inputRange:[0,1], outputRange:[0.5,4] });
                return (
                  <AnimatedCircle
                    key={i}
                    cx={p.x}
                    cy={p.y}
                    r={rAnim as any}
                    fill="#6e56cf"
                    opacity={dotProgs[i] as any}
                  />
                );
              })}
            </Svg>
          )}

          <View style={{ flexDirection:'row', justifyContent:'space-between', marginTop:6, paddingHorizontal:4 }}>
            {REPORT.weekly.map(d=>(
              <Sub key={d.day} style={{ width:24, textAlign:'center' }}>{d.day}</Sub>
            ))}
          </View>
        </ChartCard>

        {/* 주간 운동 시간 */}
        <ChartCard>
          <Title>주간 운동 시간</Title>

          {wChart>0 && (
            <Svg width={wChart} height={220}>
              <G>
                {[0,1,2,3,4,5].map(i=>{
                  const y = 16 + ((220 - 32) * i)/5;
                  return <SvgLine key={i} x1={16} y1={y} x2={wChart-16} y2={y} stroke="#EAEAF0" strokeDasharray="3 3" />;
                })}
              </G>

              <G>
                {REPORT.weekly.map((d,i)=>{
                  const innerW = wChart - 16*2;
                  const slotW = innerW / REPORT.weekly.length;
                  const centerX = 16 + slotW*i + slotW/2;
                  const maxH = 220 - 16*2;
                  const targetH = (d.exerciseMin / maxMin) * maxH;
                  const hAnim = barProgs[i].interpolate({ inputRange:[0,1], outputRange:[0, targetH] });
                  const yAnim = barProgs[i].interpolate({ inputRange:[0,1], outputRange:[220-16, 220-16-targetH] });

                  return (
                    <AnimatedRect
                      key={d.day}
                      x={centerX - (barW/2)}
                      width={barW}
                      y={yAnim as any}
                      height={hAnim as any}
                      fill="#3b82f6"
                      rx={6}
                    />
                  );
                })}
              </G>
            </Svg>
          )}

          <View style={{ flexDirection:'row', justifyContent:'space-between', marginTop:6, paddingHorizontal:4 }}>
            {REPORT.weekly.map(d=>(
              <Sub key={d.day} style={{ width:24, textAlign:'center' }}>{d.day}</Sub>
            ))}
          </View>
        </ChartCard>
      </Container>
    </Page>
  );
}
