"use client";

import { formatCurrency } from "@/lib/formatter";
import styled from "@emotion/styled";

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 0.5rem 0;
`;

const SummaryLabel = styled.span<{ $bold: boolean }>`
  font-weight: ${(props) => (props.$bold ? "bold" : "normal")};
`;

const SummaryValue = styled.span<{ $bold: boolean }>`
  font-weight: ${(props) => (props.$bold ? "bold" : "normal")};
`;

export default function SummaryRow({
  label,
  value,
  bold = false,
}: {
  label: string;
  value: number;
  bold?: boolean;
}) {
  return (
    <Container>
      <SummaryLabel $bold={bold}>{label}</SummaryLabel>
      <SummaryValue $bold={bold}>{formatCurrency(value)}</SummaryValue>
    </Container>
  );
}
