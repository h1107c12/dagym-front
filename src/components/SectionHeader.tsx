import React from 'react';
import styled from 'styled-components/native';
import type { DefaultTheme } from 'styled-components/native';
import Ionicons from '@expo/vector-icons/Ionicons';

const Row = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 8px;
  margin: 8px 0 10px 2px;
`;

const Title = styled.Text`
  color: ${(p: { theme: DefaultTheme }) => p.theme.colors.text};
  font-size: 14px;
  font-weight: 800;
`;

type Props = {
  title: string;
  icon?: keyof typeof Ionicons.glyphMap;
  color?: string;
  size?: number;
};

export default function SectionHeader({ title, icon = 'sparkles', color = '#6E56CF', size = 16 }: Props) {
  return (
    <Row>
      <Ionicons name={icon} size={size} color={color} />
      <Title>{title}</Title>
    </Row>
  );
}
