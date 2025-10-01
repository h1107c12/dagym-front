// App.tsx
import React, { useEffect } from 'react';
import { NavigationContainer, DefaultTheme as NavDefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ThemeProvider } from 'styled-components/native';
import * as NavigationBar from 'expo-navigation-bar';
import { StatusBar } from 'expo-status-bar';

import theme from './src/styles/theme';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import MainTabs from './stack/MainTabs';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import SettingsScreen from './screens/SettingsScreen';          
import PrivacyPolicyScreen from './screens/PrivacyPolicyScreen';
import HelpScreen from './screens/HelpScreen';

// react-navigation 테마를 앱 테마에 맞게 매핑
const MyTheme = {
  ...NavDefaultTheme,
  colors: {
    ...NavDefaultTheme.colors,
    background: theme.colors.background,
    primary: theme.colors.primary,
    card: theme.colors.surface,
    border: theme.colors.border,
    text: theme.colors.text,
  },
};

// 전역 스택 타입
export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Main: undefined;
  Settings: undefined;
  PrivacyPolicy: undefined;
  Help: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator() {
  const { isLoading, session } = useAuth();
  if (isLoading) return null;

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {session ? (
        <>
          {/* 메인 탭 */}
          <Stack.Screen name="Main" component={MainTabs} />

          {/* 설정 모달 */}
          <Stack.Screen
            name="Settings"
            component={SettingsScreen}
            options={{
              presentation: 'modal',
              animation: 'slide_from_bottom',
              headerShown: false,
            }}
          />

          {/* 개인정보 보호 */}
          <Stack.Screen
            name="PrivacyPolicy"
            component={PrivacyPolicyScreen}
            options={{
              presentation: 'card',
              animation: 'slide_from_right',
              headerShown: false,
            }}
          />

          {/* 도움말 */}
          <Stack.Screen
            name="Help"
            component={HelpScreen}
            options={{
              presentation: 'card',
              animation: 'slide_from_right',
              headerShown: false,
            }}
          />
        </>
      ) : (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  useEffect(() => {
    (async () => {
      try {
        await NavigationBar.setVisibilityAsync('hidden');
        await NavigationBar.setBehaviorAsync('overlay-swipe');
        await NavigationBar.setBackgroundColorAsync('transparent');
      } catch {
        // noop
      }
    })();
  }, []);

  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <StatusBar style="dark" translucent backgroundColor="transparent" />
        <NavigationContainer theme={MyTheme}>
          <RootNavigator />
        </NavigationContainer>
      </ThemeProvider>
    </AuthProvider>
  );
}
