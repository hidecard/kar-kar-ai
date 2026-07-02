const { Telegraf } = require('telegraf');

// Use the token directly for testing to rule out environment variable issues
// If you want to keep using env, ensure they are set in Vercel dashboard
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || "8987676029:AAE5DXSpRA6v7xN77uTuIRQXAB-0jiu9Yes";

const bot = new Telegraf(BOT_TOKEN);

bot.start((ctx) => {
  return ctx.reply('Kar Kar AI Bot is now ONLINE! (Test Mode)');
});

bot.on('text', async (ctx) => {
  const userText = ctx.message.text;
  return ctx.reply(`You said: ${userText}\n(Note: Gemini AI is temporarily disabled for testing token connectivity)`);
});

module.exports = async (req, res) => {
  if (req.method === 'POST') {
    try {
      // Manual handle update to avoid any telegraf internal getMe calls if possible
      await bot.handleUpdate(req.body);
      res.status(200).json({ ok: true });
    } catch (err) {
      console.error('Detailed Webhook Error:', err);
      res.status(200).json({ error: err.message, stack: err.stack });
    }
  } else {
    res.status(200).send('Kar Kar AI Test Bot is running.');
  }
};
