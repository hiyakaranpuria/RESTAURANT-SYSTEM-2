import axios from 'axios';

const testActiveOrdersFlow = async () => {
  try {
    console.log('🧪 Testing Active Orders Flow...');
    
    // Step 1: Place a test order
    const orderData = {
      restaurantId: "68fe544f5003ce90186aac7f",
      tableNumber: "2",
      items: [
        {
          menuItemId: "6900d719e5612aa4347d349a",
          name: "DAHI BHALLE",
          price: 350,
          quantity: 1
        }
      ],
      specialInstructions: "Test order for active orders",
      totalAmount: 350,
      originalAmount: 350,
      pointsRedeemed: 0,
      discountAmount: 0,
      customerInfo: null
    };

    console.log('📤 Placing test order...');
    const orderResponse = await axios.post('http://localhost:5000/api/orders', orderData);
    console.log('✅ Order placed:', orderResponse.data._id);
    console.log('📊 Order status:', orderResponse.data.status);
    
    // Step 2: Check active orders
    const customerEmail = `guest-68fe544f5003ce90186aac7f-2@temp.com`;
    console.log('📤 Fetching active orders for:', customerEmail);
    
    const activeResponse = await axios.get('http://localhost:5000/api/orders/active', {
      params: {
        restaurantId: "68fe544f5003ce90186aac7f",
        tableNumber: "2",
        customerEmail: customerEmail
      }
    });
    
    console.log('✅ Active orders found:', activeResponse.data.length);
    console.log('📋 Active orders:', activeResponse.data);
    
    if (activeResponse.data.length > 0) {
      console.log('🎉 SUCCESS: Active orders are working!');
      activeResponse.data.forEach((order, index) => {
        console.log(`Order ${index + 1}:`, {
          id: order._id,
          status: order.status,
          items: order.items.length,
          total: order.totalAmount
        });
      });
    } else {
      console.log('❌ No active orders found. Possible issues:');
      console.log('- Order status might not be in active statuses');
      console.log('- Customer email might not match');
      console.log('- Restaurant/table might not match');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
};

testActiveOrdersFlow();