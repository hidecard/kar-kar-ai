# Kar Kar AI Telegram Bot

ဤစနစ်သည် User တစ်ယောက်ချင်းစီ၏ စကားပြောမှတ်တမ်းကို Turso DB ထဲတွင် သိမ်းဆည်းပြီး Gemini API ထံ စဉ်ဆက်မပြတ် Context အဖြစ် ပူးတွဲပေးပို့သော **Stateful Chatbot Flow** ဖြစ်သည်။

## 🚀 Features
- **Telegram Integration**: Telegraf framework ကို အသုံးပြုထားသည်။
- **AI Powered**: Google Gemini API ကို အသုံးပြု၍ အဖြေများ ထုတ်ပေးသည်။
- **Memory (Stateful)**: Turso DB (SQLite) ကို အသုံးပြု၍ user တစ်ဦးချင်းစီ၏ chat history ကို မှတ်သားထားသည်။

## 🛠 Setup Instructions

### 1. Database Preparation (Turso)
SQL table ဆောက်ရန်:
```sql
CREATE TABLE chat_memory (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT,
    role TEXT,
    message TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### 2. Installation
```bash
npm install
```

### 3. Environment Variables
`.env` file ဆောက်ပြီး အောက်ပါ key များ ထည့်သွင်းပါ:
```env
TELEGRAM_BOT_TOKEN=your_bot_token
GEMINI_API_KEY=your_gemini_api_key
TURSO_DATABASE_URL=your_turso_db_url
TURSO_AUTH_TOKEN=your_turso_auth_token
```

### 4. Running the Bot
Local development အတွက်:
```bash
node index.js
```
*မှတ်ချက်: `index.js` သည် ယခုအခါ Webhook ပုံစံသို့ ပြောင်းလဲထားသဖြင့် local တွင် run ရန် `bot.launch()` ကို ပြန်ထည့်ရန် သို့မဟုတ် serverless-http ကဲ့သို့သော library များ သုံးရန် လိုအပ်နိုင်ပါသည်။*

### 5. Vercel Deployment
1. GitHub repository ကို Vercel နှင့် ချိတ်ဆက်ပါ။
2. Vercel Project Settings ထဲတွင် Environment Variables (`TELEGRAM_BOT_TOKEN`, `GEMINI_API_KEY`, စသည်) ကို ထည့်သွင်းပါ။
3. Deploy လုပ်ပြီးနောက် ရရှိလာသော Vercel URL ကို အသုံးပြု၍ Telegram Webhook ကို အောက်ပါအတိုင်း သတ်မှတ်ပါ:
   `https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook?url=<YOUR_VERCEL_URL>`
