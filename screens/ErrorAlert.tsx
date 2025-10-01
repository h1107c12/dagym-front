// screens/ErrorAlert.tsx
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing } from 'react-native';
import styled from 'styled-components/native';
import Ionicons from '@expo/vector-icons/Ionicons';

const BannerWrap = styled(Animated.View)`
  position: absolute;
  left: 16px;
  right: 16px;
  top: 8px;
  padding: 10px 12px;
  border-radius: 10px;
  border-width: 1px;
  flex-direction: row;
  align-items: center;
  background-color: #2a0a0a;  /* 어두운 붉은 바탕 */
  border-color: #d32f2f;      /* 붉은 테두리 */
`;
const BannerText = styled.Text` color: #fff; flex: 1; margin-left: 8px; `;
const BannerClose = styled.Pressable` padding: 4px; `;

type Props = {
  message: string;
  visible: boolean;
  onClose: () => void;
  autoHideMs?: number;
};

export default function ErrorAlert({ message, visible, onClose, autoHideMs = 3500 }: Props) {
  const [mounted, setMounted] = useState(visible);
  const slide = useRef(new Animated.Value(-12)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (visible) {
      setMounted(true);
      if (timerRef.current) clearTimeout(timerRef.current);
      Animated.parallel([
        Animated.timing(slide, { toValue: 0, duration: 220, easing: Easing.out(Easing.quad), useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 1, duration: 220, easing: Easing.out(Easing.quad), useNativeDriver: true }),
      ]).start();
      if (autoHideMs > 0) timerRef.current = setTimeout(onClose, autoHideMs);
    } else {
      if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null; }
      Animated.parallel([
        Animated.timing(slide, { toValue: -12, duration: 160, easing: Easing.in(Easing.quad), useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0, duration: 160, easing: Easing.in(Easing.quad), useNativeDriver: true }),
      ]).start(({ finished }) => { if (finished) setMounted(false); });
    }
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [visible, autoHideMs, onClose, opacity, slide]);

  if (!mounted) return null;

  return (
    <BannerWrap
      style={{ transform: [{ translateY: slide }], opacity, zIndex: 1000, elevation: 1000 }}
      pointerEvents="box-none"
      accessibilityRole="alert"
      accessibilityLiveRegion="polite"
    >
      <Ionicons name="alert-circle-outline" size={18} color="#ff6b6b" />
      <BannerText>{message}</BannerText>
      <BannerClose onPress={onClose} hitSlop={8}>
        <Ionicons name="close" size={16} color="#ff8a8a" />
      </BannerClose>
    </BannerWrap>
  );
}
