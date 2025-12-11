# 🎤 Habit Breaker - Architecture Presentation Script
## 1-Minute Architecture Overview | 一分钟架构说明

---

## 📝 Script (1 minute / 60 seconds)

### Opening (0:00 - 0:10)

**English:**
> "Good morning! Today I'll present Habit Breaker's architecture. Our system is a Desktop application built with Electron that monitors all your desktop apps in real-time."

**中文:**
> "早上好！今天我将介绍 Habit Breaker 的架构。我们的系统是一个使用 Electron 构建的桌面应用程序，可以实时监控您所有的桌面应用。"

---

### Core Architecture (0:10 - 0:35)

**English:**
> "The Desktop App uses active-win to detect which application you're using. When you open a distracting app, it sends data to our Node.js backend server. The backend integrates with Groq LLM to generate personalized intervention messages, and ElevenLabs TTS to create authentic voice warnings. If you stay distracted, Stripe automatically charges a penalty fee from your committed deposit. If you achieve your daily goal, UberEats delivers food as a reward."

**中文:**
> "桌面应用使用 active-win 检测您正在使用的应用程序。当您打开分心应用时，它会将数据发送到我们的 Node.js 后端服务器。后端集成 Groq LLM 生成个性化干预消息，使用 ElevenLabs TTS 创建真实语音警告。如果您继续分心，Stripe 会自动从您的承诺存款中扣除罚金。如果您达成每日目标，UberEats 会送餐作为奖励。"

---

### Automation & Reporting (0:35 - 0:55)

**English:**
> "Every evening at 8 PM, n8n workflow automatically triggers our daily report service. The system generates comprehensive statistics and sends them via Gmail SMTP to your email. All data is stored securely in our PostgreSQL database. This creates a complete closed-loop system: monitoring, intervention, rewards, and reporting."

**中文:**
> "每天晚上 8 点，n8n 工作流自动触发我们的每日报告服务。系统生成全面的统计数据，并通过 Gmail SMTP 发送到您的邮箱。所有数据安全存储在 PostgreSQL 数据库中。这形成了一个完整的闭环系统：监控、干预、奖励和报告。"

---

### Closing (0:55 - 1:00)

**English:**
> "Thank you! Questions?"

**中文:**
> "谢谢！有问题吗？"

---

## 🎯 Key Points to Emphasize

### 1. **Multi-Technology Integration** | 多技术整合
- Desktop App (Electron + active-win)
- AI Services (Groq LLM + ElevenLabs TTS)
- Payment System (Stripe)
- Reward System (UberEats)
- Automation (n8n)
- Email Delivery (Gmail SMTP)

### 2. **Complete Workflow** | 完整工作流程
- Real-time monitoring → AI intervention → Financial penalty/reward → Automated reporting

### 3. **Closed-Loop System** | 闭环系统
- Monitor → Analyze → Intervene → Reward → Report

---

## 📊 Visual Aids (If Using Slides)

**Slide 1: System Architecture Diagram**
- Show the Mermaid diagram from README.md
- Point to Desktop App → Backend → Services

**Slide 2: Data Flow**
- Show the sequence diagram
- Highlight: Setup → Monitoring → Reward → Reporting

---

## ⏱️ Timing Breakdown

| Time | Section | Content |
|------|----------|---------|
| 0:00-0:10 | Opening | Introduction |
| 0:10-0:35 | Core Architecture | Desktop App, Backend, AI Services, Payment/Reward |
| 0:35-0:55 | Automation | n8n, Daily Reports, Email |
| 0:55-1:00 | Closing | Thank you, Q&A |

---

## 💡 Tips for Delivery

1. **Speak clearly and at moderate pace** | 清晰、中等语速
2. **Point to architecture diagram when mentioning components** | 提到组件时指向架构图
3. **Emphasize the "closed-loop" concept** | 强调"闭环"概念
4. **Show enthusiasm about the financial incentive system** | 对财务激励系统展现热情
5. **Practice the timing** | 练习时间控制

---

## 🔄 Alternative Shorter Version (45 seconds)

If you need a shorter version, you can skip the detailed explanation of each service and focus on the high-level flow:

**English:**
> "Habit Breaker is a Desktop App that monitors all your applications. When you get distracted, our AI generates personalized voice warnings and charges penalties via Stripe. Achieve your goals, and UberEats delivers rewards. Every evening, n8n automatically sends daily reports via Gmail. It's a complete closed-loop productivity system."

**中文:**
> "Habit Breaker 是一个监控您所有应用程序的桌面应用。当您分心时，我们的 AI 生成个性化语音警告，并通过 Stripe 收取罚金。达成目标，UberEats 会送餐奖励。每天晚上，n8n 自动通过 Gmail 发送每日报告。这是一个完整的闭环生产力系统。"

---

**Last Updated:** December 2025  
**Version:** 1.0

