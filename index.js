require('dotenv').config();
const { Telegraf } = require('telegraf');
const { createClient } = require('@libsql/client');
const { GoogleGenAI } = require('@google/genai');

// Package များကို စတင်သက်ဝင်စေခြင်း
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

/**
 * စကားပြောမှတ်တမ်းများကို Turso DB ထဲတွင် သိမ်းဆည်းပေးမည့် Function
 */
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

/**
 * User တစ်ဦးချင်းစီ၏ နောက်ဆုံးပြောခဲ့သော စကားပြောမှတ်တမ်း ၁၀ ကြောင်းကို ပြန်ယူပေးမည့် Function
 */
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

// === Telegram Bot Events Handling ===

bot.start((ctx) => {
  ctx.reply('မင်္ဂလာပါဗျာ။ ကျွန်တော်က Turso Memory ပါဝင်တဲ့ Gemini AI Bot ဖြစ်ပါတယ်။ ကျွန်တော့်ကို စကားလုံးတွေ သင်ပေးပြီး စမ်းသပ်ကြည့်နိုင်ပါတယ်!');
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
    await ctx.reply(aiAnswer);

  } catch (error) {
    console.error("🤖 Bot Main Process Error:", error);
    await ctx.reply('ဆောရီးဗျာ၊ တစ်ခုခု မှားယွင်းသွားလို့ စာပြန်လို့ မရသေးပါဘူးခင်ဗျာ။');
  }
});

// Vercel Serverless Function Handler
module.exports = async (req, res) => {
  try {
    if (req.method === 'POST') {
      await bot.handleUpdate(req.body);
      res.status(200).send('OK');
    } else {
      res.status(200).send('Bot is running...');
    }
  } catch (error) {
    console.error('Webhook Error:', error);
    res.status(500).send('Internal Server Error');
  }
};
