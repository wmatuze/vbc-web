// Test script to verify server connectivity
import { testConnection, login } from './services/api';

// Execute test
async function runTest() {
  console.log('Starting server connection test...');
  
  // Test basic connection
  const connectionWorks = await testConnection();
  console.log(`Connection test result: ${connectionWorks ? 'SUCCESS' : 'FAILED'}`);
  
  // Test login
  if (connectionWorks) {
    console.log('Testing login with test credentials...');
    const loginResult = await login('admin', 'church_admin_2025');
    console.log(`Login test result: ${loginResult ? 'SUCCESS' : 'FAILED'}`);
  }
}

// Run the test
runTest().catch(err => {
  console.error('Test failed with error:', err);
});

// Export the function for potential reuse
export { runTest }; 