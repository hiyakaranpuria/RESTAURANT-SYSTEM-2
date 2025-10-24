import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [tableId, setTableId] = useState(null);

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    const savedTableId = localStorage.getItem("tableId");
    if (savedCart) setCart(JSON.parse(savedCart));
    if (savedTableId) setTableId(savedTableId);
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item, quantity = 1, note = "") => {
    setCart((prev) => {
      const existing = prev.find(
        (i) => i.menuItemId === item._id && i.note === note
      );
      if (existing) {
        return prev.map((i) =>
          i.menuItemId === item._id && i.note === note
            ? { ...i, qty: i.qty + quantity }
            : i
        );
      }
      return [
        ...prev,
        {
          menuItemId: item._id,
          name: item.name,
          price: item.price,
          qty: quantity,
          note,
          image: item.imageUrl,
        },
      ];
    });
  };

  const updateQuantity = (menuItemId, note, qty) => {
    if (qty <= 0) {
      removeFromCart(menuItemId, note);
    } else {
      setCart((prev) =>
        prev.map((i) =>
          i.menuItemId === menuItemId && i.note === note ? { ...i, qty } : i
        )
      );
    }
  };

  const removeFromCart = (menuItemId, note) => {
    setCart((prev) =>
      prev.filter((i) => !(i.menuItemId === menuItemId && i.note === note))
    );
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("cart");
  };

  const getTotal = () => {
    return cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        tableId,
        setTableId,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        getTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
