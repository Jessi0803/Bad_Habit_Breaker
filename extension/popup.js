// Habit Breaker - Popup Script
// 支援用戶偏好管理 + Clerk 真實整合

// Load settings on popup open
document.addEventListener('DOMContentLoaded', async () => {
  // Initialize Clerk
  console.log('🔐 Initializing Clerk authentication...');
  await clerkAuth.init();
  
  // Load saved settings
  const settings = await chrome.storage.sync.get({
    enabled: true,
    voiceType: 'mom',
    volume: 0.8,
    sensitivity: 'medium',
    userEmail: null,
    clerkUserId: null
  });
  
  // Set UI state
  document.getElementById('enabledToggle').checked = settings.enabled;
  
  // Set active voice button
  document.querySelectorAll('.voice-btn:not(.sensitivity-btn)').forEach(btn => {
    if (btn.dataset.voice === settings.voiceType) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
  
  // Set active sensitivity button
  document.querySelectorAll('.sensitivity-btn').forEach(btn => {
    if (btn.dataset.sensitivity === settings.sensitivity) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
  updateSensitivityDescription(settings.sensitivity);
  
  // Load user info from Clerk
  loadUserInfo(settings);
  
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

// Sensitivity selection
document.querySelectorAll('.sensitivity-btn').forEach(btn => {
  btn.addEventListener('click', async (e) => {
    // Update UI
    document.querySelectorAll('.sensitivity-btn').forEach(b => b.classList.remove('active'));
    e.target.classList.add('active');
    
    // Save setting
    const sensitivity = e.target.dataset.sensitivity;
    await chrome.storage.sync.set({ sensitivity });
    updateSensitivityDescription(sensitivity);
    console.log('Sensitivity set to:', sensitivity);
  });
});

// Update sensitivity description
function updateSensitivityDescription(sensitivity) {
  const descriptions = {
    low: 'Relaxed detection (30-60s)',
    medium: 'Balanced detection (10-15s)',
    high: 'Strict detection (5-10s)'
  };
  document.getElementById('sensitivityDesc').textContent = descriptions[sensitivity] || descriptions.medium;
}

// Load user info from Clerk
async function loadUserInfo(settings) {
  const loginBtn = document.getElementById('loginBtn');
  const userInfo = document.getElementById('userInfo');
  
  // Check Clerk login status
  const isSignedIn = clerkAuth.isSignedIn();
  const user = clerkAuth.getUser();
  
  if (isSignedIn && user) {
    // User is logged in via Clerk
    loginBtn.textContent = 'Sign Out';
    loginBtn.style.background = 'rgba(244, 67, 54, 0.3)';
    userInfo.style.display = 'block';
    
    const email = user.primary_email_address?.email_address || settings.userEmail || 'user@example.com';
    document.getElementById('userEmail').textContent = email;
    document.getElementById('userPlan').textContent = user.public_metadata?.plan || 'Free';
    
    console.log('✅ User logged in:', email);
  } else {
    // User not logged in
    loginBtn.textContent = 'Sign In';
    loginBtn.style.background = 'rgba(255, 255, 255, 0.3)';
    userInfo.style.display = 'none';
    console.log('ℹ️ User not logged in');
  }
}

// Login button with real Clerk integration
document.getElementById('loginBtn').addEventListener('click', async () => {
  const loginBtn = document.getElementById('loginBtn');
  
  if (clerkAuth.isSignedIn()) {
    // Sign out
    try {
      loginBtn.disabled = true;
      loginBtn.textContent = 'Signing out...';
      
      await clerkAuth.signOut();
      
      loginBtn.textContent = 'Sign In';
      loginBtn.style.background = 'rgba(255, 255, 255, 0.3)';
      document.getElementById('userInfo').style.display = 'none';
      
      console.log('✅ User signed out successfully');
    } catch (error) {
      console.error('❌ Sign out error:', error);
      alert('Sign out failed. Please try again.');
    } finally {
      loginBtn.disabled = false;
    }
  } else {
    // Sign in - Show prompt for email/password
    const email = prompt('Enter your email:');
    if (!email) return;
    
    const password = prompt('Enter your password:');
    if (!password) return;
    
    try {
      loginBtn.disabled = true;
      loginBtn.textContent = 'Signing in...';
      
      // Option 1: Use real Clerk API (需要設定 API key)
      if (CLERK_PUBLISHABLE_KEY && CLERK_PUBLISHABLE_KEY !== 'pk_test_REPLACE_WITH_YOUR_KEY') {
        const user = await clerkAuth.signIn(email, password);
        
        loginBtn.textContent = 'Sign Out';
        loginBtn.style.background = 'rgba(244, 67, 54, 0.3)';
        document.getElementById('userInfo').style.display = 'block';
        document.getElementById('userEmail').textContent = user.primary_email_address.email_address;
        
        console.log('✅ Clerk sign in successful:', user);
      } else {
        // Option 2: Demo mode (如果還沒設定 Clerk key)
        console.warn('⚠️  Clerk key not configured. Using demo mode.');
        
        await chrome.storage.sync.set({
          userEmail: email,
          clerkUserId: 'demo_' + Date.now(),
          userName: email.split('@')[0]
        });
        
        await chrome.storage.local.set({
          clerk_user: {
            primary_email_address: { email_address: email },
            id: 'demo_' + Date.now(),
            first_name: email.split('@')[0]
          }
        });
        
        loginBtn.textContent = 'Sign Out';
        loginBtn.style.background = 'rgba(244, 67, 54, 0.3)';
        document.getElementById('userInfo').style.display = 'block';
        document.getElementById('userEmail').textContent = email;
        
        alert('Demo login successful! \n\n🔧 To enable real Clerk:\n1. Get API key from clerk.com\n2. Update CLERK_PUBLISHABLE_KEY in clerk-config.js');
        
        console.log('ℹ️ Demo login successful. Set up Clerk key for production.');
      }
      
    } catch (error) {
      console.error('❌ Sign in error:', error);
      alert('Sign in failed: ' + error.message + '\n\nTrying demo mode...');
      
      // Fallback to demo
      await chrome.storage.sync.set({
        userEmail: email,
        clerkUserId: 'demo_' + Date.now()
      });
      
      loginBtn.textContent = 'Sign Out';
      document.getElementById('userInfo').style.display = 'block';
      document.getElementById('userEmail').textContent = email;
      
    } finally {
      loginBtn.disabled = false;
    }
  }
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

// ═══════════════════════════════════════════════════════════
// 🔮 Clerk Integration Ready
// ═══════════════════════════════════════════════════════════
// 黑客松當天可以用以下方式整合 Clerk:
// 
// 1. 安裝: npm install @clerk/chrome-extension
// 2. 設定: 在 manifest.json 加入 Clerk API key
// 3. 替換上面的 Demo login 為真實 Clerk 登入
// 
// 範例代碼:
// import Clerk from '@clerk/chrome-extension';
// const clerk = new Clerk(CLERK_API_KEY);
// await clerk.load();
// const user = await clerk.signIn.create({ ... });
// ═══════════════════════════════════════════════════════════

