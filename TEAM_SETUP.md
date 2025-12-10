# 🚀 團隊成員設置指南 (Team Setup Guide)

**For team members cloning this project from GitHub**

---

## 📦 快速開始 (5 分鐘)

### Step 1: 克隆專案

```bash
# 克隆倉庫
git clone git@github.com:Jessi0803/Bad_Habit_Breaker.git

# 進入專案目錄
cd Bad_Habit_Breaker
```

---

## 🔧 Backend 設置

### Step 2: 安裝 Node.js 依賴

```bash
# 進入 backend 目錄
cd backend

# 安裝所有依賴
npm install
```

**安裝的套件：**
- `express` - Web server
- `cors` - CORS handling
- `dotenv` - Environment variables
- `groq-sdk` - Groq LLM API
- `nodemailer` - Email sending
- `node-fetch` - HTTP requests

---

### Step 3: 配置環境變數 (重要！)

創建 `.env` 檔案：

```bash
# 在 backend 目錄下
touch .env
```

**編輯 `.env` 檔案，加入以下內容：**

```bash
# ========================================
# 🧠 Groq LLM API Key (必須)
# ========================================
# 取得位置: https://console.groq.com/keys
GROQ_API_KEY=gsk_your_groq_api_key_here

# ========================================
# 🎙️ ElevenLabs API Key (可選，用於動態語音)
# ========================================
# 取得位置: https://elevenlabs.io/app/settings/api-keys
# 如果沒有此 key，會使用預先生成的 MP3 檔案
ELEVENLABS_API_KEY=your_elevenlabs_api_key_here

# ========================================
# 📧 Email 設定 (可選，用於發送每日報告)
# ========================================
# Gmail App Password 教學: https://support.google.com/accounts/answer/185833
EMAIL_USER=your.email@gmail.com
EMAIL_PASSWORD=your_gmail_app_password

# ========================================
# 🔧 Server 設定
# ========================================
PORT=3000
NODE_ENV=development
```

---

### 📝 如何取得 API Keys？

#### 1️⃣ **Groq API Key** (必須，免費)

1. 訪問：https://console.groq.com/keys
2. 登入或註冊帳號（免費）
3. 點擊 "Create API Key"
4. 複製 key（格式：`gsk_...`）
5. 貼到 `.env` 的 `GROQ_API_KEY`

**優點：**
- ✅ 完全免費
- ✅ 速度極快
- ✅ 無配額限制（合理使用內）

---

#### 2️⃣ **ElevenLabs API Key** (可選)

**選項 A: 使用預先生成的音檔（推薦給測試）**
- 不需要 API Key
- 使用 `extension/assets/voices/*.mp3`
- 已包含 10 個音檔

**選項 B: 啟用動態語音生成**
1. 訪問：https://elevenlabs.io/app/settings/api-keys
2. 註冊帳號
3. 免費方案：10,000 字符/月（約 200 次干預）
4. 付費方案（$22/月）：100,000 字符/月
5. 複製 API Key
6. 貼到 `.env` 的 `ELEVENLABS_API_KEY`

**如果沒有配置：**
- ✅ Extension 仍正常運作
- ✅ 使用預先生成的 MP3 檔案
- ❌ 無法即時生成與 LLM 文字匹配的語音

---

#### 3️⃣ **Gmail App Password** (可選，用於 Email 報告)

1. 訪問：https://myaccount.google.com/apppasswords
2. 選擇應用：「郵件」
3. 選擇裝置：「其他」，輸入 "Habit Breaker"
4. 點擊「產生」
5. 複製 16 位密碼（格式：`xxxx xxxx xxxx xxxx`）
6. 貼到 `.env` 的 `EMAIL_PASSWORD`

**如果沒有配置：**
- ✅ Extension 仍正常運作
- ❌ 無法發送每日報告 Email

---

### Step 4: 啟動 Backend

```bash
# 確保在 backend 目錄
cd backend

# 啟動 server
node server.js
```

**成功啟動會看到：**

```
🚀 ═══════════════════════════════════════════════
   Habit Breaker API Server
   ═══════════════════════════════════════════════
   Status: ✅ Running on port 3000
   Health: http://localhost:3000/health

   🧠 AI Features:
      • Groq LLM: ✅ Integrated
      • Dynamic Messages: ✅ Enabled
      • Behavior Analysis: ✅ Ready

   📡 API Endpoints:
      POST /api/generate-intervention
      POST /api/should-intervene
      POST /api/log-intervention
      GET  /api/stats
      POST /api/daily-report
      POST /api/send-email-report
      GET  /api/test-email

   📧 Email Status:
      ✅ Configured & Ready (如果有配置)
   ═══════════════════════════════════════════════
```

---

### Step 5: 測試 Backend

**開新終端機，執行：**

