# Habit Breaker 🚫🎯

> An AI agent that monitors your browsing habits and intervenes with personalized voice messages when you're getting distracted.

## 🎪 Hackathon Info
- **Event**: ElevenLabs Conversational Agents Hackathon
- **Team Size**: 4 people
- **Build Time**: 4 hours on hackathon day
- **Current Phase**: Pre-hackathon prototype development

## 💡 Core Concept

**One Core User Flow**:
1. User browses normally
2. AI detects "bad habit" behavior (scrolling Instagram/TikTok too long, opening shopping sites, etc.)
3. AI speaks in mom's voice or idol's voice with intervention message
4. Page automatically freezes/blocks to break the distraction cycle

**Critical Pain Point Solved**: 
Scrolling addiction and procrastination - the silent productivity killer that everyone experiences but struggles to control.

**Meme-able Factor**: 
"Your mom is literally watching your screen" - funny, relatable, shareable. Imagine TikTok videos of people getting roasted by AI mom voice!

## 🏗️ Technical Architecture

### Core Components

```
┌─────────────────────────────────────────────────────────────┐
│                     Chrome Extension                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Content    │  │  Background  │  │    Popup     │      │
│  │   Script     │  │   Service    │  │     UI       │      │
│  │  (Monitor)   │  │  (AI Logic)  │  │  (Settings)  │      │
│  └──────┬───────┘  └──────┬───────┘  └──────────────┘      │
└─────────┼──────────────────┼──────────────────────────────┘
          │                  │
          ▼                  ▼
    ┌─────────────────────────────────┐
    │       Backend API Server        │
    │  (LLM + Rule Engine + Logging)  │
    └─────────┬──────────┬────────────┘
              │          │
    ┌─────────▼──┐   ┌──▼──────────┐
    │ ElevenLabs │   │  Clerk Auth │
    │  Voice API │   │  (Optional) │
    └────────────┘   └─────────────┘
```

### Tech Stack (Aligned with Partners)

**Must Use**:
- ✅ **ElevenLabs**: Voice generation (mom voice, idol voice)
- ✅ **Clerk**: User authentication (if we add user accounts)
- ✅ **Blackbox AI**: Could use for code generation during hackathon
- ✅ **Bolt**: Fast deployment platform

**Core Technologies**:
- Chrome Extension (Manifest V3)
- Node.js + Express backend
- LLM API (GPT-4 or Claude) for intent detection
- ElevenLabs Voice API for TTS

## 📋 Pre-Hackathon Checklist

### ✅ What to Do NOW (Before Hackathon)

1. **Get API Keys Ready**
   - [ ] ElevenLabs API key + test voice cloning
   - [ ] OpenAI/Anthropic API key
   - [ ] Clerk account (if using auth)

2. **Build Working Prototype**
   - [ ] Chrome extension that can detect current URL/tab
   - [ ] Basic rule engine (if URL contains "instagram" → trigger)
   - [ ] ElevenLabs API integration (play voice message)
   - [ ] Page blocking mechanism

3. **Prepare Demo Assets**
   - [ ] 3-5 pre-generated voice messages (saves API calls during demo)
   - [ ] Test scenarios (Instagram, Amazon, YouTube)
   - [ ] 2-minute demo script

4. **Test Everything Locally**
   - [ ] Extension loads in Chrome
   - [ ] Voice plays successfully
   - [ ] Page blocking works
   - [ ] No major bugs

### 🚀 Hackathon Day Strategy (4 Hours)

**Hour 1: Setup & Polish**
- Load prototype
- Fix any immediate bugs
- Set up deployment

**Hour 2-3: Feature Enhancement**
- Add more voice personalities
- Improve detection logic
- Better UI/UX
- Add partner integrations (Clerk, etc.)

**Hour 4: Demo Prep**
- Test demo flow 10 times
- Record backup video
- Prepare pitch deck
- Practice presentation

## 👥 Team Division (4 People)

### Person 1: Frontend/Extension Lead
- Chrome extension architecture
- Content scripts (monitoring logic)
- UI/UX (popup interface)
- Page blocking mechanism

### Person 2: Backend/AI Lead
- Backend API server
- LLM integration (behavior detection)
- Rule engine logic
- Data logging

### Person 3: Voice/Integration Lead
- ElevenLabs Voice API integration
- Voice cloning setup
- Partner tech integration (Clerk, Bolt)
- Audio playback in extension

### Person 4: Demo/Product Lead
- Demo script & scenarios
- Presentation deck
- Video recording
- User flow testing
- Meme content creation

**Note**: On hackathon day, Person 4 can help with bug fixes and testing while others code.

## 🎯 Judging Criteria Alignment

| Criterion | Our Strategy | Score Target |
|-----------|-------------|--------------|
| **Working Prototype** | Pre-built prototype + polish on hackathon day | 5/5 |
| **Technical Complexity** | Browser monitoring + Voice AI + LLM intent detection + Page control | 4-5/5 |
| **Innovation & Creativity** | "Your mom is watching" - novel take on productivity | 4/5 |
| **Real-World Impact** | Solves universal procrastination problem | 4-5/5 |
| **Theme Alignment** | Conversational agent that acts on user intent + multiple partner techs | 5/5 |

## 🎬 Demo Script (2 Minutes)

1. **Hook (15s)**: "Ever feel like you need your mom to yell at you to stop scrolling? We built exactly that."

2. **Problem (15s)**: "We waste hours daily on Instagram, TikTok, shopping sites. We know it's bad, but we can't stop."

3. **Solution Demo (60s)**:
   - Open Instagram → scroll
   - AI mom voice: "小明！又在滑手機！你的報告寫完了嗎？"
   - Page freezes with overlay
   - Show settings: switch to idol voice
   - Open Amazon → browse
   - Idol voice: "Hey, I thought you were saving money?"

4. **Tech Highlight (20s)**: "AI monitors behavior in real-time, ElevenLabs generates personalized voice, seamlessly blocks distractions."

5. **Impact (10s)**: "Break habits before they break your productivity. Your AI accountability partner, 24/7."

## 📦 File Structure

```
habit-breaker/
├── extension/              # Chrome extension
│   ├── manifest.json
│   ├── background.js       # Service worker
│   ├── content.js          # Page monitoring
│   ├── popup.html          # Settings UI
│   └── popup.js
├── backend/                # API server
│   ├── server.js
│   ├── llm-service.js      # Intent detection
│   ├── elevenlabs.js       # Voice generation
│   └── rules-engine.js     # Behavior rules
├── assets/                 # Pre-generated voices
│   └── voice-clips/
├── docs/
│   ├── API.md
│   └── DEPLOYMENT.md
└── README.md
```

## 🔑 Success Factors (Based on Past Winners)

✅ **Working Demo**: Have a polished, working prototype ready before hackathon
✅ **Clear Value**: Solves relatable problem everyone understands instantly  
✅ **Wow Factor**: Voice intervention is surprising and memorable
✅ **Multi-Partner**: Use ElevenLabs + at least 2 other partner techs
✅ **Shareable**: People will want to post videos of AI mom roasting them

## 🎤 Pitch Deck Outline

1. Title: "Habit Breaker - Your AI Accountability Partner"
2. Problem: Procrastination epidemic (show meme)
3. Solution: AI intervention with personalized voice
4. Demo: Live or video
5. Tech: Architecture diagram with partner logos
6. Impact: Productivity gains, habit formation
7. Next Steps: Chrome Web Store, mobile apps

## 📝 Next Steps

Start with `/extension` and `/backend` folders - those contain the core prototype you need working BEFORE hackathon day!

