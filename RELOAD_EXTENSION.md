# 🔄 Extension 完整重新載入步驟

## 問題：語音還是舊的

### 原因
- Extension 可能有緩存
- 設定沒有正確保存
- Service Worker 沒有重啟

---

## ✅ 解決方案（按順序執行）

### Step 1: 完全移除 Extension

1. **打開 Extensions 頁面**
   ```
   chrome://extensions
   ```

2. **移除 Habit Breaker**
   - 找到 Habit Breaker
   - 點擊「移除」按鈕
   - 確認移除

### Step 2: 清除瀏覽器緩存（可選但推薦）

1. **打開開發者工具**
   ```
   Command + Option + I (Mac)
   或
   F12 (Windows)
   ```

2. **右鍵點擊重新整理按鈕**
   - 選擇「清空快取並強制重新整理」

### Step 3: 重新載入 Extension

1. **再次打開**
   ```
   chrome://extensions
   ```

2. **啟用開發者模式**
   - 右上角開關打開

3. **載入未封裝項目**
   - 點擊「載入未封裝項目」
   - 選擇資料夾：`/Users/jc/Desktop/Habit_Breaker/extension`
   - 點擊「選擇」

### Step 4: 檢查 Service Worker

1. **在 Extension 卡片上找到「Service Worker」**
   - 點擊「service worker」連結
   - 會打開 DevTools

2. **在 Console 中輸入並執行**
   ```javascript
   chrome.storage.sync.get(['voiceType'], (result) => {
     console.log('Current voiceType:', result.voiceType);
   });
   ```

### Step 5: 設定 Churchill 語音

1. **點擊 Extension 圖示**
   - 打開 Popup

2. **選擇 🇬🇧 Churchill**
   - 確認按鈕變成紫色

3. **再次檢查 Service Worker Console**
   ```javascript
   chrome.storage.sync.get(['voiceType'], (result) => {
     console.log('Updated voiceType:', result.voiceType);
   });
   ```
   - 應該顯示：`voiceType: "churchill"`

### Step 6: 測試

1. **打開新分頁**
   - 訪問 instagram.com 或 facebook.com

2. **打開該頁面的 Console**
   ```
   Command + Option + J (Mac)
   或
   F12 (Windows)
   ```

3. **等待 10-15 秒**

4. **檢查 Console 輸出**
   - 應該看到：
     ```
     🔊 Attempting to play audio file: churchill_instagram.mp3
     🎵 Audio URL: chrome-extension://xxxxx/assets/voices/churchill_instagram.mp3
     ```

5. **聽語音**
   - 應該聽到英國口音！

---

## 🐛 如果還是不行

### Debug 方式

#### 檢查 1: Backend 是否返回正確的 audioFile

在 Service Worker Console 執行：
```javascript
fetch('http://localhost:3000/api/generate-intervention', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    site: 'instagram.com',
    timeSpent: 30,
    visitCount: 2,
    currentTime: '14:30',
    voiceType: 'churchill'
  })
}).then(r => r.json()).then(console.log);
```

**預期輸出：**
```json
{
  "success": true,
  "message": "...",
  "audioFile": "churchill_instagram.mp3"
}
```

#### 檢查 2: 語音檔案是否存在

在終端機執行：
```bash
ls -lh /Users/jc/Desktop/Habit_Breaker/extension/assets/voices/churchill*.mp3
```

應該看到 4 個檔案。

#### 檢查 3: Extension 是否能訪問檔案

在頁面 Console 執行：
```javascript
const audioUrl = chrome.runtime.getURL('assets/voices/churchill_instagram.mp3');
console.log('Audio URL:', audioUrl);

// 嘗試載入
const audio = new Audio(audioUrl);
audio.play().then(() => {
  console.log('✅ Audio loaded and playing!');
}).catch(err => {
  console.error('❌ Audio failed:', err);
});
```

---

## 💡 常見問題

### Q: 為什麼需要完全移除再重新載入？
A: Service Worker 和緩存可能卡住舊的設定。

### Q: 可以只按「重新載入」圖示嗎？
A: 可以試試，但完全移除更保險。

### Q: 語音檔案路徑對嗎？
A: 應該是 `assets/voices/churchill_instagram.mp3`（不是 `churchill-instagram.mp3`）

---

## ✅ 成功標誌

當一切正常時，你會看到：

**Service Worker Console:**
```
📊 Generating intervention for instagram.com (30s, visit #2, voice: churchill)
✅ LLM generated: "We shall never surrender to distraction!"
🎵 Using audio: churchill_instagram.mp3
```

**頁面 Console:**
```
🔊 Attempting to play audio file: churchill_instagram.mp3
🎵 Audio URL: chrome-extension://xxxxx/assets/voices/churchill_instagram.mp3
✅ Audio strategy 1 succeeded
```

**你會聽到：**
🇬🇧 **英國口音**的邱吉爾風格訓話！

---

Good luck! 🚀

