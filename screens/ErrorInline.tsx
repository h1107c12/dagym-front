// screens/ErrorInline.tsx
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing } from 'react-native';
import styled from 'styled-components/native';
import Ionicons from '@expo/vector-icons/Ionicons';

const Wrap = styled(Animated.View)`
  border-width: 1px;
  border-color: #d32f2f;
  background-color: #2a0a0a;
  padding: 12px;
  border-radius: 10px;
  flex-direction: row;
  align-items: center;
`;

const Msg = styled.Text`
  color: #fff;
  margin-left: 8px;
  flex: 1;
`;

const Close = styled.Pressable`
  padding: 4px;
`;

type Props = {
  visible: boolean;
  message: string;
  onClose: () => void;
};

export default function ErrorInline({ visible, message, onClose }: Props) {
  const [mounted, setMounted] = useState(visible);
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-6)).current; // 살짝 위
  const scale = useRef(new Animated.Value(0.98)).current;

  useEffect(() => {
    if (visible) {
      setMounted(true);
      Animated.parallel([
        Animated.timing(opacity,    { toValue: 1, duration: 180, easing: Easing.out(Easing.quad), useNativeDriver: true }),
        Animated.timing(translateY, { toValue: 0, duration: 180, easing: Easing.out(Easing.quad), useNativeDriver: true }),
        Animated.timing(scale,      { toValue: 1, duration: 180, easing: Easing.out(Easing.quad), useNativeDriver: true }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(opacity,    { toValue: 0, duration: 140, easing: Easing.in(Easing.quad), useNativeDriver: true }),
        Animated.timing(translateY, { toValue: -6, duration: 140, easing: Easing.in(Easing.quad), useNativeDriver: true }),
        Animated.timing(scale,      { toValue: 0.98, duration: 140, easing: Easing.in(Easing.quad), useNativeDriver: true }),
      ]).start(({ finished }) => { if (finished) setMounted(false); });
    }
  }, [visible, opacity, translateY, scale]);

  if (!mounted) return null;

  return (
    <Wrap
      style={{ opacity, transform: [{ translateY }, { scale }] }}
      accessibilityRole="alert"
      accessibilityLiveRegion="polite"
    >
      <Ionicons name="alert-circle-outline" size={18} color="#ff6b6b" />
      <Msg>{message}</Msg>
      <Close onPress={onClose} hitSlop={8}>
        <Ionicons name="close" size={16} color="#ff8a8a" />
      </Close>
    </Wrap>
  );
}
