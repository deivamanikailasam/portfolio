/**
 * Test script to verify the file server is working correctly
 * Run this with: node test-file-server.js
 */

const testFileServer = async () => {
  console.log('🧪 Testing File Server...\n');

  // Test 1: Health Check
  console.log('Test 1: Health Check');
  try {
    const healthResponse = await fetch('http://localhost:3001/api/health');
    const healthData = await healthResponse.json();
    console.log('✅ Health check passed:', healthData);
  } catch (error) {
    console.error('❌ Health check failed:', error.message);
    console.log('💡 Make sure file server is running: npm run file-server');
    return;
  }

  console.log('\n');

  // Test 2: Save File
  console.log('Test 2: Save Test File');
  try {
    const testData = {
      test: true,
      timestamp: new Date().toISOString(),
      message: 'This is a test file'
    };

    const saveResponse = await fetch('http://localhost:3001/api/save-file', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        path: 'test-output.json',
        content: JSON.stringify(testData, null, 2)
      })
    });

    if (!saveResponse.ok) {
      throw new Error(`HTTP ${saveResponse.status}: ${saveResponse.statusText}`);
    }

    const saveData = await saveResponse.json();
    console.log('✅ File save test passed:', saveData);
  } catch (error) {
    console.error('❌ File save test failed:', error.message);
    return;
  }

  console.log('\n✨ All tests passed! File server is working correctly.\n');
};

// Run tests
testFileServer().catch(console.error);

