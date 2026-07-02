const { Telegraf } = require('telegraf');
const { createClient } = require('@libsql/client');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const GEMINI_KEY = process.env.GEMINI_API_KEY;
const TURSO_URL = (process.env.TURSO_DATABASE_URL || "").replace('llibsql://', 'libsql://');
const TURSO_TOKEN = process.env.TURSO_AUTH_TOKEN;

const bot = new Telegraf(BOT_TOKEN);
const genAI = new GoogleGenerativeAI(GEMINI_KEY);
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
      
      await db.execute(`
        CREATE TABLE IF NOT EXISTS knowledge_base (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          keyword TEXT UNIQUE,
          response TEXT
        );
      `);
    }
  } catch (error) {
    console.error('❌ DB Init Error:', error);
  }
}

initDb();

async function findInKnowledgeBase(text) {
  try {
    const lowerText = text.toLowerCase();
    // Fetch all keywords to check locally for better matching
    const result = await db.execute('SELECT keyword, response FROM knowledge_base');
    
    for (const row of result.rows) {
      const keyword = row.keyword.toLowerCase();
      // If the message contains the keyword, return the response
      if (lowerText.includes(keyword)) {
        return row.response;
      }
    }
    return null;
  } catch (error) {
    console.error('❌ KB Search Error:', error);
    return null;
  }
}

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
  return ctx.reply('မင်္ဂလာပါဗျာ။ Kar Kar AI Bot ပြန်လည်အလုပ်လုပ်ပါပြီ။ ကျွန်တော့်ကို JavaScript နဲ့ Programming အကြောင်းတွေ မေးမြန်းနိုင်ပါတယ်!');
});

bot.on('text', async (ctx) => {
  const userId = ctx.from.id.toString();
  const userText = ctx.message.text;

  try {
    // 1. Check Knowledge Base first
    const kbResponse = await findInKnowledgeBase(userText);
    if (kbResponse) {
      await saveToMemory(userId, 'user', userText);
      await saveToMemory(userId, 'model', kbResponse);
      return ctx.reply(kbResponse + "\n\n(Retrieved from Local Knowledge Base)");
    }

    // 2. If not found in KB, try Gemini
    await saveToMemory(userId, 'user', userText);
    const memoryRows = await getChatMemory(userId);
    const history = memoryRows.map(row => ({
      role: row.role === 'user' ? 'user' : 'model',
      parts: [{ text: row.message }]
    }));

    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash',
    });

    const chat = model.startChat({
      history: history.slice(0, -1),
    });

    const result = await chat.sendMessage(userText);
    const aiAnswer = result.response.text();

    await saveToMemory(userId, 'model', aiAnswer);
    return ctx.reply(aiAnswer);

  } catch (error) {
    console.error("🤖 Bot Error:", error);
    if (error.message.includes('429')) {
      return ctx.reply("စိတ်မကောင်းပါဘူးဗျာ၊ လက်ရှိမှာ Gemini API Quota ပြည့်နေလို့ အဖြေမပေးနိုင်သေးပါဘူး။ ခဏနေမှ ပြန်စမ်းကြည့်ပေးပါ။");
    }
    return ctx.reply(`Error: ${error.message}`);
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
    res.status(200).send('Kar Kar AI Bot is active with Knowledge Base support.');
  }
};
