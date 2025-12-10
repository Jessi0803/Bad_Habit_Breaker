// Habit Breaker - Backend API Server
// Handles voice generation and behavior analysis with LLM

import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { generatePersonalizedMessage, shouldIntervene } from './llm-service-groq.js';
import { generateDailyReport, formatReportAsHTML, formatReportAsText } from './daily-report-service.js';
import { sendDailyReportEmail, isEmailConfigured, testEmailConfig } from './email-service.js';

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
    voice: 'ElevenLabs ready',
    email: isEmailConfigured() ? 'Email configured ✅' : 'Email not configured (optional)'
  });
});

/**
 * 🚀 新的核心 API：使用 LLM 生成動態干預訊息
 * POST /api/generate-intervention
 * Body: { site, timeSpent, visitCount, currentTime }
 */
app.post('/api/generate-intervention', async (req, res) => {
  try {
    const { site, timeSpent, visitCount, currentTime, voiceType } = req.body;
    
    if (!site || timeSpent === undefined) {
      return res.status(400).json({ 
        error: 'Missing required fields: site, timeSpent' 
      });
    }
    
    console.log(`📊 Generating intervention for ${site} (${timeSpent}s, visit #${visitCount || 1}, voice: ${voiceType || 'mom'})`);
    
    // 使用 Groq LLM 生成個性化訊息
    const result = await generatePersonalizedMessage({
      site,
      timeSpent,
      voiceType,
      visitCount: visitCount || 1,
      currentTime: currentTime || new Date().toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      })
    });
    
    // 根據語音類型和網站選擇對應的預錄音檔
    const audioMappings = {
      churchill: {
        'instagram': 'churchill_instagram.mp3',
        'facebook': 'churchill_facebook.mp3',
        'youtube': 'churchill_youtube.mp3',
        'shopping': 'churchill_shopping.mp3',
        'amazon': 'churchill_shopping.mp3',
        'default': 'churchill_instagram.mp3'
      },
      mom: {
        'instagram': 'mom-instagram-en.mp3',
        'facebook': 'mom-facebook-en.mp3',
        'shopping': 'mom-shopping-en.mp3',
        'amazon': 'mom-shopping-en.mp3',
        'default': 'mom-instagram-en.mp3'
      },
      idol: {
        'instagram': 'coach-tiktok-en.mp3',  // Use coach voice as placeholder
        'facebook': 'mom-facebook-en.mp3',
        'youtube': 'coach-tiktok-en.mp3',
        'default': 'coach-tiktok-en.mp3'
      },
      coach: {
        'instagram': 'coach-tiktok-en.mp3',
        'facebook': 'coach-tiktok-en.mp3',
        'shopping': 'mom-shopping-en.mp3',
        'amazon': 'mom-shopping-en.mp3',
        'default': 'coach-tiktok-en.mp3'
      }
    };
    
    // 選擇語音集合
    const currentVoice = voiceType || 'mom';
    const audioMapping = audioMappings[currentVoice] || audioMappings.mom;
    
    // 找出最匹配的音檔
    let audioFile = audioMapping.default;
    for (const [keyword, file] of Object.entries(audioMapping)) {
      if (keyword !== 'default' && site.toLowerCase().includes(keyword)) {
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

/**
 * 📊 生成每日報告（n8n 整合）
 * POST /api/daily-report
 * Body: { userEmail, format: 'html'|'text'|'json' }
 */
app.post('/api/daily-report', async (req, res) => {
  try {
    const { userEmail = 'demo@habitbreaker.ai', format = 'json' } = req.body;
    
    console.log(`📊 Generating daily report for ${userEmail} (format: ${format})`);
    
    // 生成報告
    const report = await generateDailyReport({ userEmail });
    
    // 根據格式返回
    if (format === 'html') {
      const html = formatReportAsHTML(report);
      res.setHeader('Content-Type', 'text/html');
      res.send(html);
    } else if (format === 'text') {
      const text = formatReportAsText(report);
      res.setHeader('Content-Type', 'text/plain');
      res.send(text);
    } else {
      res.json({
        success: true,
        report: report
      });
    }
    
    console.log(`✅ Daily report generated for ${userEmail}`);
    
  } catch (error) {
    console.error('❌ Error generating daily report:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * 📧 預覽每日報告 HTML（測試用）
 * GET /api/daily-report/preview
 */
app.get('/api/daily-report/preview', async (req, res) => {
  try {
    const report = await generateDailyReport({});
    const html = formatReportAsHTML(report);
    res.setHeader('Content-Type', 'text/html');
    res.send(html);
  } catch (error) {
    console.error('❌ Error generating preview:', error);
    res.status(500).send('Error generating report');
  }
});

/**
 * 📧 Send daily report via email
 * POST /api/send-email-report
 * Body: { userEmail }
 */
app.post('/api/send-email-report', async (req, res) => {
  try {
    const { userEmail } = req.body;
    
    if (!userEmail) {
      return res.status(400).json({
        success: false,
        error: 'userEmail is required'
      });
    }
    
    console.log(`📧 Sending daily report email to ${userEmail}`);
    
    // Generate report
    const report = await generateDailyReport({ userEmail });
    const htmlContent = formatReportAsHTML(report);
    const textContent = formatReportAsText(report);
    
    // Send email
    const emailResult = await sendDailyReportEmail({
      to: userEmail,
      subject: `🚫 Your Daily Habit Report - ${report.date}`,
      htmlContent,
      textContent
    });
    
    if (emailResult.success) {
      console.log(`✅ Email sent to ${userEmail}`);
      res.json({
        success: true,
        message: 'Email sent successfully',
        messageId: emailResult.messageId
      });
    } else {
      res.status(500).json(emailResult);
    }
    
  } catch (error) {
    console.error('❌ Error sending email report:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * 🧪 Test email configuration
 * GET /api/test-email
 */
app.get('/api/test-email', async (req, res) => {
  try {
    const result = await testEmailConfig();
    res.json(result);
  } catch (error) {
    res.status(500).json({
      configured: false,
      error: error.message
    });
  }
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
  console.log(`      POST /api/daily-report`);
  console.log(`      POST /api/send-email-report`);
  console.log(`      GET  /api/test-email`);
  console.log('');
  console.log('   📧 Email Status:');
  console.log(`      ${isEmailConfigured() ? '✅ Configured & Ready' : '⚠️  Not configured (see EMAIL_SETUP.md)'}`);
  console.log('   ═══════════════════════════════════════════════');
  console.log('');
});

export default app;
