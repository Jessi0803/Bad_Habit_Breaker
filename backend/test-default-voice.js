// Test with default/free voices
import 'dotenv/config';

const API_KEY = process.env.ELEVENLABS_API_KEY;

async function testDefaultVoice() {
  console.log('\n🎙️ Testing with default free voice...\n');
  
  try {
    // Try the most basic voice
    const VOICE_ID = '21m00Tcm4TlvDq8ikWAM'; // Rachel - usually always available
    
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': API_KEY
      },
      body: JSON.stringify({
        text: "Testing voice generation.",
        model_id: 'eleven_monolingual_v1',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.5
        }
      })
    });
    
    console.log(`Status: ${response.status} ${response.statusText}`);
    
    if (!response.ok) {
      const error = await response.text();
      console.log(`\n❌ Error: ${error}`);
    } else {
      const buffer = await response.arrayBuffer();
      console.log(`\n✅ Success! Generated ${(buffer.byteLength / 1024).toFixed(2)} KB audio`);
      console.log('\n💡 Conclusion: API can generate voices, but might have voice selection limits');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testDefaultVoice();
