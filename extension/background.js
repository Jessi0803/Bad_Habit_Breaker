// Habit Breaker - Background Service Worker
// Monitors user behavior and triggers interventions with LLM

// Backend API Configuration
const BACKEND_URL = 'http://localhost:3000';
const USE_LLM = true; // Set to false to use fixed messages

// Visit count tracking (for LLM context)
const visitCounts = new Map();

// Sensitivity thresholds
const SENSITIVITY_MULTIPLIERS = {
  high: 0.5,    // 5-10s
  medium: 1.0,  // 10-15s (default)
  low: 3.0      // 30-60s
};

// Configuration (base thresholds, will be adjusted by sensitivity)
const BAD_HABITS = [
  { 
    domain: "instagram.com", 
    threshold: 10, // seconds - DEMO MODE (will be adjusted by sensitivity)
    messages: ["Instagram can wait! You have important things to do!", "Stop scrolling and get back to work!"]
  },
  { 
    domain: "tiktok.com", 
    threshold: 10, // DEMO MODE (original: 180)
    messages: ["Stop scrolling TikTok! Your time is precious!", "TikTok can wait! Focus on what matters!"]
  },
  { 
    domain: "amazon.com", 
    threshold: 15, // DEMO MODE (original: 300)
    messages: ["Do you really need to buy more stuff?", "Shopping again? Think about your budget!"],
    keywords: ["cart", "checkout", "buy"]
  },
  { 
    domain: "youtube.com", 
    threshold: 15, // DEMO MODE (original: 300)
    path: "/shorts",
    messages: ["You've been watching shorts for too long!", "YouTube Shorts is a time sink! Stop now!"]
  },
  {
    domain: "facebook.com",
    threshold: 10, // DEMO MODE (original: 180)
    messages: ["Facebook again? When will you be productive?", "Stop scrolling Facebook! Get back to work!"]
  },
  {
    domain: "twitter.com",
    threshold: 10, // DEMO MODE (original: 180)
    messages: ["Twitter scrolling won't pay your bills!", "Stop wasting time on Twitter!"]
  },
  {
    domain: "x.com",
    threshold: 10, // DEMO MODE (original: 180)
    messages: ["Stop scrolling X! Get back to work!", "X can wait! Focus on your priorities!"]
  }
];

// Track user activity per tab
const tabActivity = new Map();

// Listen for tab updates
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    checkAndStartMonitoring(tabId, tab.url);
  }
});

// Listen for tab activation
chrome.tabs.onActivated.addListener((activeInfo) => {
  chrome.tabs.get(activeInfo.tabId, (tab) => {
    if (tab.url) {
      checkAndStartMonitoring(activeInfo.tabId, tab.url);
    }
  });
});

// Check if URL matches any bad habit and start monitoring
async function checkAndStartMonitoring(tabId, url) {
  try {
    const urlObj = new URL(url);
    const domain = urlObj.hostname.replace('www.', '');
    
    // Find matching habit rule
    const habit = BAD_HABITS.find(h => {
      const domainMatch = domain.includes(h.domain);
      const pathMatch = !h.path || urlObj.pathname.includes(h.path);
      return domainMatch && pathMatch;
    });
    
    if (habit) {
      // Get user sensitivity setting
      const settings = await chrome.storage.sync.get({ sensitivity: 'medium' });
      const multiplier = SENSITIVITY_MULTIPLIERS[settings.sensitivity] || 1.0;
      const adjustedThreshold = Math.round(habit.threshold * multiplier);
      
      // Track visit count for this domain
      const today = new Date().toDateString();
      const visitKey = `${domain}_${today}`;
      const currentCount = visitCounts.get(visitKey) || 0;
      visitCounts.set(visitKey, currentCount + 1);
      
      // Start monitoring this tab
      tabActivity.set(tabId, {
        startTime: Date.now(),
        url: url,
        domain: domain,
        habit: habit,
        threshold: adjustedThreshold, // Use adjusted threshold
        alerted: false,
        visitCount: currentCount + 1
      });
      
      console.log(`📊 Monitoring started for tab ${tabId}: ${domain}`);
      console.log(`   Visit #${currentCount + 1} today | Threshold: ${adjustedThreshold}s (${settings.sensitivity} sensitivity)`);
      
      // Set up alarm to check threshold
      chrome.alarms.create(`check_${tabId}`, {
        delayInMinutes: adjustedThreshold / 60,
        periodInMinutes: 0.5 // Check every 30 seconds after threshold
      });
    } else {
      // Stop monitoring if switched to a good site
      if (tabActivity.has(tabId)) {
        tabActivity.delete(tabId);
        chrome.alarms.clear(`check_${tabId}`);
        console.log(`Monitoring stopped for tab ${tabId}`);
      }
    }
  } catch (error) {
    console.error('Error parsing URL:', error);
  }
}

// Check tab activity periodically
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name.startsWith('check_')) {
    const tabId = parseInt(alarm.name.split('_')[1]);
    checkTabActivity(tabId);
  }
});

