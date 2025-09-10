// src/styles/theme.ts
export const theme = {
  colors: {
    // 핵심 컬러
    primary: '#6E56CF',        // 퍼플
    primarySoft: '#F3EFFF',
    gradientFrom: '#9C6BFF',   // 히어로 카드 그라데 시작
    gradientTo:   '#FF6AA9',   // 히어로 카드 그라데 끝

    // 배경/표면/텍스트
    background: '#F7F7FB',
    surface:    '#FFFFFF',
    text:       '#121212',
    muted:      '#7A7A90',
    border:     '#E9E9F1',

    // 배지/추천 카드 배경
    streakBg: '#E7F6E7',
    dietRecoBg: '#FCEBFA',
    workoutRecoBg: '#EAF3FF',

    // 상태
    success: '#0BB37D',
    warning: '#FF8A00',
    error:   '#E5484D',
  },

  // 8px 스케일
  space(n: number) { return n * 8; },

  radius: {
    sm: 8, md: 12, lg: 16, xl: 18, xl2: 24, pill: 999,
  },

  typography: {
    title:   { size: 18, weight: '800' as const },
    body:    { size: 14, weight: '400' as const },
    caption: { size: 12, weight: '400' as const },
  },

  shadow: {
    card: {
      elevation: 3,
      shadowColor: '#000',
      shadowOpacity: 0.07,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 4 },
    } as const
  }
};

export type AppTheme = typeof theme;
export default theme;
