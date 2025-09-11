import styled from 'styled-components/native';

type ChipProps = { fg?: string; bg?: string };

const Chip = styled.Text<ChipProps>`
  color: ${(p: ChipProps) => p.fg ?? '#6E56CF'};
  background: ${(p: ChipProps) => p.bg ?? '#F3EFFF'};
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 12px;
`;

export default Chip;
