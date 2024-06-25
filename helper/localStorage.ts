export const saveCartToLocalStorage = (cart: any) => {
  localStorage.setItem("cart", JSON.stringify(cart));
};

export const getCartFromLocalStorage = () => {
  const cart = localStorage.getItem("cart");
  return cart ? JSON.parse(cart) : [];
};

export const clearLocalStorageCart = () => {
  localStorage.removeItem("cart");
};
