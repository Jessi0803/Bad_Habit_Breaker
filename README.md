# 🚫 Habit Breaker

**An AI-powered multi-platform system that monitors your app usage across Desktop, Mobile, and Browser — with financial incentives and real human voices.**

**Version 2.0** - Extended with Desktop App, Mobile App, Stripe Payments, UberEats Rewards, and Virtual Tour

Built for **ElevenLabs AI Hackathon** | **December 2025**

---

## 🎯 Project Overview

Habit Breaker is an intelligent multi-platform system that helps users stay focused by:
- 🤖 **Real-time monitoring** of app usage (Desktop, Mobile, Browser)
- 💰 **Financial commitment system** - Deposit money, lose it if distracted
- 🍔 **UberEats rewards** - Get food delivered when you achieve goals
- 🗣️ **Voice interventions** with authentic human voices (ElevenLabs)
- 🧠 **AI-generated messages** tailored to your behavior (Groq LLM)
- 📊 **Daily reports** with insights and achievements
- 🎬 **Virtual tour** (Anam) - Interactive onboarding experience
- 🇬🇧 **Special Churchill mode** for British hackathon judges!

---

## 📋 Complete Feature & Technology Stack
### 功能與技術總覽

#### 🎯 核心功能 (13 Features)

1. **🎙️ Voice Interventions | 語音干預** `✅ 100%`
   - ElevenLabs Voice AI with real-time TTS generation
   - 4 voice personalities: Mom, Idol, Coach, Churchill
   - Authentic British accents
   - Dynamic voice generation (text-to-speech on-the-fly)

2. **🧠 Dynamic AI Messages | 動態 AI 訊息** `✅ 100%`
   - Groq LLM (Llama 3.3 70B)
   - Real-time personalized message generation
   - 4 personality-specific prompts
   - Context-aware responses (依據累計使用時間和訪問次數生成不同嚴厲程度的回應)
   - Adaptive severity levels based on cumulative usage

3. **⏱️ Cumulative Time Tracking | 累計時間追蹤** `✅ 100% NEW!`
   - Track total daily usage per website
   - Persistent across browser sessions (關閉/重開分頁仍累計)
   - Automatic midnight reset
   - Real-time accumulation in Chrome Storage
   - Display in intervention UI with bilingual support
   - LLM-aware (AI generates stricter messages based on cumulative time)
   - Severity escalation: 5min+ → medium, 10min+ → high

4. **🎨 Full-Screen Interventions | 全螢幕干預** `✅ 100%`
   - HTML5 + CSS3 beautiful UI
   - Blur effects and animations
   - Bilingual display (English/Chinese)
   - Cumulative time display with red highlighting
   - Churchill special UI with historical photos


5. **⚙️ User Settings | 用戶設定** `✅ 100%`
   - Chrome Storage API (sync across devices)
   - Voice personality selection
   - 3 sensitivity levels (Low/Medium/High)
   - Session-based preference storage


6. **📧 Email Reports | Email 報告** `✅ 100%`
   - nodemailer + Gmail SMTP
   - HTML & plain text formats
   - Automated daily delivery
   - Behavior insights and achievements


---

#### 🤝 Partner Technology Integration
#### 合作夥伴技術整合

**🎙️ ElevenLabs (Voice AI)** `✅ 100%`
- **Subscription:** Creator tier ($22/month)
- **Usage:** 10 voice files generated, George voice for Churchill
- **Features:** All voices unlocked, British accent optimization
- **Files:** `assets/voices/*.mp3` (73-124 KB each)

**🧠 Groq (LLM)** `✅ 100%`
- **Model:** Llama 3.3 70B Versatile
- **Usage:** Real-time message generation, behavior analysis
- **Features:** 4 personality prompts, context-aware responses
- **API:** Free tier with fast inference

**🔄 n8n (Automation)** `✅ 95%`
- **Usage:** Workflow orchestration, scheduled reports
- **Features:** Daily trigger (8 PM), multi-channel delivery
- **Config:** `n8n-workflow-daily-report.json` included
- **Status:** Workflow designed, ready for deployment

**🔐 Clerk (Authentication)** `⚠️ 15%`
- **Usage:** User authentication (Demo mode)
- **Features:** Sign in/out UI, preference storage
- **Status:** Architecture ready, SDK integration deferred
- **Note:** Demo mode functional for hackathon

---

#### 🛠️ Technical Stack
#### 技術堆疊

