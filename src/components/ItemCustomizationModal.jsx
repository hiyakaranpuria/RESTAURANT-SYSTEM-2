import { useState, useEffect } from "react";

const ItemCustomizationModal = ({ item, onClose, onAddToCart }) => {
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedAddOns, setSelectedAddOns] = useState([]);
  const [customizations, setCustomizations] = useState({});
  const [excludedIngredients, setExcludedIngredients] = useState([]);
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    // Set default size if available
    if (item.sizes && item.sizes.length > 0) {
      const defaultSize = item.sizes.find((s) => s.isDefault) || item.sizes[0];
      setSelectedSize(defaultSize);
    }

    // Initialize required customizations
    if (item.customizationOptions) {
      const initialCustomizations = {};
      item.customizationOptions.forEach((option) => {
        if (option.required && option.options.length > 0) {
          initialCustomizations[option.name] = [option.options[0].label];
        }
      });
      setCustomizations(initialCustomizations);
    }
  }, [item]);

  const toggleAddOn = (addOn) => {
    setSelectedAddOns((prev) => {
      const exists = prev.find((a) => a.name === addOn.name);
      if (exists) {
        return prev.filter((a) => a.name !== addOn.name);
      }
      return [...prev, addOn];
    });
  };

  const toggleExcludedIngredient = (ingredient) => {
    setExcludedIngredients((prev) => {
      if (prev.includes(ingredient)) {
        return prev.filter((i) => i !== ingredient);
      }
      return [...prev, ingredient];
    });
  };

  const handleCustomizationChange = (optionName, value, type) => {
    setCustomizations((prev) => {
      if (type === "single") {
        return { ...prev, [optionName]: [value] };
      } else {
        // multiple selection
        const current = prev[optionName] || [];
        if (current.includes(value)) {
          return { ...prev, [optionName]: current.filter((v) => v !== value) };
        }
        return { ...prev, [optionName]: [...current, value] };
      }
    });
  };

  const calculateTotalPrice = () => {
    let total = selectedSize ? selectedSize.price : item.price;

    // Add-ons
    selectedAddOns.forEach((addOn) => {
      total += addOn.price;
    });

    // Customization price modifiers
    if (item.customizationOptions) {
      item.customizationOptions.forEach((option) => {
        const selectedValues = customizations[option.name] || [];
        selectedValues.forEach((value) => {
          const opt = option.options.find((o) => o.label === value);
          if (opt && opt.priceModifier) {
            total += opt.priceModifier;
          }
        });
      });
    }

    return total * quantity;
  };

  const isValid = () => {
    // Check if all required customizations are selected
    if (item.customizationOptions) {
      for (const option of item.customizationOptions) {
        if (option.required) {
          const selected = customizations[option.name];
          if (!selected || selected.length === 0) {
            return false;
          }
        }
      }
    }
    return true;
  };

  const handleAddToCart = () => {
    if (!isValid()) {
      alert("Please complete all required selections");
      return;
    }

    const customizedItem = {
      ...item,
      selectedSize,
      selectedAddOns,
      customizations,
      excludedIngredients,
      specialInstructions,
      quantity,
      customizedPrice: calculateTotalPrice() / quantity,
    };

    onAddToCart(customizedItem);
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-scaleIn">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xl">{item.isVeg ? "🟢" : "🔴"}</span>
                <h2 className="text-2xl font-bold">{item.name}</h2>
              </div>
              {item.description && (
                <p className="text-gray-600 text-sm">{item.description}</p>
              )}
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 ml-4"
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

          <div className="p-6 space-y-6">
            {/* Size Selection */}
            {item.sizes && item.sizes.length > 0 && (
              <div>
                <h3 className="font-semibold text-lg mb-3">
                  Choose Size <span className="text-red-500">*</span>
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  {item.sizes.map((size) => (
                    <button
                      key={size.name}
                      onClick={() => setSelectedSize(size)}
                      className={`p-4 border-2 rounded-lg text-center transition-all ${
                        selectedSize?.name === size.name
                          ? "border-green-600 bg-green-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="font-semibold">{size.name}</div>
                      <div className="text-green-600 font-bold mt-1">
                        ₹{size.price.toFixed(2)}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Customization Options */}
            {item.customizationOptions &&
              item.customizationOptions.map((option) => (
                <div key={option.name}>
                  <h3 className="font-semibold text-lg mb-3">
                    {option.name}
                    {option.required && (
                      <span className="text-red-500"> *</span>
                    )}
                  </h3>
                  <div className="space-y-2">
                    {option.options.map((opt) => (
                      <label
                        key={opt.label}
                        className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type={
                              option.type === "single" ? "radio" : "checkbox"
                            }
                            name={option.name}
                            checked={
                              customizations[option.name]?.includes(
                                opt.label
                              ) || false
                            }
                            onChange={() =>
                              handleCustomizationChange(
                                option.name,
                                opt.label,
                                option.type
                              )
                            }
                            className="w-4 h-4 text-green-600"
                          />
                          <span>{opt.label}</span>
                        </div>
                        {opt.priceModifier !== 0 && (
                          <span className="text-green-600 font-semibold">
                            {opt.priceModifier > 0 ? "+" : ""}₹
                            {opt.priceModifier.toFixed(2)}
                          </span>
                        )}
                      </label>
                    ))}
                  </div>
                </div>
              ))}

            {/* Add-ons */}
            {item.addOns && item.addOns.length > 0 && (
              <div>
                <h3 className="font-semibold text-lg mb-3">
                  Add-ons (Optional)
                </h3>
                <div className="space-y-2">
                  {item.addOns.map((addOn) => (
                    <label
                      key={addOn.name}
                      className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={selectedAddOns.some(
                            (a) => a.name === addOn.name
                          )}
                          onChange={() => toggleAddOn(addOn)}
                          className="w-4 h-4 text-green-600"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span>{addOn.name}</span>
                            <span className="text-xs">
                              {addOn.isVeg ? "🟢" : "🔴"}
                            </span>
                          </div>
                        </div>
                      </div>
                      <span className="text-green-600 font-semibold">
                        +₹{addOn.price.toFixed(2)}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Exclude Ingredients */}
            {item.excludableIngredients &&
              item.excludableIngredients.length > 0 && (
                <div>
                  <h3 className="font-semibold text-lg mb-3">
                    Remove Ingredients (Optional)
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {item.excludableIngredients.map((ingredient) => (
                      <button
                        key={ingredient}
                        onClick={() => toggleExcludedIngredient(ingredient)}
                        className={`px-4 py-2 rounded-full border-2 transition-all ${
                          excludedIngredients.includes(ingredient)
                            ? "border-red-500 bg-red-50 text-red-700"
                            : "border-gray-300 hover:border-gray-400"
                        }`}
                      >
                        {excludedIngredients.includes(ingredient) && "✕ "}
                        {ingredient}
                      </button>
                    ))}
                  </div>
                </div>
              )}

            {/* Special Instructions */}
            {item.allowSpecialInstructions && (
              <div>
                <h3 className="font-semibold text-lg mb-3">
                  Special Instructions (Optional)
                </h3>
                <textarea
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  placeholder="Any special requests? (e.g., less spicy, well done)"
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                  rows="3"
                  maxLength="200"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {specialInstructions.length}/200 characters
                </p>
              </div>
            )}

            {/* Quantity */}
            <div>
              <h3 className="font-semibold text-lg mb-3">Quantity</h3>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200 font-bold text-xl"
                >
                  -
                </button>
                <span className="text-xl font-bold w-12 text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200 font-bold text-xl"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-white border-t px-6 py-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-lg font-semibold">Total Price</span>
              <span className="text-2xl font-bold text-green-600">
                ₹{calculateTotalPrice().toFixed(2)}
              </span>
            </div>
            <button
              onClick={handleAddToCart}
              disabled={!isValid()}
              className={`w-full py-3 rounded-lg font-semibold text-white transition-all ${
                isValid()
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-gray-300 cursor-not-allowed"
              }`}
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ItemCustomizationModal;
