import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';
import HomeScreen from '../screens/HomeScreen';
import DietScreen from '../screens/DietScreen';
import WorkoutScreen from '../screens/WorkoutScreen';
import ReportScreen from '../screens/ReportScreen';

export type RootTabParamList = {
  Home: undefined;
  Diet: undefined;
  Workout: undefined;
  Report: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#6E56CF',
        tabBarInactiveTintColor: '#A2A2B4',
        tabBarStyle: { height: 64, paddingBottom: 10, paddingTop: 8 },
        tabBarIcon: ({ color, size, focused }) => {
          const icon: Record<keyof RootTabParamList, [any, any]> = {
            Home: ['home-outline', 'home'],
            Diet: ['restaurant-outline', 'restaurant'],
            Workout: ['barbell-outline', 'barbell'],
            Report: ['stats-chart-outline', 'stats-chart'],
          };
          const [outline, solid] = icon[route.name];
          return <Ionicons name={focused ? (solid as any) : (outline as any)} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: '홈' }} />
      <Tab.Screen name="Diet" component={DietScreen} options={{ title: '식단' }} />
      <Tab.Screen name="Workout" component={WorkoutScreen} options={{ title: '운동' }} />
      <Tab.Screen name="Report" component={ReportScreen} options={{ title: '리포트' }} />
    </Tab.Navigator>
  );
}