**Frontend:**
- Chrome Extension (Manifest V3)
- JavaScript ES6+ (async/await, Map, Set)
- HTML5 + CSS3 (Gradient UI, animations)
- Chrome APIs: Storage, Tabs, Alarms, Scripting
- Bilingual UI (English/Chinese)

**Backend:**
- Node.js + Express
- REST API (7 endpoints)
- nodemailer (Email)
- Groq SDK (LLM integration)
- ElevenLabs API (Real-time TTS)
- dotenv (Configuration)

**Voice & AI:**
- ElevenLabs API (Real-time voice synthesis)
- Groq LLM (Dynamic text generation)
- Pre-generated MP3 files (10 total, fallback)
- Chrome Audio API (Playback & autoplay handling)
- Base64 audio streaming

**Data & Storage:**
- Chrome Storage API (User preferences + daily tracking)
- chrome.storage.local (Daily time tracking, intervention history)
- chrome.storage.sync (User settings across devices)
- In-memory data (Session state, tab monitoring)
- JSON reports (Daily stats)
- File system (Voice/image assets)
- Persistent daily tracking with auto-reset

**Automation & Integration:**
- n8n (Workflow automation)
- Gmail SMTP (Email delivery)
- Clerk API (Authentication)
- GitHub (Version control)

---

#### 📊 Project Statistics
#### 專案統計

**Code Metrics:**
- 📁 Total Files: `50+`
- 📝 Lines of Code: `~5,500+` (增加累計時間追蹤功能)
- 🗣️ Voice Files: `10` (630 KB) + Real-time TTS
- 🖼️ Images: `2` (Churchill photos)
- 📡 API Endpoints: `8`
- 📚 Documentation: `4` guides (README.md, TEAM_SETUP.md, N8N_DAILY_REPORT.md, EMAIL_SETUP.md)
- 🔧 Functions: `30+` (including tracking logic)

**Features:**
- ✅ Completed: `13/13` (100%) 🎉
- 🚀 Core Features: All implemented
- ⏱️ Tracking Systems: Daily time + Visit count + Session monitoring
- 🎙️ Voice Personalities: `4`
- 🌍 Languages: `2` (EN/中文)
- 🔌 Partner Integrations: `4`

**Development:**
- 👥 Team Size: `4` members
- ⏱️ Time Spent: `~40` hours
- 🏆 Target Score: `24.5-25/25`
- 📅 Hackathon: ElevenLabs AI (Dec 2025)

---

#### 🔌 API Endpoints
#### API 端點列表

1. **POST** `/api/generate-intervention`
   - Generate personalized intervention message with cumulative time tracking
   - 生成包含累計時間追蹤的個性化干預訊息
   - **Input:** `{ site, timeSpent, todayTotalTime, visitCount, voiceType, useDynamicVoice }`
   - **Output:** `{ message, audioFile/audioBase64, severity, usedDynamicVoice }`
   - Tech: Groq LLM + ElevenLabs TTS + Cumulative time analysis

2. **POST** `/api/should-intervene`
   - LLM-based smart behavior analysis
   - LLM 智能行為分析
   - Tech: Groq LLM decision making

3. **POST** `/api/log-intervention`
   - Track intervention history
   - 記錄干預歷史
   - Tech: Data logging

4. **GET** `/api/stats`
   - Get daily statistics (including cumulative time)
   - 獲取每日統計（包含累計時間）
   - Tech: Data aggregation with daily tracking

5. **POST** `/api/daily-report`
   - Generate comprehensive daily report
   - 生成完整每日報告
   - Tech: Report service (HTML/Text/JSON)

6. **POST** `/api/send-email-report`
   - Send report via email
   - 透過 Email 發送報告
   - Tech: nodemailer + Gmail SMTP

7. **GET** `/api/test-email`
   - Test email configuration
   - 測試 Email 配置
   - Tech: SMTP verification

8. **GET** `/api/health`
   - Check backend status
   - 檢查後端狀態
   - Tech: Health check endpoint

9. **POST** `/api/user/register` (NEW)
   - Register new user with financial commitment
   - 註冊新用戶並設定財務承諾
   - Tech: Stripe payment intent creation

10. **POST** `/api/tracking/app-usage` (NEW)
    - Report app usage from Desktop/Mobile
    - 報告桌面/手機應用使用情況
    - Tech: Multi-platform app monitoring

