import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import axios from "axios";

const MenuPage = () => {
  const { qrSlug } = useParams();
  const navigate = useNavigate();
  const { cart, addToCart, updateQuantity, getTotal, setTableId } = useCart();
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [search, setSearch] = useState("");
  const [table, setTable] = useState(null);

  useEffect(() => {
    fetchTableAndMenu();
  }, [qrSlug]);

  const fetchTableAndMenu = async () => {
    try {
      const { data } = await axios.get(`/api/menu/by-table/${qrSlug}`);
      setTable(data.table);
      setTableId(data.table._id);
      setCategories(data.categories);
      setItems(data.items);
      if (data.categories.length > 0) {
        setSelectedCategory(data.categories[0]._id);
      }
    } catch (error) {
      console.error("Error fetching menu:", error);
    }
  };

  const filteredItems = items.filter((item) => {
    const matchesCategory =
      !selectedCategory || item.categoryId === selectedCategory;
    const matchesSearch =
      !search || item.name.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch && item.availability;
  });

  return (
    <div className="min-h-screen bg-background-light">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm border-b px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 text-primary">
              <svg
                fill="none"
                viewBox="0 0 48 48"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  clipRule="evenodd"
                  d="M24 4H6V17.3333V30.6667H24V44H42V30.6667V17.3333H24V4Z"
                  fill="currentColor"
                  fillRule="evenodd"
                />
              </svg>
            </div>
            <h1 className="text-xl font-bold">The Gourmet Place</h1>
          </div>
          <button className="px-4 py-2 bg-gray-100 rounded-lg text-sm font-bold">
            Table {table?.number || "..."}
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[260px_1fr_340px] gap-6 p-4 lg:p-8">
        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <h3 className="px-3 text-sm font-semibold text-gray-600 uppercase mb-4">
              Categories
            </h3>
            <nav className="flex flex-col gap-1">
              {categories.map((cat) => (
                <button
                  key={cat._id}
                  onClick={() => setSelectedCategory(cat._id)}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                    selectedCategory === cat._id
                      ? "bg-green-50 text-primary"
                      : "hover:bg-gray-100"
                  }`}
                >
                  <span className="material-symbols-outlined">restaurant</span>
                  <p className="text-sm font-medium">{cat.name}</p>
                </button>
              ))}
            </nav>
          </div>
        </aside>

        <section className="flex flex-col gap-6">
          <div className="flex w-full items-stretch rounded-lg h-12 bg-white shadow-sm">
            <div className="flex items-center justify-center pl-4 text-gray-500">
              <span className="material-symbols-outlined">search</span>
            </div>
            <input
              className="flex-1 px-4 border-none focus:outline-none focus:ring-2 focus:ring-primary/50 rounded-r-lg"
              placeholder="Search for dishes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <h2 className="text-3xl font-bold">
            {categories.find((c) => c._id === selectedCategory)?.name || "Menu"}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <div key={item._id} className="flex flex-col gap-3 group">
                <div className="relative w-full overflow-hidden">
                  <div
                    className="w-full aspect-[4/3] bg-cover bg-center rounded-lg transition-transform duration-300 group-hover:scale-105"
                    style={{
                      backgroundImage: `url(${
                        item.imageUrl || "https://via.placeholder.com/400x300"
                      })`,
                    }}
                  />
                  <button
                    onClick={() => addToCart(item)}
                    className="absolute bottom-2 right-2 flex items-center justify-center w-10 h-10 bg-primary/90 hover:bg-primary text-white rounded-full shadow-lg transition-transform hover:scale-110"
                  >
                    <span className="material-symbols-outlined">add</span>
                  </button>
                </div>
                <div>
                  <p className="text-base font-semibold">{item.name}</p>
                  <p className="text-gray-600 text-sm">
                    ${item.price.toFixed(2)} - {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <aside className="hidden xl:block">
          <div className="sticky top-24 rounded-lg border bg-white p-6">
            <h3 className="text-xl font-bold mb-4">Your Order</h3>
            <div className="space-y-4 mb-6">
              {cart.length === 0 ? (
                <div className="text-center py-10">
                  <span className="material-symbols-outlined text-5xl text-gray-400 mb-2">
                    shopping_cart
                  </span>
                  <p className="font-semibold">Your cart is empty</p>
                  <p className="text-sm text-gray-600">
                    Add items to get started!
                  </p>
                </div>
              ) : (
                cart.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4">
                    <img
                      className="w-16 h-16 rounded-md object-cover"
                      src={item.image || "https://via.placeholder.com/64"}
                      alt={item.name}
                    />
                    <div className="flex-grow">
                      <p className="font-semibold text-sm">{item.name}</p>
                      <p className="text-gray-600 text-sm">
                        ${item.price.toFixed(2)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                      <button
                        onClick={() =>
                          updateQuantity(
                            item.menuItemId,
                            item.note,
                            item.qty - 1
                          )
                        }
                        className="w-6 h-6 flex items-center justify-center rounded hover:bg-primary/20"
                      >
                        <span className="material-symbols-outlined text-sm">
                          remove
                        </span>
                      </button>
                      <span className="w-4 text-center text-sm font-medium">
                        {item.qty}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(
                            item.menuItemId,
                            item.note,
                            item.qty + 1
                          )
                        }
                        className="w-6 h-6 flex items-center justify-center rounded hover:bg-primary/20"
                      >
                        <span className="material-symbols-outlined text-sm">
                          add
                        </span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
            {cart.length > 0 && (
              <>
                <div className="border-t pt-4">
                  <div className="flex justify-between text-base font-medium">
                    <p>Subtotal</p>
                    <p>${getTotal().toFixed(2)}</p>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">
                    Taxes calculated at checkout
                  </p>
                  <button
                    onClick={() => navigate("/cart")}
                    className="mt-4 w-full bg-primary text-white rounded-lg h-12 px-4 font-bold hover:opacity-90"
                  >
                    Place Order
                  </button>
                </div>
              </>
            )}
          </div>
        </aside>
      </main>
    </div>
  );
};

export default MenuPage;
