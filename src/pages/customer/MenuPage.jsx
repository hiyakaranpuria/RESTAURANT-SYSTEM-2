import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import ItemCustomizationModal from "../../components/ItemCustomizationModal";
import CustomerLoginModal from "../../components/CustomerLoginModal";
import FeedbackHistoryModal from "../../components/FeedbackHistoryModal";
import { useAuth } from "../../context/MultiAuthContext";

const MenuPage = () => {
  const { restaurantId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [restaurantInfo, setRestaurantInfo] = useState(null);
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [tableNumber, setTableNumber] = useState("");
  const [showTableModal, setShowTableModal] = useState(true);
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [dietaryFilter, setDietaryFilter] = useState("all"); // all, veg, nonveg
  const [priceRange, setPriceRange] = useState("all"); // all, budget, mid, premium
  const [sortBy, setSortBy] = useState("default"); // default, price-low, price-high
  const [showFilters, setShowFilters] = useState(false);
  const [customizingItem, setCustomizingItem] = useState(null);
  const [showCustomerLogin, setShowCustomerLogin] = useState(false);
  const [customerPoints, setCustomerPoints] = useState(0);
  const [showFeedbackHistory, setShowFeedbackHistory] = useState(false);

  const { isCustomerAuthenticated, getCustomerSession } = useAuth();

  useEffect(() => {
    // Check if table number is already set
    const savedTable = sessionStorage.getItem("tableNumber");
    const savedRestaurant = sessionStorage.getItem("restaurantId");

    if (savedTable && savedRestaurant === restaurantId) {
      setTableNumber(savedTable);
      setShowTableModal(false);
      fetchCustomerPoints();
    }

    fetchMenuData();
  }, [restaurantId]);

  useEffect(() => {
    if (tableNumber && restaurantId) {
      fetchCustomerPoints();
    }
  }, [tableNumber, restaurantId]);

  // Refresh points when page becomes visible (user returns from other pages)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && tableNumber && restaurantId) {
        fetchCustomerPoints();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [tableNumber, restaurantId]);

  const fetchCustomerPoints = async () => {
    if (restaurantId && tableNumber) {
      try {
        const sessionId = `${restaurantId}-${tableNumber}`;
        const response = await axios.get(`/api/feedback/customer/${sessionId}`);
        setCustomerPoints(response.data.totalPoints || 0);
      } catch (error) {
        console.error("Error fetching customer points:", error);
      }
    }
  };

  const updateCustomerPoints = (newPoints) => {
    setCustomerPoints(newPoints);
  };

  // Expose updateCustomerPoints globally for OrderStatusPage
  useEffect(() => {
    window.updateCustomerPoints = updateCustomerPoints;
    return () => {
      delete window.updateCustomerPoints;
    };
  }, []);

  const fetchMenuData = async () => {
    try {
      // Fetch restaurant info
      const restaurantRes = await axios.get(`/api/restaurant/${restaurantId}`);
      setRestaurantInfo(restaurantRes.data);

      // Fetch categories
      const categoriesRes = await axios.get(`/api/menu/categories`, {
        params: { restaurantId },
      });
      setCategories(categoriesRes.data);

      // Fetch menu items
      const itemsRes = await axios.get(`/api/menu/items`, {
        params: { restaurantId },
      });
      setItems(itemsRes.data.items.filter((item) => item.availability));
    } catch (error) {
      console.error("Error fetching menu:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleTableSubmit = (e) => {
    e.preventDefault();
    if (tableNumber.trim()) {
      sessionStorage.setItem("tableNumber", tableNumber);
      sessionStorage.setItem("restaurantId", restaurantId);
      setShowTableModal(false);
      fetchCustomerPoints();
    }
  };

  const hasCustomizations = (item) => {
    // First check if customization is enabled for this item
    if (!item.enableCustomization) {
      return false;
    }

    // Only show customization modal if there are actual options configured
    const hasSizes = item.sizes && item.sizes.length > 0;
    const hasAddOns = item.addOns && item.addOns.length > 0;
    const hasOptions =
      item.customizationOptions && item.customizationOptions.length > 0;
    const hasExcludable =
      item.excludableIngredients && item.excludableIngredients.length > 0;

    // Only consider special instructions if there are other customizations
    return hasSizes || hasAddOns || hasOptions || hasExcludable;
  };

  const handleAddToCart = (item) => {
    if (hasCustomizations(item)) {
      setCustomizingItem(item);
    } else {
      addToCartDirectly(item);
    }
  };

  const addToCartDirectly = (item) => {
    const existingItem = cart.find((cartItem) => cartItem._id === item._id);

    if (existingItem) {
      setCart(
        cart.map((cartItem) =>
          cartItem._id === item._id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        )
      );
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const addCustomizedItemToCart = (customizedItem) => {
    // Generate unique ID for customized item
    const customizationKey = JSON.stringify({
      size: customizedItem.selectedSize?.name,
      addOns: customizedItem.selectedAddOns.map((a) => a.name).sort(),
      customizations: customizedItem.customizations,
      excluded: customizedItem.excludedIngredients.sort(),
      instructions: customizedItem.specialInstructions,
    });

    const existingItem = cart.find(
      (cartItem) =>
        cartItem._id === customizedItem._id &&
        cartItem.customizationKey === customizationKey
    );

    if (existingItem) {
      setCart(
        cart.map((cartItem) =>
          cartItem._id === customizedItem._id &&
          cartItem.customizationKey === customizationKey
            ? {
                ...cartItem,
                quantity: cartItem.quantity + customizedItem.quantity,
              }
            : cartItem
        )
      );
    } else {
      setCart([...cart, { ...customizedItem, customizationKey }]);
    }
  };

  const removeFromCart = (itemId) => {
    setCart(cart.filter((item) => item._id !== itemId));
  };

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity === 0) {
      removeFromCart(itemId);
    } else {
      setCart(
        cart.map((item) =>
          item._id === itemId ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };

  const getTotalPrice = () => {
    return cart.reduce(
      (total, item) =>
        total + (item.customizedPrice || item.price) * item.quantity,
      0
    );
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const filteredItems = items
    .filter((item) => {
      // Category filter
      if (
        selectedCategory !== "all" &&
        item.categoryId?._id !== selectedCategory
      ) {
        return false;
      }

      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(query);
        const matchesDescription = item.description
          ?.toLowerCase()
          .includes(query);
        if (!matchesName && !matchesDescription) {
          return false;
        }
      }

      // Dietary filter (assuming items have a 'isVeg' field - we'll add this)
      if (dietaryFilter === "veg" && !item.isVeg) {
        return false;
      }
      if (dietaryFilter === "nonveg" && item.isVeg) {
        return false;
      }

      // Price range filter
      if (priceRange === "budget" && item.price > 200) {
        return false;
      }
      if (priceRange === "mid" && (item.price <= 200 || item.price > 500)) {
        return false;
      }
      if (priceRange === "premium" && item.price <= 500) {
        return false;
      }

      return true;
    })
    .sort((a, b) => {
      // Sorting
      if (sortBy === "price-low") {
        return a.price - b.price;
      }
      if (sortBy === "price-high") {
        return b.price - a.price;
      }
      return 0; // default order
    });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg">Loading menu...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Table Number Modal */}
      {showTableModal && (
        <>
          <div className="fixed inset-0 bg-black/50 z-50" />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-8 animate-scaleIn">
              <div className="text-center mb-6">
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
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold mb-2">Welcome to</h2>
                <h3 className="text-xl text-green-600 font-semibold">
                  {restaurantInfo?.restaurantName}
                </h3>
              </div>

              <form onSubmit={handleTableSubmit}>
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">
                    Enter Your Table Number
                  </label>
                  <input
                    type="text"
                    required
                    value={tableNumber}
                    onChange={(e) => setTableNumber(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-center text-2xl font-bold focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="e.g., 5"
                    autoFocus
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700"
                >
                  View Menu
                </button>
              </form>
            </div>
          </div>
        </>
      )}

      {/* Header */}
      <header className="bg-white border-b shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-xl font-bold">
                {restaurantInfo?.restaurantName}
              </h1>
              <div className="flex items-center gap-3">
                <p className="text-sm text-gray-600">Table {tableNumber}</p>
                {customerPoints > 0 && (
                  <div className="flex items-center gap-1 bg-yellow-100 px-2 py-1 rounded-full">
                    <svg
                      className="w-4 h-4 text-yellow-600"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                    <span className="text-sm font-semibold text-yellow-700">
                      {customerPoints} pts
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {/* Order History Button */}
              <button
                onClick={() => navigate(`/customer/history/${restaurantId}`)}
                className="bg-blue-500 text-white px-3 py-2 rounded-lg font-medium hover:bg-blue-600 flex items-center gap-2"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
                <span className="hidden sm:inline">History</span>
              </button>

              {/* Cart Button */}
              <button
                onClick={() => setShowCart(true)}
                className="relative bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700"
              >
                <div className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  <span>Cart</span>
                  {getTotalItems() > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                      {getTotalItems()}
                    </span>
                  )}
                </div>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Search Bar */}
      <div className="bg-white border-b sticky top-[73px] z-30">
        <div className="container mx-auto px-4 py-3">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search dishes..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <svg
                className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 ${
                showFilters ||
                dietaryFilter !== "all" ||
                priceRange !== "all" ||
                sortBy !== "default"
                  ? "bg-green-600 text-white"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                />
              </svg>
              Filters
            </button>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="mt-3 p-4 bg-gray-50 rounded-lg space-y-4 animate-slideInUp">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Dietary Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dietary Preference
                  </label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setDietaryFilter("all")}
                      className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium ${
                        dietaryFilter === "all"
                          ? "bg-green-600 text-white"
                          : "bg-white text-gray-700 border"
                      }`}
                    >
                      All
                    </button>
                    <button
                      onClick={() => setDietaryFilter("veg")}
                      className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium ${
                        dietaryFilter === "veg"
                          ? "bg-green-600 text-white"
                          : "bg-white text-gray-700 border"
                      }`}
                    >
                      🟢 Veg
                    </button>
                    <button
                      onClick={() => setDietaryFilter("nonveg")}
                      className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium ${
                        dietaryFilter === "nonveg"
                          ? "bg-green-600 text-white"
                          : "bg-white text-gray-700 border"
                      }`}
                    >
                      🔴 Non-Veg
                    </button>
                  </div>
                </div>

                {/* Price Range Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price Range
                  </label>
                  <select
                    value={priceRange}
                    onChange={(e) => setPriceRange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  >
                    <option value="all">All Prices</option>
                    <option value="budget">Budget (Under ₹200)</option>
                    <option value="mid">Mid-Range (₹200-500)</option>
                    <option value="premium">Premium (Above ₹500)</option>
                  </select>
                </div>

                {/* Sort By */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sort By
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  >
                    <option value="default">Default</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                  </select>
                </div>
              </div>

              {/* Clear Filters */}
              {(dietaryFilter !== "all" ||
                priceRange !== "all" ||
                sortBy !== "default") && (
                <button
                  onClick={() => {
                    setDietaryFilter("all");
                    setPriceRange("all");
                    setSortBy("default");
                  }}
                  className="text-sm text-red-600 hover:text-red-700 font-medium"
                >
                  Clear all filters
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Category Filter */}
      <div className="bg-white border-b sticky top-[145px] z-20">
        <div className="container mx-auto px-4 py-3 overflow-x-auto">
          <div className="flex gap-2 min-w-max">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-4 py-2 rounded-full font-medium whitespace-nowrap ${
                selectedCategory === "all"
                  ? "bg-green-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              All Items
            </button>
            {categories.map((cat) => (
              <button
                key={cat._id}
                onClick={() => setSelectedCategory(cat._id)}
                className={`px-4 py-2 rounded-full font-medium whitespace-nowrap ${
                  selectedCategory === cat._id
                    ? "bg-green-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <main className="container mx-auto px-4 py-6">
        {/* Results Info */}
        <div className="mb-4 flex justify-between items-center">
          <p className="text-sm text-gray-600">
            {filteredItems.length}{" "}
            {filteredItems.length === 1 ? "item" : "items"} found
            {searchQuery && ` for "${searchQuery}"`}
          </p>
          {(searchQuery || dietaryFilter !== "all" || priceRange !== "all") && (
            <button
              onClick={() => {
                setSearchQuery("");
                setDietaryFilter("all");
                setPriceRange("all");
                setSortBy("default");
                setSelectedCategory("all");
              }}
              className="text-sm text-green-600 hover:text-green-700 font-medium"
            >
              Clear all
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item, index) => (
            <div
              key={item._id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover-lift animate-fadeIn"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="relative h-48">
                <img
                  src={
                    item.imageUrl
                      ? `http://localhost:5000${item.imageUrl}`
                      : "https://via.placeholder.com/400x300?text=No+Image"
                  }
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <div className="flex items-start gap-2 mb-1">
                  <span className="text-lg flex-shrink-0 mt-0.5">
                    {item.isVeg ? "🟢" : "🔴"}
                  </span>
                  <h3 className="text-lg font-bold">{item.name}</h3>
                </div>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {item.description || "Delicious dish"}
                </p>
                <div className="flex justify-between items-center">
                  <p className="text-xl font-bold text-green-600">
                    ₹{item.price.toFixed(2)}
                  </p>
                  <button
                    onClick={() => handleAddToCart(item)}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 btn-animate flex items-center gap-2"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    {hasCustomizations(item) ? "Customize" : "Add"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="col-span-full text-center py-12 bg-white rounded-xl">
            <svg
              className="w-16 h-16 text-gray-400 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-gray-600 text-lg font-medium mb-2">
              No items found
            </p>
            <p className="text-gray-500 text-sm mb-4">
              {searchQuery
                ? `No results for "${searchQuery}"`
                : "Try adjusting your filters"}
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setDietaryFilter("all");
                setPriceRange("all");
                setSortBy("default");
                setSelectedCategory("all");
              }}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Clear filters
            </button>
          </div>
        )}
      </main>

      {/* Cart Sidebar */}
      {showCart && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setShowCart(false)}
          />
          <div className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white z-50 shadow-xl overflow-y-auto animate-slideInRight">
            <div className="sticky top-0 bg-white border-b px-4 py-4 flex justify-between items-center">
              <h2 className="text-xl font-bold">Your Cart</h2>
              <button
                onClick={() => setShowCart(false)}
                className="text-gray-500 hover:text-gray-700"
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="p-4">
              {cart.length === 0 ? (
                <div className="text-center py-12">
                  <svg
                    className="w-16 h-16 text-gray-400 mx-auto mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  <p className="text-gray-600">Your cart is empty</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Add items to get started
                  </p>
                </div>
              ) : (
                <>
                  <div className="space-y-4 mb-4">
                    {cart.map((item, index) => (
                      <div
                        key={`${item._id}-${index}`}
                        className="flex gap-3 bg-gray-50 p-3 rounded-lg"
                      >
                        <img
                          src={
                            item.imageUrl
                              ? `http://localhost:5000${item.imageUrl}`
                              : "https://via.placeholder.com/80x80?text=No+Image"
                          }
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold">{item.name}</h3>

                          {/* Show customizations */}
                          {item.selectedSize && (
                            <p className="text-xs text-gray-600">
                              Size: {item.selectedSize.name}
                            </p>
                          )}
                          {item.selectedAddOns &&
                            item.selectedAddOns.length > 0 && (
                              <p className="text-xs text-gray-600">
                                Add-ons:{" "}
                                {item.selectedAddOns
                                  .map((a) => a.name)
                                  .join(", ")}
                              </p>
                            )}
                          {item.excludedIngredients &&
                            item.excludedIngredients.length > 0 && (
                              <p className="text-xs text-gray-600">
                                No: {item.excludedIngredients.join(", ")}
                              </p>
                            )}
                          {item.specialInstructions && (
                            <p className="text-xs text-gray-600 italic">
                              "{item.specialInstructions}"
                            </p>
                          )}

                          <p className="text-green-600 font-bold mt-1">
                            ₹{(item.customizedPrice || item.price).toFixed(2)}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <button
                              onClick={() =>
                                updateQuantity(item._id, item.quantity - 1)
                              }
                              className="w-8 h-8 bg-white border rounded-lg flex items-center justify-center hover:bg-gray-100"
                            >
                              -
                            </button>
                            <span className="w-8 text-center font-semibold">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(item._id, item.quantity + 1)
                              }
                              className="w-8 h-8 bg-white border rounded-lg flex items-center justify-center hover:bg-gray-100"
                            >
                              +
                            </button>
                            <button
                              onClick={() => removeFromCart(item._id)}
                              className="ml-auto text-red-500 hover:text-red-700"
                            >
                              <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-4 space-y-2">
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Total</span>
                      <span className="text-green-600">
                        ₹{getTotalPrice().toFixed(2)}
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        // Check if customer is logged in
                        if (!isCustomerAuthenticated) {
                          setShowCustomerLogin(true);
                          return;
                        }

                        localStorage.setItem(
                          `cart_${restaurantId}`,
                          JSON.stringify(cart)
                        );
                        navigate(`/checkout/${restaurantId}`);
                      }}
                      className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700"
                    >
                      Proceed to Checkout
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </>
      )}

      {/* Customization Modal */}
      {customizingItem && (
        <ItemCustomizationModal
          item={customizingItem}
          onClose={() => setCustomizingItem(null)}
          onAddToCart={addCustomizedItemToCart}
        />
      )}

      {/* Customer Login Modal */}
      {showCustomerLogin && (
        <CustomerLoginModal
          onClose={() => setShowCustomerLogin(false)}
          onSuccess={() => {
            setShowCustomerLogin(false);
            // Proceed to checkout after login
            localStorage.setItem(`cart_${restaurantId}`, JSON.stringify(cart));
            navigate(`/checkout/${restaurantId}`);
          }}
        />
      )}

      {/* Feedback History Modal */}
      <FeedbackHistoryModal
        isOpen={showFeedbackHistory}
        onClose={() => setShowFeedbackHistory(false)}
        restaurantId={restaurantId}
        tableNumber={tableNumber}
        onPointsUpdate={setCustomerPoints}
      />
    </div>
  );
};

export default MenuPage;
