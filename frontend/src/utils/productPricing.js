export const getEffectivePrice = (item) => {
  const price = Number(item?.price) || 0;
  const discountedPrice = Number(item?.discountedPrice);

  return Number.isFinite(discountedPrice) && discountedPrice > 0 && discountedPrice < price
    ? discountedPrice
    : price;
};
