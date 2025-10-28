import axios from 'axios';

const testOrderPlacement = async () => {
  try {
    console.log('Testing order placement...');
    
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
      specialInstructions: "Test order from debug script",
      totalAmount: 350,
      originalAmount: 350,
      pointsRedeemed: 0,
      discountAmount: 0,
      customerInfo: null
    };

    console.log('Order data:', JSON.stringify(orderData, null, 2));
    
    // Test direct API call
    const response = await axios.post('http://localhost:5000/api/orders', orderData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Success! Order created:', response.data);
    console.log('Status:', response.status);
    
  } catch (error) {
    console.error('Error details:');
    console.error('Status:', error.response?.status);
    console.error('Status Text:', error.response?.statusText);
    console.error('Data:', error.response?.data);
    console.error('Message:', error.message);
    
    if (error.response?.status === 404) {
      console.error('404 Error - Endpoint not found. Check if server is running and route exists.');
    }
  }
};

testOrderPlacement();