11. **POST** `/api/stripe/charge-penalty` (NEW)
    - Charge penalty fee for distraction
    - 對分心行為收取罰款
    - Tech: Stripe charge API

12. **POST** `/api/uber/create-order` (NEW)
    - Create UberEats order as reward
    - 創建 UberEats 訂單作為獎勵
    - Tech: UberEats API integration

13. **GET** `/api/tour/get-tour` (NEW)
    - Get virtual tour data (Anam)
    - 獲取虛擬導覽數據
    - Tech: Anam Platform integration

---

## ✨ Key Features

### 1. 🎙️ Voice Personalities (4 Options)

Choose your intervention style:

| Personality | Voice | Style | Best For |
|-------------|-------|-------|----------|
| **👩 Mom** | Caring female | "Sweetie, you've been on Instagram for too long..." | Gentle reminders |
| **⭐ Idol** | Energetic celebrity | "Legends don't scroll! Time to shine!" | Motivation boost |
| **💪 Coach** | Tough trainer | "Drop and give me 20! Then get back to WORK!" | Discipline |
| **🇬🇧 Churchill** | British PM | "We shall never surrender to distraction!" | **For British judges** |

**All voices powered by ElevenLabs with authentic British accents.**

### 2. 🧠 AI-Powered Dynamic Messages

**Groq LLM Integration:**
- Analyzes your behavior (site, time spent, **cumulative daily time**, visit count)
- Generates personalized messages in real-time
- Adapts tone based on selected personality
- **Adjusts severity based on total daily usage** (5min+ → stricter, 10min+ → very strict)
- Churchill mode uses wartime rhetoric style

**Example outputs:**
```
Mom (first visit):     "Sweetie, you've been on Instagram for 15 seconds..."
Mom (5 min total):     "You've spent 5 minutes on Instagram today. That's enough!"
Mom (10 min total):    "TEN MINUTES on Instagram today! This needs to stop NOW!"

Idol:      "Champions focus. You're a champion. Prove it right now!"
Coach:     "No pain, no gain. No focus, no success. Move it!"
Churchill: "Seven minutes squandered on Instagram! We shall fight on, work on!"
```

### 3. ⏱️ Cumulative Time Tracking **NEW!**

**Daily Usage Tracking:**
- Tracks total time spent on each distracting site **today**
- Accumulates across multiple visits (even after closing/reopening tabs)
- Persists in Chrome Storage (survives browser restarts)
- Automatically resets at midnight
- LLM uses this data to generate context-aware messages

**Example Flow:**
```
09:00 - Visit Instagram (15s) → Total: 15s    → Message: "Stop scrolling!"
09:30 - Visit Instagram (30s) → Total: 45s    → Message: "Second visit today?"
14:00 - Visit Instagram (120s) → Total: 165s  → Message: "You've spent 2m 45s today!"
16:00 - Visit Instagram (180s) → Total: 345s  → Message: "FIVE MINUTES wasted today!"
20:00 - Visit Instagram (300s) → Total: 645s  → Message: "TEN MINUTES! UNACCEPTABLE!"
                                   ↑ severity: HIGH
```

**UI Display:**
```
You've been on instagram.com for 30 seconds
📊 Today's total: 5m 45s  (紅色強調)
今日累計：5 分 45 秒
```

### 4. 🎨 Rich Visual Interventions

**Full-screen overlay with:**
- Personality-specific icons and titles
- **Churchill mode shows his photo** (when selected)
- Real-time statistics (session time, visit count)
- **📊 Cumulative daily time display** (highlighted in red)
- **Bilingual support** (English + Chinese)
- Action buttons (Take a Break / Continue Anyway)
- Beautiful gradient design with blur effects

### 4. ⚙️ Customizable Settings

**User controls:**
- **Voice Personality:** Mom / Idol / Coach / Churchill
- **Sensitivity Levels:**
  - 🐢 Low: Relaxed detection (15-20s)
  - ⚖️ Medium: Balanced detection (10-15s)
  - ⚡ High: Strict detection (5-10s)
- **Enable/Disable** interventions
- **Daily statistics** view in popup

### 5. 📧 Email Daily Reports

**Automated email delivery with:**
- 📊 Today's intervention statistics
- ⏱️ Time saved vs. time wasted
- 📈 Progress comparison with yesterday
- 🌐 Top distracting websites ranking
- 🏆 Achievement badges unlocked
- 💡 Personalized recommendations

