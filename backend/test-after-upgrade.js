// Test ElevenLabs after upgrade
// Run this AFTER you upgrade to verify it works

import 'dotenv/config';
import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API_KEY = process.env.ELEVENLABS_API_KEY;

async function testAfterUpgrade() {
  console.log('\n🎉 Testing ElevenLabs After Upgrade\n');
  console.log('═══════════════════════════════════════════════\n');
  
  try {
    // Check subscription status
    console.log('📊 Step 1: Checking subscription...');
    const userResponse = await fetch('https://api.elevenlabs.io/v1/user', {
      headers: { 'xi-api-key': API_KEY }
    });
    
    if (!userResponse.ok) {
      throw new Error(`Failed to get user info: ${userResponse.status}`);
    }
    
    const userData = await userResponse.json();
    console.log(`✅ Subscription: ${userData.subscription?.tier || 'unknown'}`);
    console.log(`   Characters: ${userData.subscription?.character_count} / ${userData.subscription?.character_limit}`);
    console.log(`   Can use TTS: ${userData.subscription?.can_use_instant_voice_cloning !== false ? '✅ Yes' : '❌ No'}`);
    
    // Test voice generation with British voice (George)
    console.log('\n🎙️ Step 2: Testing Churchill-style voice generation...');
    const CHURCHILL_VOICE_ID = 'JBFqnCBsd6RMkjVDRZzb'; // George - British male
    
    const testText = "We shall never surrender to distraction! Close this page immediately!";
    
    const voiceResponse = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${CHURCHILL_VOICE_ID}`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': API_KEY
      },
      body: JSON.stringify({
        text: testText,
        model_id: 'eleven_multilingual_v2', // Use newer model
        voice_settings: {
          stability: 0.75,
          similarity_boost: 0.85,
          style: 0.5,
          use_speaker_boost: true
        }
      })
    });
    
    if (!voiceResponse.ok) {
      const error = await voiceResponse.text();
      throw new Error(`Voice generation failed: ${error}`);
    }
    
    const audioBuffer = await voiceResponse.arrayBuffer();
    const testFile = path.join(__dirname, '../extension/assets/voices/test_churchill.mp3');
    fs.writeFileSync(testFile, Buffer.from(audioBuffer));
    
    console.log(`✅ Voice generated successfully!`);
    console.log(`   File size: ${(audioBuffer.byteLength / 1024).toFixed(2)} KB`);
    console.log(`   Saved to: test_churchill.mp3`);
    console.log(`   Text: "${testText}"`);
    
    console.log('\n🎉 ALL TESTS PASSED!');
    console.log('\n📝 Next steps:');
    console.log('   1. Listen to test_churchill.mp3 to verify quality');
    console.log('   2. Run: node generate-churchill-voices.js');
    console.log('   3. Generate all Churchill voices for demo!');
    console.log('\n═══════════════════════════════════════════════\n');
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    console.log('\n💡 If you just upgraded:');
    console.log('   - Wait 1-2 minutes for changes to take effect');
    console.log('   - Try running this script again');
    console.log('   - Check your payment was processed\n');
  }
}

testAfterUpgrade();

