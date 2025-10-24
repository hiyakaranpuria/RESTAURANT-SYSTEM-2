import { useState, useEffect } from "react";
import axios from "axios";

const MenuManagementPage = () => {
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    fetchCategories();
    fetchItems();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data } = await axios.get("/api/menu/categories");
      setCategories(data);
      if (data.length > 0) setSelectedCategory(data[0]._id);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchItems = async () => {
    try {
      const { data } = await axios.get("/api/menu/items");
      setItems(data.items);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  const toggleAvailability = async (itemId, currentStatus) => {
    try {
      await axios.patch(`/api/menu/items/${itemId}`, {
        availability: !currentStatus,
      });
      fetchItems();
    } catch (error) {
      console.error("Error updating availability:", error);
    }
  };

  const filteredItems = items.filter(
    (item) => item.categoryId === selectedCategory
  );

  return (
    <div className="flex min-h-screen">
      <aside className="w-72 bg-[#2C3E50] p-4 text-white">
        <div className="mb-4">
          <h1 className="text-lg font-bold">QR Menu System</h1>
          <p className="text-sm text-gray-400">Admin Panel</p>
        </div>

        <div className="mb-4">
          <div className="flex items-stretch rounded-lg h-10 bg-white/10">
            <div className="flex items-center justify-center pl-3 text-white/70">
              <span className="material-symbols-outlined text-sm">search</span>
            </div>
            <input
              className="flex-1 px-2 bg-transparent border-none text-white placeholder:text-white/70 text-sm focus:outline-none"
              placeholder="Search categories..."
            />
          </div>
        </div>

        <nav className="flex flex-col gap-2 mt-4">
          {categories.map((cat) => (
            <button
              key={cat._id}
              onClick={() => setSelectedCategory(cat._id)}
              className={`flex items-center justify-between gap-3 px-3 py-2 rounded-lg ${
                selectedCategory === cat._id
                  ? "bg-[#27AE60]/80"
                  : "hover:bg-white/10"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-sm">
                  dinner_dining
                </span>
                <p className="text-sm font-medium">{cat.name}</p>
              </div>
            </button>
          ))}
        </nav>

        <button className="w-full mt-auto bg-[#27AE60] hover:bg-[#27AE60]/90 rounded-lg h-10 px-4 text-sm font-bold mt-4">
          Create New Category
        </button>
      </aside>

      <main className="flex-1 p-8 bg-[#F8F9FA]">
        <div className="flex justify-between items-center mb-8">
          <p className="text-4xl font-black">Menu Management</p>
        </div>

        <div className="flex justify-between items-center border-b pb-4 mb-6">
          <h2 className="text-2xl font-bold">
            {categories.find((c) => c._id === selectedCategory)?.name ||
              "Items"}
          </h2>
          <button className="flex items-center gap-2 bg-[#27AE60] hover:bg-[#27AE60]/90 text-white rounded-lg h-10 px-4 text-sm font-bold">
            <span className="material-symbols-outlined text-sm">add</span>
            <span>Add New Item</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item._id}
              className="flex flex-col bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg"
            >
              <img
                className="h-40 w-full object-cover"
                src={item.imageUrl || "https://via.placeholder.com/400x300"}
                alt={item.name}
              />
              <div className="p-4 flex flex-col flex-1">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-bold">{item.name}</h3>
                  <p className="text-lg font-semibold text-[#27AE60]">
                    ${item.price.toFixed(2)}
                  </p>
                </div>
                <p className="text-sm text-gray-600 mt-1 flex-1">
                  {item.description}
                </p>
                <div className="flex justify-between items-center mt-4 pt-4 border-t">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-600">
                      {item.availability ? "Available" : "Unavailable"}
                    </span>
                    <button
                      onClick={() =>
                        toggleAvailability(item._id, item.availability)
                      }
                      className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                        item.availability ? "bg-[#27AE60]" : "bg-gray-300"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                          item.availability ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="text-gray-600 hover:text-[#2C3E50]">
                      <span className="material-symbols-outlined text-sm">
                        edit
                      </span>
                    </button>
                    <button className="text-gray-600 hover:text-red-500">
                      <span className="material-symbols-outlined text-sm">
                        delete
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-4 min-h-[300px] text-center">
            <span className="material-symbols-outlined text-gray-400 text-5xl">
              add_circle
            </span>
            <p className="text-lg font-semibold text-gray-600 mt-4">
              Add a new item
            </p>
            <p className="text-sm text-gray-600">
              Click the button above to get started.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MenuManagementPage;
