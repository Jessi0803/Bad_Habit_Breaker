// Daily Report Service
// Generate user's daily habit report

import 'dotenv/config';

/**
 * Generate daily report
 * @param {Object} options - Report options
 * @returns {Object} Report data
 */
export async function generateDailyReport(options = {}) {
  const {
    userEmail = 'demo@habitbreaker.ai',
    date = new Date()
  } = options;
  
  // Get today's statistics (from storage or database)
  const today = new Date(date).setHours(0, 0, 0, 0);
  
  // Mock data (should be fetched from database in production)
  const report = {
    date: new Date(today).toISOString().split('T')[0],
    userEmail,
    
    // Intervention statistics
    interventions: {
      total: Math.floor(Math.random() * 10) + 5, // 5-15 times
      byWebsite: [
        { site: 'instagram.com', count: Math.floor(Math.random() * 5) + 2 },
        { site: 'facebook.com', count: Math.floor(Math.random() * 4) + 1 },
        { site: 'youtube.com', count: Math.floor(Math.random() * 3) + 1 }
      ],
      byTime: [
        { hour: '09:00-12:00', count: Math.floor(Math.random() * 4) + 1 },
        { hour: '14:00-17:00', count: Math.floor(Math.random() * 4) + 2 },
        { hour: '20:00-23:00', count: Math.floor(Math.random() * 3) + 1 }
      ]
    },
    
    // Time statistics
    timeStats: {
      totalTimeWasted: Math.floor(Math.random() * 120) + 30, // 30-150 minutes
      timeSaved: Math.floor(Math.random() * 90) + 20, // 20-110 minutes
      averageSessionLength: Math.floor(Math.random() * 15) + 5, // 5-20 minutes
      longestSession: Math.floor(Math.random() * 30) + 10 // 10-40 minutes
    },
    
    // Progress indicators
    progress: {
      vsYesterday: {
        interventions: Math.floor(Math.random() * 5) - 2, // -2 to +3
        timeWasted: Math.floor(Math.random() * 30) - 15 // -15 to +15 minutes
      },
      weeklyTrend: Math.random() > 0.5 ? 'improving' : 'stable',
      streakDays: Math.floor(Math.random() * 7) + 1 // 1-8 days
    },
    
    // Achievements
    achievements: [],
    
    // Recommendations
    recommendations: []
  };
  
  // Generate achievements
  if (report.interventions.total < 5) {
    report.achievements.push({
      title: 'Self-Discipline Master',
      description: 'Only needed ' + report.interventions.total + ' reminders today!',
      icon: '🏆'
    });
  }
  
  if (report.timeStats.timeSaved > 60) {
    report.achievements.push({
      title: 'Time Guardian',
      description: 'Saved ' + report.timeStats.timeSaved + ' minutes today!',
      icon: '⏰'
    });
  }
  
  if (report.progress.streakDays >= 7) {
    report.achievements.push({
      title: '7-Day Challenge',
      description: report.progress.streakDays + ' days of staying focused!',
      icon: '🔥'
    });
  }
  
  // Generate recommendations
  const topSite = report.interventions.byWebsite[0];
  if (topSite && topSite.count > 3) {
    report.recommendations.push({
      type: 'warning',
      message: `${topSite.site} is your biggest distraction (${topSite.count} times). Consider adjusting sensitivity or setting break times.`
    });
  }
  
  if (report.progress.vsYesterday.interventions > 0) {
    report.recommendations.push({
      type: 'tip',
      message: report.progress.vsYesterday.interventions + ' more interventions than yesterday. Try "Strict Mode"?'
    });
  } else {
    report.recommendations.push({
      type: 'praise',
      message: 'Amazing! You\'re more disciplined than yesterday! Keep it up! 💪'
    });
  }
  
  if (report.timeStats.longestSession > 25) {
    report.recommendations.push({
      type: 'tip',
      message: 'You had a ' + report.timeStats.longestSession + '-minute distraction session. You might need more frequent reminders.'
    });
  }
  
  return report;
}

/**
 * Format report as Email HTML
 */
