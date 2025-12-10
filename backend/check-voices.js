// Check available ElevenLabs voices
import 'dotenv/config';

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;

async function listVoices() {
  const response = await fetch('https://api.elevenlabs.io/v1/voices', {
    headers: {
      'xi-api-key': ELEVENLABS_API_KEY
    }
  });
  
  const data = await response.json();
  
  console.log('\n🎙️ Available ElevenLabs Voices:\n');
  
  // Look for British/Churchill-style voices
  const britishVoices = data.voices.filter(v => 
    v.name.toLowerCase().includes('british') || 
    v.name.toLowerCase().includes('churchill') ||
    v.name.toLowerCase().includes('uk') ||
    v.labels?.accent?.toLowerCase() === 'british'
  );
  
  console.log('🇬🇧 British/Churchill-style voices:');
  britishVoices.forEach(v => {
    console.log(`  - ${v.name} (${v.voice_id})`);
    console.log(`    Age: ${v.labels?.age || 'N/A'}, Gender: ${v.labels?.gender || 'N/A'}`);
    console.log(`    Accent: ${v.labels?.accent || 'N/A'}`);
    console.log('');
  });
  
  if (britishVoices.length === 0) {
    console.log('  No Churchill-specific voice found, showing all male voices...\n');
    
    const maleVoices = data.voices.filter(v => 
      v.labels?.gender?.toLowerCase() === 'male'
    ).slice(0, 5);
    
    maleVoices.forEach(v => {
      console.log(`  - ${v.name} (${v.voice_id})`);
      console.log(`    Accent: ${v.labels?.accent || 'N/A'}, Age: ${v.labels?.age || 'N/A'}`);
      console.log('');
    });
  }
}

listVoices().catch(console.error);
