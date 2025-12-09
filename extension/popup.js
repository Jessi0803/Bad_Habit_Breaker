// Habit Breaker - Popup Script

// Load settings on popup open
document.addEventListener('DOMContentLoaded', async () => {
  // Load saved settings
  const settings = await chrome.storage.sync.get({
    enabled: true,
    voiceType: 'mom',
    volume: 0.8
  });
  
  // Set UI state
  document.getElementById('enabledToggle').checked = settings.enabled;
  
  // Set active voice button
  const voiceButtons = document.querySelectorAll('.voice-btn');
  voiceButtons.forEach(btn => {
    if (btn.dataset.voice === settings.voiceType) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
  
  // Load stats
  loadStats();
});

// Save enabled/disabled state
document.getElementById('enabledToggle').addEventListener('change', async (e) => {
  await chrome.storage.sync.set({ enabled: e.target.checked });
  console.log('Habit Breaker', e.target.checked ? 'enabled' : 'disabled');
});

// Voice type selection
document.querySelectorAll('.voice-btn').forEach(btn => {
  btn.addEventListener('click', async (e) => {
    // Update UI
    document.querySelectorAll('.voice-btn').forEach(b => b.classList.remove('active'));
    e.target.classList.add('active');
    
    // Save setting
    const voiceType = e.target.dataset.voice;
    await chrome.storage.sync.set({ voiceType });
    console.log('Voice type set to:', voiceType);
  });
});

// Test voice button
document.getElementById('testBtn').addEventListener('click', async () => {
  const settings = await chrome.storage.sync.get({
    voiceType: 'mom'
  });
  
  const testMessages = {
    mom: '小明！不要再分心了！專心做你的事情！',
    idol: 'Hey! I believe in you, but you need to focus now!',
    coach: 'Come on! Champions don\'t waste time scrolling. Get back to work!'
  };
  
  const message = testMessages[settings.voiceType];
  
  // Use Web Speech API for testing
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(message);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 0.8;
    speechSynthesis.speak(utterance);
  }
  
  // Show feedback
  const btn = document.getElementById('testBtn');
  const originalText = btn.textContent;
  btn.textContent = '✓ Playing...';
  btn.disabled = true;
  
  setTimeout(() => {
    btn.textContent = originalText;
    btn.disabled = false;
  }, 2000);
});

// Load and display stats
async function loadStats() {
  const data = await chrome.storage.local.get({ interventions: [] });
  const interventions = data.interventions;
  
  // Filter today's interventions
  const today = new Date().setHours(0, 0, 0, 0);
  const todayInterventions = interventions.filter(i => i.timestamp >= today);
  
  // Calculate stats
  const count = todayInterventions.length;
  const timeSaved = Math.round(todayInterventions.reduce((sum, i) => sum + i.timeSpent, 0) / 60);
  
  // Find most blocked domain
  const domainCounts = {};
  todayInterventions.forEach(i => {
    domainCounts[i.domain] = (domainCounts[i.domain] || 0) + 1;
  });
  
  const mostBlocked = Object.keys(domainCounts).length > 0
    ? Object.entries(domainCounts).sort((a, b) => b[1] - a[1])[0][0]
    : '-';
  
  // Update UI
  document.getElementById('interventionCount').textContent = count;
  document.getElementById('timeSaved').textContent = `${timeSaved} min`;
  document.getElementById('mostBlocked').textContent = mostBlocked;
}