export function formatReportAsHTML(report) {
  const { interventions, timeStats, progress, achievements, recommendations } = report;
  
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f5f5f5; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; }
    .header h1 { margin: 0; font-size: 28px; }
    .header p { margin: 10px 0 0 0; opacity: 0.9; }
    .section { padding: 25px; border-bottom: 1px solid #eee; }
    .section:last-child { border-bottom: none; }
    .stat-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-top: 15px; }
    .stat-card { background: #f8f9fa; padding: 15px; border-radius: 8px; text-align: center; }
    .stat-value { font-size: 32px; font-weight: bold; color: #667eea; }
    .stat-label { font-size: 14px; color: #666; margin-top: 5px; }
    .progress-good { color: #10b981; }
    .progress-bad { color: #ef4444; }
    .achievement { background: #fef3c7; padding: 12px; border-radius: 8px; margin: 10px 0; display: flex; align-items: center; }
    .achievement-icon { font-size: 32px; margin-right: 12px; }
    .recommendation { padding: 12px; border-radius: 8px; margin: 10px 0; }
    .recommendation.warning { background: #fee2e2; border-left: 4px solid #ef4444; }
    .recommendation.tip { background: #dbeafe; border-left: 4px solid #3b82f6; }
    .recommendation.praise { background: #d1fae5; border-left: 4px solid #10b981; }
    .website-list { list-style: none; padding: 0; }
    .website-item { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
    .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🚫 Daily Habit Report</h1>
      <p>${report.date}</p>
    </div>
    
    <div class="section">
      <h2>📊 Today's Stats</h2>
      <div class="stat-grid">
        <div class="stat-card">
          <div class="stat-value">${interventions.total}</div>
          <div class="stat-label">Interventions</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${timeStats.timeSaved}min</div>
          <div class="stat-label">Time Saved</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${timeStats.totalTimeWasted}min</div>
          <div class="stat-label">Time Wasted</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${progress.streakDays}</div>
          <div class="stat-label">Day Streak</div>
        </div>
      </div>
    </div>
    
    <div class="section">
      <h2>📈 Progress Comparison</h2>
      <p>
        vs Yesterday:
        <span class="${progress.vsYesterday.interventions <= 0 ? 'progress-good' : 'progress-bad'}">
          ${progress.vsYesterday.interventions > 0 ? '+' : ''}${progress.vsYesterday.interventions} interventions
        </span>
        |
        <span class="${progress.vsYesterday.timeWasted <= 0 ? 'progress-good' : 'progress-bad'}">
          ${progress.vsYesterday.timeWasted > 0 ? '+' : ''}${progress.vsYesterday.timeWasted} min wasted
        </span>
      </p>
      <p>Weekly Trend: ${progress.weeklyTrend === 'improving' ? '📈 Improving' : '📊 Stable'}</p>
    </div>
    
    <div class="section">
      <h2>🌐 Top Distracting Sites</h2>
      <ul class="website-list">
        ${interventions.byWebsite.map(site => `
          <li class="website-item">
            <span>${site.site}</span>
            <strong>${site.count} times</strong>
          </li>
        `).join('')}
      </ul>
    </div>
    
    ${achievements.length > 0 ? `
    <div class="section">
      <h2>🏆 Today's Achievements</h2>
      ${achievements.map(ach => `
        <div class="achievement">
          <div class="achievement-icon">${ach.icon}</div>
          <div>
            <strong>${ach.title}</strong>
            <div style="font-size: 14px; color: #666;">${ach.description}</div>
          </div>
        </div>
      `).join('')}
    </div>
    ` : ''}
    
    ${recommendations.length > 0 ? `
    <div class="section">
      <h2>💡 Recommendations</h2>
      ${recommendations.map(rec => `
        <div class="recommendation ${rec.type}">
          ${rec.message}
        </div>
      `).join('')}
    </div>
    ` : ''}
    
    <div class="footer">
      Powered by Habit Breaker | ElevenLabs | Groq | n8n<br>
      Keep building better habits! 💪
    </div>
  </div>
</body>
</html>
  `;
}

/**
 * Format report as plain text (Slack/Discord)
 */
export function formatReportAsText(report) {
  const { interventions, timeStats, progress, achievements, recommendations } = report;
  
  let text = `
🚫 **Daily Habit Report** - ${report.date}
━━━━━━━━━━━━━━━━━━━━━━

📊 **Today's Stats**
• Interventions: ${interventions.total}
• Time Saved: ${timeStats.timeSaved} minutes
• Time Wasted: ${timeStats.totalTimeWasted} minutes
• Day Streak: ${progress.streakDays} days

📈 **Progress Comparison**
vs Yesterday: ${progress.vsYesterday.interventions > 0 ? '+' : ''}${progress.vsYesterday.interventions} interventions
Weekly Trend: ${progress.weeklyTrend === 'improving' ? '📈 Improving' : '📊 Stable'}

🌐 **Top Distracting Sites**
${interventions.byWebsite.map((site, i) => `${i + 1}. ${site.site} - ${site.count} times`).join('\n')}
`;

  if (achievements.length > 0) {
    text += `\n🏆 **Today's Achievements**\n`;
    achievements.forEach(ach => {
      text += `${ach.icon} ${ach.title}: ${ach.description}\n`;
    });
  }
  
  if (recommendations.length > 0) {
    text += `\n💡 **Recommendations**\n`;
    recommendations.forEach((rec, i) => {
      text += `${i + 1}. ${rec.message}\n`;
    });
  }
  
  text += `\n━━━━━━━━━━━━━━━━━━━━━━
Powered by Habit Breaker 💪`;
  
  return text;
}

export default {
  generateDailyReport,
  formatReportAsHTML,
  formatReportAsText
};

