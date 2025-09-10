// App.tsx
import React, { useEffect } from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import MainTabs from './stack/MainTabs';
import { ThemeProvider } from 'styled-components/native';
import theme from './src/styles/theme';
import * as NavigationBar from 'expo-navigation-bar';
import { StatusBar } from 'expo-status-bar';

const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: theme.colors.background,
    primary: theme.colors.primary,
    card: theme.colors.surface,
    border: theme.colors.border,
    text: theme.colors.text,
  },
};

export default function App() {
  useEffect(() => {
    (async () => {
      try {
        // 완전 몰입형: 내비게이션 바 숨기고 스와이프로만 잠깐 나타남
        await NavigationBar.setVisibilityAsync('hidden'); // 'hidden' 도 가능
        await NavigationBar.setBehaviorAsync('overlay-swipe'); // 콘텐츠를 가리지 않게
        await NavigationBar.setBackgroundColorAsync('transparent');
        // 상단 상태바(시계/배터리)는 숨기고 싶으면 아래 주석 해제
        // StatusBar.setHidden(true, 'fade');
      } catch (e) {
        console.warn('NavigationBar config failed', e);
      }
    })();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      {/* 상태바를 숨기지 않을 거면 style만 지정 */}
      <StatusBar style="dark" translucent backgroundColor="transparent" />
      <NavigationContainer theme={MyTheme}>
        <MainTabs />
      </NavigationContainer>
    </ThemeProvider>
  );
}
