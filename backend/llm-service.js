// LLM Service - Dynamic message generation using OpenAI/Anthropic
// This makes the intervention more personalized and context-aware

const OPENAI_API_KEY = process.env.OPENAI_API_KEY || '';
const USE_LLM = !!OPENAI_API_KEY; // Only use LLM if API key is provided

/**
 * Generate a personalized intervention message using LLM
 * @param {Object} context - User behavior context
 * @returns {Promise<string>} - Generated message
 */
async function generateInterventionMessage(context) {
  const { domain, timeSpent, scrollCount, clickCount, timeOfDay, visitCount } = context;
  
  if (!USE_LLM) {
    // Fallback to static messages if no LLM API key
    return getStaticMessage(domain);
  }
  
  try {
    const prompt = `You are a caring but firm mom helping someone break bad browsing habits.

Context:
- Website: ${domain}
- Time spent: ${timeSpent} seconds
- Current time: ${timeOfDay}
- Visit count today: ${visitCount}
${scrollCount ? `- Scroll count: ${scrollCount}` : ''}
${clickCount ? `- Clicks: ${clickCount}` : ''}

Generate a SHORT (under 20 words), caring but firm intervention message in English.
Make it personal, direct, and effective. Use "you" to address them.
DO NOT use quotation marks in your response.

Examples:
- "Third time on Instagram today? That report isn't going to write itself!"
- "Shopping again? You already spent 30 minutes here this morning."
- "TikTok for 10 minutes already. Your goals are waiting!"

Your message:`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini', // Faster and cheaper
        messages: [
          { 
            role: 'system', 
            content: 'You are a concise, caring parent helping break bad habits. Keep responses under 20 words.' 
          },
          { role: 'user', content: prompt }
        ],
        max_tokens: 50,
        temperature: 0.8 // More creative
      })
    });
    
    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }
    
    const data = await response.json();
    const message = data.choices[0].message.content.trim();
    
    console.log('✅ LLM generated message:', message);
    return message;
    
  } catch (error) {
    console.error('LLM generation failed, using fallback:', error.message);
    return getStaticMessage(domain);
  }
}

/**
 * Analyze behavior and decide if intervention is needed
 * Uses LLM for smarter detection beyond simple time thresholds
 */
async function shouldIntervene(context) {
  const { domain, timeSpent, actions } = context;
  
  if (!USE_LLM) {
    // Simple rule-based fallback
    return timeSpent >= 10; // Default threshold
  }
  
  try {
    const prompt = `Analyze this browsing behavior and decide if we should intervene:

Domain: ${domain}
Time spent: ${timeSpent} seconds
Actions: ${actions.join(', ')}

Is this person wasting time or productively using the site?
Respond with ONLY: "YES" (intervene) or "NO" (don't intervene)
Then on a new line, briefly explain why in 10 words or less.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 30,
        temperature: 0.3 // More deterministic
      })
    });
    
    const data = await response.json();
    const result = data.choices[0].message.content.trim();
    
    const shouldStop = result.toUpperCase().startsWith('YES');
    console.log('🤖 LLM decision:', shouldStop ? 'INTERVENE' : 'ALLOW', '- Reason:', result);
    
    return shouldStop;
    
  } catch (error) {
    console.error('LLM analysis failed:', error.message);
    // Fallback to time-based rule
    return timeSpent >= 10;
  }
}

/**
 * Static message fallback (when LLM is not available)
 */
function getStaticMessage(domain) {
  const messages = {
    'instagram.com': 'Instagram can wait! You have important things to do!',
    'tiktok.com': 'Stop scrolling TikTok! Your time is precious!',
    'amazon.com': 'Do you really need to buy more stuff?',
    'facebook.com': 'Facebook again? When will you be productive?',
    'youtube.com': "You've been watching for too long!"
  };
  
  const cleanDomain = domain.replace('www.', '');
  const match = Object.keys(messages).find(key => cleanDomain.includes(key));
  
  return match ? messages[match] : 'Time to get back to work!';
}

module.exports = {
  generateInterventionMessage,
  shouldIntervene,
  USE_LLM
};

