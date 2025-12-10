// Test ElevenLabs API Key
import 'dotenv/config';

const API_KEY = process.env.ELEVENLABS_API_KEY;

console.log('\n🔍 Testing ElevenLabs API Key...\n');
console.log(`API Key: ${API_KEY?.substring(0, 10)}...${API_KEY?.substring(API_KEY.length - 5)}`);

async function testAPI() {
  try {
    // Test 1: Get user info
    console.log('\n📊 Test 1: Checking account info...');
    const userResponse = await fetch('https://api.elevenlabs.io/v1/user', {
      headers: {
        'xi-api-key': API_KEY
      }
    });
    
    if (!userResponse.ok) {
      console.log(`❌ Status: ${userResponse.status} ${userResponse.statusText}`);
      const error = await userResponse.text();
      console.log(`Error: ${error}`);
      return;
    }
    
    const userData = await userResponse.json();
    console.log('✅ API Key is valid!');
    console.log(`   User: ${userData.subscription?.tier || 'Free'} tier`);
    console.log(`   Character quota: ${userData.subscription?.character_count || 0} / ${userData.subscription?.character_limit || 'N/A'}`);
    console.log(`   Can use TTS: ${userData.subscription?.can_use_instant_voice_cloning !== false ? 'Yes' : 'No'}`);
    
    // Check if quota is exhausted
    if (userData.subscription?.character_count >= userData.subscription?.character_limit) {
      console.log('\n⚠️  WARNING: Character quota exhausted!');
      console.log('   You need to wait for quota reset or upgrade your plan.');
    }
    
  } catch (error) {
    console.error('\n❌ API Test Failed:', error.message);
  }
}

testAPI();
