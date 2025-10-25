# Item Customization Feature Guide

## Overview

The new item customization system allows restaurants to offer flexible ordering options and customers to personalize their orders.

## Features Implemented

### 1. **Size Variants**

- Add multiple size options (Small, Medium, Large, etc.)
- Each size has its own price
- Mark one size as default
- Example: Pizza (Small ₹299, Medium ₹499, Large ₹699)

### 2. **Add-ons/Extras**

- Optional extras customers can add
- Each add-on has a price
- Can be marked as Veg/Non-Veg
- Example: Extra Cheese (+₹50), Bacon (+₹80)

### 3. **Customization Options**

- Create custom option groups (Spice Level, Cooking Preference, etc.)
- Single choice (radio) or Multiple choice (checkbox)
- Can be marked as required
- Price modifiers for each option
- Example:
  - Spice Level: Mild (₹0), Medium (₹0), Hot (+₹20)
  - Toppings: Mushrooms (+₹30), Olives (+₹25), Peppers (+₹20)

### 4. **Excludable Ingredients**

- Let customers remove ingredients they don't want
- No price change
- Example: No Onions, No Garlic, No Cilantro

### 5. **Special Instructions**

- Free text field for custom requests
- 200 character limit
- Example: "Please make it extra crispy", "Less oil please"

## How to Use (Restaurant Dashboard)

### Adding Customizations to Menu Items

1. **Go to Restaurant Dashboard** → Click "Add Menu Item" or edit existing item

2. **Fill basic details** (Name, Description, Price, Category, Image)

3. **Scroll to "Customization Options"** section with 4 tabs:

#### **Sizes Tab**

- Click "+ Add Size"
- Enter size name (e.g., "Small")
- Enter price (e.g., 299)
- Check "Default" for the default size
- Add more sizes as needed

#### **Add-ons Tab**

- Click "+ Add Add-on"
- Enter add-on name (e.g., "Extra Cheese")
- Enter additional price (e.g., 50)
- Check "Veg" if vegetarian
- Add more add-ons as needed

#### **Options Tab**

- Click "+ Add Customization Option"
- Enter option name (e.g., "Spice Level")
- Select type: Single Choice or Multiple Choice
- Check "Required" if customer must select
- Click "+ Add Value" to add option values
  - Enter label (e.g., "Mild")
  - Enter price modifier (0 for no change, +20 for extra cost)
- Add more options as needed

#### **Exclude Tab**

- Click "+ Add Ingredient"
- Enter ingredient name (e.g., "Onions")
- Add more ingredients as needed
- Check "Allow special instructions" to enable free text field

4. **Save the item** - All customizations are saved with the menu item

## Customer Experience

### Ordering with Customizations

1. **Browse Menu** - Items with customizations show "Customize" button instead of "Add"

2. **Click "Customize"** - Opens customization modal with:

   - Size selection (if available)
   - Customization options (Spice Level, etc.)
   - Add-ons with prices
   - Excludable ingredients
   - Special instructions field
   - Quantity selector
   - Live price calculation

3. **Make Selections** - Required fields marked with red asterisk (\*)

4. **Add to Cart** - Customized item added with all selections

5. **View Cart** - Shows:
   - Item name
   - Selected size
   - Add-ons
   - Excluded ingredients
   - Special instructions
   - Final price per item

## Example Use Cases

### Pizza Restaurant

```
Item: Margherita Pizza
Base Price: ₹299

Sizes:
- Small: ₹299 (default)
- Medium: ₹499
- Large: ₹699

Add-ons:
- Extra Cheese: +₹50
- Olives: +₹40
- Mushrooms: +₹60
- Jalapeños: +₹30

Options:
- Crust Type (Required, Single):
  - Thin Crust: ₹0
  - Thick Crust: ₹0
  - Stuffed Crust: +₹80

Exclude:
- Onions, Bell Peppers, Tomatoes

Special Instructions: Enabled
```

### Burger Joint

```
Item: Classic Burger
Base Price: ₹199

Sizes:
- Regular: ₹199 (default)
- Large: ₹249

Add-ons:
- Extra Patty: +₹80
- Cheese Slice: +₹30
- Bacon: +₹60

Options:
- Cooking Level (Required, Single):
  - Well Done: ₹0
  - Medium: ₹0
  - Rare: ₹0

Exclude:
- Onions, Pickles, Lettuce, Tomatoes

Special Instructions: Enabled
```

### Coffee Shop

```
Item: Cappuccino
Base Price: ₹120

Sizes:
- Small: ₹120 (default)
- Medium: ₹150
- Large: ₹180

Add-ons:
- Extra Shot: +₹40
- Whipped Cream: +₹20
- Caramel Drizzle: +₹30

Options:
- Milk Type (Required, Single):
  - Regular: ₹0
  - Soy: +₹20
  - Almond: +₹30
  - Oat: +₹25

Special Instructions: Enabled
```

## Technical Details

### Database Schema

- `sizes`: Array of {name, price, isDefault}
- `addOns`: Array of {name, price, isVeg}
- `customizationOptions`: Array of {name, type, required, options[{label, priceModifier}]}
- `excludableIngredients`: Array of strings
- `allowSpecialInstructions`: Boolean

### Cart Item Structure

```javascript
{
  ...item,
  selectedSize: {name: "Medium", price: 499},
  selectedAddOns: [{name: "Extra Cheese", price: 50}],
  customizations: {"Spice Level": ["Hot"]},
  excludedIngredients: ["Onions", "Garlic"],
  specialInstructions: "Please make it extra crispy",
  quantity: 2,
  customizedPrice: 569 // calculated total per item
}
```

## Benefits

### For Restaurants

- Increase average order value with add-ons
- Reduce food waste by allowing exclusions
- Better customer satisfaction
- Competitive advantage
- Flexible pricing strategies

### For Customers

- Personalize orders to preferences
- Dietary restrictions accommodation
- Clear pricing transparency
- Better ordering experience
- Get exactly what they want

## Next Steps

To test the feature:

1. Start the server and client
2. Login to restaurant dashboard
3. Add/edit a menu item with customizations
4. Visit the menu page as a customer
5. Try customizing and ordering items
6. Check cart to see customizations displayed
