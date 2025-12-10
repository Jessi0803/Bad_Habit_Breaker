# ⚡ Quick Reference - Habit Breaker

## 🚀 啟動（2分鐘）

```bash
# 1. 啟動 Backend
cd /Users/jc/Desktop/Habit_Breaker/backend
node server.js

# 2. 載入 Extension
# Chrome → chrome://extensions → 載入未封裝 → 選擇 extension 資料夾

# 3. 測試
# 訪問 Instagram → 等 10 秒 → 看到動態訊息！
```

---

## 🎯 核心賣點

| 特點 | 說明 |
|------|------|
| 🧠 **動態訊息** | Groq LLM 每次生成不同訊息 |
| 🔊 **真人語音** | ElevenLabs 媽媽語氣 |
| ⚡ **即時分析** | 追蹤訪問次數、時間 |
| 💯 **免費** | Groq 完全免費 |

---

## 📊 Demo 數據

```bash
# 測試 LLM
curl -X POST http://localhost:3000/api/generate-intervention \
  -H "Content-Type: application/json" \
  -d '{"site":"instagram.com","timeSpent":120,"visitCount":3,"currentTime":"14:30"}'

# 查看統計
curl http://localhost:3000/api/stats
```

---

## 🎬 30秒 Pitch

> "Habit Breaker 用 **Groq LLM** 即時分析你的壞習慣，動態生成個性化警告，
> 然後用 **ElevenLabs** 真人語音念出來。每次訊息都不同，因為 AI 了解你！"

---

## 🔧 故障排除

| 問題 | 解決方案 |
|------|----------|
| 沒反應 | 檢查 Backend：`curl localhost:3000/health` |
| 沒聲音 | 點擊頁面一次解鎖音訊 |
| 固定訊息 | 檢查 `background.js` 中 `USE_LLM = true` |

---

## 📞 重要檔案

- **Backend**: `backend/server.js`
- **Extension**: `extension/background.js`, `extension/content.js`
- **測試**: `bash test-integration.sh`
- **完整說明**: `HACKATHON_READY.md`

---

**現在去拿冠軍吧！** 🏆💪