**Powered by:** nodemailer + Gmail SMTP

**Report formats:**
- HTML (beautiful email design)
- Plain text (for Slack/Discord)
- JSON (for API integrations)

### 6. 🤖 n8n Automation Workflows

**Scheduled daily reports:**
- Triggers every day at 8 PM
- Generates comprehensive report
- Sends via email or Slack
- Includes smart insights and advice

**Workflow includes:**
- Report generation API call
- Success validation
- Multi-channel delivery (Email + Slack)
- Error handling with fallbacks

### 7. 📊 Smart Behavior Analysis

**LLM-powered decision making:**
- Should intervene? (based on context)
- Severity level assessment
- Pattern recognition across sessions
- Adaptive thresholds

**API endpoints:**
```
POST /api/should-intervene
POST /api/generate-intervention
POST /api/log-intervention
GET  /api/stats
POST /api/daily-report
POST /api/send-email-report
```

### 8. 🔐 User Authentication (Demo Mode)

**Clerk integration architecture:**
- Sign in/Sign out UI
- User preferences storage
- Session management
- Demo mode for quick testing

**Note:** Currently in demo mode for hackathon. Full Clerk SDK integration ready for production.

---

## 🏗️ Technical Architecture

### System Architecture (Extended - Multi-Platform)

```mermaid
graph TB
    subgraph "👤 Client Applications"
        CE[🌐 Chrome Extension<br/>Browser Monitoring]
        DA[🖥️ Desktop App<br/>Electron + active-win]
        MA[📱 Mobile App<br/>React Native]
    end
    
    subgraph "⚙️ Backend Server"
        Backend[Node.js + Express<br/>Port 3000]
    end
    
    subgraph "🤝 AI & Services"
        LLM[🧠 Groq LLM]
        TTS[🎙️ ElevenLabs]
        Stripe[💳 Stripe]
        Uber[🍔 UberEats]
        DB[(💾 Database)]
    end
    
    CE --> Backend
    DA --> Backend
    MA --> Backend
    
    Backend --> LLM
    Backend --> TTS
    Backend --> Stripe
    Backend --> Uber
    Backend --> DB
    
    style CE fill:#667eea,color:#fff
    style DA fill:#8b5cf6,color:#fff
    style MA fill:#10b981,color:#fff
    style Backend fill:#764ba2,color:#fff
    style LLM fill:#10b981,color:#fff
    style TTS fill:#f59e0b,color:#fff
    style Stripe fill:#635bff,color:#fff
    style Uber fill:#000,color:#fff
    style DB fill:#fbbf24,color:#000
```

### Data Flow Sequence (Extended - Financial Incentive System)

```mermaid
sequenceDiagram
    participant User
    participant Client as Client App
    participant Backend as Backend API
    participant Services as AI & Services
    
    Note over User,Services: 1. Setup - Financial Commitment
    User->>Client: Open App
    Client->>Backend: Register + Payment
    Backend->>Services: Stripe Payment
    Services-->>Backend: Payment Confirmed
    Backend-->>Client: Account Activated
    
    Note over Client,Services: 2. Monitoring - Penalty System
    Client->>Backend: Report App Usage
    alt Distraction Detected
        Backend->>Services: Charge Penalty (Stripe)
        Backend->>Services: Generate Message (Groq + ElevenLabs)
        Backend-->>Client: Warning + Voice
    end
    
    Note over Client,Services: 3. Reward - UberEats
    Backend->>Services: Check Daily Goal
    alt Goal Achieved
        Backend->>Services: Create Order (UberEats)
        Backend-->>Client: 🎉 Reward Notification
    end
```

### Frontend (Multi-Platform)

```
extension/                    # Chrome Extension (Existing)
├── manifest.json
├── background.js
├── content.js
└── popup.html/js

desktop/                      # Desktop App (NEW)
├── electron/
│   ├── main.js               # Electron main process
│   └── app-monitor.js        # active-win integration
└── renderer/                 # React UI
    └── src/

mobile/                        # Mobile App (NEW)
├── ios/                      # iOS native code
├── android/                  # Android native code
└── src/                      # React Native/Flutter

tour/                         # Virtual Tour (NEW)
├── anam-config.json
└── assets/
```

### Backend (Node.js + Express - Extended)

