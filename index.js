require('dotenv').config();
const { Telegraf } = require('telegraf');
const { createClient } = require('@libsql/client');
const { GoogleGenAI } = require('@google/genai');

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const dbUrl = process.env.TURSO_DATABASE_URL ? process.env.TURSO_DATABASE_URL.replace('llibsql://', 'libsql://') : '';
const db = createClient({
  url: dbUrl,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

// Table initialization
async function initDb() {
  try {
    await db.execute(`
      CREATE TABLE IF NOT EXISTS chat_memory (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT,
        role TEXT,
        message TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Database initialized');
  } catch (error) {
    console.error('❌ DB Init Error:', error);
  }
}

initDb();

async function saveToMemory(userId, role, message) {
  try {
    await db.execute({
      sql: 'INSERT INTO chat_memory (user_id, role, message) VALUES (?, ?, ?)',
      args: [userId, role, message]
    });
  } catch (error) {
    console.error('❌ Database Save Error:', error);
  }
}

async function getChatMemory(userId) {
  try {
    const result = await db.execute({
      sql: 'SELECT role, message FROM chat_memory WHERE user_id = ? ORDER BY timestamp DESC LIMIT 10',
      args: [userId]
    });
    return result.rows.reverse();
  } catch (error) {
    console.error('❌ Database Retrieve Error:', error);
    return [];
  }
}

bot.start((ctx) => {
  console.log('Start command received');
  return ctx.reply('မင်္ဂလာပါဗျာ။ ကျွန်တော်က Turso Memory ပါဝင်တဲ့ Gemini AI Bot ဖြစ်ပါတယ်။ ကျွန်တော့်ကို စကားလုံးတွေ သင်ပေးပြီး စမ်းသပ်ကြည့်နိုင်ပါတယ်!');
});

bot.on('text', async (ctx) => {
  const userId = ctx.from.id.toString();
  const userText = ctx.message.text;
  console.log(`Message from ${userId}: ${userText}`);

  try {
    await saveToMemory(userId, 'user', userText);
    const memoryRows = await getChatMemory(userId);

    const chatContents = memoryRows.map(row => ({
      role: row.role === 'user' ? 'user' : 'model',
      parts: [{ text: row.message }]
    }));

    const model = ai.getGenerativeModel({
      model: 'gemini-1.5-flash',
      systemInstruction: "မင်းက ကူညီတတ်ပြီး ဉာဏ်ကောင်းတဲ့ AI Assistant တစ်ခုဖြစ်တယ်။ User နဲ့ အပြန်အလှန် ပြောဖူးသမျှ အချက်အလက်တွေကို မှတ်မိနေရမယ်။ အဖြေအားလုံးကို မြန်မာဘာသာစကားဖြင့်ပဲ ယဉ်ကျေးပျူငှာစွာ ဖြေကြားပေးပါ။"
    });

    const chat = model.startChat({
      history: chatContents.slice(0, -1),
    });

    const result = await chat.sendMessage(userText);
    const aiAnswer = result.response.text();

    await saveToMemory(userId, 'model', aiAnswer);
    return ctx.reply(aiAnswer);

  } catch (error) {
    console.error("🤖 Bot Main Process Error:", error);
    return ctx.reply('ဆောရီးဗျာ၊ တစ်ခုခု မှားယွင်းသွားလို့ စာပြန်လို့ မရသေးပါဘူးခင်ဗျာ။');
  }
});

// Vercel Serverless Function Handler
module.exports = async (req, res) => {
  if (req.method === 'POST') {
    try {
      await bot.handleUpdate(req.body);
      res.status(200).json({ ok: true });
    } catch (err) {
      console.error('Error handling update:', err);
      res.status(500).json({ error: err.message });
    }
  } else {
    res.status(200).send('Bot is running properly with Webhook.');
  }
};
