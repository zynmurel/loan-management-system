export const getTotalPayableAmount = (amount: number, interest: number) => {
  return (amount + (interest / 100) * amount).toFixed(2);
};

export const getMonthlyPayableAmount = (
  amount: number,
  interest: number,
  months: number,
) => {
  return ((amount + (interest / 100) * amount) / months).toFixed(2);
};

export const getMonthlyOverduePenalty = (
  amount: number,
  interest: number,
  months: number,
  penalty: number,
) => {
  return (
    ((amount + (interest / 100) * amount) / months) *
    (penalty / 100)
  ).toFixed(2);
};
