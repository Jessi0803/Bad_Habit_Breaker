// backend/test-groq.js
// 測試 Groq API 是否正常工作

import 'dotenv/config';
import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

async function testGroqAPI() {
  console.log('🚀 測試 Groq API...\n');

  try {
    // 測試 1: 基本對話
    console.log('📝 測試 1: 基本對話');
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: "Say 'Hello from Groq!' in a enthusiastic way"
        }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 50
    });

    console.log('✅ 回應:', chatCompletion.choices[0]?.message?.content);
    console.log('⚡ 模型:', chatCompletion.model);
    console.log('');

    // 測試 2: 生成干預訊息（模擬真實使用）
    console.log('📝 測試 2: 生成干預訊息');
    const interventionCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: `You are a caring life coach. A user has been on Instagram for 180 seconds (this is their visit #3 today, current time: 14:30).

Generate a SHORT (max 15 words), impactful message to snap them out of the distraction. Be direct but caring.

Return ONLY the message, nothing else.`
        }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 50
    });

    console.log('✅ 干預訊息:', interventionCompletion.choices[0]?.message?.content);
    console.log('');

    // 測試 3: 速度測試
    console.log('📝 測試 3: 速度測試');
    const startTime = Date.now();
    
    await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: "Count from 1 to 5"
        }
      ],
      model: "llama-3.3-70b-versatile",
      max_tokens: 30
    });

    const endTime = Date.now();
    const duration = endTime - startTime;

    console.log(`✅ 回應時間: ${duration}ms`);
    console.log('');

    console.log('🎉 所有測試通過！Groq API 運作正常！');
    console.log('');
    console.log('💡 下一步：');
    console.log('   1. 整合到 background.js');
    console.log('   2. 創建 API endpoint');
    console.log('   3. 測試完整流程');

  } catch (error) {
    console.error('❌ 測試失敗:', error.message);
    
    if (error.message.includes('API key')) {
      console.error('');
      console.error('⚠️  請確認：');
      console.error('   1. 已在 backend/.env 設定 GROQ_API_KEY');
      console.error('   2. API Key 格式正確（應該以 gsk_ 開頭）');
      console.error('   3. API Key 沒有被撤銷');
      console.error('');
      console.error('📝 獲取 API Key：https://console.groq.com/keys');
    }
  }
}

// 執行測試
testGroqAPI();

