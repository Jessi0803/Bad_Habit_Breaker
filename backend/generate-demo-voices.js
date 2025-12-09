// 預先生成 Demo 用的語音檔案
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const API_KEY = process.env.ELEVENLABS_API_KEY;
const OUTPUT_DIR = path.join(__dirname, '../extension/assets/voices');

// 確保輸出資料夾存在
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Demo 訊息清單
const messages = [
  {
    text: '小明！又在滑Instagram了！你的工作做完了嗎？',
    filename: 'mom-instagram-zh.mp3',
    voiceId: 'EXAVITQu4vr4xnSDxMaL' // Sarah - 女聲
  },
  {
    text: 'Instagram can wait! You have important things to do!',
    filename: 'mom-instagram-en.mp3',
    voiceId: 'EXAVITQu4vr4xnSDxMaL' // Sarah
  },
  {
    text: '又在網購？你這個月的預算還夠嗎？',
    filename: 'mom-shopping-zh.mp3',
    voiceId: 'EXAVITQu4vr4xnSDxMaL'
  },
  {
    text: 'Do you really need to buy more stuff?',
    filename: 'mom-shopping-en.mp3',
    voiceId: 'EXAVITQu4vr4xnSDxMaL'
  },
  {
    text: '不要再刷臉書了！',
    filename: 'mom-facebook-zh.mp3',
    voiceId: 'EXAVITQu4vr4xnSDxMaL'
  },
  {
    text: 'Stop scrolling TikTok! Your time is precious!',
    filename: 'coach-tiktok-en.mp3',
    voiceId: 'CwhRBWXzGAHq8TQ4Fs17' // Roger - 男聲
  }
];

async function generateVoice(text, voiceId, filename) {
  try {
    console.log(`🎤 生成: ${filename}...`);
    
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': API_KEY
        },
        body: JSON.stringify({
          text: text,
          model_id: 'eleven_multilingual_v2',
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
      throw new Error(`API Error: ${response.status}`);
    }
    
    const audioBuffer = await response.arrayBuffer();
    const outputPath = path.join(OUTPUT_DIR, filename);
    fs.writeFileSync(outputPath, Buffer.from(audioBuffer));
    
    console.log(`✅ 已儲存: ${filename} (${(audioBuffer.byteLength / 1024).toFixed(1)} KB)`);
    
  } catch (error) {
    console.error(`❌ 失敗: ${filename} - ${error.message}`);
  }
}

async function generateAll() {
  console.log('🚀 開始生成 Demo 語音檔...\n');
  console.log(`輸出目錄: ${OUTPUT_DIR}\n`);
  
  for (const msg of messages) {
    await generateVoice(msg.text, msg.voiceId, msg.filename);
    // 等待 1 秒避免 rate limit
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log('\n🎉 全部完成！');
  console.log(`\n已生成 ${messages.length} 個語音檔案到:`);
  console.log(OUTPUT_DIR);
}

// 執行
generateAll().catch(console.error);

