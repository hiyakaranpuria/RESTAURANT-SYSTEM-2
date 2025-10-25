# Item Customization Testing Checklist

## 🧪 Testing Guide

### Prerequisites

- [ ] Server is running (`cd server && npm start`)
- [ ] Client is running (`npm run dev`)
- [ ] Restaurant account created and logged in
- [ ] At least one menu category created

---

## 1️⃣ Restaurant Dashboard Tests

### Adding Item with Customizations

#### Basic Item Setup

- [ ] Click "Add Menu Item"
- [ ] Fill in item name (e.g., "Margherita Pizza")
- [ ] Fill in description
- [ ] Set base price (e.g., 299)
- [ ] Select category
- [ ] Upload image
- [ ] Set as Veg/Non-Veg
- [ ] Check availability

#### Size Customizations

- [ ] Click "Sizes" tab
- [ ] Click "+ Add Size"
- [ ] Add "Small" with price 299, mark as default
- [ ] Add "Medium" with price 499
- [ ] Add "Large" with price 699
- [ ] Verify all sizes show correctly
- [ ] Try removing a size
- [ ] Try changing default size

#### Add-ons

- [ ] Click "Add-ons" tab
- [ ] Click "+ Add Add-on"
- [ ] Add "Extra Cheese" with price 50, mark as Veg
- [ ] Add "Olives" with price 40, mark as Veg
- [ ] Add "Bacon" with price 80, mark as Non-Veg
- [ ] Verify all add-ons show correctly
- [ ] Try removing an add-on

#### Customization Options

- [ ] Click "Options" tab
- [ ] Click "+ Add Customization Option"
- [ ] Add "Spice Level" as Single Choice, Required
  - [ ] Add value "Mild" with price modifier 0
  - [ ] Add value "Medium" with price modifier 0
  - [ ] Add value "Hot" with price modifier 20
- [ ] Add "Toppings" as Multiple Choice, Optional
  - [ ] Add value "Mushrooms" with price modifier 30
  - [ ] Add value "Peppers" with price modifier 20
- [ ] Verify options show correctly
- [ ] Try removing an option value
- [ ] Try removing an entire option

#### Excludable Ingredients

- [ ] Click "Exclude" tab
- [ ] Click "+ Add Ingredient"
- [ ] Add "Onions"
- [ ] Add "Garlic"
- [ ] Add "Bell Peppers"
- [ ] Verify "Allow special instructions" is checked
- [ ] Try unchecking it
- [ ] Try removing an ingredient

#### Save Item

- [ ] Click "Add Item"
- [ ] Verify success message
- [ ] Verify item appears in menu list
- [ ] Verify item shows all customization indicators

### Editing Item with Customizations

- [ ] Click edit on the item you just created
- [ ] Verify all customizations load correctly
- [ ] Modify a size price
- [ ] Add a new add-on
- [ ] Remove a customization option
- [ ] Add an excludable ingredient
- [ ] Click "Update Item"
- [ ] Verify changes saved

### Creating Item Without Customizations

- [ ] Add a simple item with no customizations
- [ ] Verify it saves correctly
- [ ] Verify it shows "Add" button (not "Customize")

---

## 2️⃣ Customer Menu Page Tests

### Viewing Items

- [ ] Navigate to menu page (`/m/{restaurantId}`)
- [ ] Enter table number
- [ ] Verify items with customizations show "Customize" button
- [ ] Verify items without customizations show "Add" button

### Simple Item (No Customizations)

- [ ] Click "Add" on simple item
- [ ] Verify it adds directly to cart
- [ ] Verify cart count increases

### Customizable Item - Full Flow

#### Opening Modal

- [ ] Click "Customize" on pizza item
- [ ] Verify modal opens with smooth animation
- [ ] Verify item name and description show
- [ ] Verify Veg/Non-Veg indicator shows

#### Size Selection

- [ ] Verify default size is pre-selected
- [ ] Click different sizes
- [ ] Verify price updates in real-time
- [ ] Verify visual selection indicator

#### Customization Options

- [ ] Verify required options show red asterisk
- [ ] Select "Spice Level" (required)
- [ ] Verify you can't unselect required single-choice
- [ ] Select multiple toppings
- [ ] Verify price updates with each selection
- [ ] Unselect a topping
- [ ] Verify price decreases

#### Add-ons

- [ ] Check "Extra Cheese"
- [ ] Verify price increases by ₹50
- [ ] Check "Olives"
- [ ] Verify price increases by ₹40
- [ ] Uncheck "Extra Cheese"
- [ ] Verify price decreases

#### Excludable Ingredients

- [ ] Click "Onions" button
- [ ] Verify it highlights/changes color
- [ ] Verify price doesn't change
- [ ] Click "Garlic" button
- [ ] Click "Onions" again to unselect
- [ ] Verify it deselects

#### Special Instructions

- [ ] Type "Please make it extra crispy"
- [ ] Verify character counter updates
- [ ] Try typing more than 200 characters
- [ ] Verify it stops at 200

#### Quantity

- [ ] Click "-" button
- [ ] Verify quantity stays at 1 (minimum)
- [ ] Click "+" button multiple times
- [ ] Verify quantity increases
- [ ] Verify total price multiplies correctly

