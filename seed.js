require('dotenv').config();
const { createClient } = require('@libsql/client');

const TURSO_URL = (process.env.TURSO_DATABASE_URL || "").replace('llibsql://', 'libsql://');
const TURSO_TOKEN = process.env.TURSO_AUTH_TOKEN;

const db = createClient({
  url: TURSO_URL,
  authToken: TURSO_TOKEN,
});

const baseProgrammingData = [
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

const topicData = [
  {
    label: 'variable',
    description: 'Variable ဆိုသည်မှာ အချက်အလက်တန်ဖိုးကို အမည်တစ်ခုဖြင့် သိမ်းဆည်းထားသော memory ကဏ္ဍတစ်ခုဖြစ်သည်။',
    usage: 'JavaScript မှာ `let`, `const`, `var` တို့ကို အသုံးပြုကာ သတ်မှတ်နိုင်သည်။',
    advice: 'variable ကို သုံးသည့်အချိန်မှာ သိမ်းဆည်းထားသော တန်ဖိုး၏ အမျိုးအစားနှင့် scope ကို သတိထားပါ။'
  },
  {
    label: 'function',
    description: 'Function ဆိုသည်မှာ ကုဒ်အစိတ်အပိုင်းတစ်ခုကို ပြန်လည်အသုံးချနိုင်ရန် အမည်ပေးထားသည့် ဆောင်ရွက်မှုတစ်ခုဖြစ်သည်။',
    usage: 'Parameter များကို လက်ခံပြီး အလုပ်လုပ်စေပြီး return statement ဖြင့် ထုတ်လွှတ်ပေးနိုင်သည်။',
    advice: 'function များကို ရှင်းသော နာမည်များနဲ့ ချရေးပြီး တစ်ခုချင်းစီ၏ တာဝန်ကို သတ်မှတ်ပေးပါ။'
  },
  {
    label: 'loop',
    description: 'Loop သည် ထပ်ခါထပ်ခါ ကုဒ်တုန့်ပြန်ဆောင်ရွက်ရန် အသုံးပြုသော statement ဖြစ်သည်။',
    usage: 'for, while, do-while စသည်ဖြင့် သတ်မှတ်ထားသော condition အထိ ဆက်လက်လုပ်ဆောင်နိုင်သည်။',
    advice: 'loop တွင် condition ကို မှန်ကန်စွာရေးဖို့ နှင့် infinite loop ဖြစ်ခြင်းကို တားဆီးရန် သတိထားပါ။'
  },
  {
    label: 'array',
    description: 'Array သည် ပစ္စည်းအချင်းချင်းတူသည့် elements များကို စုစည်းထားသည့် list တစ်ခုဖြစ်သည်။',
    usage: 'JavaScript မှာ square brackets `[]` ဖြင့် ဖန်တီးပြီး index နံပါတ်များဖြင့် element များကို ရယူနိုင်သည်။',
    advice: 'array ကို update ဖို့ push, pop, shift, unshift, splice စသည့် method များကို သိထားပါ။'
  },
  {
    label: 'object',
    description: 'Object ဆိုသည်မှာ key-value pair များအဖြစ် အချက်အလက်ကို စုစည်းထားသည့် data structure တစ်ခုဖြစ်သည်။',
    usage: 'JavaScript မှာ curly braces `{}` နဲ့ ဖန်တီးပြီး property name နှင့် value ကို သတ်မှတ်နိုင်သည်။',
    advice: 'object ထဲမှ property များကို access လုပ်ရာတွင် dot notation နဲ့ bracket notation တို့ကို သတိထားပါ။'
  },
  {
    label: 'string',
    description: 'String သည် စာလုံးများစွာကို ထည့်သိုလှောင်ထားသည့် character sequence တစ်ခုဖြစ်သည်။',
    usage: 'JavaScript မှာ single quotes, double quotes, template literals များဖြင့် string ကို ဖန်တီးနိုင်သည်။',
    advice: 'string operations တွေအတွက် length, slice, substring, replace စသည်တို့ကို အသုံးပြုနိုင်သည်။'
  },
  {
    label: 'number',
    description: 'Number သည် ဂဏန်းတန်ဖိုးများကို ကိုယ်စားပြုသည့် data type တစ်ခုဖြစ်သည်။',
    usage: 'JavaScript မှာ integer, float, negative number များကို တိုက်ရိုက် အသုံးပြုနိုင်သည်။',
    advice: 'ကုဒ်ရေးသည့်အခါ သင့်တန်ဖိုးများကို ကန့်သတ်မှုများ၊ rounding နှင့် arithmetic operations များအတွက် စဉ်းစားပါ။'
  },
  {
    label: 'boolean',
    description: 'Boolean သည် true သို့ false တန်ဖိုးတန်ဖိုးနှစ်ခုသာ ရနိုင်သော data type ဖြစ်သည်။',
    usage: 'Condition statements နှင့် logic comparison များတွင် boolean တန်ဖိုးများကို အဓိကသုံးသည်။',
    advice: 'boolean ကို အသုံးပြုသော logic ကို ရှင်းလင်းလင်းရေးထား၍ condition မမျှတမှုများကို လျှော့ချပေးပါ။'
  },
  {
    label: 'condition',
    description: 'Condition သည် true သို့ false ကို ဆုံးဖြတ်ပေးသည့်စည်းမျဉ်းတစ်ရပ်ဖြစ်သည်။',
    usage: 'Comparison operators နှင့် logical operators များဖြင့် condition ကို ဖန်တီးပြီး if statement တို့တွင် သုံးနိုင်သည်။',
    advice: 'condition များကို ရှင်းလင်းသော syntax နှင့် parentheses များဖြင့် သတ်မှတ်ပါ။'
  },
  {
    label: 'if statement',
    description: 'If statement သည် condition တစ်ခုအရ အချက်အလက်ကို လုပ်ဆောင်စေမည့် control flow statement တစ်ခုဖြစ်သည်။',
    usage: 'if (condition) { ... } စသည်ဖြင့် JavaScript နှင့် programming language များတွင် အသုံးပြုသည်။',
    advice: 'condition ကို မမှန်မမှင်ရိုက်မထည့်ရန် နှင့် ကိုယ်လိုချင်သလို output ကို အတိအကျသတ်မှတ်ပါ။'
  },
  {
    label: 'else statement',
    description: 'Else statement သည် if condition မမှန်ပါက အခြားအလုပ်တစ်ခုကို ပြုလုပ်စေသော branch တစ်ခုဖြစ်သည်။',
    usage: 'if statement နှင့်တွဲဖက်ပြီး else { ... } အဖြစ်အသုံးပြုနိုင်သည်။',
    advice: 'if-else ကို အသုံးပြုရာတွင် အချက်လက်စွန့်ခြင်းများကို ရှောင်ကြဉ်ပါ။'
  },
  {
    label: 'switch statement',
    description: 'Switch statement သည် value တစ်ခုအပေါ်မူတည်၍ အလုပ်စဉ်မျိုးစုံကို ခွဲခြားသတ်မှတ်နိုင်သည်။',
    usage: 'switch(expression) { case value: ... break; default: ... } စသည်ဖြင့်ရေးခိုင်းသည်။',
    advice: 'case များကို မှန်ကန်စွာ ထား၍ default branch ကို မမေ့ပါနဲ့။'
  },
  {
    label: 'function call',
    description: 'Function call သည် function ကို မိမိသတ်မှတ်ထားသည့် code block ကို လုပ်ဆောင်ရန် ခေါ်ယူခြင်းဖြစ်သည်။',
    usage: 'functionName(arguments) ဖြင့် function ကို ခေါ်ယူနိုင်ပါသည်။',
    advice: 'call လုပ်မည့် function ၏ parameters နဲ့ return type ကို ရှင်းလင်းစွာ သိရှိထားပါ။'
  },
  {
    label: 'parameter',
    description: 'Parameter သည် function သို့ ဗလာသို့ အချက်အလက်များကို ပေးပို့ရာတွင် အသုံးပြုသော variable တစ်ခုဖြစ်သည်။',
    usage: 'function myFunction(param1, param2) { ... } အဖြစ် parameter များကို သတ်မှတ်နိုင်သည်။',
    advice: 'parameter များကို ဝင်းရှင်းသော နာမည်များနှင့် သတ်မှတ်၍ function ရည်ရွယ်ချက်ကို ထောက်ခံပါ။'
  },
  {
    label: 'return value',
    description: 'Return value သည် function မှ ပြန်လာနိုင်သည့် တန်ဖိုးတစ်ခုဖြစ်သည်။',
    usage: '`return` statement ကို အသုံးပြုပြီး ကိုယ်လိုချင်သည့် data ကို ပြန်ပို့နိုင်သည်။',
    advice: 'function တစ်ခုစီ၏ output ကို ပြန်ပေးယူနိုင်ရန် return value ကို မှန်ကန်စွာ သတ်မှတ်ပါ။'
  },
  {
    label: 'class',
    description: 'Class သည် object-oriented programming တွင် object template တစ်ခုကို သတ်မှတ်သည့် blueprint ဖြစ်သည်။',
    usage: 'JavaScript မှာ `class MyClass { constructor() { ... } }` အမျိုးအစားအတွင်း တည်ဆောက်နိုင်သည်။',
    advice: 'class ကို သုံးပြီး object များကို ပြန်လည်အသုံးချနိုင်သော properties နှင့် methods များသတ်မှတ်ပါ။'
  },
  {
    label: 'inheritance',
    description: 'Inheritance သည် class တစ်ခုမှ အခြား class တစ်ခုသို့ properties နှင့် methods များကို ဆက်ခံပေးခြင်း ဖြစ်သည်။',
    usage: '`class Child extends Parent { ... }` အမျိုးအစားနဲ့ subclass ကို ဖန်တီးနိုင်သည်။',
    advice: 'inheritance ကို အသုံးပေးရာတွင် code ရိုးရှင်းစေရန် နှင့် တန်ဖိုးပြန်လည်အသုံးချပါ။'
  },
  {
    label: 'module',
    description: 'Module သည် code ကို ပိုင်းခြားထားသည့် ဖိုင် သို့ library တစ်ခုဖြစ်ပြီး reusability ကို တိုးတက်စေသည်။',
    usage: 'JavaScript မှာ `export` နှင့် `import` ကို အသုံးပြုပြီး module များကို ချိတ်ဆက်နိုင်သည်။',
    advice: 'module များကို function နှင့် data များကို သီးခြားသိမ်းဆည်းရန် အသုံးပြုပါ။'
  },
  {
    label: 'package',
    description: 'Package သည် code libraries, modules, တွေကို ဖိုင် bundle အနေဖြင့် စုစည်းထားသည့် unit တစ်ခုဖြစ်သည်။',
    usage: '`package.json` မှာ dependency များကို ရေးသားပြီး npm သို့ yarn မှတဆင့် install လုပ်နိုင်သည်။',
    advice: 'project တွင် အသုံးလိုလားသော packages များကို ရှင်းလင်းစွာ စီမံထားပါ။'
  },
  {
    label: 'npm',
    description: 'npm သည် Node.js မှ packages များကို install, manage လုပ်စေရန် အသုံးပြုသော package manager ဖြစ်သည်။',
    usage: '`npm install package-name` ကဲ့သို့က command များဖြင့် packages ကို ထည့်သွင်းနိုင်သည်။',
    advice: 'npm scripts နှင့် `package.json` ကို အသုံးပြုပြီး project workflow ကို စနစ်တကျ စီမံပါ။'
  },
  {
    label: 'git',
    description: 'Git သည် source code ကို version control များစွာနှင့် ချိတ်ဆက်ပြီး code history ကို ထိန်းသိမ်းရန် ကူညီသည်။',
    usage: '`git init`, `git add`, `git commit`, `git push` စသည်ဖြင့် project ကို version control လုပ်နိုင်သည်။',
    advice: 'commit message များကို ဖတ်ရှုရလွယ်ကူအောင် ရေးသားပြီး branch များကို သေချာစွာ စီမံပါ။'
  },
  {
    label: 'github',
    description: 'GitHub သည် Git repository များကို အွန်လိုင်းတွင် ဧရိယာပေးသည့် platform ဖြစ်သည်။',
    usage: 'repository ဖွင့်ခြင်း၊ collaboration အတွက် pull request ဖန်တီးခြင်း၊ issue တွေကို ထိန်းသိမ်းနိုင်သည်။',
    advice: 'GitHub ကို အသုံးပြုပြီး teamwork, code review, documentation အတွက် ပိုမိုကောင်းမွန်စေပါ။'
  },
  {
    label: 'html',
    description: 'HTML သည် web page ၏ structure ကို ဆောက်ပေးသော markup language ဖြစ်သည်။',
    usage: '`<div>`, `<p>`, `<a>` စသည်ဖြင့် element များကို တည်ဆောက်နိုင်သည်။',
    advice: 'semantic HTML ကို သုံးပြီး accessibility နှင့် SEO ကို စဉ်းစားပါ။'
  },
  {
    label: 'css',
    description: 'CSS သည် web page ၏ သူ့အင်္ကျီလျှာရွစေခြင်း၊ layout ပြုလုပ်ခြင်းတို့ကို အထောက်အပံ့ပေးသည်။',
    usage: 'selector, property, value များကို သတ်မှတ်၍ style များကို ထည့်သွင်းနိုင်သည်။',
    advice: 'CSS ကို maintain လွယ်အောင် classes, variables, modular design ကို အသုံးပြုပါ။'
  },
  {
    label: 'flexbox',
    description: 'Flexbox သည် layout အလွယ်တကူ ထိန်းချုပ်နိုင်စေရန် CSS display mode တစ်ခုဖြစ်သည်။',
    usage: '`display: flex;` ဖြင့် container ကို ဖန်တီးပြီး align-items, justify-content စသည့် property များကို သတ်မှတ်နိုင်သည်။',
    advice: 'flexbox ကို row နှင့် column layout များကို စိတ်တိုင်းကျ အဆင်ပြေစေပါသည်။'
  },
  {
    label: 'grid',
    description: 'CSS Grid သည် ကွန်တိနာကို row နှင့် column အခြေခံ layout ပုံစံဖြင့် ဖန်တီးနိုင်စေသည်။',
    usage: 'grid-template-columns, grid-template-rows, gap စသည့် property များကို သုံးနိုင်သည်။',
    advice: 'grid ကို responsive layout များအတွက် လေ့လာပြီး မိမိ page ကို ဖန်တီးစေပါ။'
  },
  {
    label: 'responsive design',
    description: 'Responsive design သည် မည်သည့် device မဆို display ကို ကိုက်ညီစေသော layout ပြုလုပ်ခြင်း ဖြစ်သည်။',
    usage: 'media queries, fluid units, flexible grids တို့ကို အသုံးပြုပြီး screen size အလိုက် ပြင်ဆင်နိုင်သည်။',
    advice: 'mobile-first design ကို အခြေပြုပြီး user experience ကို အရည်အသွေးမြင့်စေပါ။'
  },
  {
    label: 'api',
    description: 'API သည် application များအကြား data နှင့် service များကို ပြန်လည်ဖလှယ်နိုင်ရန် interface ဖြစ်သည်။',
    usage: 'REST API, GraphQL API စသည့် ပုံစံများဖြင့် request-response flow ကို တည်ဆောက်နိုင်သည်။',
    advice: 'API design တွင် clear endpoints, authentication, error handling များကို စီမံပါ။'
  },
  {
    label: 'endpoint',
    description: 'Endpoint သည် API ထဲမှ request များကို လက်ခံသည့် URL path တစ်ခုဖြစ်သည်။',
    usage: '`/users`, `/posts/:id` များကဲ့သို့ URL route များကို သတ်မှတ်နိုင်သည်။',
    advice: 'endpoint naming ကို ရိုးရှင်းသိသာစေပြီး RESTful principles ကို လိုက်နာပါ။'
  },
  {
    label: 'database',
    description: 'Database သည် structured data များကို သိမ်းဆည်းပြီး ထုတ်ယူရန် အသုံးပြုသည်။',
    usage: 'SQL databases တွင် table များတည်ဆောက်ပြီး query များဖြင့် data ကို ရရှိနိုင်သည်။',
    advice: 'database schema ကို သေချာစီမံပြီး data integrity နှင့် normalization ကို စဉ်းစားပါ။'
  },
  {
    label: 'sql',
    description: 'SQL သည် relational database များတွင် data ကို query, insert, update, delete လုပ်ရန် အသုံးပြုသော language ဖြစ်သည်။',
    usage: '`SELECT`, `INSERT`, `UPDATE`, `DELETE` စသည့် command များကို မှန်ကန်စွာ ရေးသားနိုင်ပါသည်။',
    advice: 'joins, indexes, transactions တို့ကို နားလည်ပြီး performance ကို ပိုမိုကောင်းမွန်စေပါ။'
  },
  {
    label: 'nosql',
    description: 'NoSQL သည် relational မဟုတ်သော database များကို ဆိုလိုပြီး flexible data model များကို ပံ့ပိုးသည်။',
    usage: 'document store, key-value store, graph database စသည့် NoSQL အမျိုးအစားများ ရှိသည်။',
    advice: 'NoSQL ကို schema-less design နှင့် scalability အတွက် အသုံးပြုပါ။'
  },
  {
    label: 'node.js',
    description: 'Node.js သည် JavaScript ကို server-side တွင် run အပ်နိုင်သည့် runtime environment ဖြစ်သည်။',
    usage: 'backend APIs, command-line tools, real-time applications များကို ဖန်တီးနိုင်သည်။',
    advice: 'event-driven architecture နှင့် asynchronous programming ကို နားလည်ခြင်း မရှိမဖြစ်လိုအပ်သည်။'
  },
  {
    label: 'express',
    description: 'Express သည် Node.js အတွက် lightweight web framework တစ်ခုဖြစ်ပြီး routing နှင့် middleware ကို ပံ့ပိုးသည်။',
    usage: '`app.get`, `app.post` စသဖြင့် route များကို သတ်မှတ်နိုင်သည်။',
    advice: 'middleware များကို စနစ်တကျ အသုံးပြုပြီး request flow ကို ကျောကျပုံစံထားပါ။'
  },
  {
    label: 'react',
    description: 'React သည် component-based JavaScript library တစ်ခုဖြစ်ပြီး user interfaces များကို ဖန်တီးပေးသည်။',
    usage: '`JSX` syntax ဖြင့် UI structure ကို ရေးသားနိုင်ပြီး state နှင့် props ဖြင့် data ကို ထိန်းချုပ်နိုင်သည်။',
    advice: 'component ထိန်းချုပ်မှုကို ပိုမို ကောင်းမွန်စေဖို့ reusable UI parts များ ဖန်တီးပါ။'
  },
  {
    label: 'component',
    description: 'Component သည် UI အပိုင်းအဆင်ငင်ကို သီးခြား သတ်မှတ်သည့် React element တစ်ခုဖြစ်သည်။',
    usage: 'function component သို့ class component အနေနဲ့ ဖန်တီးနိုင်ပြီး props နှင့် state ကို ထိန်းသိမ်းသည်။',
    advice: 'component များကို တိုတောင်းစွာထား၍ single responsibility principle ကို လိုက်နာပါ။'
  },
  {
    label: 'props',
    description: 'Props သည် parent component မှ child component ထံသို့ data ပေးပို့ရာတွဲ အသုံးပြုသော object ဖြစ်သည်။',
    usage: '`<Child value={data} />` ကဲ့သို့ props ကို component မှာ အပ်နိုင်သည်။',
    advice: 'props များကို read-only အဖြစ် သတ်မှတ်ထားပြီး component ထဲမှ မပြန်လည်ပြောင်းလဲပါ။'
  },
  {
    label: 'state',
    description: 'State သည် component ၏ ထိန်းချုပ်ထားသော dynamic data ကို ကိုယ်စားပြုသည့် object ဖြစ်သည်။',
    usage: 'React hooks တွင် `useState` ကို အသုံးပြုပြီး state ကို update လုပ်နိုင်သည်။',
    advice: 'state ကို သိသာထင်ရှားစွာနဲ့ ထိန်းသိမ်းပြီး unnecessary re-renders မဖြစ်စေရပါ။'
  },
  {
    label: 'lifecycle',
    description: 'Lifecycle သည် component ၏ creation, update, destruction စတင်မှုများကို ကိုယ်စားပြုသည်။',
    usage: 'React class components တွင် `componentDidMount`, `componentDidUpdate`, `componentWillUnmount` တို့ကို သုံးနိုင်သည်။',
    advice: 'lifecycle hooks များကို နားလည်ခြင်းသည် side effect များကို စနစ်တကျ ထိန်းချုပ်ရန် အရေးကြီးသည်။'
  },
  {
    label: 'hook',
    description: 'Hook သည် React function component များတွင် state နှင့် lifecycle features ကို အသုံးပြုရန် API တစ်ခုဖြစ်သည်။',
    usage: '`useState`, `useEffect`, `useMemo` စသည်တို့ကို component ထဲတွင် ခေါ်ယူနိုင်သည်။',
    advice: 'hook များကို rules of hooks လိုက်နာပြီး condition များအောက်တွင် မခေါ်မိပါနှင့်။'
  },
  {
    label: 'async',
    description: 'Async သည် asynchronous operation များကို ရေးသားရာတွင် function ကို အမှတ်အသားပြုရန် အသုံးပြုသည်။',
    usage: '`async function fetchData() { ... }` ကဲ့သို့ async function ကို ရေးနိုင်သည်။',
    advice: 'async ကို await နှင့် တွဲဖက်ပြီး promise များကို ရိုးရှင်းစွာ ကိုင်တွယ်ပါ။'
  },
  {
    label: 'await',
    description: 'Await သည် async function ထဲတွင် promise ရလဒ်ကို ရှေ့နေစွာ စောင့်ဆိုင်းရန် အသုံးပြုသည်။',
    usage: '`const data = await fetch(url);` မှာ promise ကို လက်ခံနိုင်သည်။',
    advice: 'await ကို async function မှသာ ခေါ်သုံးနိုင်ပြီး error handling ကို try/catch နဲ့ ပြုလုပ်ပါ။'
  },
  {
    label: 'promise',
    description: 'Promise သည် asynchronous operation ၏ အလားအလာရှိသော ရလဒ်ကို ကိုယ်စားပြုသည့် object ဖြစ်သည်။',
    usage: '`new Promise((resolve, reject) => { ... })` အဖြစ် ဖန်တီးနိုင်သည်။',
    advice: 'then/catch/finally များကို အသုံးပြုပြီး success နှင့် error case များကို ဖြန့်ချိပါ။'
  },
  {
    label: 'error handling',
    description: 'Error handling သည် application ထဲတွင် ပြဿနာများကို ဖမ်းယူပြီး 안전하게 ပြန်လည်ဆောင်ရွက်ခြင်း ဖြစ်သည်။',
    usage: 'JavaScript တွင် try/catch/finally ကို အသုံးပြု၍ ပြဿနာကို ကိုင်တွယ်နိုင်သည်။',
    advice: 'error messages များကို သိသာရှင်းလင်းစွာ ဖော်ပြပြီး user ကို အကူအညီပေးပါ။'
  },
  {
    label: 'debug',
    description: 'Debug သည် code ထဲမှ ပြဿနာများကို ရှာဖွေ၊ တိကျစွာ နားလည်ရန် အရေးကြီးသော လုပ်ငန်းစဉ်ဖြစ်သည်။',
    usage: 'console.log, debugger statement, browser devtools တို့ကို အသုံးပြုနိုင်သည်။',
    advice: 'bug ကို အခြေခံမှ စတင်၍ ဆက်လျှောက်ရှာဖွေပါ။ ပြင်ဆင်ရာ ဖော်ပြချက်များကို သပ်ရပ်စွာ ထားပါ။'
  },
  {
    label: 'terminal',
    description: 'Terminal သည် command-line interface ဖြစ်ပြီး project commands များကို run လုပ်ရာတွင် အသုံးပြုသည်။',
    usage: '`npm install`, `git status`, `node index.js` စသည်ဖြင့် command များကို အသုံးပြုနိုင်သည်။',
    advice: 'terminal command များကို အလုပ်ဖြစ်စေဖို့ 정확하게 ရိုက်ပါ။ path နှင့် directory အခြေအနေကို ကြည့်ပါ။'
  },
  {
    label: 'deployment',
    description: 'Deployment သည် application ကို production environment ထဲသို့ တင်ပြခြင်း ဖြစ်သည်။',
    usage: 'Vercel, Netlify, Heroku, AWS စသည့် service များမှတဆင့် upload လုပ်နိုင်သည်။',
    advice: 'deployment မှာ environment variables, build process, security settings များကို စဉ်းစားပါ။'
  },
  {
    label: 'hosting',
    description: 'Hosting သည် website သို့ application ကို online တွင် ရရှိနိုင်စေရန် server ပေါ်တွင် သိမ်းဆည်းခြင်း ဖြစ်သည်။',
    usage: 'shared hosting, VPS, cloud services များကို အသုံးပြုနိုင်သည်။',
    advice: 'hosting service ကို project ပမာဏနှင့် performance လိုအပ်ချက်များအတွက် ရွေးချယ်ပါ။'
  },
  {
    label: 'version control',
    description: 'Version control သည် code history ကို ထိန်းသိမ်းရန်နှင့် အပြောင်းအလဲများကို အလွယ်တကူအကောင်းဆုံး စီမံရန် နည်းလမ်းတစ်ခုဖြစ်သည်။',
    usage: '`git commit`, `git branch`, `git merge` စသည်ဖြင့် changes များကို အုပ်ချုပ်နိုင်သည်။',
    advice: 'regular commits, branch-based workflow, clear messages များကို အသုံးပြုပါ။'
  },
  {
    label: 'algorithm',
    description: 'Algorithm သည် ဖြေရှင်းရန်အတွက် လုပ်ဆောင်ချက်အစီအစဉ် တစ်ခုဖြစ်သည်။',
    usage: 'searching, sorting, pathfinding စသည်တို့အတွက် algorithm များကို ရေးသားနိုင်သည်။',
    advice: 'algorithm များကို time complexity နှင့် space complexity အရ သုံးသပ်ပါ။'
  }
];

const questionTemplates = [
  (topic) => ({
    keyword: `${topic.label} ဆိုတာဘာလဲ`,
    response: `တိကျစွာပြောရမယ်ဆိုရင် ${topic.description} ${topic.usage} ${topic.advice} ဤအကြောင်းအရာကို နားလည်ထားခြင်းသည် code ရေးရာတွင် အရေးကြီးပြီး သင်၏ တိုးတက်မှုကို မြန်ဆန်စေပါလိမ့်မည်။`
  }),
  (topic) => ({
    keyword: `${topic.label} ကို ဘယ်လို အသုံးပြုမလဲ`,
    response: `လက်တွေ့အသုံးပြုရန် ${topic.description} ${topic.usage} ${topic.advice} အဆင့်ဆင့် လေ့လာပြီး ကိုယ်ပိုင် နမူနာများ ရေးသားပါက သင်ယူမှု ပိုမို ခိုင်မာပါလိမ့်မည်။`
  }),
  (topic) => ({
    keyword: `${topic.label} အတွက် အခြေခံ syntax ဘာလဲ`,
    response: `Syntax အတွက် ${topic.description} ${topic.usage} ${topic.advice} syntax ကိုမှန်ကန်စွာ နားလည်ထားခြင်းက error များကို လျှော့ချနိုင်သည်။`
  }),
  (topic) => ({
    keyword: `${topic.label} ကို သင်ယူရင် ဘာတွေ အရေးကြီးသလဲ`,
    response: `သင်ယူရာတွင် ${topic.description} ${topic.usage} ${topic.advice} အဓိကအချက်မှာ concept များကို မှန်ကန်စွာ နားလည်ပြီး လက်တွေ့ application တွင် သုံးနိုင်ရန် ဖြစ်ပါသည်။`
  }),
  (topic) => ({
    keyword: `${topic.label} နဲ့ ပတ်သက်တဲ့ နမူနာ`,
    response: `ဥပမာအနေဖြင့် ${topic.description} ${topic.usage} ${topic.advice} ဤနမူနာများက သင်၏ နားလည်မှုကို တိုးမြှင့်ပေးပါလိမ့်မည်။`
  }),
  (topic) => ({
    keyword: `${topic.label} မှာ ဖြစ်နိုင်တဲ့ ပြဿနာတွေ`,
    response: `ပြဿနာများကိုရှောင်ရန် ${topic.description} ${topic.usage} ${topic.advice} ဒီအချက်များကို သတိပြုခြင်းဖြင့် code quality ကို ပိုမို မြင့်မားစေပါသည်။`
  }),
  (topic) => ({
    keyword: `${topic.label} ကို မြန်မြန်လေ့လာရန် အကြံပြုချက်`,
    response: `မြန်မြန်လေ့လာရန် ${topic.description} ${topic.usage} ${topic.advice} သင့်အတွက် နမူနာစာရေးခြင်း၊ အသုံးချခြင်းနှင့် ပြန်လည်သုံးသပ်ခြင်းကို အလေးထားပါ။`
  }),
  (topic) => ({
    keyword: `${topic.label} ကို လက်တွေ့အလုပ်တွင် ဘယ်လို သုံးမလဲ`,
    response: `လက်တွေ့လုပ်ငန်းများတွင် ${topic.description} ${topic.usage} ${topic.advice} project design ကို စဉ်းစားပြီး သုံးပါက အကျိုးရှိပါလိမ့်မည်။`
  }),
  (topic) => ({
    keyword: `${topic.label} ကို ရှင်းပြပါ`,
    response: `ရှင်းပြရမယ်ဆိုရင် ${topic.description} ${topic.usage} ${topic.advice} ရှင်းလင်းစွာ ရှင်းပြခြင်းက သင်၏ နားလည်မှုကို ပိုမိုတိုးတက်စေပါသည်။`
  }),
  (topic) => ({
    keyword: `${topic.label} ကို သင့်ရဲ့ project မှာ ဘယ်လို ထည့်မလဲ`,
    response: `Project ထဲမှာ ${topic.description} ${topic.usage} ${topic.advice} project architecture နှင့် use case များကို စဉ်းစားပြီး ထည့်သွင်းပါ။`
  })
];

const programmingData = baseProgrammingData.concat(
  topicData.flatMap((topic) => questionTemplates.map((template) => template(topic)))
);

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