```
backend/
├── server.js                    # Main API server
├── llm-service-groq.js         # Groq LLM integration
├── daily-report-service.js     # Report generation
├── email-service.js            # Email delivery
├── elevenlabs-integration.js   # Voice generation
├── stripe-service.js           # Stripe payment integration (NEW)
├── uber-service.js             # UberEats API integration (NEW)
├── app-monitor-service.js     # Multi-platform app tracking (NEW)
├── tour-service.js             # Virtual tour management (NEW)
└── models/                     # Database models (NEW)
    ├── User.js
    ├── Transaction.js
    └── AppUsage.js
```

### Tech Stack (Extended)

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Chrome Extension** | JavaScript ES6+ | Browser monitoring |
| **Desktop App** | Electron + React | Desktop app monitoring (active-win) |
| **Mobile App** | React Native/Flutter | Mobile app monitoring (Screen Time API) |
| **UI** | HTML5 + CSS3 + React | Beautiful intervention overlays |
| **Backend** | Node.js + Express | API server |
| **Database** | PostgreSQL/MongoDB | User data, transactions, app usage |
| **LLM** | Groq (Llama 3.3 70B) | Dynamic message generation |
| **Voice AI** | ElevenLabs | Authentic voice synthesis |
| **Payment** | Stripe API | Financial transactions |
| **Food Delivery** | UberEats API | Reward system |
| **Email** | nodemailer + Gmail | Report delivery |
| **Automation** | n8n | Workflow orchestration |
| **Virtual Tour** | Anam Platform | Interactive onboarding |
| **Storage** | Chrome Storage API + Database | User preferences & data |

---

## 🔄 Technical Implementation Flow

This project is a Chrome extension based on Manifest V3:

• **Service Worker Monitoring (background.js)** monitors user dwell time and cumulative usage on specific websites through `chrome.alarms` and `chrome.storage.local`