// Check if tab has exceeded threshold
async function checkTabActivity(tabId) {
  const activity = tabActivity.get(tabId);
  
  if (!activity || activity.alerted) {
    return;
  }
  
  const elapsedTime = (Date.now() - activity.startTime) / 1000; // seconds
  const threshold = activity.threshold || activity.habit.threshold; // Use adjusted threshold
  
  if (elapsedTime >= threshold) {
    console.log(`⚠️  Threshold exceeded for tab ${tabId}: ${elapsedTime.toFixed(1)}s (limit: ${threshold}s)`);
    
    // Mark as alerted to prevent multiple interventions
    activity.alerted = true;
    tabActivity.set(tabId, activity);
    
    // Trigger intervention
    await triggerIntervention(tabId, activity);
  }
}

// Trigger the intervention (voice + page block)
async function triggerIntervention(tabId, activity) {
  try {
    // Get user settings
    const settings = await chrome.storage.sync.get({
      voiceType: 'mom',
      enabled: true,
      volume: 0.8
    });
    
    if (!settings.enabled) {
      return;
    }
    
    const timeSpent = Math.floor((Date.now() - activity.startTime) / 1000);
    let message, audioFile;
    
    // 🚀 Use LLM to generate dynamic message
    if (USE_LLM) {
      try {
        console.log(`🧠 Requesting LLM intervention for ${activity.domain}...`);
        
        const response = await fetch(`${BACKEND_URL}/api/generate-intervention`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            site: activity.domain,
            timeSpent: timeSpent,
            visitCount: activity.visitCount || 1,
            currentTime: new Date().toLocaleTimeString('en-US', { 
              hour: '2-digit', 
              minute: '2-digit',
              hour12: false 
            }),
            voiceType: settings.voiceType || 'mom'  // Pass voice personality to LLM
          })
        });
        
        if (response.ok) {
          const data = await response.json();
          message = data.message;
          audioFile = data.audioFile;
          console.log(`✅ LLM generated: "${message}"`);
          console.log(`🎵 Using audio: ${audioFile}`);
        } else {
          throw new Error('Backend response not ok');
        }
      } catch (error) {
        console.error('⚠️ LLM API failed, using fallback:', error);
        // Fallback to fixed messages
        const messages = activity.habit.messages;
        message = messages[Math.floor(Math.random() * messages.length)];
        audioFile = 'mom-instagram-en.mp3';
      }
    } else {
      // Use fixed messages
      const messages = activity.habit.messages;
      message = messages[Math.floor(Math.random() * messages.length)];
      audioFile = 'mom-instagram-en.mp3';
    }
    
    // Send message to content script to show overlay and play voice
    chrome.tabs.sendMessage(tabId, {
      action: 'intervene',
      message: message,
      audioFile: audioFile,
      voiceType: settings.voiceType,
      domain: activity.domain,
      timeSpent: timeSpent
    });
    
    // Log event
    console.log(`🎯 Intervention triggered for ${activity.domain}: "${message}"`);
    
    // Save to history (for analytics later)
    saveInterventionHistory(activity, message);
    
    // Log to backend
    logInterventionToBackend(activity, message, timeSpent);
    
  } catch (error) {
    console.error('❌ Error triggering intervention:', error);
  }
}

// Save intervention history
async function saveInterventionHistory(activity, message) {
  const history = await chrome.storage.local.get({ interventions: [] });
  history.interventions.push({
    timestamp: Date.now(),
    domain: activity.domain,
    timeSpent: (Date.now() - activity.startTime) / 1000,
    message: message
  });
  
  // Keep only last 100 interventions
  if (history.interventions.length > 100) {
    history.interventions = history.interventions.slice(-100);
  }
  
  await chrome.storage.local.set({ interventions: history.interventions });
}

// Log intervention to backend (for analytics)
async function logInterventionToBackend(activity, message, timeSpent) {
  if (!USE_LLM) return;
  
  try {
    await fetch(`${BACKEND_URL}/api/log-intervention`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        domain: activity.domain,
        timeSpent: timeSpent,
        message: message,
        userResponse: 'pending'
      })
    });
  } catch (error) {
    console.error('Failed to log intervention to backend:', error);
  }
}

// Listen for messages from content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'userContinued') {
    // User clicked "Continue Anyway"
    const tabId = sender.tab.id;
    if (tabActivity.has(tabId)) {
      // Reset monitoring for this tab
      const activity = tabActivity.get(tabId);
      activity.startTime = Date.now();
      activity.alerted = false;
      tabActivity.set(tabId, activity);
    }
  } else if (message.action === 'userTookBreak') {
    // User agreed to take a break
    const tabId = sender.tab.id;
    chrome.tabs.remove(tabId);
  }
  
  return true;
});

// Clean up when tab is closed
chrome.tabs.onRemoved.addListener((tabId) => {
  tabActivity.delete(tabId);
  chrome.alarms.clear(`check_${tabId}`);
});

console.log('Habit Breaker extension loaded!');

