const { Telegraf } = require('telegraf');
const { createClient } = require('@libsql/client');
const { GoogleGenAI } = require('@google/genai');

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const GEMINI_KEY = process.env.GEMINI_API_KEY;
const TURSO_URL = (process.env.TURSO_DATABASE_URL || "").replace('llibsql://', 'libsql://');
const TURSO_TOKEN = process.env.TURSO_AUTH_TOKEN;

const bot = new Telegraf(BOT_TOKEN);
const ai = new GoogleGenAI(GEMINI_KEY);
const db = createClient({
  url: TURSO_URL,
  authToken: TURSO_TOKEN,
});

async function initDb() {
  try {
    if (TURSO_URL && TURSO_TOKEN) {
      await db.execute(`
        CREATE TABLE IF NOT EXISTS chat_memory (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id TEXT,
          role TEXT,
          message TEXT,
          timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        );
      `);
    }
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
  return ctx.reply('မင်္ဂလာပါဗျာ။ Kar Kar AI Bot ပြန်လည်အလုပ်လုပ်ပါပြီ။ ကျွန်တော့်ကို စကားလုံးတွေ သင်ပေးပြီး စမ်းသပ်ကြည့်နိုင်ပါတယ်!');
});

bot.on('text', async (ctx) => {
  const userId = ctx.from.id.toString();
  const userText = ctx.message.text;

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
    console.error("🤖 Bot Error:", error);
    return ctx.reply(`Gemini Error: ${error.message}\n\n(Debugging: Key starts with ${GEMINI_KEY ? GEMINI_KEY.substring(0, 5) : 'NONE'})`);
  }
});

module.exports = async (req, res) => {
  if (req.method === 'POST') {
    try {
      await bot.handleUpdate(req.body);
      res.status(200).json({ ok: true });
    } catch (err) {
      console.error('Webhook Error:', err);
      res.status(200).json({ error: err.message });
    }
  } else {
    res.status(200).send('Kar Kar AI Bot is active.');
  }
};
