const fetch = require('node-fetch');

// Configuration
const API_URL = 'http://localhost:5001/api/contact';

async function testInquirySubmission() {
  console.log('🔍 Starting inquiry submission test');
  console.log(`🔍 API URL: ${API_URL}`);

  // Test inquiry data
  const testInquiry = {
    name: 'Test User',
    email: 'test@example.com',
    phone: '123-456-7890',
    subject: 'Test Inquiry from Backend Script',
    message: 'This is a test inquiry to diagnose any backend issues with inquiry submissions.',
    vehicle: 'Test Vehicle',
    vehicleId: null // Optional - can be null for testing
  };

  console.log('🔍 Test inquiry data:', testInquiry);

  try {
    // Make the API request
    console.log('🔍 Sending API request...');
    
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testInquiry)
    });

    // Parse response data
    const responseText = await response.text();
    let responseData;
    
    try {
      responseData = JSON.parse(responseText);
      console.log('🔍 Response can be parsed as JSON');
    } catch (e) {
      console.error('❌ Response is not valid JSON:', responseText);
      return;
    }

    console.log('🔍 Response status:', response.status);
    console.log('🔍 Response status text:', response.statusText);
    console.log('🔍 Response headers:', Object.fromEntries([...response.headers.entries()]));
    console.log('🔍 Response data:', responseData);

    if (response.ok) {
      console.log('✅ TEST PASSED: Inquiry submission was successful!');
      console.log('✅ Inquiry ID:', responseData.data?.id);
    } else {
      console.error('❌ TEST FAILED: Inquiry submission failed!');
      console.error('❌ Error:', responseData?.message || 'Unknown error');
    }
  } catch (error) {
    console.error('❌ TEST ERROR: Exception caught during test');
    console.error('❌ Error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
  }
}

// Run the test
testInquirySubmission(); 