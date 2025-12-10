// backend/llm-service-groq.js
// 使用 Groq（完全免費！）

import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

/**
 * 使用 Groq LLM 分析用戶行為並生成個性化訊息
 * 
 * @param {Object} behaviorData - 用戶行為數據
 * @param {string} behaviorData.site - 網站名稱（如 "Instagram"）
 * @param {number} behaviorData.timeSpent - 已花時間（秒）
 * @param {number} behaviorData.visitCount - 今日訪問次數
 * @param {string} behaviorData.currentTime - 當前時間（如 "14:30"）
 * @returns {Promise<Object>} - { message: string, severity: "low"|"medium"|"high" }
 */
export async function generatePersonalizedMessage(behaviorData) {
  try {
    const { site, timeSpent, visitCount, currentTime } = behaviorData;

    const prompt = `You are a caring but firm life coach. A user has been on ${site} for ${timeSpent} seconds (this is their visit #${visitCount} today, current time: ${currentTime}).

Generate a SHORT (max 15 words), impactful message to snap them out of the distraction. Be direct but caring.

Examples:
- "Third Instagram visit today? Your goals won't wait forever."
- "30 minutes on shopping sites. Your wallet thanks you for stopping."
- "TikTok at 2pm on a workday? Come on, you're better than this."

Return ONLY the message, nothing else.`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: prompt
        }
      ],
      model: "llama-3.3-70b-versatile", // 免費且快速
      temperature: 0.7,
      max_tokens: 50,
      top_p: 1,
      stream: false
    });

    const message = chatCompletion.choices[0]?.message?.content?.trim();

    // 根據行為判斷嚴重程度
    let severity = "low";
    if (timeSpent > 120 || visitCount > 3) {
      severity = "high";
    } else if (timeSpent > 60 || visitCount > 1) {
      severity = "medium";
    }

    return {
      message: message || `Stop wasting time on ${site}!`,
      severity,
      generatedBy: "groq-llama-3.3-70b"
    };

  } catch (error) {
    console.error('❌ Groq LLM Error:', error.message);
    
    // Fallback 訊息
    return {
      message: `Time to get back to work! You've been on ${behaviorData.site} for too long.`,
      severity: "medium",
      generatedBy: "fallback"
    };
  }
}

/**
 * 智能判斷是否應該介入
 * 
 * @param {Object} behaviorData - 用戶行為數據
 * @returns {Promise<Object>} - { shouldIntervene: boolean, reason: string }
 */
export async function shouldIntervene(behaviorData) {
  try {
    const { site, timeSpent, actions, scrollSpeed } = behaviorData;

    const prompt = `Analyze this browsing behavior and determine if we should intervene:
- Site: ${site}
- Time spent: ${timeSpent} seconds
- Actions: ${actions || "scrolling"}
- Scroll speed: ${scrollSpeed || "normal"}

Is this doom-scrolling/time-wasting? Answer with ONLY "YES" or "NO".`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: prompt
        }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.3,
      max_tokens: 5,
      stream: false
    });

    const response = chatCompletion.choices[0]?.message?.content?.trim().toUpperCase();
    const shouldIntervene = response === "YES";

    return {
      shouldIntervene,
      reason: shouldIntervene ? "LLM detected time-wasting behavior" : "Productive browsing detected"
    };

  } catch (error) {
    console.error('❌ Groq Analysis Error:', error.message);
    
    // Fallback 到簡單規則
    return {
      shouldIntervene: behaviorData.timeSpent > 60,
      reason: "Fallback to time-based rule"
    };
  }
}

export default {
  generatePersonalizedMessage,
  shouldIntervene
};

