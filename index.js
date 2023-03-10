const { Telegraf, Markup } = require("telegraf");

const cron = require("node-cron");

require("dotenv").config();

const workers = require("./workers");

console.log(workers);
const bot = new Telegraf(process.env.TELEGRAM_API_TOKEN);
const chat_id = -875342255;
// const chat_id = -872858162;

//back 10-14
//front 10-16, 10-14
//test 15-19

let checkMessages = false;
const wellDone = [];

function checkTime(time) {
  const hour = new Date().getHours();

  return time.start <= hour && time.end > hour;
}

cron.schedule(
  "0 9-19 * * 1-5",
  () => {
    const day = new Date().getDay();

    const currentWorkers = workers.filter((worker) =>
      worker.all ? checkTime(worker.work) : checkTime(worker.days[day])
    );

    console.log("CURRENT WORKERS", currentWorkers);

    if (currentWorkers.length > 0) {
      const markWorkers = currentWorkers
        .map((worker) => `@${worker.user}`)
        .join(", ");
      const message = `${markWorkers} напишите в чат своё текущее задание. \nЕсли задания нет, то возьмите его у Максима, далее уведомите о нём в текущий чат.`;

      bot.telegram.sendMessage(chat_id, message);

      checkMessages = true;
    }
  },
  {
    scheduled: true,
    timezone: "Europe/Moscow",
  }
);

cron.schedule(
  "15 9-19 * * 1-5",
  () => {
    const day = new Date().getDay();

    const currentWorkers = workers.filter((worker) =>
      worker.all ? checkTime(worker.work) : checkTime(worker.days[day])
    );

    const badUsers = currentWorkers.filter(
      (worker) => !wellDone.includes(worker.user)
    );

    if (badUsers.length > 0) {
      const badUsersStr = badUsers
        .map((worker) => `@${worker.user}`)
        .join(", ");
      const message = `${badUsersStr} - не написали ничего в чат.\n Отмечаю @kawasakime`;

      bot.telegram.sendMessage(chat_id, message);
    }

    checkMessages = false;
  },
  {
    scheduled: true,
    timezone: "Europe/Moscow",
  }
);

// const buttons = Markup.inlineKeyboard([
//   [Markup.callbackButton("Test", "test")],
//   [Markup.callbackButton("Test 2", "test2")],
// ]);

const keyboard = [
  [
    {
      text: "Хочу кота", // текст на кнопке
      callback_data: "moreKeks", // данные для обработчика событий
    },
  ],
  [
    {
      text: "Хочу песика",
      callback_data: "morePes",
    },
  ],
  [
    {
      text: "Хочу проходить курсы",
      url: "https://htmlacademy.ru/courses", //внешняя ссылка
    },
  ],
];

bot.telegram.sendMessage(
  chat_id,
  "123",
  Markup.keyboard([
    ["🔍 Search", "😎 Popular"], // Row1 with 2 buttons
    ["☸ Setting", "📞 Feedback"], // Row2 with 2 buttons
    ["📢 Ads", "⭐️ Rate us", "👥 Share"], // Row3 with 3 buttons
  ])
    .oneTime()
    .resize()
    .extra()
);

bot.start((ctx) => ctx.reply("Привет."));
bot.on("callback_query", (query) => {
  const msg = query.message;
  query.answerCbQuery("Записано");
  // bot
  //   .answerCallbackQuery(query.id)
  //   .then(() => bot.sendMessage(msg.chat.id, "You clicked!"));
});

bot.on("message", (ctx) => {
  console.log(ctx.message);

  if (checkMessages) {
    const user = ctx.message.from.username;

    if (workers.map((worker) => worker.user).includes(user)) {
      wellDone.push(user);
    }
  }
});
bot.launch();

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
