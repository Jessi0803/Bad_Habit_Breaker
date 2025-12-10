// Check ElevenLabs quota
import 'dotenv/config';

const API_KEY = process.env.ELEVENLABS_API_KEY;

async function checkQuota() {
  console.log('\n📊 Checking ElevenLabs Subscription...\n');
  
  const response = await fetch('https://api.elevenlabs.io/v1/user', {
    headers: { 'xi-api-key': API_KEY }
  });
  
  const data = await response.json();
  const sub = data.subscription;
  
  console.log('🎯 Subscription Plan:', sub?.tier || 'Unknown');
  console.log('📈 Character Quota:');
  console.log(`   Used:      ${sub?.character_count?.toLocaleString() || 0}`);
  console.log(`   Total:     ${sub?.character_limit?.toLocaleString() || 0}`);
  console.log(`   Remaining: ${(sub?.character_limit - sub?.character_count)?.toLocaleString() || 0}`);
  console.log(`   Usage:     ${((sub?.character_count / sub?.character_limit) * 100).toFixed(2)}%`);
  
  console.log('\n💰 Cost Analysis:');
  const charactersPerVoice = 100; // Average
  const voicesGenerated = Math.floor(sub?.character_count / charactersPerVoice);
  const remainingVoices = Math.floor((sub?.character_limit - sub?.character_count) / charactersPerVoice);
  
  console.log(`   Voices generated so far: ~${voicesGenerated}`);
  console.log(`   Voices remaining: ~${remainingVoices.toLocaleString()}`);
  
  console.log('\n🔄 Reset Information:');
  console.log(`   Next reset: ${sub?.next_character_count_reset_unix ? new Date(sub.next_character_count_reset_unix * 1000).toLocaleDateString() : 'N/A'}`);
  
  console.log('\n✅ Conclusion:');
  if (sub?.character_limit - sub?.character_count > 10000) {
    console.log('   You have PLENTY of quota remaining! 🎉');
    console.log('   Safe to generate more voices as needed.');
  } else {
    console.log('   ⚠️  Running low on quota. Use wisely.');
  }
}

checkQuota();
