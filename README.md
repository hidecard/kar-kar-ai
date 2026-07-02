# Kar Kar AI Telegram Bot

ဤစနစ်သည် User တစ်ယောက်ချင်းစီ၏ စကားပြောမှတ်တမ်းကို Turso DB ထဲတွင် သိမ်းဆည်းပြီး Turso Database ရှိ Knowledge Base မှ အချက်အလက်များကို အခြေခံ၍ အဖြေပေးသော **Knowledge-Based Chatbot** ဖြစ်သည်။ Gemini AI ကို ဖယ်ရှားထားပြီး ကိုယ်ပိုင် Database မှ အချက်အလက်များကိုသာ အသုံးပြုပါသည်။

## 🚀 Features
- **Telegram Integration**: Telegraf framework ကို အသုံးပြုထားသည်။
- **Knowledge Base**: Turso DB (SQLite) ရှိ `knowledge_base` table မှ အချက်အလက်များကို အခြေခံ၍ အဖြေပေးသည်။
- **Memory (Stateful)**: User တစ်ဦးချင်းစီ၏ chat history ကို `chat_memory` table တွင် မှတ်သားထားသည်။

## 🛠 Setup Instructions

### 1. Database Preparation (Turso)
အောက်ပါ SQL table များကို ဆောက်ရန် လိုအပ်သည် (Bot မှ အလိုအလျောက် ဆောက်ပေးမည်ဖြစ်သော်လည်း manual ဆောက်လိုပါက):
```sql
CREATE TABLE chat_memory (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT,
    role TEXT,
    message TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE knowledge_base (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    keyword TEXT UNIQUE,
    response TEXT
);
```

### 2. Knowledge Base ထဲသို့ အချက်အလက်ထည့်ခြင်း
Bot အဖြေပေးနိုင်ရန် Turso DB ထဲရှိ `knowledge_base` table တွင် keyword နှင့် response များ ထည့်ထားရန် လိုအပ်သည်။
ဥပမာ - keyword: `javascript`, response: `JavaScript သည် Web Development အတွက် အဓိကသုံးသော Programming Language တစ်ခု ဖြစ်ပါသည်။`

### 3. Installation
```bash
npm install
```

### 4. Environment Variables
`.env` file ဆောက်ပြီး အောက်ပါ key များ ထည့်သွင်းပါ:
```env
TELEGRAM_BOT_TOKEN=your_bot_token
TURSO_DATABASE_URL=your_turso_db_url
TURSO_AUTH_TOKEN=your_turso_auth_token
```

### 5. Running the Bot
Vercel ပေါ်တွင် Webhook အနေဖြင့် အလုပ်လုပ်ရန် ပြင်ဆင်ထားသည်။

### 6. Vercel Deployment
1. GitHub repository ကို Vercel နှင့် ချိတ်ဆက်ပါ။
2. Vercel Project Settings ထဲတွင် Environment Variables (`TELEGRAM_BOT_TOKEN`, `TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN`) ကို ထည့်သွင်းပါ။
3. Deploy လုပ်ပြီးနောက် ရရှိလာသော Vercel URL ကို အသုံးပြု၍ Telegram Webhook ကို အောက်ပါအတိုင်း သတ်မှတ်ပါ:
   `https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook?url=<YOUR_VERCEL_URL>`
