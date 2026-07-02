require('dotenv').config();
const { createClient } = require('@libsql/client');

const TURSO_URL = (process.env.TURSO_DATABASE_URL || "").replace('llibsql://', 'libsql://');
const TURSO_TOKEN = process.env.TURSO_AUTH_TOKEN;

const db = createClient({
  url: TURSO_URL,
  authToken: TURSO_TOKEN,
});

const programmingData = [
  { keyword: 'javascript', response: 'JavaScript သည် Web Development အတွက် အဓိကသုံးသော Programming Language တစ်ခု ဖြစ်ပါသည်။' },
  { keyword: 'python', response: 'Python သည် ဖတ်ရလွယ်ကူပြီး AI, Data Science နှင့် Backend ပိုင်းတွင် အသုံးများသော Language ဖြစ်သည်။' },
  { keyword: 'html', response: 'HTML သည် Website တစ်ခု၏ Structure (အရိုးစု) ကို တည်ဆောက်ပေးသော Markup Language ဖြစ်သည်။' },
  { keyword: 'css', response: 'CSS သည် Website တစ်ခုကို လှပအောင် အရောင်သွင်းခြင်း၊ Layout ချခြင်းများ ပြုလုပ်ပေးသည်။' },
  { keyword: 'react', response: 'React သည် Facebook မှ ထုတ်လုပ်ထားသော UI Components များ တည်ဆောက်ရန် သုံးသည့် JavaScript Library တစ်ခုဖြစ်သည်။' },
  { keyword: 'node.js', response: 'Node.js သည် JavaScript ကို Browser အပြင်ဘက် (Server-side) တွင် run နိုင်အောင် လုပ်ဆောင်ပေးသော Runtime တစ်ခုဖြစ်သည်။' },
  { keyword: 'database', response: 'Database ဆိုသည်မှာ အချက်အလက်များကို စနစ်တကျ သိမ်းဆည်းထားသော နေရာတစ်ခုဖြစ်သည်။ ဥပမာ - MySQL, PostgreSQL, Turso.' },
  { keyword: 'api', response: 'API ဆိုသည်မှာ Software တစ်ခုနှင့်တစ်ခု အချက်အလက် ဖလှယ်နိုင်ရန် ချိတ်ဆက်ပေးသော စနစ်ဖြစ်သည်။' },
  { keyword: 'git', response: 'Git သည် Code version များကို ထိန်းချုပ်ရန် (Version Control) အသုံးပြုသော စနစ်ဖြစ်သည်။' },
  { keyword: 'programming', response: 'Programming ဆိုသည်မှာ ကွန်ပျူတာကို အလုပ်ခိုင်းရန်အတွက် ညွှန်ကြားချက်များ ရေးသားခြင်း ဖြစ်သည်။' },
  { keyword: 'ဘာတွေလုပ်လို့ရလဲ', response: 'ကျွန်တော်က Programming အကြောင်းတွေကို ဖြေပေးနိုင်ပါတယ်။ သိချင်တာရှိရင် keyword လေးတွေနဲ့ မေးကြည့်ပါဗျာ။' },
  { keyword: 'ဘာလုပ်လို့ရလဲ', response: 'ကျွန်တော်က Programming အကြောင်းတွေကို ဖြေပေးနိုင်ပါတယ်။ သိချင်တာရှိရင် keyword လေးတွေနဲ့ မေးကြည့်ပါဗျာ။' },
  { keyword: 'ဟယ်လို', response: 'မင်္ဂလာပါဗျာ! Kar Kar AI မှ ကြိုဆိုပါတယ်။ ဘာများ ကူညီပေးရမလဲခင်ဗျာ။' },
  { keyword: 'hello', response: 'မင်္ဂလာပါဗျာ! Kar Kar AI မှ ကြိုဆိုပါတယ်။ ဘာများ ကူညီပေးရမလဲခင်ဗျာ။' }
];

async function seed() {
  console.log('🌱 Seeding database...');
  for (const item of programmingData) {
    try {
      await db.execute({
        sql: 'INSERT OR REPLACE INTO knowledge_base (keyword, response) VALUES (?, ?)',
        args: [item.keyword.toLowerCase(), item.response]
      });
      console.log(`✅ Added: ${item.keyword}`);
    } catch (error) {
      console.error(`❌ Error adding ${item.keyword}:`, error);
    }
  }
  console.log('✨ Seeding complete!');
  process.exit(0);
}

seed();
