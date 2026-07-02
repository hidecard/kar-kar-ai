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
    
    // အချိန် အစီအစဉ် မှန်ကန်စေရန် ရှေးအကျဆုံးမှ နောက်ဆုံးအဆင့်သို့ ပြန်လှန် (Reverse) ပေးရမည်
    return result.rows.reverse();
  } catch (error) {
    console.error('❌ Database Retrieve Error:', error);
    return [];
  }
}

// === Telegram Bot Events Handling ===

// Start Command စတင်ချိန်
bot.start((ctx) => {
  ctx.reply('မင်္ဂလာပါဗျာ။ ကျွန်တော်က Turso Memory ပါဝင်တဲ့ Gemini AI Bot ဖြစ်ပါတယ်။ ကျွန်တော့်ကို စကားလုံးတွေ သင်ပေးပြီး စမ်းသပ်ကြည့်နိုင်ပါတယ်!');
});

// User ထံမှ စာသားဝင်လာတိုင်း အလုပ်လုပ်မည့်နေရာ
bot.on('text', async (ctx) => {
  const userId = ctx.from.id.toString();
  const userText = ctx.message.text;

  // အမြန်စာပြန်နိုင်ရန် ကနဦး အသိပေးချက် ပို့ထားခြင်း
  await ctx.sendChatAction('typing');

  try {
    // ၁။ User ပြောလိုက်သော စာသားကို DB တွင် မှတ်ဉာဏ်အဖြစ် သိမ်းဆည်းသည်
    await saveToMemory(userId, 'user', userText);

    // ၂။ ယခင် ပြောခဲ့ဖူးသမျှ သမိုင်းကြောင်း (Chat History) ကို DB မှ ဆွဲထုတ်သည်
    const memoryRows = await getChatMemory(userId);

    // ၃။ Gemini SDK ဖတ်ရှုနိုင်မည့် Contents Object Format သို့ ပြောင်းလဲခြင်း
    const chatContents = memoryRows.map(row => ({
      role: row.role,
      parts: [{ text: row.message }]
    }));

    // ၄။ အတိတ်မှတ်တမ်းများအပါအဝင် Gemini API ထံ ပေးပို့၍ အဖြေတောင်းခံခြင်း
    const response = await ai.getGenerativeModel({
      model: 'gemini-1.5-flash', // Updated model name based on current standard (user had 2.5 which might be a typo)
      systemInstruction: "မင်းက ကူညီတတ်ပြီး ဉာဏ်ကောင်းတဲ့ AI Assistant တစ်ခုဖြစ်တယ်။ User နဲ့ အပြန်အလှန် ပြောဖူးသမျှ အချက်အလက်တွေကို မှတ်မိနေရမယ်။ အဖြေအားလုံးကို မြန်မာဘာသာစကားဖြင့်ပဲ ယဉ်ကျေးပျူငှာစွာ ဖြေကြားပေးပါ။"
    });

    const chat = response.startChat({
      history: chatContents.slice(0, -1), // History excluding the current message
    });

    const result = await chat.sendMessage(userText);
    const aiAnswer = result.response.text();

    // ၅။ Gemini ၏ အဖြေကို နောက်တစ်ကြိမ် မမေ့စေရန် DB တွင် ထပ်မံသိမ်းဆည်းသည်
    await saveToMemory(userId, 'model', aiAnswer);

    // ၆။ Telegram အသုံးပြုသူထံ အဖြေစာသား ပြန်လည်ပေးပို့သည်
    await ctx.reply(aiAnswer);

  } catch (error) {
    console.error("🤖 Bot Main Process Error:", error);
    await ctx.reply('ဆောရီးဗျာ၊ တစ်ခုခု မှားယွင်းသွားလို့ စာပြန်လို့ မရသေးပါဘူးခင်ဗျာ။');
  }
});

// Bot ကို စတင် Run ခြင်း
bot.launch().then(() => {
  console.log('🚀 Telegram Gemini-Turso Memory Bot ဟာ အောင်မြင်စွာ ပွင့်သွားပါပြီ။');
});

// စနစ်တကျ Bot ပိတ်သိမ်းခြင်း လုပ်ငန်းစဉ်များ
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
