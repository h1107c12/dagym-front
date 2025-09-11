import React from 'react';
import styled from 'styled-components/native';
import type { DefaultTheme } from 'styled-components/native';

const Wrap = styled.View`
  background: ${(p: { theme: DefaultTheme }) => p.theme.colors.surface};
  border-radius: ${(p: { theme: DefaultTheme }) => p.theme.radius.lg}px;
  padding: 16px;
`;

type CardProps = React.PropsWithChildren<{
  style?: any;
}>;

export default function Card({ children, style }: CardProps) {
  return <Wrap style={style}>{children}</Wrap>;
}
