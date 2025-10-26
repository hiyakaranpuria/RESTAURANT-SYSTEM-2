import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import FeedbackModal from "../../components/FeedbackModal";

const OrderStatusPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  useEffect(() => {
    fetchOrder();
    // Auto-refresh every 5 seconds
    const interval = setInterval(fetchOrder, 5000);
    return () => clearInterval(interval);
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      const { data } = await axios.get(`/api/orders/${orderId}`);
      setOrder(data);
      setFeedbackSubmitted(data.feedback?.submitted || false);
    } catch (error) {
      console.error("Error fetching order:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFeedbackSubmit = (result) => {
    setFeedbackSubmitted(true);
    // Refresh the order to show updated feedback status
    fetchOrder();
    
    // Update points in parent menu page if available
    if (window.opener && window.opener.updateCustomerPoints) {
      window.opener.updateCustomerPoints(result.totalPoints);
    }
    
    alert(`Thank you for your feedback! You earned ${result.pointsEarned} points. Total points: ${result.totalPoints}`);
  };

  const statusSteps = [
    { key: "placed", label: "Order Placed", icon: "receipt_long" },
    { key: "preparing", label: "In the Kitchen", icon: "soup_kitchen" },
    { key: "ready", label: "Ready for Pickup", icon: "local_mall" },
    { key: "delivered", label: "Completed", icon: "check_circle" },
  ];

  const currentStepIndex = statusSteps.findIndex(
    (s) => s.key === order?.status
  );
  const progress = ((currentStepIndex + 1) / statusSteps.length) * 100;

  const getEstimatedTime = () => {
    if (!order || !order.estimatedReadyTime) return null;

    const readyTime = new Date(order.estimatedReadyTime);
    const now = new Date();
    const diffMinutes = Math.max(0, Math.round((readyTime - now) / 60000));

    return diffMinutes;
  };

  const getReadyByTime = () => {
    if (!order || !order.estimatedReadyTime) return null;

    return new Date(order.estimatedReadyTime).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-gray-600">Loading order...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-xl text-gray-600">Order not found</p>
          <button
            onClick={() => navigate("/")}
            className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  const estimatedMinutes = getEstimatedTime();
  const readyByTime = getReadyByTime();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      <header className="bg-white border-b shadow-sm px-4 py-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(`/m/${order.restaurantId._id}`)}
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
              <h2 className="text-xl font-bold">
                {order.restaurantId?.restaurantName}
              </h2>
              <p className="text-sm text-gray-600">Table {order.tableNumber}</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="text-center mb-8 animate-fadeIn">
          <h1 className="text-4xl font-black mb-2">Track Your Order</h1>
          <p className="text-gray-600">
            Order #{order._id.slice(-6).toUpperCase()}
          </p>
        </div>

        {/* Status Progress */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 animate-fadeIn">
          <div className="flex items-center justify-between mb-8">
            {statusSteps.map((step, idx) => (
              <div key={step.key} className="flex flex-col items-center flex-1">
                <div className="relative">
                  <div
                    className={`flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 ${
                      idx <= currentStepIndex
                        ? "bg-green-600 text-white scale-110"
                        : "bg-gray-300 text-gray-500"
                    }`}
                  >
                    <span className="material-symbols-outlined">
                      {step.icon}
                    </span>
                  </div>
                  {idx <= currentStepIndex && (
                    <div className="absolute inset-0 bg-green-600 rounded-full animate-ping opacity-20"></div>
                  )}
                </div>
                <p
                  className={`mt-2 text-xs sm:text-sm font-semibold text-center ${
                    idx <= currentStepIndex ? "text-green-600" : "text-gray-500"
                  }`}
                >
                  {step.label}
                </p>
                {idx < statusSteps.length - 1 && (
                  <div className="hidden sm:block absolute top-6 left-1/2 w-full h-1 -z-10">
                    <div
                      className={`h-full transition-all duration-500 ${
                        idx < currentStepIndex ? "bg-green-600" : "bg-gray-300"
                      }`}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="w-full rounded-full bg-gray-200 h-3 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-green-500 to-green-600 transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Status Message */}
        <div
          className="bg-white rounded-xl shadow-lg p-6 mb-6 animate-fadeIn"
          style={{ animationDelay: "0.1s" }}
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-green-600">
                {statusSteps[currentStepIndex]?.icon}
              </span>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold mb-2">
                {statusSteps[currentStepIndex]?.label}
              </h3>
              <p className="text-gray-600 mb-3">
                {order.status === "placed" &&
                  "Your order has been received and will be prepared shortly."}
                {order.status === "preparing" &&
                  "Our kitchen is preparing your delicious meal!"}
                {order.status === "ready" &&
                  "Your order is ready! Please come to the counter to collect it."}
                {order.status === "delivered" &&
                  "Thank you for your order! Enjoy your meal!"}
              </p>

              {order.status === "preparing" && order.estimatedWaitTime && (
                <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 mt-4">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-green-600 text-4xl animate-pulse">
                      timer
                    </span>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">
                        Estimated wait time
                      </p>
                      <p className="text-3xl font-bold text-green-600">
                        {order.estimatedWaitTime} minute
                        {order.estimatedWaitTime !== 1 ? "s" : ""}
                      </p>
                      {readyByTime && (
                        <p className="text-sm text-gray-600 mt-1">
                          Ready by:{" "}
                          <span className="font-semibold text-green-700">
                            {readyByTime}
                          </span>
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {order.status === "ready" && (
                <div className="bg-green-50 border-2 border-green-500 rounded-lg p-4 animate-pulse">
                  <p className="text-green-800 font-bold text-lg">
                    🎉 Your order is ready for pickup!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Order Details */}
        <div
          className="bg-white rounded-xl shadow-lg mb-6 animate-fadeIn"
          style={{ animationDelay: "0.2s" }}
        >
          <div className="p-6 border-b">
            <h3 className="text-lg font-bold">Order Details</h3>
          </div>
          <div className="p-6">
            <div className="space-y-3 mb-4">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-sm text-gray-600">
                      ₹{item.price.toFixed(2)} × {item.quantity}
                    </p>
                  </div>
                  <p className="font-bold text-green-600">
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            {order.specialInstructions && (
              <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-xs font-semibold text-yellow-800 mb-1">
                  Special Instructions:
                </p>
                <p className="text-sm text-yellow-900">
                  {order.specialInstructions}
                </p>
              </div>
            )}

            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-green-600">
                  ₹{order.totalAmount.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Order Info */}
        <div
          className="bg-white rounded-xl shadow-lg p-6 animate-fadeIn"
          style={{ animationDelay: "0.3s" }}
        >
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Order Time</p>
              <p className="font-semibold">
                {new Date(order.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
            <div>
              <p className="text-gray-600">Table Number</p>
              <p className="font-semibold">{order.tableNumber}</p>
            </div>
          </div>
        </div>

        {/* Feedback Button - Show when order is delivered and feedback not submitted */}
        {order.status === "delivered" && (
          <div
            className="bg-white rounded-xl shadow-lg p-6 animate-fadeIn"
            style={{ animationDelay: "0.4s" }}
          >
            {feedbackSubmitted ? (
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-green-600 mb-2">
                  Thank You for Your Feedback!
                </h3>
                <p className="text-gray-600">
                  Your review helps us improve our service.
                </p>
              </div>
            ) : (
              <div className="text-center">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-yellow-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">How was your experience?</h3>
                <p className="text-gray-600 mb-4">
                  Rate your order and earn points for future discounts!
                </p>
                <button
                  onClick={() => setShowFeedbackModal(true)}
                  className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-8 py-3 rounded-lg font-semibold hover:from-yellow-600 hover:to-orange-600 transition-all transform hover:scale-105 shadow-lg"
                >
                  ⭐ Give Feedback & Earn Points
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Feedback Modal */}
      <FeedbackModal
        order={order}
        isOpen={showFeedbackModal}
        onClose={() => setShowFeedbackModal(false)}
        onSubmit={handleFeedbackSubmit}
      />
    </div>
  );
};

export default OrderStatusPage;
