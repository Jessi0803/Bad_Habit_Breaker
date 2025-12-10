// Find better Churchill-like voice from ElevenLabs
import 'dotenv/config';

const API_KEY = process.env.ELEVENLABS_API_KEY;

async function findBestVoice() {
  console.log('\n🔍 Searching for Churchill-like voices in ElevenLabs...\n');
  
  const response = await fetch('https://api.elevenlabs.io/v1/voices', {
    headers: { 'xi-api-key': API_KEY }
  });
  
  const data = await response.json();
  
  // Look for older British male voices
  const britishMales = data.voices.filter(v => 
    v.labels?.gender === 'male' &&
    (v.labels?.accent === 'british' || v.labels?.accent === 'english')
  );
  
  console.log('🇬🇧 All British Male Voices:\n');
  console.log('═'.repeat(60));
  
  britishMales.sort((a, b) => {
    const ageOrder = { 'old': 0, 'middle_aged': 1, 'young': 2 };
    return ageOrder[a.labels?.age] - ageOrder[b.labels?.age];
  });
  
  britishMales.forEach((v, i) => {
    const ageEmoji = v.labels?.age === 'old' ? '👴' : v.labels?.age === 'middle_aged' ? '👨' : '👦';
    console.log(`\n${i + 1}. ${ageEmoji} ${v.name}`);
    console.log(`   Voice ID: ${v.voice_id}`);
    console.log(`   Age: ${v.labels?.age || 'N/A'}`);
    console.log(`   Accent: ${v.labels?.accent || 'N/A'}`);
    if (v.labels?.description) {
      console.log(`   Description: ${v.labels.description}`);
    }
    if (v.labels?.use_case) {
      console.log(`   Use case: ${v.labels.use_case}`);
    }
  });
  
  console.log('\n' + '═'.repeat(60));
  console.log('\n💡 Recommendation for Churchill:\n');
  console.log('   Look for: OLD age + DEEP/AUTHORITATIVE + BRITISH accent');
  console.log('   Current voice (George): middle_aged - sounds too young\n');
  
  // Show current voice
  const currentVoice = britishMales.find(v => v.voice_id === 'JBFqnCBsd6RMkjVDRZzb');
  if (currentVoice) {
    console.log('🎙️ Currently using:');
    console.log(`   ${currentVoice.name} (${currentVoice.labels?.age})`);
    console.log(`   ID: ${currentVoice.voice_id}\n`);
  }
}

findBestVoice().catch(console.error);

