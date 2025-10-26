import { useState, useEffect } from "react";
import { Star, X, Award, Calendar } from "lucide-react";
import axios from "axios";

const FeedbackHistoryModal = ({ isOpen, onClose, restaurantId, tableNumber, onPointsUpdate }) => {
  const [feedbackHistory, setFeedbackHistory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && restaurantId && tableNumber) {
      fetchFeedbackHistory();
    }
  }, [isOpen, restaurantId, tableNumber]);

  const fetchFeedbackHistory = async () => {
    try {
      setLoading(true);
      
      // Try to get customer session first
      const customerSession = JSON.parse(localStorage.getItem('customerSession') || '{}');
      
      let response;
      if (customerSession.isAuthenticated && customerSession.user?.email) {
        // Logged in customer - get all their orders across all restaurants
        response = await axios.get(`/api/feedback/customer/email/${encodeURIComponent(customerSession.user.email)}/orders`);
      } else {
        // Guest customer - get orders for this table/restaurant session
        const sessionId = `${restaurantId}-${tableNumber}`;
        response = await axios.get(`/api/feedback/customer/${sessionId}/orders`);
      }
      
      setFeedbackHistory(response.data);
      if (onPointsUpdate) {
        onPointsUpdate(response.data.totalPoints || 0);
      }
    } catch (error) {
      console.error("Error fetching feedback history:", error);
      setFeedbackHistory({ totalPoints: 0, orderHistory: [] });
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center rounded-t-xl">
          <div>
            <h2 className="text-xl font-bold">Your Feedback History</h2>
            <p className="text-sm text-gray-600">Track your points and past reviews</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading your feedback history...</p>
            </div>
          ) : (
            <>
              {/* Points Summary */}
              <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg p-6 mb-6">
                <div className="flex items-center gap-3">
                  <Award className="w-8 h-8" />
                  <div>
                    <h3 className="text-2xl font-bold">{feedbackHistory?.totalPoints || 0}</h3>
                    <p className="text-green-100">Total Feedback Points</p>
                  </div>
                </div>
                <p className="text-sm text-green-100 mt-2">
                  Keep giving feedback to earn more points and unlock rewards!
                </p>
              </div>

              {/* Order History */}
              {feedbackHistory?.orderHistory?.length > 0 ? (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Your Reviews</h3>
                  {feedbackHistory.orderHistory.map((order, orderIndex) => (
                    <div key={orderIndex} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-600">
                            {new Date(order.orderDate).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-semibold text-green-600">
                            +{order.totalPoints} points
                          </span>
                        </div>
                      </div>

                      <div className="space-y-3">
                        {order.items.map((item, itemIndex) => (
                          <div key={itemIndex} className="flex gap-3 p-3 bg-gray-50 rounded-lg">
                            <img
                              src={
                                item.menuItemId?.imageUrl
                                  ? `http://localhost:5000${item.menuItemId.imageUrl}`
                                  : "https://via.placeholder.com/60x60?text=No+Image"
                              }
                              alt={item.name}
                              className="w-12 h-12 object-cover rounded-lg flex-shrink-0"
                            />
                            <div className="flex-1">
                              <h4 className="font-medium">{item.name}</h4>
                              <div className="flex items-center gap-2 mt-1">
                                {renderStars(item.rating)}
                                <span className="text-sm text-gray-600">
                                  ({item.rating}/5)
                                </span>
                                <span className="text-sm font-medium text-green-600">
                                  +{item.points} pts
                                </span>
                              </div>
                              {item.description && (
                                <p className="text-sm text-gray-600 mt-2 italic">
                                  "{item.description}"
                                </p>
                              )}
                              {item.feedbackDate && (
                                <p className="text-xs text-gray-500 mt-1">
                                  Reviewed on {new Date(item.feedbackDate).toLocaleDateString()}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Award className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Reviews Yet</h3>
                  <p className="text-gray-600 mb-4">
                    Complete an order and give feedback to start earning points!
                  </p>

                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default FeedbackHistoryModal;