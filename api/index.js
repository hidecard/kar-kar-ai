const { Telegraf } = require('telegraf');
const { createClient } = require('@libsql/client');

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TURSO_URL = (process.env.TURSO_DATABASE_URL || "").replace('llibsql://', 'libsql://');
const TURSO_TOKEN = process.env.TURSO_AUTH_TOKEN;

const bot = new Telegraf(BOT_TOKEN);
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
      console.log('✅ Database tables initialized.');
    }
  } catch (error) {
    console.error('❌ DB Init Error:', error);
  }
}

initDb();

async function findInKnowledgeBase(text) {
  try {
    const lowerText = text.toLowerCase().trim();
    // Fetch all keywords to check locally for better matching
    const result = await db.execute('SELECT keyword, response FROM knowledge_base');
    
    for (const row of result.rows) {
      const keyword = row.keyword.toLowerCase().trim();
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

bot.start((ctx) => {
  return ctx.reply('မင်္ဂလာပါဗျာ။ Kar Kar AI Bot မှ ကြိုဆိုပါတယ်။ ကျွန်တော်သိတဲ့ JavaScript နဲ့ Programming အကြောင်းတွေကို မေးမြန်းနိုင်ပါတယ်!');
});

bot.on('text', async (ctx) => {
  const userId = ctx.from.id.toString();
  const userText = ctx.message.text;

  try {
    // 1. Check Knowledge Base
    const kbResponse = await findInKnowledgeBase(userText);
    
    await saveToMemory(userId, 'user', userText);

    if (kbResponse) {
      await saveToMemory(userId, 'bot', kbResponse);
      return ctx.reply(kbResponse);
    } else {
      const fallbackMsg = "စိတ်မကောင်းပါဘူးဗျာ၊ အဲ့ဒီအကြောင်းအရာကို ကျွန်တော် မသိသေးပါဘူး။ နောက်မှ ထပ်မေးကြည့်ပေးပါဦး။";
      await saveToMemory(userId, 'bot', fallbackMsg);
      return ctx.reply(fallbackMsg);
    }

  } catch (error) {
    console.error("🤖 Bot Error:", error);
    return ctx.reply(`Error: တစ်ခုခုမှားယွင်းနေပါတယ်ဗျာ။`);
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
    res.status(200).send('Kar Kar AI Bot is active (Knowledge Base Only Mode).');
  }
};
