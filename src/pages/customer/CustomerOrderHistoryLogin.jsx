import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Star, ArrowLeft, Award, Calendar, ShoppingBag, MapPin } from "lucide-react";
import axios from "axios";
import { useAuth } from "../../context/MultiAuthContext";

const CustomerOrderHistoryLogin = () => {
  const navigate = useNavigate();
  const { getCustomerSession } = useAuth();
  const [loading, setLoading] = useState(true);
  const [orderHistory, setOrderHistory] = useState(null);
  const [customerEmail, setCustomerEmail] = useState("");
  
  // Get the restaurant ID from query params if user came from a specific menu
  const urlParams = new URLSearchParams(window.location.search);
  const fromRestaurantId = urlParams.get('from');

  useEffect(() => {
    const customerSession = getCustomerSession();
    if (customerSession.isAuthenticated && customerSession.user) {
      setCustomerEmail(customerSession.user.email);
      fetchOrderHistory(customerSession.user.email);
    } else {
      // Redirect to login if not authenticated
      navigate('/login');
    }
  }, [navigate, getCustomerSession]);

  const fetchOrderHistory = async (email) => {
    try {
      setLoading(true);
      console.log("Fetching order history for email:", email);
      const response = await axios.get(`/api/feedback/customer/email/${encodeURIComponent(email)}/orders`);
      console.log("Order history response:", response.data);
      setOrderHistory(response.data);
    } catch (error) {
      console.error("Error fetching order history:", error);
      setOrderHistory({ totalPoints: 0, orderHistory: [] });
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your order history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(fromRestaurantId ? `/m/${fromRestaurantId}` : '/dashboard')}
              className="text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-xl font-bold">My Order History</h1>
              <p className="text-sm text-gray-600">{customerEmail}</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Debug Info - Remove in production */}
        {process.env.NODE_ENV === 'development' && orderHistory && (
          <div className="bg-gray-100 p-4 rounded-lg mb-4 text-sm">
            <p><strong>Debug Info:</strong></p>
            <p>Customer Email: {customerEmail}</p>
            <p>Orders Found: {orderHistory?.orderHistory?.length || 0}</p>
            <p>Total Points: {orderHistory?.totalPoints || 0}</p>
            {orderHistory.debug && (
              <>
                <p>Backend Debug - Customer Found: {orderHistory.debug.customerFound ? 'Yes' : 'No'}</p>
                <p>Backend Debug - Orders Count: {orderHistory.debug.ordersCount}</p>
              </>
            )}
          </div>
        )}

        {/* Total Feedback Points Card */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl p-6 mb-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 rounded-full p-3">
                <Award className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-3xl font-bold">{orderHistory?.totalPoints || 0}</h2>
                <p className="text-green-100">Total Feedback Points Earned</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-green-100 text-sm">Keep giving feedback</p>
              <p className="text-green-100 text-sm">to earn more points!</p>
            </div>
          </div>
        </div>

        {/* Order History */}
        {orderHistory?.orderHistory?.length > 0 ? (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold flex items-center gap-2">
              <ShoppingBag className="w-5 h-5" />
              Your Orders & Reviews ({orderHistory.orderHistory.length})
            </h3>
            
            {orderHistory.orderHistory.map((order, orderIndex) => (
              <div key={orderIndex} className="bg-white rounded-xl shadow-lg overflow-hidden">
                {/* Order Header */}
                <div className="bg-gray-50 px-6 py-4 border-b">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-gray-500" />
                      <div>
                        <p className="font-semibold">
                          Order #{order.orderId.toString().slice(-6).toUpperCase()}
                        </p>
                        <p className="text-sm text-gray-600">
                          {new Date(order.orderDate).toLocaleDateString()} • {new Date(order.orderDate).toLocaleTimeString()} • ₹{order.totalAmount?.toFixed(2)}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <MapPin className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-600">
                            {order.restaurantName} - Table {order.tableNumber}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                            order.status === 'ready' ? 'bg-blue-100 text-blue-700' :
                            order.status === 'preparing' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </span>
                          {order.feedbackSubmitted && (
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                              Feedback Given
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      {order.totalPoints > 0 ? (
                        <div className="flex items-center gap-2 bg-green-100 px-3 py-1 rounded-full">
                          <Award className="w-4 h-4 text-green-600" />
                          <span className="font-semibold text-green-700">
                            +{order.totalPoints} points
                          </span>
                        </div>
                      ) : (
                        <div className="text-sm text-gray-500">
                          {order.status === 'delivered' && !order.feedbackSubmitted ? 'Feedback pending' : 'No feedback'}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-6">
                  <div className="space-y-4">
                    {order.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="flex gap-4 p-4 bg-gray-50 rounded-lg">
                        <img
                          src={
                            item.imageUrl
                              ? `http://localhost:5000${item.imageUrl}`
                              : "https://via.placeholder.com/80x80?text=No+Image"
                          }
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                        />
                        <div className="flex-1">
                          <h4 className="font-semibold text-lg">{item.name}</h4>
                          <p className="text-sm text-gray-600">
                            Qty: {item.quantity} • ₹{(item.price * item.quantity).toFixed(2)}
                          </p>
                          
                          {/* Rating - only show if feedback given */}
                          {item.rating ? (
                            <div className="flex items-center gap-3 mt-2">
                              {renderStars(item.rating)}
                              <span className="text-sm text-gray-600">
                                ({item.rating}/5)
                              </span>
                              <div className="flex items-center gap-1 bg-green-100 px-2 py-1 rounded-full">
                                <Award className="w-3 h-3 text-green-600" />
                                <span className="text-xs font-semibold text-green-700">
                                  +{item.points} pts
                                </span>
                              </div>
                            </div>
                          ) : (
                            <div className="mt-2">
                              <span className="text-sm text-gray-500">No rating given</span>
                            </div>
                          )}

                          {/* Description */}
                          {item.description && (
                            <div className="mt-3 p-3 bg-white border border-gray-200 rounded-lg">
                              <p className="text-sm text-gray-700 italic">
                                "{item.description}"
                              </p>
                            </div>
                          )}

                          {/* Feedback Date */}
                          {item.feedbackDate && (
                            <p className="text-xs text-gray-500 mt-2">
                              Reviewed on {new Date(item.feedbackDate).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Orders Yet</h3>
            <p className="text-gray-600 mb-6">
              You haven't placed any orders yet. Start exploring restaurants!
            </p>
            <button
              onClick={() => navigate(fromRestaurantId ? `/m/${fromRestaurantId}` : '/dashboard')}
              className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
            >
              {fromRestaurantId ? 'Back to Menu' : 'Explore Restaurants'}
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default CustomerOrderHistoryLogin;