#### Validation

- [ ] Unselect required "Spice Level"
- [ ] Try clicking "Add to Cart"
- [ ] Verify button is disabled or shows error
- [ ] Select "Spice Level" again
- [ ] Verify button enables

#### Adding to Cart

- [ ] Click "Add to Cart"
- [ ] Verify modal closes
- [ ] Verify cart count increases
- [ ] Verify success feedback

### Cart Display

#### Opening Cart

- [ ] Click cart button
- [ ] Verify cart sidebar opens

#### Viewing Customized Item

- [ ] Verify item name shows
- [ ] Verify selected size shows (e.g., "Size: Large")
- [ ] Verify add-ons show (e.g., "Add-ons: Extra Cheese, Olives")
- [ ] Verify excluded ingredients show (e.g., "No: Onions, Garlic")
- [ ] Verify special instructions show in italics
- [ ] Verify price is correct
- [ ] Verify quantity shows

#### Multiple Customized Items

- [ ] Add same item with different customizations
- [ ] Verify they appear as separate cart items
- [ ] Add same item with same customizations
- [ ] Verify quantity increases on existing item

#### Cart Actions

- [ ] Increase quantity of customized item
- [ ] Verify price updates
- [ ] Decrease quantity
- [ ] Remove item
- [ ] Verify total updates correctly

#### Price Calculation

- [ ] Verify subtotal is correct
- [ ] Verify it includes all customization costs
- [ ] Verify it multiplies by quantity correctly

---

## 3️⃣ Edge Cases & Error Handling

### Restaurant Dashboard

- [ ] Try saving item with empty size name
- [ ] Try saving item with negative price
- [ ] Try saving item with empty add-on name
- [ ] Try saving customization option with no values
- [ ] Try saving with required option but no values
- [ ] Verify appropriate error messages

### Customer Menu

- [ ] Try adding item without selecting required option
- [ ] Try with very long special instructions (>200 chars)
- [ ] Try with quantity = 0 (should stay at 1)
- [ ] Try closing modal without adding
- [ ] Verify cart doesn't change

### Data Persistence

- [ ] Add customized item to cart
- [ ] Refresh page
- [ ] Verify cart persists (if implemented)
- [ ] Proceed to checkout
- [ ] Verify customizations carry through

---

## 4️⃣ UI/UX Tests

### Responsiveness

- [ ] Test on mobile screen (< 640px)
- [ ] Test on tablet screen (640px - 1024px)
- [ ] Test on desktop screen (> 1024px)
- [ ] Verify modal is scrollable on small screens
- [ ] Verify buttons are touch-friendly

### Animations

- [ ] Verify modal opens with scale animation
- [ ] Verify filter panel slides in
- [ ] Verify cart sidebar slides from right
- [ ] Verify smooth transitions on selections

### Visual Feedback

- [ ] Verify hover states on buttons
- [ ] Verify active states on selections
- [ ] Verify disabled states
- [ ] Verify loading states during save
- [ ] Verify success/error messages

### Accessibility

- [ ] Tab through form fields
- [ ] Verify focus indicators
- [ ] Verify labels are clear
- [ ] Verify required fields marked
- [ ] Verify error messages are clear

---

## 5️⃣ Integration Tests

### Complete Order Flow

- [ ] Browse menu
- [ ] Customize and add multiple items
- [ ] View cart
- [ ] Modify quantities
- [ ] Proceed to checkout
- [ ] Verify order summary shows customizations
- [ ] Place order
- [ ] Verify order confirmation shows customizations

### Multiple Restaurants

- [ ] Create items in Restaurant A with customizations
- [ ] Create items in Restaurant B with different customizations
- [ ] Verify they don't interfere with each other
- [ ] Verify correct items show on correct menu

---

## 6️⃣ Performance Tests

### Load Testing

- [ ] Add item with 10+ sizes
- [ ] Add item with 20+ add-ons
- [ ] Add item with 5+ customization options
- [ ] Verify modal loads quickly
- [ ] Verify price calculation is instant

### Cart Performance

- [ ] Add 20+ items to cart
- [ ] Verify cart renders quickly
- [ ] Verify scroll is smooth
- [ ] Verify calculations are correct

---

## 🎯 Success Criteria

All tests should pass with:

- ✅ No console errors
- ✅ Smooth animations
- ✅ Correct price calculations
- ✅ Data persistence
- ✅ Clear user feedback
- ✅ Responsive design
- ✅ Intuitive UX

---

## 🐛 Bug Reporting Template

If you find issues, report them with:

```
**Bug Title**: [Brief description]

**Steps to Reproduce**:
1.
2.
3.

**Expected Behavior**:
[What should happen]

**Actual Behavior**:
[What actually happens]

**Screenshots**:
[If applicable]

**Environment**:
- Browser:
- Screen size:
- User role:
```

---

## 📝 Test Results

Date: ****\_\_\_****
Tester: ****\_\_\_****

Total Tests: ****\_\_\_****
Passed: ****\_\_\_****
Failed: ****\_\_\_****
Blocked: ****\_\_\_****

Notes:

---

---

---
