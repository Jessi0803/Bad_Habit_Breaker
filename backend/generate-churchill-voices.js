// Generate Churchill-style voices for Habit Breaker
// British Prime Minister Winston Churchill inspired intervention messages

import 'dotenv/config';
import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
const VOICE_ID = 'JBFqnCBsd6RMkjVDRZzb'; // George - British male

// Churchill-style intervention messages
const CHURCHILL_MESSAGES = [
  {
    text: "We shall never surrender to distraction! Close this page and return to your duties!",
    filename: "churchill_instagram.mp3",
    context: "Instagram"
  },
  {
    text: "This is not the time for Facebook! We must fight on, we must work on, we must focus on!",
    filename: "churchill_facebook.mp3",
    context: "Facebook"
  },
  {
    text: "Never in the field of productivity was so much wasted by so many on so little. Close YouTube now!",
    filename: "churchill_youtube.mp3",
    context: "YouTube"
  },
  {
    text: "Success is not final, failure is not fatal. But scrolling through shopping sites is definitely procrastination! Get back to work!",
    filename: "churchill_shopping.mp3",
    context: "Shopping"
  }
];

async function generateChurchillVoice(text, filename) {
  console.log(`\n🎙️ Generating Churchill voice: ${filename}`);
  console.log(`📝 Text: "${text}"`);
  
  try {
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': ELEVENLABS_API_KEY
      },
      body: JSON.stringify({
        text: text,
        model_id: 'eleven_multilingual_v2', // Use newer model for Creator tier
        voice_settings: {
          stability: 0.95,        // Maximum stability = deeper, more authoritative
          similarity_boost: 0.95, // Maximum similarity = more consistent old voice
          style: 0.2,            // Lower style = more serious, less expressive (older)
          use_speaker_boost: true
        }
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const audioBuffer = await response.arrayBuffer();
    const outputPath = path.join(__dirname, '../extension/assets/voices', filename);
    
    fs.writeFileSync(outputPath, Buffer.from(audioBuffer));
    
    console.log(`✅ Generated: ${filename} (${(audioBuffer.byteLength / 1024).toFixed(2)} KB)`);
    
    // Add delay to respect rate limits
    await new Promise(resolve => setTimeout(resolve, 1000));
    
  } catch (error) {
    console.error(`❌ Failed to generate ${filename}:`, error.message);
  }
}

async function generateAllChurchillVoices() {
  console.log('🇬🇧 ═══════════════════════════════════════════════');
  console.log('   Winston Churchill Voice Generation');
  console.log('   For British Judges at Hackathon');
  console.log('   ═══════════════════════════════════════════════');
  
  // Check if API key exists
  if (!ELEVENLABS_API_KEY) {
    console.error('❌ ELEVENLABS_API_KEY not found in .env');
    process.exit(1);
  }
  
  // Create voices directory if it doesn't exist
  const voicesDir = path.join(__dirname, '../extension/assets/voices');
  if (!fs.existsSync(voicesDir)) {
    fs.mkdirSync(voicesDir, { recursive: true });
  }
  
  // Generate all Churchill voices
  for (const message of CHURCHILL_MESSAGES) {
    await generateChurchillVoice(message.text, message.filename);
  }
  
  console.log('\n✅ All Churchill voices generated successfully!');
  console.log('\n📝 Next steps:');
  console.log('   1. Update extension/popup.html to add Churchill voice option');
  console.log('   2. Update extension/background.js to use Churchill messages');
  console.log('   3. Demo with British accent for the judges! 🇬🇧');
}

generateAllChurchillVoices();

