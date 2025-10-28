// Simple test to check if the QR generation route is accessible
import axios from 'axios';

const testQRRoute = async () => {
  try {
    // Test if the route exists (should get 401 without auth)
    const response = await axios.post('http://localhost:5000/api/restaurant/test-id/generate-tables', {
      numberOfTables: 1
    });
    console.log('Route response:', response.data);
  } catch (error) {
    if (error.response?.status === 401) {
      console.log('✅ Route exists but requires authentication (expected)');
    } else if (error.response?.status === 404) {
      console.log('❌ Route not found - check server routes');
    } else {
      console.log('Route error:', error.response?.status, error.response?.data);
    }
  }
};

testQRRoute();