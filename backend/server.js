// Habit Breaker - Backend API Server
// Handles voice generation and behavior analysis with LLM

import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { generatePersonalizedMessage, shouldIntervene } from './llm-service-groq.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Habit Breaker API is running',
    llm: 'Groq LLM integrated',
    voice: 'ElevenLabs ready'
  });
});

/**
 * 🚀 新的核心 API：使用 LLM 生成動態干預訊息
 * POST /api/generate-intervention
 * Body: { site, timeSpent, visitCount, currentTime }
 */
app.post('/api/generate-intervention', async (req, res) => {
  try {
    const { site, timeSpent, visitCount, currentTime } = req.body;
    
    if (!site || timeSpent === undefined) {
      return res.status(400).json({ 
        error: 'Missing required fields: site, timeSpent' 
      });
    }
    
    console.log(`📊 Generating intervention for ${site} (${timeSpent}s, visit #${visitCount || 1})`);
    
    // 使用 Groq LLM 生成個性化訊息
    const result = await generatePersonalizedMessage({
      site,
      timeSpent,
      visitCount: visitCount || 1,
      currentTime: currentTime || new Date().toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      })
    });
    
    // 根據網站選擇對應的預錄音檔
    const audioMapping = {
      'instagram': 'mom-instagram-en.mp3',
      'facebook': 'mom-facebook-en.mp3',
      'tiktok': 'coach-tiktok-en.mp3',
      'amazon': 'mom-shopping-en.mp3',
      'shopping': 'mom-shopping-en.mp3'
    };
    
    // 找出最匹配的音檔
    let audioFile = 'mom-instagram-en.mp3'; // 默認
    for (const [keyword, file] of Object.entries(audioMapping)) {
      if (site.toLowerCase().includes(keyword)) {
        audioFile = file;
        break;
      }
    }
    
    console.log(`✅ Generated message: "${result.message}"`);
    console.log(`🎵 Audio file: ${audioFile}`);
    
    res.json({
      success: true,
      message: result.message,
      audioFile: audioFile,
      severity: result.severity,
      generatedBy: result.generatedBy
    });
    
  } catch (error) {
    console.error('❌ Error generating intervention:', error);
    
    // Fallback 訊息（如果 LLM 失敗）
    res.json({
      success: true,
      message: `Time to stop browsing ${req.body.site}! You have more important things to do!`,
      audioFile: 'mom-instagram-en.mp3',
      severity: 'medium',
      generatedBy: 'fallback'
    });
  }
});

/**
 * 🧠 智能判斷是否需要干預
 * POST /api/should-intervene
 * Body: { site, timeSpent, actions, scrollSpeed }
 */
app.post('/api/should-intervene', async (req, res) => {
  try {
    const { site, timeSpent, actions, scrollSpeed } = req.body;
    
    if (!site || timeSpent === undefined) {
      return res.status(400).json({ 
        error: 'Missing required fields: site, timeSpent' 
      });
    }
    
    console.log(`🤔 Analyzing behavior on ${site}...`);
    
    // 使用 LLM 智能判斷
    const result = await shouldIntervene({
      site,
      timeSpent,
      actions: actions || 'scrolling',
      scrollSpeed: scrollSpeed || 'normal'
    });
    
    console.log(`${result.shouldIntervene ? '⚠️' : '✅'} ${result.reason}`);
    
    res.json({
      success: true,
      shouldIntervene: result.shouldIntervene,
      reason: result.reason
    });
    
  } catch (error) {
    console.error('❌ Error analyzing behavior:', error);
    
    // Fallback 到簡單規則
    res.json({
      success: true,
      shouldIntervene: req.body.timeSpent > 60,
      reason: 'Fallback to time-based rule'
    });
  }
});

/**
 * 🎤 即時生成語音（可選功能）
 * POST /api/generate-voice
 * Body: { text, voiceType }
 */
app.post('/api/generate-voice', async (req, res) => {
  try {
    const { text, voiceType = 'mom' } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }
    
    // 這個功能需要 ElevenLabs API
    // 目前使用預錄音檔，所以這個 endpoint 是為未來準備的
    
    res.json({
      success: true,
      message: 'Voice generation not implemented yet. Using pre-recorded audio.',
      audioFile: 'mom-instagram-en.mp3'
    });
    
  } catch (error) {
    console.error('Error generating voice:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * 📝 記錄干預事件（用於分析和學習）
 * POST /api/log-intervention
 * Body: { domain, timeSpent, message, userResponse }
 */
app.post('/api/log-intervention', async (req, res) => {
  try {
    const { domain, timeSpent, message, userResponse } = req.body;
    
    // 在生產環境中，這裡會保存到數據庫
    console.log('📊 Intervention logged:', {
      timestamp: new Date().toISOString(),
      domain,
      timeSpent,
      message,
      userResponse
    });
    
    res.json({ success: true });
    
  } catch (error) {
    console.error('Error logging intervention:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * 📈 獲取用戶統計數據（Demo 用）
 * GET /api/stats
 */
app.get('/api/stats', (req, res) => {
  // 這裡可以返回一些 mock 數據用於 Demo
  res.json({
    success: true,
    stats: {
      totalInterventions: 42,
      topDistractingSites: [
        { site: 'instagram.com', count: 15 },
        { site: 'tiktok.com', count: 12 },
        { site: 'facebook.com', count: 8 }
      ],
      timesSaved: '2h 15m',
      successRate: '73%'
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log('');
  console.log('🚀 ═══════════════════════════════════════════════');
  console.log('   Habit Breaker API Server');
  console.log('   ═══════════════════════════════════════════════');
  console.log(`   Status: ✅ Running on port ${PORT}`);
  console.log(`   Health: http://localhost:${PORT}/health`);
  console.log('');
  console.log('   🧠 AI Features:');
  console.log('      • Groq LLM: ✅ Integrated');
  console.log('      • Dynamic Messages: ✅ Enabled');
  console.log('      • Behavior Analysis: ✅ Ready');
  console.log('');
  console.log('   📡 API Endpoints:');
  console.log(`      POST /api/generate-intervention`);
  console.log(`      POST /api/should-intervene`);
  console.log(`      POST /api/log-intervention`);
  console.log(`      GET  /api/stats`);
  console.log('   ═══════════════════════════════════════════════');
  console.log('');
});

export default app;
