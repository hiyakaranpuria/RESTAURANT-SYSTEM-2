import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import axios from "axios";
import { useAuth } from "../../context/MultiAuthContext";
import QRCodeManager from "../../components/QRCodeManager";

const QRManagementPage = () => {
  const navigate = useNavigate();
  const {
    isRestaurantAuthenticated,
    getRestaurantSession,
    getToken,
    loading: authLoading,
  } = useAuth();
  const [restaurantInfo, setRestaurantInfo] = useState(null);

  // Check restaurant authentication
  useEffect(() => {
    if (!authLoading && !isRestaurantAuthenticated) {
      navigate("/restaurant/login");
    }
  }, [authLoading, isRestaurantAuthenticated, navigate]);

  useEffect(() => {
    if (isRestaurantAuthenticated) {
      fetchRestaurantInfo();
    }
  }, [isRestaurantAuthenticated]);

  const fetchRestaurantInfo = async () => {
    try {
      // Set axios authorization header
      const token = getToken("restaurant");
      if (token) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      }
      
      const { data } = await axios.get("/api/auth/me");
      console.log("Auth me response:", data);
      
      // Extract restaurant info from the response
      const restaurantData = data.restaurant || data;
      setRestaurantInfo(restaurantData);
      console.log("Restaurant info loaded:", restaurantData);
    } catch (error) {
      console.error("Error fetching restaurant info:", error);
    }
  };

  if (authLoading || !restaurantInfo) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading restaurant information...</p>
        </div>
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
              onClick={() => navigate("/restaurant/dashboard")}
              className="text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">QR Code Management</h1>
              <p className="text-sm text-gray-600">
                {restaurantInfo?.restaurantName} • Manage your table QR codes
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <QRCodeManager 
          restaurantId={restaurantInfo?._id} 
          restaurantName={restaurantInfo?.restaurantName}
        />
      </main>
    </div>
  );
};

export default QRManagementPage;