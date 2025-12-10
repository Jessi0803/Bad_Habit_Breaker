// Habit Breaker - Content Script
// Runs on every page and handles interventions

let interventionActive = false;
let globalAudioContext = null;

// 預先初始化 Audio Context (提高自動播放成功率)
function initAudioContext() {
  try {
    globalAudioContext = new (window.AudioContext || window.webkitAudioContext)();
    console.log('🎵 Audio Context initialized');
  } catch (e) {
    console.log('⚠️ Could not initialize Audio Context');
  }
}

// 頁面載入時初始化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAudioContext);
} else {
  initAudioContext();
}

// 監聽用戶互動來"解鎖"音訊播放能力
let audioUnlocked = false;

function unlockAudio() {
  if (audioUnlocked) return;
  
  // 策略: 播放一個超短的靜音音訊來獲得播放權限
  const silentAudio = new Audio();
  silentAudio.src = 'data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4LjI5LjEwMAAAAAAAAAAAAAAA//tQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAACAAADhAC7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7//////////////////////////////////////////////////////////////////8AAAAATGF2YzU4LjU0AAAAAAAAAAAAAAAAJAAAAAAAAAAAA4S+FwBz//sQZAAP8AAAaQAAAAgAAA0gAAABAAABpAAAACAAADSAAAAETEFNRTMuMTAwVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/7UGQAD/AAAAaQAAAAgAAA0gAAABAAABpAAAACAAADSAAAAEVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVU=';
  silentAudio.volume = 0.01;
  silentAudio.play()
    .then(() => {
      audioUnlocked = true;
      console.log('🔓 Audio unlocked! Autoplay should work now.');
    })
    .catch(() => {
      console.log('⚠️ Still locked, will try on next interaction');
    });
  
  // Resume Audio Context
  if (globalAudioContext && globalAudioContext.state === 'suspended') {
    globalAudioContext.resume().then(() => {
      console.log('🔊 Audio Context resumed');
    });
  }
}

// 監聽多種用戶互動事件
['click', 'touchstart', 'keydown', 'scroll'].forEach(event => {
  document.addEventListener(event, unlockAudio, { once: true, capture: true, passive: true });
});

// Listen for intervention messages from background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'intervene' && !interventionActive) {
    interventionActive = true;
    showIntervention(message);
  }
  return true;
});

// Show intervention overlay and play voice
function showIntervention(data) {
  // Create overlay
  const overlay = document.createElement('div');
  overlay.id = 'habit-breaker-overlay';
  overlay.innerHTML = `
    <div class="habit-breaker-modal">
      <div class="habit-breaker-icon">🚫</div>
      <h1 class="habit-breaker-title">Hold On!</h1>
      <p class="habit-breaker-message">${escapeHtml(data.message)}</p>
      <div class="habit-breaker-stats">
        <p>You've been on <strong>${escapeHtml(data.domain)}</strong></p>
        <p>for <strong>${data.timeSpent} seconds</strong></p>
      </div>
      <div class="habit-breaker-buttons">
        <button id="habit-breaker-break" class="btn-primary">
          ✅ Take a Break
        </button>
        <button id="habit-breaker-continue" class="btn-secondary">
          ⏭️ Continue Anyway
        </button>
      </div>
    </div>
  `;
  
  document.body.appendChild(overlay);
  
  // Play voice with multiple fallback strategies
  // Use audioFile from backend if available, otherwise fallback to selection logic
  const audioFile = data.audioFile || selectAudioFile(data.message, data.domain);
  playVoiceWithFallback(audioFile, data.message);
  
  // Add event listeners
  document.getElementById('habit-breaker-break').addEventListener('click', () => {
    chrome.runtime.sendMessage({ action: 'userTookBreak' });
    removeOverlay();
  });
  
  document.getElementById('habit-breaker-continue').addEventListener('click', () => {
    chrome.runtime.sendMessage({ action: 'userContinued' });
    removeOverlay();
  });
  
  // Blur the page content
  document.body.classList.add('habit-breaker-blur');
}

// 多重策略播放語音，嘗試繞過自動播放限制
function playVoiceWithFallback(audioFile, message) {
  console.log('🔊 Attempting to play audio file:', audioFile);
  console.log('📝 Message:', message);
  
  // 構建音檔 URL
  const audioUrl = chrome.runtime.getURL(`assets/voices/${audioFile}`);
  
  console.log('🎵 Audio URL:', audioUrl);
  
  let playedSuccessfully = false;
  
  // 策略 1: 直接播放 (可能被阻擋)
  tryDirectPlay(audioUrl).then(success => {
    if (success) playedSuccessfully = true;
  });
  
  // 策略 2: Muted 播放再 unmute (常用技巧)
  setTimeout(() => {
    if (!playedSuccessfully) {
      tryMutedPlay(audioUrl).then(success => {
        if (success) playedSuccessfully = true;
      });
    }
  }, 100);
  
  // 策略 3: 使用 Web Audio API (更底層)
  setTimeout(() => {
    if (!playedSuccessfully) {
      tryWebAudioAPI(audioUrl).then(success => {
        if (success) playedSuccessfully = true;
      });
    }
  }, 200);
  
  // 如果都失敗，顯示點擊提示播放
  setTimeout(() => {
    if (!playedSuccessfully && !audioUnlocked) {
      showAudioPrompt(audioUrl, message);
    }
  }, 500);
}

