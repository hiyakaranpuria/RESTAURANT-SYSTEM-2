import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const RestaurantVerificationPage = () => {
  const navigate = useNavigate();
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [filter, setFilter] = useState("pending");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [notes, setNotes] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchRestaurants();
  }, [filter]);

  const fetchRestaurants = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`/api/restaurant?status=${filter}`);
      setRestaurants(data);
    } catch (error) {
      console.error("Error fetching restaurants:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (restaurantId) => {
    try {
      const { data } = await axios.get(`/api/restaurant/${restaurantId}`);
      setSelectedRestaurant(data);
      setShowModal(true);
    } catch (error) {
      console.error("Error fetching restaurant details:", error);
    }
  };

  const handleApprove = async () => {
    if (!selectedRestaurant) return;

    setActionLoading(true);
    try {
      await axios.patch(`/api/restaurant/${selectedRestaurant._id}/verify`, {
        status: "approved",
        notes: notes,
      });

      alert("Restaurant approved successfully!");
      setShowModal(false);
      setSelectedRestaurant(null);
      setNotes("");
      fetchRestaurants();
    } catch (error) {
      alert("Error approving restaurant: " + error.response?.data?.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!selectedRestaurant) return;

    if (!rejectionReason.trim()) {
      alert("Please provide a rejection reason");
      return;
    }

    setActionLoading(true);
    try {
      await axios.patch(`/api/restaurant/${selectedRestaurant._id}/verify`, {
        status: "rejected",
        rejectionReason: rejectionReason,
        notes: notes,
      });

      alert("Restaurant rejected");
      setShowModal(false);
      setSelectedRestaurant(null);
      setRejectionReason("");
      setNotes("");
      fetchRestaurants();
    } catch (error) {
      alert("Error rejecting restaurant: " + error.response?.data?.message);
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      pending: "bg-yellow-100 text-yellow-800",
      approved: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
    };

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status]}`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-background-light">
      {/* Header */}
      <header className="bg-white border-b px-4 py-3">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-primary">
              verified
            </span>
            <h1 className="text-xl font-bold">Restaurant Verification</h1>
          </div>
          <button
            onClick={() => navigate("/admin/menu")}
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            Back to Dashboard
          </button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Filters */}
        <div className="mb-6 flex gap-4">
          <button
            onClick={() => setFilter("pending")}
            className={`px-4 py-2 rounded-lg font-medium ${
              filter === "pending"
                ? "bg-primary text-white"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            Pending (
            {
              restaurants.filter((r) => r.verification.status === "pending")
                .length
            }
            )
          </button>
          <button
            onClick={() => setFilter("approved")}
            className={`px-4 py-2 rounded-lg font-medium ${
              filter === "approved"
                ? "bg-primary text-white"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            Approved
          </button>
          <button
            onClick={() => setFilter("rejected")}
            className={`px-4 py-2 rounded-lg font-medium ${
              filter === "rejected"
                ? "bg-primary text-white"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            Rejected
          </button>
        </div>

        {/* Restaurant List */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading...</p>
          </div>
        ) : restaurants.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg">
            <p className="text-gray-600">No restaurants found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {restaurants.map((restaurant) => (
              <div
                key={restaurant._id}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold">
                        {restaurant.restaurantName}
                      </h3>
                      {getStatusBadge(restaurant.verification.status)}
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                      <div>
                        <p>
                          <span className="font-medium">Type:</span>{" "}
                          {restaurant.businessType}
                        </p>
                        <p>
                          <span className="font-medium">Cuisine:</span>{" "}
                          {restaurant.cuisineType}
                        </p>
                        <p>
                          <span className="font-medium">Owner:</span>{" "}
                          {restaurant.owner.name}
                        </p>
                      </div>
                      <div>
                        <p>
                          <span className="font-medium">Email:</span>{" "}
                          {restaurant.owner.email}
                        </p>
                        <p>
                          <span className="font-medium">Phone:</span>{" "}
                          {restaurant.phone}
                        </p>
                        <p>
                          <span className="font-medium">Location:</span>{" "}
                          {restaurant.address.city}, {restaurant.address.state}
                        </p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Applied:{" "}
                      {new Date(restaurant.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={() => handleViewDetails(restaurant._id)}
                    className="ml-4 px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Details Modal */}
      {showModal && selectedRestaurant && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setShowModal(false)}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
                <h2 className="text-2xl font-bold">
                  {selectedRestaurant.restaurantName}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Business Information */}
                <div>
                  <h3 className="text-lg font-bold mb-3">
                    Business Information
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Restaurant Name</p>
                      <p className="font-medium">
                        {selectedRestaurant.restaurantName}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Business Type</p>
                      <p className="font-medium">
                        {selectedRestaurant.businessType}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Cuisine Type</p>
                      <p className="font-medium">
                        {selectedRestaurant.cuisineType}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Phone</p>
                      <p className="font-medium">{selectedRestaurant.phone}</p>
                    </div>
                  </div>
                  {selectedRestaurant.description && (
                    <div className="mt-3">
                      <p className="text-gray-600">Description</p>
                      <p className="text-sm">
                        {selectedRestaurant.description}
                      </p>
                    </div>
                  )}
                </div>

                {/* Location */}
                <div>
                  <h3 className="text-lg font-bold mb-3">Location</h3>
                  <p className="text-sm">
                    {selectedRestaurant.address.street}
                    <br />
                    {selectedRestaurant.address.city},{" "}
                    {selectedRestaurant.address.state}{" "}
                    {selectedRestaurant.address.postalCode}
                    <br />
                    {selectedRestaurant.address.country}
                  </p>
                </div>

                {/* Owner Information */}
                <div>
                  <h3 className="text-lg font-bold mb-3">Owner Information</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Name</p>
                      <p className="font-medium">
                        {selectedRestaurant.owner.name}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Email</p>
                      <p className="font-medium">
                        {selectedRestaurant.owner.email}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Phone</p>
                      <p className="font-medium">
                        {selectedRestaurant.owner.phone}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Verification Documents */}
                <div>
                  <h3 className="text-lg font-bold mb-3">
                    Verification Documents
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600">
                        Business License Number
                      </p>
                      <p className="font-medium">
                        {selectedRestaurant.verification.businessLicense}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Tax ID</p>
                      <p className="font-medium">
                        {selectedRestaurant.verification.taxId}
                      </p>
                    </div>

                    {/* Document Links */}
                    <div className="grid grid-cols-3 gap-4 mt-4">
                      {selectedRestaurant.verification.gstRegistration && (
                        <a
                          href={`http://localhost:5000${selectedRestaurant.verification.gstRegistration}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50"
                        >
                          <span className="material-symbols-outlined text-4xl text-primary mb-2">
                            description
                          </span>
                          <p className="text-sm font-medium text-center">
                            GST Registration
                          </p>
                        </a>
                      )}
                      {selectedRestaurant.verification.fssaiLicense && (
                        <a
                          href={`http://localhost:5000${selectedRestaurant.verification.fssaiLicense}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50"
                        >
                          <span className="material-symbols-outlined text-4xl text-primary mb-2">
                            description
                          </span>
                          <p className="text-sm font-medium text-center">
                            FSSAI License
                          </p>
                        </a>
                      )}
                      {selectedRestaurant.verification.ownerAadhar && (
                        <a
                          href={`http://localhost:5000${selectedRestaurant.verification.ownerAadhar}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50"
                        >
                          <span className="material-symbols-outlined text-4xl text-primary mb-2">
                            badge
                          </span>
                          <p className="text-sm font-medium text-center">
                            Owner Aadhar
                          </p>
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {/* Admin Actions */}
                {selectedRestaurant.verification.status === "pending" && (
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-bold mb-3">Admin Actions</h3>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Notes (Optional)
                        </label>
                        <textarea
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          className="w-full rounded-lg border border-gray-300 p-3 text-sm"
                          rows="3"
                          placeholder="Add any notes about this application..."
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Rejection Reason (Required if rejecting)
                        </label>
                        <textarea
                          value={rejectionReason}
                          onChange={(e) => setRejectionReason(e.target.value)}
                          className="w-full rounded-lg border border-gray-300 p-3 text-sm"
                          rows="2"
                          placeholder="Provide reason for rejection..."
                        />
                      </div>

                      <div className="flex gap-4">
                        <button
                          onClick={handleApprove}
                          disabled={actionLoading}
                          className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50"
                        >
                          {actionLoading
                            ? "Processing..."
                            : "Approve Restaurant"}
                        </button>
                        <button
                          onClick={handleReject}
                          disabled={actionLoading}
                          className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 disabled:opacity-50"
                        >
                          {actionLoading
                            ? "Processing..."
                            : "Reject Application"}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Review Information (if already reviewed) */}
                {selectedRestaurant.verification.status !== "pending" && (
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-bold mb-3">
                      Review Information
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div>
                        <p className="text-gray-600">Status</p>
                        <p className="font-medium">
                          {selectedRestaurant.verification.status}
                        </p>
                      </div>
                      {selectedRestaurant.verification.reviewedAt && (
                        <div>
                          <p className="text-gray-600">Reviewed At</p>
                          <p className="font-medium">
                            {new Date(
                              selectedRestaurant.verification.reviewedAt
                            ).toLocaleString()}
                          </p>
                        </div>
                      )}
                      {selectedRestaurant.verification.notes && (
                        <div>
                          <p className="text-gray-600">Notes</p>
                          <p className="font-medium">
                            {selectedRestaurant.verification.notes}
                          </p>
                        </div>
                      )}
                      {selectedRestaurant.verification.rejectionReason && (
                        <div>
                          <p className="text-gray-600">Rejection Reason</p>
                          <p className="font-medium text-red-600">
                            {selectedRestaurant.verification.rejectionReason}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default RestaurantVerificationPage;
