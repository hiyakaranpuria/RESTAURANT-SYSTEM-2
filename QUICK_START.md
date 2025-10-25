# 🚀 Quick Start Guide - Item Customization

## Get Started in 5 Minutes!

### Step 1: Start the Application (1 min)

```bash
# Terminal 1 - Start Backend
cd server
npm start

# Terminal 2 - Start Frontend
cd ..
npm run dev
```

Wait for both servers to start. You should see:

- Backend: `Server running on port 5000`
- Frontend: `Local: http://localhost:5173`

---

### Step 2: Create Test Restaurant (1 min)

1. Go to `http://localhost:5173/restaurant/signup`
2. Fill in:
   - Restaurant Name: **"Test Pizza Place"**
   - Email: **test@pizza.com**
   - Password: **password123**
   - Phone: **1234567890**
   - Address: **123 Test St**
3. Click **Sign Up**
4. Login with the same credentials

---

### Step 3: Add Category (30 sec)

1. In Restaurant Dashboard, click **"+ Add Category"**
2. Enter: **"Pizzas"**
3. Click **Add Category**

---

### Step 4: Add Customizable Item (2 min)

1. Click **"+ Add Menu Item"**

2. **Basic Info:**

   - Name: **Margherita Pizza**
   - Description: **Classic pizza with tomato and mozzarella**
   - Price: **299**
   - Category: **Pizzas**
   - Mark as: **Vegetarian**

3. **Scroll to "Customization Options"**

4. **Sizes Tab:**

   - Click **"+ Add Size"**
   - Small: **299** ✓ Default
   - Click **"+ Add Size"**
   - Medium: **499**
   - Click **"+ Add Size"**
   - Large: **699**

5. **Add-ons Tab:**

   - Click **"+ Add Add-on"**
   - Extra Cheese: **50** ✓ Veg
   - Click **"+ Add Add-on"**
   - Olives: **40** ✓ Veg

6. **Options Tab:**

   - Click **"+ Add Customization Option"**
   - Name: **Spice Level**
   - Type: **Single Choice**
   - ✓ Required
   - Click **"+ Add Value"**
     - Mild: **0**
   - Click **"+ Add Value"**
     - Medium: **0**
   - Click **"+ Add Value"**
     - Hot: **20**

7. **Exclude Tab:**

   - Click **"+ Add Ingredient"**
   - **Onions**
   - Click **"+ Add Ingredient"**
   - **Garlic**
   - ✓ Allow special instructions

8. Click **"Add Item"**

---

### Step 5: Test as Customer (1 min)

1. Copy your restaurant ID from the QR code or URL
2. Go to: `http://localhost:5173/m/{your-restaurant-id}`
3. Enter table number: **5**
4. Click **"Customize"** on the pizza
5. Try selecting:
   - Size: **Medium**
   - Spice: **Hot**
   - Add-ons: **Extra Cheese** ✓
   - Exclude: **Onions** ✓
   - Instructions: **"Extra crispy please"**
   - Quantity: **2**
6. Watch the price update: **₹569 × 2 = ₹1,138**
7. Click **"Add to Cart"**
8. Open cart to see all customizations
9. Click **"Proceed to Checkout"**

---

## 🎉 Done!

You've successfully:
✅ Created a restaurant  
✅ Added a customizable menu item  
✅ Tested the customer experience  
✅ Seen real-time price calculation  
✅ Verified cart displays customizations

---

## 🧪 Try These Next

### More Customization Examples

#### Burger

```
Name: Classic Burger
Price: 199
Sizes: Regular (199), Large (249)
Add-ons: Extra Patty (+80), Cheese (+30)
Options: Cooking Level (Well Done, Medium, Rare)
Exclude: Pickles, Onions, Lettuce
```

#### Coffee

```
Name: Cappuccino
Price: 120
Sizes: Small (120), Medium (150), Large (180)
Add-ons: Extra Shot (+40), Whipped Cream (+20)
Options: Milk Type (Regular, Soy +20, Almond +30)
```

#### Sandwich

```
Name: Club Sandwich
Price: 249
Add-ons: Extra Bacon (+60), Avocado (+50)
Options: Bread Type (White, Wheat, Multigrain +10)
Exclude: Tomatoes, Mayo, Lettuce
```

---

## 📚 Learn More

- **Full Guide**: See `CUSTOMIZATION_GUIDE.md`
- **Testing**: Follow `TESTING_CHECKLIST.md`
- **Technical Details**: Read `CUSTOMIZATION_IMPLEMENTATION.md`
- **Flow Diagram**: Check `CUSTOMIZATION_FLOW.md`

---

## 💡 Tips

### For Restaurant Owners

- Start with simple customizations (sizes, 2-3 add-ons)
- Mark common options as default
- Use clear, descriptive names
- Test the customer experience yourself
- Price add-ons to increase order value

### For Testing

- Try different combinations
- Test required vs optional fields
- Verify price calculations
- Check cart displays correctly
- Test on mobile devices

---

## 🐛 Troubleshooting

### Modal doesn't open?

- Check browser console for errors
- Verify item has customization fields
- Refresh the page

### Price not updating?

- Check all price fields are numbers
- Verify price modifiers are set correctly
- Look for console errors

### Can't add to cart?

- Ensure all required fields are selected
- Check validation messages
- Verify quantity is at least 1

### Customizations not showing in cart?

- Check cart item structure
- Verify customization data is saved
- Refresh the cart

---

## 🎯 Success Checklist

After following this guide, you should be able to:

- [ ] Create a restaurant account
- [ ] Add menu categories
- [ ] Add items with sizes
- [ ] Add items with add-ons
- [ ] Add items with custom options
- [ ] Add excludable ingredients
- [ ] Enable special instructions
- [ ] View items as a customer
- [ ] Customize and order items
- [ ] See customizations in cart
- [ ] Calculate prices correctly
- [ ] Proceed to checkout

---

## 🚀 Next Steps

1. **Add More Items**: Create a full menu with various customizations
2. **Test Thoroughly**: Follow the testing checklist
3. **Customize UI**: Adjust colors, fonts, layouts to match your brand
4. **Deploy**: Move to production when ready
5. **Monitor**: Track which customizations are most popular
6. **Optimize**: Adjust prices and options based on data

---

## 📞 Need Help?

- Check documentation files in the project root
- Review code comments in components
- Test with the provided examples
- Follow the testing checklist

---

**Happy Customizing! 🎉**

Your restaurant ordering system now supports flexible, personalized orders that will delight customers and increase revenue!
