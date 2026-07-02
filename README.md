# Kar Kar AI Telegram Bot

ဤစနစ်သည် User တစ်ယောက်ချင်းစီ၏ စကားပြောမှတ်တမ်းကို Turso DB ထဲတွင် သိမ်းဆည်းပြီး Turso Database ရှိ Knowledge Base မှ အချက်အလက်များကို အခြေခံ၍ အဖြေပေးသော **Knowledge-Based Chatbot** ဖြစ်သည်။

## 🚀 Features
- **Telegram Integration**: Telegraf framework ကို အသုံးပြုထားသည်။
- **Teaching Mode**: Bot ကို တိုက်ရိုက် အချက်အလက်အသစ်များ သင်ပေးနိုင်သည်။
- **Knowledge Base**: Turso DB (SQLite) ရှိ `knowledge_base` table မှ အချက်အလက်များကို အခြေခံ၍ အဖြေပေးသည်။
- **Memory (Stateful)**: User တစ်ဦးချင်းစီ၏ chat history ကို `chat_memory` table တွင် မှတ်သားထားသည်။

## 🛠 Setup Instructions

### 1. Database Preparation (Turso)
Bot မှ အလိုအလျောက် Table များ ဆောက်ပေးမည် ဖြစ်သည်။

### 2. Teaching Mode (Bot ကို သင်ပေးခြင်း)
Bot ကို အချက်အလက်အသစ်များ သင်ပေးရန် Telegram chat တွင် အောက်ပါအတိုင်း ရေးသားပေးပို့ပါ-
`keyword: response`

ဥပမာ -
- `python: Python သည် လွယ်ကူသော language ဖြစ်သည်။`
- `စားပြီးပြီလား: စားပြီးပါပြီဗျာ၊ သင်ရော စားပြီးပြီလား။`

### 3. Initial Knowledge Base Seeding
Programming ဆိုင်ရာ အခြေခံ အချက်အလက်များကို တစ်ခါတည်း ထည့်သွင်းရန်:
1. `.env` file ထဲတွင် Turso URL နှင့် Token ထည့်ပါ။
2. အောက်ပါ command ကို run ပါ-
```bash
node seed.js
```

### 4. Installation
```bash
npm install
```

### 5. Environment Variables
`.env` file ဆောက်ပြီး အောက်ပါ key များ ထည့်သွင်းပါ:
```env
TELEGRAM_BOT_TOKEN=your_bot_token
TURSO_DATABASE_URL=your_turso_db_url
TURSO_AUTH_TOKEN=your_turso_auth_token
```

### 6. Running the Bot
Vercel ပေါ်တွင် Webhook အနေဖြင့် အလုပ်လုပ်ရန် ပြင်ဆင်ထားသည်။

### 7. Vercel Deployment
1. GitHub repository ကို Vercel နှင့် ချိတ်ဆက်ပါ။
2. Vercel Project Settings ထဲတွင် Environment Variables များကို ထည့်သွင်းပါ။
3. Deploy လုပ်ပြီးနောက် ရရှိလာသော Vercel URL ကို အသုံးပြု၍ Telegram Webhook ကို သတ်မှတ်ပါ။
