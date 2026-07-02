require('dotenv').config();
const { Telegraf } = require('telegraf');
const { createClient } = require('@libsql/client');
const { GoogleGenAI } = require('@google/genai');

// Package များကို စတင်သက်ဝင်စေခြင်း
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Fix Database URL (removing the extra 'l')
const dbUrl = process.env.TURSO_DATABASE_URL ? process.env.TURSO_DATABASE_URL.replace('llibsql://', 'libsql://') : '';

const db = createClient({
  url: dbUrl,
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
  return ctx.reply('မင်္ဂလာပါဗျာ။ ကျွန်တော်က Turso Memory ပါဝင်တဲ့ Gemini AI Bot ဖြစ်ပါတယ်။ ကျွန်တော့်ကို စကားလုံးတွေ သင်ပေးပြီး စမ်းသပ်ကြည့်နိုင်ပါတယ်!');
});

bot.on('text', async (ctx) => {
  const userId = ctx.from.id.toString();
  const userText = ctx.message.text;

  try {
    // ၁။ User ပြောလိုက်သော စာသားကို DB တွင် မှတ်ဉာဏ်အဖြစ် သိမ်းဆည်းသည်
    await saveToMemory(userId, 'user', userText);

    // ၂။ ယခင် ပြောခဲ့ဖူးသမျှ သမိုင်းကြောင်း (Chat History) ကို DB မှ ဆွဲထုတ်သည်
    const memoryRows = await getChatMemory(userId);

    // ၃။ Gemini SDK ဖတ်ရှုနိုင်မည့် Contents Object Format သို့ ပြောင်းလဲခြင်း
    const chatContents = memoryRows.map(row => ({
      role: row.role === 'user' ? 'user' : 'model',
      parts: [{ text: row.message }]
    }));

    // ၄။ အတိတ်မှတ်တမ်းများအပါအဝင် Gemini API ထံ ပေးပို့၍ အဖြေတောင်းခံခြင်း
    const model = ai.getGenerativeModel({
      model: 'gemini-1.5-flash',
      systemInstruction: "မင်းက ကူညီတတ်ပြီး ဉာဏ်ကောင်းတဲ့ AI Assistant တစ်ခုဖြစ်တယ်။ User နဲ့ အပြန်အလှန် ပြောဖူးသမျှ အချက်အလက်တွေကို မှတ်မိနေရမယ်။ အဖြေအားလုံးကို မြန်မာဘာသာစကားဖြင့်ပဲ ယဉ်ကျေးပျူငှာစွာ ဖြေကြားပေးပါ။"
    });

    const chat = model.startChat({
      history: chatContents.slice(0, -1),
    });

    const result = await chat.sendMessage(userText);
    const aiAnswer = result.response.text();

    // ၅။ Gemini ၏ အဖြေကို နောက်တစ်ကြိမ် မမေ့စေရန် DB တွင် ထပ်မံသိမ်းဆည်းသည်
    await saveToMemory(userId, 'model', aiAnswer);

    // ၆။ Telegram အသုံးပြုသူထံ အဖြေစာသား ပြန်လည်ပေးပို့သည်
    return ctx.reply(aiAnswer);

  } catch (error) {
    console.error("🤖 Bot Main Process Error:", error);
    return ctx.reply('ဆောရီးဗျာ၊ တစ်ခုခု မှားယွင်းသွားလို့ စာပြန်လို့ မရသေးပါဘူးခင်ဗျာ။');
  }
});

// Vercel Serverless Function Handler using Telegraf's built-in webhookCallback
module.exports = bot.webhookCallback('/');
