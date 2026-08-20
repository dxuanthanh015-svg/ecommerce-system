export const getActiveUserEmail = () => {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const user = JSON.parse(localStorage.getItem("user"));
  if (isLoggedIn && user && user.email) {
    return user.email.trim().toLowerCase();
  }
  return null;
};

export const getCartStorageKey = () => {
  const email = getActiveUserEmail();
  return email ? `cart_${email}` : "cart_guest";
};

export const getUserCart = () => {
  const key = getCartStorageKey();
  const cartData = JSON.parse(localStorage.getItem(key)) || [];
  localStorage.setItem("cart", JSON.stringify(cartData));
  return cartData;
};

export const saveUserCart = (cartItems) => {
  const key = getCartStorageKey();
  localStorage.setItem(key, JSON.stringify(cartItems));
  localStorage.setItem("cart", JSON.stringify(cartItems));
  window.dispatchEvent(new Event("cartUpdated"));
};

export const migrateGuestCartOnLogin = (userEmail) => {
  if (!userEmail) return;
  const guestCart = JSON.parse(localStorage.getItem("cart_guest")) || [];
  const userKey = `cart_${userEmail.trim().toLowerCase()}`;
  const userCart = JSON.parse(localStorage.getItem(userKey)) || [];

  if (guestCart.length > 0) {
    guestCart.forEach((guestItem) => {
      const existingIdx = userCart.findIndex(
        (uItem) =>
          String(uItem.id) === String(guestItem.id) &&
          uItem.color === guestItem.color &&
          uItem.size === guestItem.size
      );
      if (existingIdx > -1) {
        userCart[existingIdx].quantity =
          (userCart[existingIdx].quantity || 1) + (guestItem.quantity || 1);
      } else {
        userCart.push(guestItem);
      }
    });

    localStorage.removeItem("cart_guest");
  }

  localStorage.setItem(userKey, JSON.stringify(userCart));
  localStorage.setItem("cart", JSON.stringify(userCart));
  window.dispatchEvent(new Event("cartUpdated"));
};
