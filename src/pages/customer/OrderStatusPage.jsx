import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const OrderStatusPage = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    fetchOrder();
    const interval = setInterval(fetchOrder, 5000);
    return () => clearInterval(interval);
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      const { data } = await axios.get(`/api/orders/${orderId}`);
      setOrder(data);
    } catch (error) {
      console.error("Error fetching order:", error);
    }
  };

  const statusSteps = [
    { key: "placed", label: "Order Placed", icon: "receipt_long" },
    { key: "preparing", label: "In the Kitchen", icon: "soup_kitchen" },
    { key: "ready", label: "Ready for Pickup", icon: "local_mall" },
    { key: "served", label: "Completed", icon: "check_circle" },
  ];

  const currentStepIndex = statusSteps.findIndex(
    (s) => s.key === order?.status
  );
  const progress = ((currentStepIndex + 1) / statusSteps.length) * 100;

  if (!order)
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );

  return (
    <div className="min-h-screen bg-background-light">
      <header className="px-4 py-3 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 text-primary">
              <svg
                fill="none"
                viewBox="0 0 48 48"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M13.8261 17.4264C16.7203 18.1174 20.2244 18.5217 24 18.5217C27.7756 18.5217 31.2797 18.1174 34.1739 17.4264C36.9144 16.7722 39.9967 15.2331 41.3563 14.1648L24.8486 40.6391C24.4571 41.267 23.5429 41.267 23.1514 40.6391L6.64374 14.1648C8.00331 15.2331 11.0856 16.7722 13.8261 17.4264Z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <h2 className="text-xl font-bold">The Gourmet Spot</h2>
          </div>
          <button className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200">
            <span className="material-symbols-outlined">account_circle</span>
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4">
        <div className="text-center my-6">
          <h1 className="text-4xl md:text-5xl font-black">Track Your Order</h1>
        </div>
        <h2 className="text-center text-xl font-bold text-gray-600 mb-10">
          Order #{order._id.slice(-6)} for Table{" "}
          {order.tableId?.number || "N/A"}
        </h2>

        <div className="flex items-center w-full px-4 mb-12">
          {statusSteps.map((step, idx) => (
            <div key={step.key} className="flex items-center flex-1">
              <div className="flex flex-col items-center text-center relative flex-1">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full z-10 ${
                    idx <= currentStepIndex
                      ? "bg-primary text-white"
                      : "bg-gray-300 text-gray-500"
                  }`}
                >
                  <span className="material-symbols-outlined">{step.icon}</span>
                </div>
                <p
                  className={`mt-2 text-sm font-semibold ${
                    idx <= currentStepIndex ? "text-primary" : "text-gray-500"
                  }`}
                >
                  {step.label}
                </p>
              </div>
              {idx < statusSteps.length - 1 && (
                <div
                  className={`flex-1 h-1 ${
                    idx < currentStepIndex ? "bg-primary" : "bg-gray-300"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <div className="p-6 rounded-xl bg-white shadow-lg border mb-6">
          <div className="flex flex-col gap-3">
            <p className="text-2xl font-bold">
              {statusSteps[currentStepIndex]?.label}
            </p>
            <p className="text-gray-600">
              {order.status === "preparing" && "Your food is being prepared"}
              {order.status === "ready" && "Your order is ready for pickup"}
              {order.status === "served" && "Enjoy your meal!"}
              {order.status === "placed" && "Your order has been received"}
            </p>
            <div className="w-full rounded-full bg-primary/20 mt-2">
              <div
                className="h-2.5 rounded-full bg-primary"
                style={{ width: `${progress}%` }}
              />
            </div>
            {order.status === "preparing" && (
              <div className="flex items-center gap-2 mt-4 text-primary font-medium">
                <span className="material-symbols-outlined text-xl">timer</span>
                <span>Ready in approximately 8 minutes</span>
              </div>
            )}
          </div>
        </div>

        <div className="rounded-xl bg-white shadow-lg border mb-6">
          <details>
            <summary className="flex items-center justify-between p-4 cursor-pointer list-none">
              <span className="font-bold text-lg">View Order Details</span>
              <span className="material-symbols-outlined">expand_more</span>
            </summary>
            <div className="p-4 border-t">
              <ul className="space-y-3 text-gray-700">
                {order.items.map((item, idx) => (
                  <li key={idx} className="flex justify-between">
                    <span>
                      {item.qty}x {item.menuItemId?.name || "Item"}
                    </span>
                    <span>
                      ${(item.qty * (item.menuItemId?.price || 0)).toFixed(2)}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="border-t my-4" />
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>${order.total?.toFixed(2)}</span>
              </div>
            </div>
          </details>
        </div>

        <div className="mt-auto pt-6 text-center">
          <button className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 rounded-lg bg-primary/20 text-primary font-bold hover:bg-primary/30">
            <span className="material-symbols-outlined">support_agent</span>
            <span>Call Waiter</span>
          </button>
        </div>
      </main>
    </div>
  );
};

export default OrderStatusPage;
