// Habit Breaker - Background Service Worker
// Monitors user behavior and triggers interventions

// Configuration
const BAD_HABITS = [
  { 
    domain: "instagram.com", 
    threshold: 10, // seconds - DEMO MODE (original: 120)
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
function checkAndStartMonitoring(tabId, url) {
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
      // Start monitoring this tab
      tabActivity.set(tabId, {
        startTime: Date.now(),
        url: url,
        domain: domain,
        habit: habit,
        alerted: false
      });
      
      console.log(`Monitoring started for tab ${tabId}: ${domain}`);
      
      // Set up alarm to check threshold
      chrome.alarms.create(`check_${tabId}`, {
        delayInMinutes: habit.threshold / 60,
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
  
  if (elapsedTime >= activity.habit.threshold) {
    console.log(`Threshold exceeded for tab ${tabId}: ${elapsedTime}s`);
    
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
    
    // Pick a random message
    const messages = activity.habit.messages;
    const message = messages[Math.floor(Math.random() * messages.length)];
    
    // Send message to content script to show overlay and play voice
    chrome.tabs.sendMessage(tabId, {
      action: 'intervene',
      message: message,
      voiceType: settings.voiceType,
      domain: activity.domain,
      timeSpent: Math.floor((Date.now() - activity.startTime) / 1000)
    });
    
    // Log event
    console.log(`Intervention triggered for ${activity.domain}: "${message}"`);
    
    // Save to history (for analytics later)
    saveInterventionHistory(activity, message);
    
  } catch (error) {
    console.error('Error triggering intervention:', error);
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

