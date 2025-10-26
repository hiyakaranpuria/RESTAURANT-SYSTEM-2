import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/MultiAuthContext";
import CustomerLoginModal from "../../components/CustomerLoginModal";

const CheckoutPage = () => {
  const { restaurantId } = useParams();
  const navigate = useNavigate();
  const {
    isCustomerAuthenticated,
    getCustomerSession,
    loading: authLoading,
  } = useAuth();
  const [restaurantInfo, setRestaurantInfo] = useState(null);
  const [cart, setCart] = useState([]);
  const [tableNumber, setTableNumber] = useState("");
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);
  const [showCustomerLogin, setShowCustomerLogin] = useState(false);

  useEffect(() => {
    // Check if customer is logged in
    if (!authLoading && !isCustomerAuthenticated) {
      // Show login modal
      setShowCustomerLogin(true);
      return;
    }

    if (!authLoading && isCustomerAuthenticated) {
      // Get cart from MenuPage (we'll use localStorage for persistence)
      const savedCart = localStorage.getItem(`cart_${restaurantId}`);
      const savedTable = sessionStorage.getItem("tableNumber");

      if (!savedCart || !savedTable) {
        navigate(`/m/${restaurantId}`);
        return;
      }

      setCart(JSON.parse(savedCart));
      setTableNumber(savedTable);
      fetchRestaurantInfo();
    }
  }, [restaurantId, navigate, isCustomerAuthenticated, authLoading]);

  const fetchRestaurantInfo = async () => {
    try {
      const { data } = await axios.get(`/api/restaurant/${restaurantId}`);
      setRestaurantInfo(data);
    } catch (error) {
      console.error("Error fetching restaurant:", error);
    } finally {
      setLoading(false);
    }
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const handlePlaceOrder = async () => {
    setPlacing(true);
    try {
      const orderData = {
        restaurantId,
        tableNumber,
        items: cart.map((item) => ({
          menuItemId: item._id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
        specialInstructions,
        totalAmount: getTotalPrice(),
      };

      const { data } = await axios.post("/api/orders", orderData);

      // Clear cart
      localStorage.removeItem(`cart_${restaurantId}`);

      // Redirect to order tracking
      navigate(`/order/${data._id}`);
    } catch (error) {
      alert(
        "Error placing order: " +
          (error.response?.data?.message || error.message)
      );
      setPlacing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(`/m/${restaurantId}`)}
              className="text-gray-600 hover:text-gray-900"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <div>
              <h1 className="text-xl font-bold">Checkout</h1>
              <p className="text-sm text-gray-600">
                {restaurantInfo?.restaurantName}
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-2xl">
        {/* Table Info */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-4 animate-fadeIn">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-600">Table Number</p>
              <p className="text-xl font-bold">{tableNumber}</p>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div
          className="bg-white rounded-lg shadow-md p-4 mb-4 animate-fadeIn"
          style={{ animationDelay: "0.1s" }}
        >
          <h2 className="text-lg font-bold mb-4">Order Summary</h2>
          <div className="space-y-3">
            {cart.map((item) => (
              <div
                key={item._id}
                className="flex justify-between items-start pb-3 border-b last:border-b-0"
              >
                <div className="flex gap-3 flex-1">
                  <img
                    src={
                      item.imageUrl
                        ? `http://localhost:5000${item.imageUrl}`
                        : "https://via.placeholder.com/60x60?text=No+Image"
                    }
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-sm text-gray-600">
                      ₹{item.price.toFixed(2)} × {item.quantity}
                    </p>
                  </div>
                </div>
                <p className="font-bold text-green-600">
                  ₹{(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">
                Subtotal ({getTotalItems()} items)
              </span>
              <span className="font-semibold">
                ₹{getTotalPrice().toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span className="text-green-600">
                ₹{getTotalPrice().toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Special Instructions */}
        <div
          className="bg-white rounded-lg shadow-md p-4 mb-4 animate-fadeIn"
          style={{ animationDelay: "0.2s" }}
        >
          <h2 className="text-lg font-bold mb-3">Special Instructions</h2>
          <textarea
            value={specialInstructions}
            onChange={(e) => setSpecialInstructions(e.target.value)}
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500"
            rows="3"
            placeholder="Any special requests? (e.g., less spicy, no onions)"
          />
        </div>

        {/* Place Order Button */}
        <button
          onClick={handlePlaceOrder}
          disabled={placing}
          className="w-full bg-green-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed btn-animate animate-fadeIn"
          style={{ animationDelay: "0.3s" }}
        >
          {placing
            ? "Placing Order..."
            : `Place Order - ₹${getTotalPrice().toFixed(2)}`}
        </button>

        <p className="text-center text-sm text-gray-500 mt-4">
          Your order will be sent to the kitchen immediately
        </p>
      </main>

      {/* Customer Login Modal */}
      {showCustomerLogin && (
        <CustomerLoginModal
          onClose={() => {
            setShowCustomerLogin(false);
            navigate(`/m/${restaurantId}`);
          }}
          onSuccess={() => {
            setShowCustomerLogin(false);
            window.location.reload(); // Reload to fetch data with customer session
          }}
        />
      )}
    </div>
  );
};

export default CheckoutPage;
