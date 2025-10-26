import { useState } from "react";
import { Star, X } from "lucide-react";
import axios from "axios";

const FeedbackModal = ({ order, isOpen, onClose, onSubmit }) => {
  const [itemFeedbacks, setItemFeedbacks] = useState(
    order?.items?.map((item, index) => ({
      itemIndex: index,
      rating: 0,
      description: ""
    })) || []
  );
  const [submitting, setSubmitting] = useState(false);

  const updateItemFeedback = (itemIndex, field, value) => {
    setItemFeedbacks(prev =>
      prev.map(feedback =>
        feedback.itemIndex === itemIndex
          ? { ...feedback, [field]: value }
          : feedback
      )
    );
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      
      // Generate session ID based on restaurant and table
      const sessionId = `${order.restaurantId}-${order.tableNumber}`;
      
      const response = await axios.post(`/api/feedback/order/${order._id}`, {
        itemFeedbacks: itemFeedbacks.filter(f => f.rating > 0 && f.rating <= 5),
        customerEmail: order.customerEmail || null
      });

      onSubmit(response.data);
      onClose();
    } catch (error) {
      console.error("Error submitting feedback:", error);
      if (error.response?.data?.code === "FEEDBACK_ALREADY_SUBMITTED") {
        alert("Feedback has already been submitted for this order.");
        onClose();
      } else {
        alert("Failed to submit feedback. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const canSubmit = itemFeedbacks.some(f => f.rating > 0);

  if (!isOpen || !order) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center rounded-t-xl">
          <div>
            <h2 className="text-xl font-bold">Rate Your Experience</h2>
            <p className="text-sm text-gray-600">Help us improve by rating each item</p>
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
          <div className="space-y-6">
            {order.items.map((item, index) => {
              const feedback = itemFeedbacks[index];
              return (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex gap-4">
                    <img
                      src={
                        item.menuItemId?.imageUrl
                          ? `http://localhost:5000${item.menuItemId.imageUrl}`
                          : "https://via.placeholder.com/80x80?text=No+Image"
                      }
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{item.name}</h3>
                      <p className="text-sm text-gray-600 mb-3">
                        Quantity: {item.quantity} • ₹{(item.price * item.quantity).toFixed(2)}
                      </p>

                      {/* Star Rating */}
                      <div className="mb-3">
                        <p className="text-sm font-medium mb-2">Rate this item:</p>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              onClick={() => updateItemFeedback(index, 'rating', star)}
                              className={`p-1 transition-colors ${
                                star <= feedback.rating
                                  ? 'text-yellow-400'
                                  : 'text-gray-300 hover:text-yellow-200'
                              }`}
                            >
                              <Star
                                className="w-8 h-8"
                                fill={star <= feedback.rating ? 'currentColor' : 'none'}
                              />
                            </button>
                          ))}
                        </div>
                        {feedback.rating > 0 && (
                          <p className="text-xs text-gray-600 mt-1">
                            {feedback.rating === 1 && "Poor"}
                            {feedback.rating === 2 && "Fair"}
                            {feedback.rating === 3 && "Good"}
                            {feedback.rating === 4 && "Very Good"}
                            {feedback.rating === 5 && "Excellent"}
                          </p>
                        )}
                      </div>

                      {/* Description */}
                      {feedback.rating > 0 && (
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Tell us more (optional):
                          </label>
                          <textarea
                            value={feedback.description}
                            onChange={(e) => updateItemFeedback(index, 'description', e.target.value)}
                            placeholder="Share your thoughts about this item..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                            rows={2}
                            maxLength={200}
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            {feedback.description.length}/200 characters
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>



          {/* Submit Button */}
          <div className="mt-6 flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50"
            >
              Skip for Now
            </button>
            <button
              onClick={handleSubmit}
              disabled={!canSubmit || submitting}
              className={`flex-1 px-4 py-3 rounded-lg font-medium ${
                canSubmit && !submitting
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {submitting ? 'Submitting...' : 'Submit Feedback'}
            </button>
          </div>

          {!canSubmit && (
            <p className="text-xs text-gray-500 text-center mt-2">
              Rate at least one item to earn points
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FeedbackModal;