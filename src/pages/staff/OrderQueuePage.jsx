import { useState, useEffect } from "react";
import axios from "axios";

const OrderQueuePage = () => {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [soundOn, setSoundOn] = useState(true);

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 3000);
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
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await axios.patch(`/api/orders/${orderId}/status`, { status: newStatus });
      fetchOrders();
    } catch (error) {
      console.error("Error updating order:", error);
    }
  };

  const getOrdersByStatus = (status) => {
    return orders.filter((o) => o.status === status);
  };

  const OrderCard = ({ order }) => (
    <div className="bg-white rounded-xl shadow-md p-4 flex flex-col gap-3 hover:shadow-lg">
      <div className="flex justify-between items-start">
        <div>
          <p className="font-bold text-lg">Table {order.tableId?.number}</p>
          <p className="text-xs text-gray-500">#{order._id.slice(-6)}</p>
        </div>
        <button className="text-gray-500 hover:text-gray-800">
          <span className="material-symbols-outlined">more_vert</span>
        </button>
      </div>
      <p className="text-sm text-gray-600">
        {new Date(order.createdAt).toLocaleTimeString()}
      </p>
      <ul className="text-sm space-y-1">
        {order.items.slice(0, 3).map((item, idx) => (
          <li key={idx}>
            <span className="font-semibold">{item.qty}x</span>{" "}
            {item.menuItemId?.name}
          </li>
        ))}
        {order.items.length > 3 && (
          <li className="font-semibold">
            +{order.items.length - 3} more item(s)
          </li>
        )}
      </ul>
      <div className="flex justify-between items-center mt-2">
        {order.items.some((i) => i.note) && (
          <span className="material-symbols-outlined text-orange-500">
            sticky_note_2
          </span>
        )}
        <div className="flex-1" />
        {order.status === "placed" && (
          <button
            onClick={() => updateOrderStatus(order._id, "preparing")}
            className="bg-primary text-white rounded-lg h-10 px-4 text-sm font-bold hover:opacity-90"
          >
            Start Preparing
          </button>
        )}
        {order.status === "preparing" && (
          <button
            onClick={() => updateOrderStatus(order._id, "ready")}
            className="bg-primary text-white rounded-lg h-10 px-4 text-sm font-bold hover:opacity-90"
          >
            Mark as Ready
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background-light">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm border-b px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-6 h-6 text-primary">
              <svg
                fill="none"
                viewBox="0 0 48 48"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  clipRule="evenodd"
                  d="M39.475 21.6262C40.358 21.4363 40.6863 21.5589 40.7581 21.5934C40.7876 21.655 40.8547 21.857 40.8082 22.3336C40.7408 23.0255 40.4502 24.0046 39.8572 25.2301C38.6799 27.6631 36.5085 30.6631 33.5858 33.5858C30.6631 36.5085 27.6632 38.6799 25.2301 39.8572C24.0046 40.4502 23.0255 40.7407 22.3336 40.8082C21.8571 40.8547 21.6551 40.7875 21.5934 40.7581C21.5589 40.6863 21.4363 40.358 21.6262 39.475C21.8562 38.4054 22.4689 36.9657 23.5038 35.2817C24.7575 33.2417 26.5497 30.9744 28.7621 28.762C30.9744 26.5497 33.2417 24.7574 35.2817 23.5037C36.9657 22.4689 38.4054 21.8562 39.475 21.6262ZM4.41189 29.2403L18.7597 43.5881C19.8813 44.7097 21.4027 44.9179 22.7217 44.7893C24.0585 44.659 25.5148 44.1631 26.9723 43.4579C29.9052 42.0387 33.2618 39.5667 36.4142 36.4142C39.5667 33.2618 42.0387 29.9052 43.4579 26.9723C44.1631 25.5148 44.659 24.0585 44.7893 22.7217C44.9179 21.4027 44.7097 19.8813 43.5881 18.7597L29.2403 4.41187C27.8527 3.02428 25.8765 3.02573 24.2861 3.36776C22.6081 3.72863 20.7334 4.58419 18.8396 5.74801C16.4978 7.18716 13.9881 9.18353 11.5858 11.5858C9.18354 13.988 7.18717 16.4978 5.74802 18.8396C4.58421 20.7334 3.72865 22.6081 3.36778 24.2861C3.02574 25.8765 3.02429 27.8527 4.41189 29.2403Z"
                  fill="currentColor"
                  fillRule="evenodd"
                />
              </svg>
            </div>
            <h2 className="text-lg font-bold">OrderQueue</h2>
          </div>
          <div className="flex items-center gap-4">
            <a
              className="hidden md:block text-sm font-medium hover:text-primary"
              href="#"
            >
              Live Queue
            </a>
            <a
              className="hidden md:block text-sm font-medium hover:text-primary"
              href="#"
            >
              Menu Items
            </a>
            <a
              className="hidden md:block text-sm font-medium hover:text-primary"
              href="#"
            >
              Settings
            </a>
            <button className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 hover:bg-gray-200">
              <span className="material-symbols-outlined text-xl">
                notifications
              </span>
            </button>
            <div className="w-10 h-10 rounded-full bg-gray-300" />
          </div>
        </div>
      </header>

      <main className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-screen-2xl mx-auto">
          <div className="mb-6">
            <p className="text-4xl font-black">Live Order Queue</p>
          </div>

          <div className="flex flex-wrap items-center gap-4 mb-6">
            <div className="flex-1 min-w-[250px]">
              <div className="flex items-stretch rounded-lg h-12 bg-white shadow-sm">
                <div className="flex items-center justify-center pl-4 text-gray-500">
                  <span className="material-symbols-outlined">search</span>
                </div>
                <input
                  className="flex-1 px-2 border-none focus:outline-none focus:ring-0 bg-transparent"
                  placeholder="Search by Order ID or menu item..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
            <button
              onClick={() => setSoundOn(!soundOn)}
              className={`flex items-center gap-2 h-12 px-4 rounded-lg shadow-sm ${
                soundOn ? "bg-primary/20 text-primary" : "bg-white"
              }`}
            >
              <span className="material-symbols-outlined">
                {soundOn ? "notifications_active" : "notifications_off"}
              </span>
              <span className="text-sm font-medium">
                Sound {soundOn ? "On" : "Off"}
              </span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <div className="flex flex-col gap-4">
              <div className="p-4 rounded-lg bg-white border-t-4 border-blue-500 shadow-sm">
                <h3 className="text-lg font-bold">
                  Placed{" "}
                  <span className="text-base font-medium text-gray-500">
                    ({getOrdersByStatus("placed").length})
                  </span>
                </h3>
              </div>
              <div className="flex flex-col gap-4">
                {getOrdersByStatus("placed").map((order) => (
                  <OrderCard key={order._id} order={order} />
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="p-4 rounded-lg bg-white border-t-4 border-orange-500 shadow-sm">
                <h3 className="text-lg font-bold">
                  Preparing{" "}
                  <span className="text-base font-medium text-gray-500">
                    ({getOrdersByStatus("preparing").length})
                  </span>
                </h3>
              </div>
              <div className="flex flex-col gap-4">
                {getOrdersByStatus("preparing").map((order) => (
                  <OrderCard key={order._id} order={order} />
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="p-4 rounded-lg bg-white border-t-4 border-green-500 shadow-sm">
                <h3 className="text-lg font-bold">
                  Ready for Pickup{" "}
                  <span className="text-base font-medium text-gray-500">
                    ({getOrdersByStatus("ready").length})
                  </span>
                </h3>
              </div>
              <div className="flex flex-col gap-4">
                {getOrdersByStatus("ready").length === 0 ? (
                  <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-gray-300 rounded-xl">
                    <span className="material-symbols-outlined text-5xl text-gray-400">
                      ramen_dining
                    </span>
                    <p className="mt-4 text-sm font-medium text-gray-500">
                      No orders ready for pickup
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
        </div>
      </main>
    </div>
  );
};

export default OrderQueuePage;
