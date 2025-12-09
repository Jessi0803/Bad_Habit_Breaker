// ElevenLabs Voice API Integration
// This handles text-to-speech conversion using ElevenLabs

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY || 'YOUR_API_KEY_HERE';
const ELEVENLABS_API_URL = 'https://api.elevenlabs.io/v1';

// Voice IDs for different personalities
// You need to create/clone these voices in ElevenLabs dashboard
const VOICE_IDS = {
  mom: 'YOUR_MOM_VOICE_ID',      // Clone your mom's voice or use a preset
  idol: 'YOUR_IDOL_VOICE_ID',    // Clone your idol's voice
  coach: 'YOUR_COACH_VOICE_ID'   // Use a strong, motivating voice
};

/**
 * Generate speech from text using ElevenLabs API
 * @param {string} text - The text to convert to speech
 * @param {string} voiceType - Type of voice ('mom', 'idol', 'coach')
 * @returns {Promise<ArrayBuffer>} - Audio data as ArrayBuffer
 */
async function generateSpeech(text, voiceType = 'mom') {
  const voiceId = VOICE_IDS[voiceType] || VOICE_IDS.mom;
  
  try {
    const response = await fetch(
      `${ELEVENLABS_API_URL}/text-to-speech/${voiceId}`,
      {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': ELEVENLABS_API_KEY
        },
        body: JSON.stringify({
          text: text,
          model_id: 'eleven_multilingual_v2', // Supports multiple languages
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
            style: 0.0,
            use_speaker_boost: true
          }
        })
      }
    );
    
    if (!response.ok) {
      throw new Error(`ElevenLabs API error: ${response.status}`);
    }
    
    const audioData = await response.arrayBuffer();
    return audioData;
    
  } catch (error) {
    console.error('Error generating speech:', error);
    throw error;
  }
}

/**
 * Generate speech and return as base64 (for easy transmission)
 * @param {string} text - The text to convert
 * @param {string} voiceType - Voice personality
 * @returns {Promise<string>} - Base64 encoded audio
 */
async function generateSpeechBase64(text, voiceType = 'mom') {
  const audioData = await generateSpeech(text, voiceType);
  const base64 = Buffer.from(audioData).toString('base64');
  return base64;
}

/**
 * Save audio to file (for pre-generating common messages)
 * @param {string} text - Text to convert
 * @param {string} voiceType - Voice type
 * @param {string} filename - Output filename
 */
async function saveAudioToFile(text, voiceType, filename) {
  const fs = require('fs').promises;
  const audioData = await generateSpeech(text, voiceType);
  await fs.writeFile(filename, Buffer.from(audioData));
  console.log(`Audio saved to ${filename}`);
}

/**
 * Pre-generate common intervention messages
 * This saves time during live demo
 */
async function preGenerateMessages() {
  const fs = require('fs');
  const path = require('path');
  
  // Create assets/voices directory if it doesn't exist
  const voicesDir = path.join(__dirname, '../assets/voices');
  if (!fs.existsSync(voicesDir)) {
    fs.mkdirSync(voicesDir, { recursive: true });
  }
  
  const messages = [
    // Mom voice messages
    {
      text: '小明！又在滑Instagram了！你的工作做完了嗎？',
      voice: 'mom',
      filename: 'mom-instagram-chinese.mp3'
    },
    {
      text: 'Stop scrolling Instagram! You have work to do!',
      voice: 'mom',
      filename: 'mom-instagram-english.mp3'
    },
    {
      text: '又在網購？你這個月的預算還夠嗎？',
      voice: 'mom',
      filename: 'mom-shopping-chinese.mp3'
    },
    {
      text: 'Shopping again? What about your budget?',
      voice: 'mom',
      filename: 'mom-shopping-english.mp3'
    },
    
    // Idol voice messages
    {
      text: 'Hey! I believe in you, but you need to focus right now!',
      voice: 'idol',
      filename: 'idol-focus.mp3'
    },
    {
      text: 'Come on, you can do better than endless scrolling!',
      voice: 'idol',
      filename: 'idol-scrolling.mp3'
    },
    
    // Coach voice messages
    {
      text: 'Champions don\'t waste time! Get back to work!',
      voice: 'coach',
      filename: 'coach-champions.mp3'
    },
    {
      text: 'Is this how winners behave? I don\'t think so!',
      voice: 'coach',
      filename: 'coach-winners.mp3'
    }
  ];
  
  console.log('Pre-generating voice messages...');
  
  for (const msg of messages) {
    try {
      const filePath = path.join(voicesDir, msg.filename);
      await saveAudioToFile(msg.text, msg.voice, filePath);
      console.log(`✓ Generated: ${msg.filename}`);
    } catch (error) {
      console.error(`✗ Failed to generate ${msg.filename}:`, error.message);
    }
  }
  
  console.log('Done! All messages pre-generated.');
}

// For Node.js usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    generateSpeech,
    generateSpeechBase64,
    saveAudioToFile,
    preGenerateMessages
  };
}

// For browser usage (if needed)
if (typeof window !== 'undefined') {
  window.ElevenLabsAPI = {
    generateSpeech,
    generateSpeechBase64
  };
}

