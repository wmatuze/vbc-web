const fetch = require('node-fetch');

const testMembershipRenewal = async () => {
  try {
    console.log('Testing membership renewal API endpoint...');
    
    const response = await fetch('http://localhost:3000/api/membership/renew', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fullName: 'Test User',
        email: 'test@example.com',
        phone: '123456789',
        birthday: '1990-01-01',
        memberSince: '2020',
        ministryInvolvement: '',
        addressChange: false,
        newAddress: '',
        agreeToTerms: true
      })
    });
    
    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers.raw());
    
    const contentType = response.headers.get('content-type');
    console.log('Content type:', contentType);
    
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      console.log('Response data:', JSON.stringify(data, null, 2));
    } else {
      const text = await response.text();
      console.log('Response text:', text);
    }
  } catch (error) {
    console.error('Error during API test:', error);
  }
};

testMembershipRenewal(); 