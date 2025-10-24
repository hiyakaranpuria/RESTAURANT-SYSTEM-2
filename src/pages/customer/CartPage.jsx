import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import axios from "axios";

const CartPage = () => {
  const navigate = useNavigate();
  const { cart, tableId, updateQuantity, removeFromCart, getTotal, clearCart } =
    useCart();
  const [loading, setLoading] = useState(false);

  const handlePlaceOrder = async () => {
    if (!tableId) {
      alert("Table not found");
      return;
    }

    setLoading(true);
    try {
      const orderData = {
        tableId,
        items: cart.map((item) => ({
          menuItemId: item.menuItemId,
          qty: item.qty,
          note: item.note,
        })),
      };
      const { data } = await axios.post("/api/orders", orderData);
      clearCart();
      navigate(`/order/${data._id}`);
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  const subtotal = getTotal();
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  return (
    <div className="min-h-screen bg-background-light">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm border-b px-4 py-3">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-6 w-6 text-primary">
              <svg
                fill="none"
                viewBox="0 0 48 48"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  clipRule="evenodd"
                  d="M24 4H6V17.3333V30.6667H24V44H42V30.6667V17.3333H24V4Z"
                  fill="currentColor"
                  fillRule="evenodd"
                />
              </svg>
            </div>
            <h2 className="text-lg font-bold">The Golden Spoon</h2>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-gray-100 rounded-lg text-sm font-bold hover:bg-gray-200"
          >
            Back to Menu
          </button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 lg:py-12">
        <div className="max-w-6xl mx-auto">
          <div className="lg:grid lg:grid-cols-3 lg:gap-12">
            <div className="lg:col-span-2">
              <div className="mb-6">
                <h1 className="text-4xl font-black">Your Cart</h1>
                <p className="mt-2 text-gray-500">
                  Please review your items before placing the order.
                </p>
              </div>

              <div className="space-y-6">
                {cart.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col gap-4 rounded-xl border bg-white p-4 sm:p-6"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div
                          className="w-[70px] h-[70px] bg-cover bg-center rounded-lg flex-shrink-0"
                          style={{
                            backgroundImage: `url(${
                              item.image || "https://via.placeholder.com/70"
                            })`,
                          }}
                        />
                        <div className="flex-1">
                          <p className="text-base font-bold">{item.name}</p>
                          {item.note && (
                            <p className="text-green-600 text-sm">
                              {item.note}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <p className="text-base font-bold">
                          ${(item.price * item.qty).toFixed(2)}
                        </p>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.menuItemId,
                                item.note,
                                item.qty - 1
                              )
                            }
                            className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200"
                          >
                            -
                          </button>
                          <span className="w-4 text-center text-base font-medium">
                            {item.qty}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.menuItemId,
                                item.note,
                                item.qty + 1
                              )
                            }
                            className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="flex w-full items-center gap-2">
                      <input
                        className="flex-1 rounded-lg bg-gray-100 h-12 px-3 text-sm border-none focus:outline-none focus:ring-2 focus:ring-primary/50"
                        placeholder="Add a special request..."
                        defaultValue={item.note}
                      />
                      <button
                        onClick={() =>
                          removeFromCart(item.menuItemId, item.note)
                        }
                        className="flex h-12 w-12 items-center justify-center rounded-lg text-gray-500 hover:bg-red-500/10 hover:text-red-500"
                      >
                        <span className="material-symbols-outlined">
                          delete
                        </span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-1 mt-8 lg:mt-0">
              <div className="lg:sticky lg:top-24">
                <div className="rounded-xl border bg-white p-6">
                  <h2 className="text-xl font-bold">Order Summary</h2>
                  <div className="mt-4 flex items-center justify-between rounded-lg bg-primary/10 p-3">
                    <span className="text-sm font-medium text-green-800">
                      Table Number
                    </span>
                    <span className="font-bold text-green-800">14</span>
                  </div>
                  <div className="mt-6 space-y-4 text-sm text-gray-500">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="font-medium text-gray-800">
                        ${subtotal.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Taxes & Fees</span>
                      <span className="font-medium text-gray-800">
                        ${tax.toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <div className="my-6 border-t border-dashed" />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                  <button
                    onClick={handlePlaceOrder}
                    disabled={loading || cart.length === 0}
                    className="mt-6 w-full rounded-xl bg-primary py-3.5 text-base font-bold text-white shadow-lg hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "Placing Order..." : "Place Order"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CartPage;