```bash
# 測試 Health Check
curl http://localhost:3000/health

# 預期輸出：
# {"status":"ok","message":"Habit Breaker API is running",...}

# 測試 LLM 干預生成
curl -X POST http://localhost:3000/api/generate-intervention \
  -H "Content-Type: application/json" \
  -d '{
    "site": "instagram.com",
    "timeSpent": 30,
    "todayTotalTime": 120,
    "visitCount": 2,
    "currentTime": "14:30",
    "voiceType": "mom",
    "useDynamicVoice": false
  }'

# 預期輸出：
# {
#   "success": true,
#   "message": "Second visit to Instagram? Your goals won't wait forever.",
#   "audioFile": "mom_instagram.mp3",
#   "severity": "medium",
#   "generatedBy": "groq-llama-3.3-70b"
# }
```

**如果看到成功輸出 → Backend 設置完成！✅**

---

## 🔌 Chrome Extension 設置

### Step 6: 載入 Extension

1. **打開 Chrome Extensions 頁面**
   ```
   在網址列輸入：chrome://extensions
   按 Enter
   ```

2. **啟用開發者模式**
   - 右上角打開「開發人員模式」開關

3. **載入未封裝項目**
   - 點擊左上角「載入未封裝項目」
   - 選擇資料夾：`/路徑/Bad_Habit_Breaker/extension`
   - 點擊「選取」

4. **確認載入成功**
   - 看到 "Habit Breaker" Extension
   - 沒有紅色錯誤訊息
   - 看到 "service worker" 藍色連結

---

### Step 7: 配置 Extension

1. **點擊 Extension 圖示**
   - Chrome 工具列右上角

2. **選擇語音人格**
   - 👩 Mom (溫柔提醒)
   - ⭐ Idol (激勵)
   - 💪 Coach (嚴厲)
   - 🇬🇧 Churchill (英國首相風格，推薦給評審展示)

3. **調整靈敏度**
   - High: 5-10 秒觸發
   - Medium: 10-15 秒（預設）
   - Low: 30-60 秒

---

### Step 8: 測試完整流程

1. **確保 Backend 正在運行**
   ```bash
   # 在 backend 目錄
   node server.js
   ```

2. **訪問測試網站**
   - 開新分頁
   - 訪問 `instagram.com` 或 `facebook.com`
   - **保持在該分頁**
   - 等待 10-15 秒

3. **預期結果**
   - ✅ 干預畫面跳出
   - ✅ 顯示中英對照訊息
   - ✅ 顯示累計時間（如果有）
   - ✅ 自動播放語音

4. **檢查 Console**
   - **Service Worker Console**: `chrome://extensions` → "service worker"
   - 應該看到：
     ```
     📊 Loaded daily tracking: {}
     Monitoring started for tab ...
     ⏱️ instagram.com: +15s (total today: 0m 15s)
     🧠 Requesting LLM intervention...
     ✅ LLM generated: "..."
     ```

---

## 🐛 常見問題

### ❌ 問題 1: `npm install` 失敗

**錯誤訊息：**
```
npm ERR! code EPERM
npm ERR! Your cache folder contains root-owned files
```

**解決方案：**
```bash
sudo chown -R $(whoami) ~/.npm
npm install
```

---

### ❌ 問題 2: Backend 無法啟動

**錯誤訊息：**
```
Error: Cannot find module 'express'
```

**解決方案：**
```bash
cd backend
rm -rf node_modules package-lock.json
npm install
node server.js
```

---

### ❌ 問題 3: Port 3000 已被佔用

**錯誤訊息：**
```
Error: listen EADDRINUSE: address already in use :::3000
```

**解決方案：**
```bash
# 停止舊的 server
pkill -f "node server.js"

# 或者使用不同的 port
PORT=3001 node server.js
```

**如果使用不同 port，需要更新 Extension：**
```javascript
// extension/background.js (第 5 行)
const BACKEND_URL = 'http://localhost:3001';  // 改成新的 port
```

---

### ❌ 問題 4: LLM API 失敗

**錯誤訊息（Backend Console）：**
```
❌ Error generating intervention: 401 Unauthorized
```

**原因：** Groq API Key 無效或未設置

**解決方案：**
1. 檢查 `.env` 檔案是否存在
2. 確認 `GROQ_API_KEY` 正確
3. 重新啟動 Backend

```bash
# 檢查 .env
cat backend/.env

# 應該看到：
# GROQ_API_KEY=gsk_...

# 重啟 server
pkill -f "node server.js"
node server.js
```

---

### ❌ 問題 5: Extension 不跳出干預

**可能原因和解決方案：**

**原因 1: Backend 沒運行**
```bash
# 測試
curl http://localhost:3000/health

# 如果失敗，啟動 backend
cd backend && node server.js
```

**原因 2: Extension 沒完全載入**
```
1. chrome://extensions
2. 找到 Habit Breaker
3. 點擊 🔄 重新載入
4. 關閉所有測試分頁
5. 開新分頁測試
```

**原因 3: 等待時間不夠**
- 確保在分頁上停留 **至少 15 秒**
- 不要切換分頁

**原因 4: 網站不在監控列表**
- 目前監控：Instagram, Facebook, YouTube, TikTok, Amazon, Twitter/X
- 其他網站不會觸發

