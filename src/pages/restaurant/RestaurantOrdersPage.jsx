import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const RestaurantOrdersPage = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showWaitTimeModal, setShowWaitTimeModal] = useState(false);
  const [waitTime, setWaitTime] = useState("");

  useEffect(() => {
    // Set axios authorization header
    const token = localStorage.getItem("token");
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }

    fetchOrders();
    // Auto-refresh every 10 seconds
    const interval = setInterval(fetchOrders, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get(
        "/api/orders?status=placed,preparing,ready"
      );
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptOrder = (order) => {
    setSelectedOrder(order);
    setShowWaitTimeModal(true);
  };

  const handleSetWaitTime = async () => {
    if (!waitTime || !selectedOrder) return;

    try {
      const readyTime = new Date();
      readyTime.setMinutes(readyTime.getMinutes() + parseInt(waitTime));

      await axios.patch(`/api/orders/${selectedOrder._id}/status`, {
        status: "preparing",
        estimatedWaitTime: parseInt(waitTime),
        estimatedReadyTime: readyTime.toISOString(),
      });

      setShowWaitTimeModal(false);
      setWaitTime("");
      setSelectedOrder(null);
      fetchOrders();
    } catch (error) {
      alert(
        "Error updating order: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  const handleMarkReady = async (orderId) => {
    try {
      await axios.patch(`/api/orders/${orderId}/status`, {
        status: "ready",
      });
      fetchOrders();
    } catch (error) {
      alert(
        "Error updating order: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  const handleMarkDelivered = async (orderId) => {
    if (!confirm("Mark this order as delivered?")) return;

    try {
      await axios.patch(`/api/orders/${orderId}/status`, {
        status: "delivered",
      });
      fetchOrders();
    } catch (error) {
      alert(
        "Error updating order: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  const getOrdersByStatus = (status) => {
    return orders.filter((o) => o.status === status);
  };

  const getNewOrdersCount = () => {
    return getOrdersByStatus("placed").length;
  };

  const OrderCard = ({ order }) => {
    const getReadyByTime = () => {
      if (order.estimatedReadyTime) {
        return new Date(order.estimatedReadyTime).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });
      }
      return null;
    };

    return (
      <div className="bg-white rounded-xl shadow-md p-4 hover:shadow-xl hover:scale-105 transition-all duration-300 animate-fadeIn">
        <div className="flex justify-between items-start mb-3">
          <div>
            <p className="font-bold text-xl">Table {order.tableNumber}</p>
            <p className="text-xs text-gray-500">
              Order #{order._id.slice(-6).toUpperCase()}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              {new Date(order.createdAt).toLocaleTimeString()}
            </p>
          </div>
          {order.status === "placed" && (
            <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded animate-bounce">
              NEW
            </span>
          )}
        </div>

        <div className="mb-3">
          <p className="text-sm font-semibold text-gray-700 mb-2">Items:</p>
          <ul className="text-sm space-y-1">
            {order.items.map((item, idx) => (
              <li key={idx} className="flex justify-between">
                <span>
                  <span className="font-semibold">{item.quantity}x</span>{" "}
                  {item.name}
                </span>
                <span className="text-gray-600">
                  ₹{(item.price * item.quantity).toFixed(2)}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {order.specialInstructions && (
          <div className="mb-3 p-2 bg-yellow-50 border border-yellow-200 rounded">
            <p className="text-xs font-semibold text-yellow-800 mb-1">
              Special Instructions:
            </p>
            <p className="text-sm text-yellow-900">
              {order.specialInstructions}
            </p>
          </div>
        )}

        <div className="flex justify-between items-center pt-3 border-t">
          <p className="font-bold text-lg text-green-600">
            ₹{order.totalAmount.toFixed(2)}
          </p>

          {order.status === "placed" && (
            <button
              onClick={() => handleAcceptOrder(order)}
              className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700"
            >
              Accept Order
            </button>
          )}

          {order.status === "preparing" && (
            <div className="text-right">
              {getReadyByTime() && (
                <p className="text-sm text-gray-600 mb-2">
                  Ready by:{" "}
                  <span className="font-semibold">{getReadyByTime()}</span>
                </p>
              )}
              <button
                onClick={() => handleMarkReady(order._id)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700"
              >
                Mark as Ready
              </button>
            </div>
          )}

          {order.status === "ready" && (
            <button
              onClick={() => handleMarkDelivered(order._id)}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-purple-700"
            >
              Delivered
            </button>
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/restaurant/dashboard")}
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
                <h1 className="text-xl font-bold">Orders</h1>
                <p className="text-sm text-gray-600">Manage incoming orders</p>
              </div>
            </div>
            {getNewOrdersCount() > 0 && (
              <div className="bg-red-500 text-white px-4 py-2 rounded-full font-bold animate-pulse">
                {getNewOrdersCount()} New Order
                {getNewOrdersCount() > 1 ? "s" : ""}
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {/* Placed Orders */}
          <div className="flex flex-col gap-4">
            <div className="p-4 rounded-lg bg-white border-l-4 border-blue-500 shadow-sm">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
                New Orders
                <span className="text-base font-medium text-gray-500">
                  ({getOrdersByStatus("placed").length})
                </span>
              </h3>
            </div>
            <div className="flex flex-col gap-4">
              {getOrdersByStatus("placed").length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-gray-300 rounded-xl bg-white">
                  <svg
                    className="w-16 h-16 text-gray-400 mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                  <p className="text-sm font-medium text-gray-500">
                    No new orders
                  </p>
                </div>
              ) : (
                getOrdersByStatus("placed").map((order) => (
                  <OrderCard key={order._id} order={order} />
                ))
              )}
            </div>
          </div>

          {/* Preparing Orders */}
          <div className="flex flex-col gap-4">
            <div className="p-4 rounded-lg bg-white border-l-4 border-orange-500 shadow-sm">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <span className="w-3 h-3 bg-orange-500 rounded-full"></span>
                Preparing
                <span className="text-base font-medium text-gray-500">
                  ({getOrdersByStatus("preparing").length})
                </span>
              </h3>
            </div>
            <div className="flex flex-col gap-4">
              {getOrdersByStatus("preparing").length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-gray-300 rounded-xl bg-white">
                  <svg
                    className="w-16 h-16 text-gray-400 mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <p className="text-sm font-medium text-gray-500">
                    No orders in preparation
                  </p>
                </div>
              ) : (
                getOrdersByStatus("preparing").map((order) => (
                  <OrderCard key={order._id} order={order} />
                ))
              )}
            </div>
          </div>

          {/* Ready Orders */}
          <div className="flex flex-col gap-4">
            <div className="p-4 rounded-lg bg-white border-l-4 border-green-500 shadow-sm">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                Ready for Pickup
                <span className="text-base font-medium text-gray-500">
                  ({getOrdersByStatus("ready").length})
                </span>
              </h3>
            </div>
            <div className="flex flex-col gap-4">
              {getOrdersByStatus("ready").length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-gray-300 rounded-xl bg-white">
                  <svg
                    className="w-16 h-16 text-gray-400 mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <p className="text-sm font-medium text-gray-500">
                    No orders ready
                  </p>
                </div>
              ) : (
                getOrdersByStatus("ready").map((order) => (
                  <OrderCard key={order._id} order={order} />
                ))
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Wait Time Modal */}
      {showWaitTimeModal && selectedOrder && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setShowWaitTimeModal(false)}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
              <h2 className="text-2xl font-bold mb-4">Set Preparation Time</h2>
              <p className="text-gray-600 mb-6">
                Table {selectedOrder.tableNumber} - Order #
                {selectedOrder._id.slice(-6).toUpperCase()}
              </p>

              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">
                  Estimated wait time (minutes) *
                </label>
                <input
                  type="number"
                  min="1"
                  max="120"
                  value={waitTime}
                  onChange={(e) => setWaitTime(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-center text-2xl font-bold focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="15"
                  autoFocus
                />
                <p className="text-sm text-gray-500 mt-2 text-center">
                  {waitTime &&
                    `Ready by: ${new Date(
                      Date.now() + parseInt(waitTime) * 60000
                    ).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}`}
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowWaitTimeModal(false)}
                  className="flex-1 px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSetWaitTime}
                  disabled={!waitTime || parseInt(waitTime) < 1}
                  className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Start Preparing
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default RestaurantOrdersPage;
