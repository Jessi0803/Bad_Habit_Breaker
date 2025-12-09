// Habit Breaker - Backend API Server
// Handles voice generation and behavior analysis

const express = require('express');
const cors = require('cors');
const { generateSpeechBase64 } = require('./elevenlabs-integration');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Habit Breaker API is running' });
});

/**
 * Generate voice intervention
 * POST /api/generate-voice
 * Body: { text, voiceType }
 */
app.post('/api/generate-voice', async (req, res) => {
  try {
    const { text, voiceType = 'mom' } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }
    
    // Generate speech
    const audioBase64 = await generateSpeechBase64(text, voiceType);
    
    res.json({
      success: true,
      audio: audioBase64,
      format: 'mp3'
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
 * Analyze behavior and suggest intervention
 * POST /api/analyze-behavior
 * Body: { domain, timeSpent, actions }
 */
app.post('/api/analyze-behavior', async (req, res) => {
  try {
    const { domain, timeSpent, actions = [] } = req.body;
    
    // Simple rule-based analysis (can be enhanced with LLM)
    const analysis = analyzeBehavior(domain, timeSpent, actions);
    
    res.json({
      success: true,
      shouldIntervene: analysis.shouldIntervene,
      message: analysis.message,
      severity: analysis.severity
    });
    
  } catch (error) {
    console.error('Error analyzing behavior:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * Log intervention event
 * POST /api/log-intervention
 * Body: { domain, timeSpent, message, userResponse }
 */
app.post('/api/log-intervention', async (req, res) => {
  try {
    const { domain, timeSpent, message, userResponse } = req.body;
    
    // In production, save to database
    console.log('Intervention logged:', {
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
 * Simple behavior analysis logic
 * Can be enhanced with LLM for more sophisticated detection
 */
function analyzeBehavior(domain, timeSpent, actions) {
  const rules = {
    'instagram.com': { threshold: 120, severity: 'high' },
    'tiktok.com': { threshold: 180, severity: 'high' },
    'facebook.com': { threshold: 180, severity: 'medium' },
    'youtube.com': { threshold: 300, severity: 'medium' },
    'amazon.com': { threshold: 300, severity: 'medium' },
    'twitter.com': { threshold: 180, severity: 'medium' },
    'x.com': { threshold: 180, severity: 'medium' }
  };
  
  const cleanDomain = domain.replace('www.', '');
  const rule = Object.keys(rules).find(key => cleanDomain.includes(key));
  
  if (!rule) {
    return {
      shouldIntervene: false,
      message: '',
      severity: 'none'
    };
  }
  
  const config = rules[rule];
  const shouldIntervene = timeSpent >= config.threshold;
  
  if (!shouldIntervene) {
    return {
      shouldIntervene: false,
      message: '',
      severity: 'none'
    };
  }
  
  // Generate appropriate message based on domain
  const messages = {
    'instagram.com': [
      '小明！又在滑Instagram了！你的工作做完了嗎？',
      'Stop scrolling Instagram! Get back to work!'
    ],
    'tiktok.com': [
      'TikTok已經看了這麼久！該停了吧？',
      'Stop watching TikTok! Your time is precious!'
    ],
    'amazon.com': [
      '又在網購？你這個月的預算還夠嗎？',
      'Shopping again? Do you really need more stuff?'
    ],
    'youtube.com': [
      'YouTube看夠了沒？該做正事了！',
      'Enough YouTube! Time to be productive!'
    ]
  };
  
  const messageOptions = messages[rule] || ['Time to get back to work!'];
  const message = messageOptions[Math.floor(Math.random() * messageOptions.length)];
  
  return {
    shouldIntervene: true,
    message: message,
    severity: config.severity
  };
}

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Habit Breaker API server running on port ${PORT}`);
  console.log(`   Health check: http://localhost:${PORT}/health`);
});

module.exports = app;

