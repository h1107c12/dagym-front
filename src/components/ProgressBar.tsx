import React from 'react';
import styled from 'styled-components/native';

const Bar = styled.View`
  height: 8px;
  background: #efeff5;
  border-radius: 8px;
  overflow: hidden;
`;

type FillProps = { w: number; color?: string };
const Fill = styled.View<FillProps>`
  height: 100%;
  width: ${(p: FillProps) => p.w}%;
  background: ${(p: FillProps) => p.color ?? '#6e56cf'};
`;

type Props = { percent: number; color?: string; style?: any };
export default function ProgressBar({ percent, color, style }: Props) {
  const w = Math.max(0, Math.min(100, percent));
  return (
    <Bar style={style}>
      <Fill w={w} color={color} />
    </Bar>
  );
}
