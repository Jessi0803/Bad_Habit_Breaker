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
    const { site, timeSpent, todayTotalTime = 0, visitCount, currentTime, voiceType = 'mom' } = behaviorData;

    // Define personality styles
    const personalities = {
      mom: {
        style: "a caring but firm mother",
        examples: [
          "Third Instagram visit today? Your goals won't wait forever.",
          "30 minutes on shopping sites. Your wallet thanks you for stopping.",
          "TikTok at 2pm on a workday? Come on, you're better than this."
        ]
      },
      idol: {
        style: "a motivational celebrity idol, energetic and inspiring",
        examples: [
          "Legends don't scroll Instagram! Time to shine, superstar!",
          "Your success story starts when you close this tab. Let's go!",
          "Champions focus. You're a champion. Prove it right now!"
        ]
      },
      coach: {
        style: "a tough but supportive fitness coach",
        examples: [
          "Drop and give me 20! Then get back to WORK!",
          "No pain, no gain. No focus, no success. Move it!",
          "This is your training ground. Stop wasting reps on ${site}!"
        ]
      },
      churchill: {
        style: "Winston Churchill, the British Prime Minister - authoritative, dramatic, and inspiring with wartime rhetoric",
        examples: [
          "We shall never surrender to distraction! Close this page immediately!",
          "Never in the field of productivity was so much wasted by so few. Return to your duties!",
          "Success is not final, scrolling is not progress. Get back to work!",
          "This is not the time for ${site}! We must fight on, work on, focus on!"
        ]
      }
    };

    const personality = personalities[voiceType] || personalities.mom;

    // Format today's total time for better readability
    const totalMinutes = Math.floor(todayTotalTime / 60);
    const totalSeconds = todayTotalTime % 60;
    const totalTimeFormatted = totalMinutes > 0 
      ? `${totalMinutes} minute${totalMinutes > 1 ? 's' : ''} ${totalSeconds} second${totalSeconds !== 1 ? 's' : ''}`
      : `${totalSeconds} second${totalSeconds !== 1 ? 's' : ''}`;

    const prompt = `You are ${personality.style}. 

Context:
- User is on ${site}
- Current session: ${timeSpent} seconds
- TODAY'S TOTAL TIME on ${site}: ${totalTimeFormatted} (${todayTotalTime} seconds total)
- This is visit #${visitCount} today
- Current time: ${currentTime}

Generate a SHORT (max 25 words), impactful message to snap them out of the distraction. ${voiceType === 'churchill' ? 'Use dramatic, wartime-style rhetoric like Churchill would.' : 'Be direct but caring.'}

${todayTotalTime > 300 ? '⚠️ IMPORTANT: They\'ve spent over 5 minutes today! Be more strict and mention the total time wasted!' : ''}
${todayTotalTime > 600 ? '🚨 CRITICAL: They\'ve spent over 10 minutes today! Be VERY strict!' : ''}

Examples of ${voiceType} style:
${personality.examples.map(ex => `- "${ex}"`).join('\n')}

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

    // 根據行為判斷嚴重程度（包含累計時間）
    let severity = "low";
    if (todayTotalTime > 600 || timeSpent > 120 || visitCount > 5) {
      // Over 10 minutes today OR long single session OR many visits
      severity = "high";
    } else if (todayTotalTime > 300 || timeSpent > 60 || visitCount > 2) {
      // Over 5 minutes today OR moderate session OR some visits
      severity = "medium";
    }

    return {
      message: message || `Stop wasting time on ${site}! You've already spent ${Math.floor(todayTotalTime / 60)} minutes today!`,
      severity,
      generatedBy: "groq-llama-3.3-70b",
      todayTotalTime: todayTotalTime  // Return for debugging
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

