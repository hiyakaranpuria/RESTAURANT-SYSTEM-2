import { useState } from "react";

const ItemCustomizationManager = ({ formData, setFormData }) => {
  const [activeTab, setActiveTab] = useState("sizes");

  // Size management
  const addSize = () => {
    const sizes = formData.sizes || [];
    setFormData({
      ...formData,
      sizes: [...sizes, { name: "", price: "", isDefault: sizes.length === 0 }],
    });
  };

  const updateSize = (index, field, value) => {
    const sizes = [...formData.sizes];
    sizes[index] = { ...sizes[index], [field]: value };

    // If setting as default, unset others
    if (field === "isDefault" && value) {
      sizes.forEach((size, i) => {
        if (i !== index) size.isDefault = false;
      });
    }

    setFormData({ ...formData, sizes });
  };

  const removeSize = (index) => {
    const sizes = formData.sizes.filter((_, i) => i !== index);
    setFormData({ ...formData, sizes });
  };

  // Add-on management
  const addAddOn = () => {
    const addOns = formData.addOns || [];
    setFormData({
      ...formData,
      addOns: [...addOns, { name: "", price: "", isVeg: true }],
    });
  };

  const updateAddOn = (index, field, value) => {
    const addOns = [...formData.addOns];
    addOns[index] = { ...addOns[index], [field]: value };
    setFormData({ ...formData, addOns });
  };

  const removeAddOn = (index) => {
    const addOns = formData.addOns.filter((_, i) => i !== index);
    setFormData({ ...formData, addOns });
  };

  // Customization option management
  const addCustomizationOption = () => {
    const customizationOptions = formData.customizationOptions || [];
    setFormData({
      ...formData,
      customizationOptions: [
        ...customizationOptions,
        {
          name: "",
          type: "single",
          required: false,
          options: [{ label: "", priceModifier: 0 }],
        },
      ],
    });
  };

  const updateCustomizationOption = (index, field, value) => {
    const customizationOptions = [...formData.customizationOptions];
    customizationOptions[index] = {
      ...customizationOptions[index],
      [field]: value,
    };
    setFormData({ ...formData, customizationOptions });
  };

  const addOptionToCustomization = (customizationIndex) => {
    const customizationOptions = [...formData.customizationOptions];
    customizationOptions[customizationIndex].options.push({
      label: "",
      priceModifier: 0,
    });
    setFormData({ ...formData, customizationOptions });
  };

  const updateCustomizationOptionValue = (
    customizationIndex,
    optionIndex,
    field,
    value
  ) => {
    const customizationOptions = [...formData.customizationOptions];
    customizationOptions[customizationIndex].options[optionIndex] = {
      ...customizationOptions[customizationIndex].options[optionIndex],
      [field]: value,
    };
    setFormData({ ...formData, customizationOptions });
  };

  const removeCustomizationOptionValue = (customizationIndex, optionIndex) => {
    const customizationOptions = [...formData.customizationOptions];
    customizationOptions[customizationIndex].options = customizationOptions[
      customizationIndex
    ].options.filter((_, i) => i !== optionIndex);
    setFormData({ ...formData, customizationOptions });
  };

  const removeCustomizationOption = (index) => {
    const customizationOptions = formData.customizationOptions.filter(
      (_, i) => i !== index
    );
    setFormData({ ...formData, customizationOptions });
  };

  // Excludable ingredients
  const addExcludableIngredient = () => {
    const excludableIngredients = formData.excludableIngredients || [];
    setFormData({
      ...formData,
      excludableIngredients: [...excludableIngredients, ""],
    });
  };

  const updateExcludableIngredient = (index, value) => {
    const excludableIngredients = [...formData.excludableIngredients];
    excludableIngredients[index] = value;
    setFormData({ ...formData, excludableIngredients });
  };

  const removeExcludableIngredient = (index) => {
    const excludableIngredients = formData.excludableIngredients.filter(
      (_, i) => i !== index
    );
    setFormData({ ...formData, excludableIngredients });
  };

  return (
    <div className="border-t pt-4 mt-4">
      <h3 className="font-semibold text-lg mb-3">Customization Options</h3>

      {/* Tabs */}
      <div className="flex gap-2 mb-4 overflow-x-auto">
        {["sizes", "addons", "options", "exclude"].map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap ${
              activeTab === tab
                ? "bg-green-600 text-white"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {tab === "sizes" && "Sizes"}
            {tab === "addons" && "Add-ons"}
            {tab === "options" && "Options"}
            {tab === "exclude" && "Exclude"}
          </button>
        ))}
      </div>

      {/* Sizes Tab */}
      {activeTab === "sizes" && (
        <div className="space-y-3">
          {(formData.sizes || []).map((size, index) => (
            <div
              key={index}
              className="flex gap-2 items-start p-3 bg-gray-50 rounded-lg"
            >
              <input
                type="text"
                placeholder="Size name (e.g., Small)"
                value={size.name}
                onChange={(e) => updateSize(index, "name", e.target.value)}
                className="flex-1 px-3 py-2 border rounded-lg"
              />
              <input
                type="number"
                placeholder="Price"
                value={size.price}
                onChange={(e) =>
                  updateSize(index, "price", parseFloat(e.target.value))
                }
                className="w-24 px-3 py-2 border rounded-lg"
              />
              <label className="flex items-center gap-2 px-3 py-2">
                <input
                  type="checkbox"
                  checked={size.isDefault}
                  onChange={(e) =>
                    updateSize(index, "isDefault", e.target.checked)
                  }
                  className="w-4 h-4"
                />
                <span className="text-sm">Default</span>
              </label>
              <button
                type="button"
                onClick={() => removeSize(index)}
                className="text-red-500 hover:text-red-700 p-2"
              >
                ✕
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addSize}
            className="text-green-600 hover:text-green-700 font-medium text-sm"
          >
            + Add Size
          </button>
        </div>
      )}

      {/* Add-ons Tab */}
      {activeTab === "addons" && (
        <div className="space-y-3">
          {(formData.addOns || []).map((addOn, index) => (
            <div
              key={index}
              className="flex gap-2 items-start p-3 bg-gray-50 rounded-lg"
            >
              <input
                type="text"
                placeholder="Add-on name (e.g., Extra Cheese)"
                value={addOn.name}
                onChange={(e) => updateAddOn(index, "name", e.target.value)}
                className="flex-1 px-3 py-2 border rounded-lg"
              />
              <input
                type="number"
                placeholder="Price"
                value={addOn.price}
                onChange={(e) =>
                  updateAddOn(index, "price", parseFloat(e.target.value))
                }
                className="w-24 px-3 py-2 border rounded-lg"
              />
              <label className="flex items-center gap-2 px-3 py-2">
                <input
                  type="checkbox"
                  checked={addOn.isVeg}
                  onChange={(e) =>
                    updateAddOn(index, "isVeg", e.target.checked)
                  }
                  className="w-4 h-4"
                />
                <span className="text-sm">Veg</span>
              </label>
              <button
                type="button"
                onClick={() => removeAddOn(index)}
                className="text-red-500 hover:text-red-700 p-2"
              >
                ✕
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addAddOn}
            className="text-green-600 hover:text-green-700 font-medium text-sm"
          >
            + Add Add-on
          </button>
        </div>
      )}

      {/* Customization Options Tab */}
      {activeTab === "options" && (
        <div className="space-y-4">
          {(formData.customizationOptions || []).map((option, optionIndex) => (
            <div
              key={optionIndex}
              className="p-4 bg-gray-50 rounded-lg space-y-3"
            >
              <div className="flex gap-2 items-start">
                <input
                  type="text"
                  placeholder="Option name (e.g., Spice Level)"
                  value={option.name}
                  onChange={(e) =>
                    updateCustomizationOption(
                      optionIndex,
                      "name",
                      e.target.value
                    )
                  }
                  className="flex-1 px-3 py-2 border rounded-lg"
                />
                <select
                  value={option.type}
                  onChange={(e) =>
                    updateCustomizationOption(
                      optionIndex,
                      "type",
                      e.target.value
                    )
                  }
                  className="px-3 py-2 border rounded-lg"
                >
                  <option value="single">Single Choice</option>
                  <option value="multiple">Multiple Choice</option>
                </select>
                <label className="flex items-center gap-2 px-3 py-2">
                  <input
                    type="checkbox"
                    checked={option.required}
                    onChange={(e) =>
                      updateCustomizationOption(
                        optionIndex,
                        "required",
                        e.target.checked
                      )
                    }
                    className="w-4 h-4"
                  />
                  <span className="text-sm">Required</span>
                </label>
                <button
                  type="button"
                  onClick={() => removeCustomizationOption(optionIndex)}
                  className="text-red-500 hover:text-red-700 p-2"
                >
                  ✕
                </button>
              </div>

              <div className="ml-4 space-y-2">
                {option.options.map((opt, valueIndex) => (
                  <div key={valueIndex} className="flex gap-2 items-center">
                    <input
                      type="text"
                      placeholder="Option value (e.g., Mild)"
                      value={opt.label}
                      onChange={(e) =>
                        updateCustomizationOptionValue(
                          optionIndex,
                          valueIndex,
                          "label",
                          e.target.value
                        )
                      }
                      className="flex-1 px-3 py-2 border rounded-lg"
                    />
                    <input
                      type="number"
                      placeholder="Price ±"
                      value={opt.priceModifier}
                      onChange={(e) =>
                        updateCustomizationOptionValue(
                          optionIndex,
                          valueIndex,
                          "priceModifier",
                          parseFloat(e.target.value) || 0
                        )
                      }
                      className="w-24 px-3 py-2 border rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        removeCustomizationOptionValue(optionIndex, valueIndex)
                      }
                      className="text-red-500 hover:text-red-700 p-2"
                    >
                      ✕
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addOptionToCustomization(optionIndex)}
                  className="text-green-600 hover:text-green-700 font-medium text-sm"
                >
                  + Add Value
                </button>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={addCustomizationOption}
            className="text-green-600 hover:text-green-700 font-medium text-sm"
          >
            + Add Customization Option
          </button>
        </div>
      )}

      {/* Excludable Ingredients Tab */}
      {activeTab === "exclude" && (
        <div className="space-y-3">
          {(formData.excludableIngredients || []).map((ingredient, index) => (
            <div key={index} className="flex gap-2 items-center">
              <input
                type="text"
                placeholder="Ingredient name (e.g., Onions)"
                value={ingredient}
                onChange={(e) =>
                  updateExcludableIngredient(index, e.target.value)
                }
                className="flex-1 px-3 py-2 border rounded-lg"
              />
              <button
                type="button"
                onClick={() => removeExcludableIngredient(index)}
                className="text-red-500 hover:text-red-700 p-2"
              >
                ✕
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addExcludableIngredient}
            className="text-green-600 hover:text-green-700 font-medium text-sm"
          >
            + Add Ingredient
          </button>

          <div className="mt-4 pt-4 border-t">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.allowSpecialInstructions !== false}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    allowSpecialInstructions: e.target.checked,
                  })
                }
                className="w-4 h-4"
              />
              <span className="text-sm font-medium">
                Allow special instructions from customers
              </span>
            </label>
          </div>
        </div>
      )}
    </div>
  );
};

export default ItemCustomizationManager;