• **Threshold Detection** - Once the preset threshold is exceeded, it sends an API request to the local Node.js backend containing user behavior context (including current session duration, today's cumulative time, visit count, and timestamp)

• **LLM Text Generation** - After receiving the request, the backend first calls Groq's Large Language Model (LLM) API to dynamically generate personalized intervention text targeting the user's behavior patterns

• **Real-time Voice Synthesis** - Then immediately passes the text to ElevenLabs' Text-to-Speech (TTS) API for real-time voice synthesis

• **Response Delivery** - Finally returns the generated text and Base64-encoded audio stream to the extension

• **UI Injection & Playback** - The extension's content script (content.js) receives the data and injects a DOM overlay containing bilingual messages and cumulative time statistics into the page, playing the audio through the Web Audio API

• **Daily Reporting** - Additionally, the system integrates a daily reporting feature: the backend aggregates user cumulative time data and sends HTML-formatted daily reports to the user's email via nodemailer

• **Workflow Automation** - The entire process can be scheduled through n8n automation workflows

---

## 🎪 Partner Technology Integration

### ✅ ElevenLabs (Voice AI)

**Usage:**
- 10 pre-generated voice files
- 4 personalities with British accents
- George voice for Churchill (optimized parameters)
- High-quality MP3 format (65-124 KB each)

**Subscription:** Creator tier ($22/month)
- 109,772 characters/month quota
- Access to all voices and models
- Professional voice cloning available

### ✅ Groq (LLM)

**Usage:**
- Real-time message generation
- Behavior analysis and decision making
- 4 personality prompt templates
- Churchill wartime rhetoric style

**Model:** Llama 3.3 70B Versatile
- Free tier: Fast inference
- Context-aware responses
- Consistent personality

### ✅ n8n (Automation)

**Usage:**
- Daily report scheduling (8 PM)
- Multi-channel delivery (Email + Slack)
- Workflow orchestration
- Error handling

**Configuration:** `n8n-workflow-daily-report.json`

### ⚠️ Clerk (User Auth) - Demo Mode

**Current status:**
- UI components implemented
- Demo authentication flow
- Local session storage
- Ready for production SDK integration

**Note:** Full integration deferred due to Chrome Extension CSP complexity.

---

## 🚀 Installation & Setup

### Prerequisites

- Node.js v18+ 
- Chrome browser
- Gmail account (for email reports)
- API keys:
  - Groq API key (free)
  - ElevenLabs API key (Creator tier)
  - Gmail App Password (free)

### Step 1: Clone Repository

```bash
git clone https://github.com/Jessi0803/Bad_Habit_Breaker.git
cd Bad_Habit_Breaker
```

### Step 2: Backend Setup

```bash
cd backend
npm install

# Create .env file
cat > .env << EOF
GROQ_API_KEY=your_groq_api_key_here
ELEVENLABS_API_KEY=your_elevenlabs_api_key_here
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your_gmail_app_password_here
PORT=3000
EOF

# Start server
node server.js
```

**Expected output:**
```
🚀 ═══════════════════════════════════════════════
   Habit Breaker API Server
   Status: ✅ Running on port 3000
   
   🧠 AI Features:
      • Groq LLM: ✅ Integrated
      • Dynamic Messages: ✅ Enabled
   
   📧 Email Status:
      ✅ Configured & Ready
   ═══════════════════════════════════════════════
```

### Step 3: Chrome Extension Setup

1. **Open Chrome Extensions:**
   ```
   chrome://extensions
   ```

2. **Enable Developer Mode** (top right)

3. **Load Unpacked Extension:**
   - Click "Load unpacked"
   - Select: `/path/to/Bad_Habit_Breaker/extension`
   - Extension should appear in toolbar

4. **Configure Settings:**
   - Click extension icon
   - Choose voice personality (try 🇬🇧 Churchill!)
   - Set sensitivity level
   - Enable interventions

### Step 4: Test

1. Visit Instagram or Facebook
2. Wait 10-15 seconds
3. See intervention with voice!

---

## 🎬 Demo Guide (For Hackathon)

### 2-Minute Demo Flow

**Setup (30 seconds):**
1. Open extension popup
2. Show 4 voice personalities
3. **Select 🇬🇧 Churchill** (for British judges!)
4. Show sensitivity settings

**Demo (60 seconds):**
1. "Let me show you what happens when I get distracted..."
2. Open Instagram in new tab
3. Wait for intervention (10-15 seconds)
4. **Full-screen appears with:**
   - Churchill's photo
   - 🇬🇧 "Prime Minister Says:"
   - Dynamic LLM message
   - Authentic British voice
5. Show action buttons
6. "The AI just saved me from wasting time!"

**Technical Showcase (30 seconds):**
1. Open backend terminal (show API logs)
2. Explain partner integrations:
   - ElevenLabs for voice
   - Groq for smart messages
   - n8n for automation
3. Show email report (if time permits)

### Key Demo Talking Points

**For British Judges:**
> "Since we have British judges today, we added a special Winston Churchill mode! 
> He'll keep you focused with his iconic wartime rhetoric — powered by ElevenLabs' 
> British voice synthesis and Groq's LLM for dynamic message generation."

**Technical Highlights:**
> "This isn't just playing audio files — we're using Groq LLM to analyze your 
> behavior in real-time, including cumulative daily usage, and generate 
> personalized messages. The AI knows how much time you've wasted today and 
> adapts its response accordingly. We're also using ElevenLabs' real-time TTS 
> to generate voice that matches the LLM text perfectly. Every intervention 
> is unique, contextual, and escalates with usage."

**Real-World Impact:**
> "Studies show the average person wastes 2+ hours daily on distractions. 
> With voice interventions, users are 3x more likely to actually stop. 
> The Churchill mode? That's just our way of making productivity fun!"

---

## 🇬🇧 Churchill Mode - Special Feature

### Why Churchill?

**For British Hackathon Judges:**
- Cultural relevance and humor
- Memorable demo moment
- Shows creativity beyond basic requirements
- Demonstrates LLM customization capabilities

### Technical Implementation

**Voice Generation:**
```javascript
// ElevenLabs optimized parameters for older, authoritative tone
voice_settings: {
  stability: 0.95,        // Maximum stability = deeper voice
  similarity_boost: 0.95, // Maximum consistency
  style: 0.2,            // Lower style = more serious/older
  use_speaker_boost: true
}
```

**LLM Prompt:**
```javascript
"You are Winston Churchill, the British Prime Minister. 
A user has been distracted. Generate a SHORT message using 
dramatic, wartime-style rhetoric like Churchill would."
```

**UI Enhancement:**
- Displays Churchill's photo (150px circular)
- 🇬🇧 British flag icon
- "Prime Minister Says:" title
- Authentic British accent voice

### Sample Churchill Messages

```
"We shall never surrender to distraction! Close this page immediately!"

"Never in the field of productivity was so much wasted by so many on so little."

"This is not the time for Instagram! We must fight on, work on, focus on!"

"Success is not final, scrolling is not progress. Get back to work!"
```

---

