const vndFormatter = new Intl.NumberFormat("vi-VN", {
  maximumFractionDigits: 0,
});

export const formatVnd = (value) => {
  const amount = Number(value);
  return `${vndFormatter.format(Number.isFinite(amount) ? amount : 0)} VND`;
};