---

### ❌ 問題 6: 語音不播放

**解決方案：**

1. **檢查音檔存在**
   ```bash
   ls extension/assets/voices/
   # 應該看到 10 個 .mp3 檔案
   ```

2. **瀏覽器自動播放限制**
   - 在頁面上點擊或滾動一下
   - 這會"解鎖"音訊播放權限

3. **檢查系統音量**
   - 音量 > 0
   - Chrome 未靜音

---

## 📚 專案結構說明

```
Bad_Habit_Breaker/
├── backend/                    # Node.js Backend
│   ├── server.js              # Express server (主程式)
│   ├── llm-service-groq.js    # Groq LLM 整合
│   ├── daily-report-service.js # 每日報告生成
│   ├── email-service.js       # Email 發送
│   ├── elevenlabs-integration.js # ElevenLabs TTS
│   ├── package.json           # 依賴列表
│   └── .env                   # 環境變數 (需自己創建)
│
├── extension/                 # Chrome Extension
│   ├── manifest.json          # Extension 設定
│   ├── background.js          # Service Worker (監控邏輯)
│   ├── content.js             # Content Script (UI)
│   ├── popup.html/js          # Extension Popup
│   ├── styles.css             # UI 樣式
│   └── assets/
│       ├── voices/*.mp3       # 預先生成的語音檔
│       └── images/*.jpg       # Churchill 照片
│
├── README.md                  # 專案主說明
├── README_COMPLETE.md         # 完整功能文檔
├── TEAM_SETUP.md             # 本檔案（團隊設置指南）
└── .gitignore                # Git 忽略檔案
```

---

## 🎯 開發工作流程

### 團隊協作建議

**前端開發者：**
```bash
# 專注於 Extension
cd extension

# 修改後重新載入
chrome://extensions → 🔄 重新載入
```

**後端開發者：**
```bash
# 專注於 Backend API
cd backend

# 修改後重啟
pkill -f "node server.js"
node server.js

# 測試 API
curl -X POST http://localhost:3000/api/generate-intervention ...
```

**測試與整合：**
```bash
# 同時啟動 Backend
cd backend && node server.js

# 開新終端機測試整合
curl http://localhost:3000/health
# 然後在 Chrome 測試 Extension
```

---

## 🔄 Git 工作流程

### 獲取最新程式碼

```bash
# 拉取最新變更
git pull origin main

# 重新安裝依賴（如果 package.json 有更新）
cd backend
npm install
```

### 提交你的變更

```bash
# 查看變更
git status

# 添加檔案
git add .

# 提交
git commit -m "描述你的變更"

# 推送
git push origin main
```

---

## 📧 聯絡與支援

**遇到問題？**

1. **檢查本指南的「常見問題」章節**
2. **查看 Backend Console 錯誤訊息**
3. **查看 Extension Service Worker Console**
4. **聯絡團隊其他成員**

**重要檔案：**
- `README_COMPLETE.md` - 完整功能說明
- `backend/EMAIL_CONFIG.md` - Email 設定詳細指南
- `N8N_DAILY_REPORT.md` - n8n 整合說明

---

## ✅ 設置完成檢查清單

- [ ] Git clone 完成
- [ ] Node.js 依賴已安裝 (`npm install`)
- [ ] `.env` 檔案已創建並配置
- [ ] Groq API Key 已設置
- [ ] Backend 成功啟動
- [ ] Backend health check 通過
- [ ] Chrome Extension 已載入
- [ ] 測試干預功能成功
- [ ] 語音播放正常

**全部打勾 → 你可以開始開發了！** 🎉

---

## 🚀 快速指令參考

```bash
# 啟動 Backend
cd backend && node server.js

# 測試 Backend
curl http://localhost:3000/health

# 測試 LLM API
curl -X POST http://localhost:3000/api/generate-intervention \
  -H "Content-Type: application/json" \
  -d '{"site":"instagram.com","timeSpent":30,"visitCount":1,"voiceType":"mom"}'

# 重啟 Backend
pkill -f "node server.js" && sleep 2 && node server.js

# 拉取最新程式碼
git pull origin main

# 重新載入 Extension
# chrome://extensions → 🔄 重新載入

# 檢查 Extension Console
# chrome://extensions → "service worker" 連結
```

---

## 🎬 Demo 準備

**黑客松展示前：**

1. ✅ Backend 運行中
2. ✅ Extension 已載入
3. ✅ 選擇 Churchill 語音（給英國評審）
4. ✅ 測試 Instagram/Facebook 干預
5. ✅ 確認累計時間功能正常
6. ✅ 確認語音播放正常

**展示流程：**
1. 說明專案概念
2. 展示 Extension 設定
3. 訪問 Instagram，等待干預
4. 指出累計時間功能
5. 按 Continue，再次訪問，展示累計
6. 強調 LLM 動態生成 + ElevenLabs 語音

---

**Good luck! 🚀**

有問題隨時問！

