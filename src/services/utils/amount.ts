export const amountBrl = (value: number): string => {
  const float = value / 100;
  return float.toLocaleString('pt-br', {
    style: 'currency',
    currency: 'BRL',
  });
};
