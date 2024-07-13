export const formatNumber = (
  value: number,
  params: Intl.NumberFormatOptions = {}
) => {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 5,
    ...params,
  }).format(value);
};

export const formatCoordinate = (value: number) => {
  return Math.round(value * 1000000);
};
