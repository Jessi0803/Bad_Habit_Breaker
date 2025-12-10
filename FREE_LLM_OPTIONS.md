# 🆓 免費 LLM 選項指南

黑客松預算有限？這裡是**完全免費**的 LLM 方案！

---

## ⭐ 選項 1: Groq（最推薦！）

### 優點
- ✅ **完全免費**（黑客松期間綽綽有餘）
- ✅ **速度超快**（14,000+ tokens/秒，比 OpenAI 快 10-30 倍！）
- ✅ **API 兼容 OpenAI**（幾乎不用改代碼）
- ✅ **免費額度**：每分鐘 30 requests，每天 14,400 requests

### 支援的模型
- `llama-3.3-70b-versatile`（推薦！平衡速度與質量）
- `llama-3.1-8b-instant`（超快但稍弱）
- `mixtral-8x7b-32768`（長文本）

### 快速開始

#### 1. 獲取 API Key（2分鐘）
```bash
1. 前往 https://console.groq.com/
2. 註冊/登入（可用 Google 帳號）
3. 點選 "API Keys" → "Create API Key"
4. 複製 API Key
```

#### 2. 安裝依賴
```bash
cd /Users/jc/Desktop/Habit_Breaker/backend
npm install groq-sdk
```

#### 3. 設定環境變數
在 `backend/.env` 加入：
```
GROQ_API_KEY=gsk_your_api_key_here
```

#### 4. 測試
```bash
cd backend
node -e "
const Groq = require('groq-sdk').default;
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

(async () => {
  const completion = await groq.chat.completions.create({
    messages: [{ role: 'user', content: 'Say hello!' }],
    model: 'llama-3.3-70b-versatile',
  });
  console.log('✅ Groq 測試成功:', completion.choices[0].message.content);
})();
"
```

---

## 🌟 選項 2: Google Gemini（也很好！）

### 優點
- ✅ **免費額度超大**（每分鐘 15 requests）
- ✅ **免費計劃不需信用卡**
- ✅ **多模態支援**（可分析圖片）

### 快速開始

#### 1. 獲取 API Key
```bash
1. 前往 https://makersuite.google.com/app/apikey
2. 登入 Google 帳號
3. 點選 "Get API Key" → "Create API key"
```

#### 2. 安裝依賴
```bash
npm install @google/generative-ai
```

#### 3. 範例代碼
```javascript
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const result = await model.generateContent("Generate a short message");
console.log(result.response.text());
```

---

## 💎 選項 3: OpenAI（新用戶有免費額度）

### 優點
- ✅ **新用戶有 $5 credit**（夠黑客松用）
- ✅ **API 最穩定**
- ✅ **文檔最完整**

### 免費額度
- 新帳號自動獲得 $5 credit
- `gpt-4o-mini`: $0.150/1M input tokens
- $5 可以做 ~33,000 次 LLM 呼叫

### 快速開始
```bash
1. 前往 https://platform.openai.com/
2. 註冊新帳號（新用戶才有 $5）
3. 創建 API key
4. npm install openai
```

---

## 🚀 選項 4: Together.ai（免費測試）

### 優點
- ✅ 新用戶有 $25 credit
- ✅ 支援超多開源模型
- ✅ 價格便宜

---

## 🏠 選項 5: Ollama（本地運行）

### 優點
- ✅ **100% 免費**
- ✅ **完全離線**
- ✅ **無限呼叫**

### 缺點
- ⚠️ 需要好的電腦（至少 8GB RAM）
- ⚠️ 速度較慢
- ⚠️ 品質較雲端模型差

### 快速開始
```bash
# 安裝 Ollama
brew install ollama

# 下載模型
ollama pull llama3.2

# 測試
ollama run llama3.2 "Hello!"
```

---

## 🎯 黑客松推薦排名

### 1️⃣ **Groq**（最推薦！）
**理由**：完全免費 + 超快速度 + 簡單易用

### 2️⃣ **Google Gemini**
**理由**：免費額度大 + 不需信用卡

### 3️⃣ **OpenAI**（如果你是新用戶）
**理由**：$5 credit 夠用 + 最穩定

---

## 📊 免費額度對比

| 服務 | 免費額度 | 速度 | 品質 | 需信用卡？ |
|------|---------|------|------|-----------|
| **Groq** | 30 req/min | ⚡⚡⚡⚡⚡ | ⭐⭐⭐⭐ | ❌ |
| **Gemini** | 15 req/min | ⚡⚡⚡ | ⭐⭐⭐⭐ | ❌ |
| **OpenAI** | $5 credit | ⚡⚡⚡⚡ | ⭐⭐⭐⭐⭐ | ✅ |
| **Together.ai** | $25 credit | ⚡⚡⚡⚡ | ⭐⭐⭐⭐ | ✅ |
| **Ollama** | 無限 | ⚡⚡ | ⭐⭐⭐ | ❌ |

---

## 🎬 實際使用估算

### 黑客松期間（4小時開發 + Demo）

**預計 LLM 呼叫次數**：
- 開發測試：~100 次
- Demo 展示：~20 次
- **總計**：~120 次

**各服務成本**：
- **Groq**：$0（完全免費）✅
- **Gemini**：$0（完全免費）✅
- **OpenAI**：~$0.02（用掉 $5 中的 0.02）✅
- **Together.ai**：~$0.01 ✅

### 結論
**隨便選都夠用！但 Groq 最快最爽！** 🚀

---

## 💻 整合到專案

我已經創建了 `backend/llm-service-groq.js`，要使用：

```bash
# 1. 安裝依賴
cd backend
npm install groq-sdk

# 2. 設定 API Key（在 backend/.env）
GROQ_API_KEY=gsk_your_key_here

# 3. 在 background.js 呼叫
// 將來會從 backend API 獲取動態訊息
```

---

## ❓ 常見問題

### Q: Groq 真的完全免費嗎？
**A**: 是的！他們用自己的硬體（LPU）來吸引用戶，黑客松期間綽綽有餘。

### Q: 免費額度用完怎麼辦？
**A**: 
1. Groq 每分鐘會重置額度
2. 可以同時申請多個服務當備援
3. 黑客松期間不太可能用完

### Q: 哪個最適合我們的專案？
**A**: **Groq**！因為：
- 速度快 → Demo 不會卡
- 免費 → 不用擔心成本
- 簡單 → 快速整合

---

## 🎉 開始使用

```bash
# 馬上試試 Groq！
cd /Users/jc/Desktop/Habit_Breaker/backend
npm install groq-sdk

# 去 console.groq.com 拿 API key
# 加到 .env
# 測試 llm-service-groq.js
```

**加油！有了免費 LLM，你的黑客松專案會更強大！** 🚀