// 選擇對應的語音檔案
function selectAudioFile(message, domain) {
  const messageMap = {
    'Instagram can wait! You have important things to do!': 'mom-instagram-en.mp3',
    'Stop scrolling and get back to work!': 'mom-instagram-en.mp3',
    'Do you really need to buy more stuff?': 'mom-shopping-en.mp3',
    'Shopping again? Think about your budget!': 'mom-shopping-en.mp3',
    'Facebook again? When will you be productive?': 'mom-facebook-en.mp3',
    'Stop scrolling Facebook! Get back to work!': 'mom-facebook-en.mp3',
    'Stop scrolling TikTok! Your time is precious!': 'coach-tiktok-en.mp3',
    'TikTok can wait! Focus on what matters!': 'coach-tiktok-en.mp3'
  };
  
  if (messageMap[message]) return messageMap[message];
  
  // Domain fallback
  if (domain.includes('instagram')) return 'mom-instagram-en.mp3';
  if (domain.includes('amazon')) return 'mom-shopping-en.mp3';
  if (domain.includes('facebook')) return 'mom-facebook-en.mp3';
  if (domain.includes('tiktok')) return 'coach-tiktok-en.mp3';
  if (domain.includes('twitter') || domain.includes('x.com')) return 'mom-facebook-en.mp3';
  if (domain.includes('youtube')) return 'coach-tiktok-en.mp3';
  
  return 'mom-instagram-en.mp3';
}

// 策略 1: 直接播放
function tryDirectPlay(audioUrl) {
  return new Promise((resolve) => {
    const audio = new Audio(audioUrl);
    audio.volume = 1.0;
    
    audio.play()
      .then(() => {
        console.log('✅ Strategy 1 SUCCESS: Direct play worked!');
        resolve(true);
      })
      .catch(err => {
        console.log('⚠️ Strategy 1 failed:', err.message);
        resolve(false);
      });
  });
}

// 策略 2: Muted play then unmute (繞過自動播放限制的常用技巧)
function tryMutedPlay(audioUrl) {
  return new Promise((resolve) => {
    const audio = new Audio(audioUrl);
    audio.muted = true; // 先靜音
    audio.volume = 1.0;
    
    audio.play()
      .then(() => {
        console.log('✅ Strategy 2: Muted play started, unmuting...');
        // 立刻取消靜音
        setTimeout(() => {
          audio.muted = false;
          console.log('🔊 Strategy 2 SUCCESS: Audio unmuted and playing!');
        }, 100);
        resolve(true);
      })
      .catch(err => {
        console.log('⚠️ Strategy 2 failed:', err.message);
        resolve(false);
      });
  });
}

// 策略 3: 使用 Web Audio API (更底層的控制)
async function tryWebAudioAPI(audioUrl) {
  try {
    if (!globalAudioContext) {
      globalAudioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    
    // 嘗試 resume context
    if (globalAudioContext.state === 'suspended') {
      await globalAudioContext.resume();
    }
    
    const response = await fetch(audioUrl);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await globalAudioContext.decodeAudioData(arrayBuffer);
    
    const source = globalAudioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(globalAudioContext.destination);
    source.start(0);
    
    console.log('✅ Strategy 3 SUCCESS: Web Audio API playing!');
    return true;
    
  } catch (err) {
    console.log('⚠️ Strategy 3 failed:', err.message);
    return false;
  }
}

// 顯示音訊播放提示（當自動播放失敗時）
function showAudioPrompt(audioUrl, message) {
  console.log('🎤 Showing audio prompt to user');
  
  // 在介入視窗中添加一個閃爍的音訊圖示
  const modal = document.querySelector('.habit-breaker-modal');
  if (!modal) return;
  
  const audioPrompt = document.createElement('div');
  audioPrompt.className = 'audio-prompt';
  audioPrompt.innerHTML = `
    <div class="audio-prompt-icon">🔊</div>
    <div class="audio-prompt-text">Click to hear message</div>
  `;
  
  // 插入到訊息下方
  const messageEl = modal.querySelector('.habit-breaker-message');
  if (messageEl) {
    messageEl.after(audioPrompt);
    
    // 點擊播放
    audioPrompt.addEventListener('click', () => {
      const audio = new Audio(audioUrl);
      audio.volume = 1.0;
      audio.play()
        .then(() => {
          console.log('🔊 Audio played after user click!');
          audioPrompt.remove();
        })
        .catch(err => console.error('Still failed:', err));
    });
  }
}

// Remove intervention overlay
function removeOverlay() {
  const overlay = document.getElementById('habit-breaker-overlay');
  if (overlay) {
    overlay.remove();
  }
  document.body.classList.remove('habit-breaker-blur');
  interventionActive = false;
}

// Helper function to escape HTML
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Track scroll behavior (for more sophisticated detection)
let scrollCount = 0;
let lastScrollTime = Date.now();

window.addEventListener('scroll', () => {
  const now = Date.now();
  if (now - lastScrollTime < 100) {
    scrollCount++;
  } else {
    scrollCount = 0;
  }
  lastScrollTime = now;
  
  // Rapid scrolling detected (could be doom scrolling)
  if (scrollCount > 50) {
    // Could send this info to background script for smarter detection
    console.log('Rapid scrolling detected');
    scrollCount = 0;
  }
});

console.log('Habit Breaker content script loaded');

