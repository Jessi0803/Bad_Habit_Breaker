# 🚀 團隊成員設置指南 (Team Setup Guide)

**For team members cloning this project from GitHub**

---

## 📦 快速開始 (3 分鐘)

**🎉 超簡單！所有 API Keys 已配置好，直接複製貼上即可！**

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

**✨ 團隊成員專用：直接複製以下內容到 `.env` 檔案！**

**編輯 `.env` 檔案，貼上以下完整配置：**

```bash
# ========================================
# 🚀 Habit Breaker - Team Shared Configuration
# 團隊共用配置（Hackathon 專用）
# ========================================

# ========================================
# 🧠 Groq LLM API Key (必須 / Required)
# ========================================
# 團隊共用 Key - 請向 Jessi 索取！
# Team shared key - Ask Jessi for the key!
GROQ_API_KEY=ask_jessi_for_groq_key

# ========================================
# 🎙️ ElevenLabs API Key (已配置 / Configured)
# ========================================
# 團隊共用 Key（Creator 方案）
# Team shared key (Creator plan)
# 請向 Jessi 索取！Ask Jessi!
ELEVENLABS_API_KEY=ask_jessi_for_elevenlabs_key

# ========================================
# 📧 Email Settings (已配置 / Configured)
# ========================================
# 團隊共用 Gmail - 請向 Jessi 索取！
# Team shared Gmail - Ask Jessi!
EMAIL_USER=ask_jessi
EMAIL_PASSWORD=ask_jessi

# ========================================
# 🔧 Server Configuration
# ========================================
PORT=3000
NODE_ENV=development
```

**📧 請向 Jessi 索取完整的 API Keys！**

**為什麼不直接放在 GitHub？**
- 🔒 安全考量（API Keys 不應公開）
- 🛡️ GitHub 會阻止包含 secrets 的推送
- ✅ 私密分享更安全

**如何獲取：**
- 透過 Slack/Discord/Line 直接向 Jessi 索取
- Jessi 會提供完整的 `.env` 配置
- 複製貼上即可使用

---

### 💡 關於共用 API Keys

**✅ 優點：**
- 不需要自己申請帳號
- 立即可用，節省設置時間
- 統一配置，避免錯誤
- 適合 Hackathon 團隊協作

**⚠️ 注意事項：**
- 這些是團隊共用的 keys，請**不要分享給團隊外的人**
- ElevenLabs 有月配額限制（100K 字符），合理使用
- Groq 免費且快速，無需擔心配額

**📊 配額說明：**
- **Groq LLM**: 免費無限制（合理使用內）
- **ElevenLabs**: 100K 字符/月 ≈ 2,000 次干預（足夠 Demo 和測試）
- **Gmail**: 每日發送限制 500 封（測試綽綽有餘）

---

### 🔑 API Keys 詳細說明

#### **Groq LLM** (已配置 ✅)
- **用途**: 動態生成個性化干預訊息
- **方案**: 免費
- **狀態**: 團隊共用，立即可用
- **不使用會**: ❌ 無法生成動態訊息（核心功能失效）

#### **ElevenLabs TTS** (已配置 ✅)
- **用途**: 即時語音生成（Text-to-Speech）
- **方案**: Creator ($22/月)
- **狀態**: 團隊共用，立即可用
- **不使用會**: ⚠️ 仍可使用預先生成的 MP3，但無法即時生成新語音

#### **Gmail SMTP** (已配置 ✅)
- **用途**: 發送每日報告 Email
- **狀態**: 團隊共用，立即可用
- **不使用會**: ⚠️ 無法發送 Email，其他功能正常

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

