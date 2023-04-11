const { Telegraf, Markup } = require("telegraf");
const cron = require("node-cron");

require("dotenv").config();

const workers = require("./workers");

console.log(workers);
const bot = new Telegraf(process.env.TELEGRAM_API_TOKEN);
const chat_id = -872858162;

const reply_chat_id = -875342255;

let checkMessages = false;
let wellDone = [];

/////////////////

const NOT_WORK_KEYBOARD = [
  [{ text: "Этот час не работаю", callback_data: "notWork" }],
  [],
  [],
];

////////////////

function checkTime(time) {
  const hour = new Date().getHours();

  return time.start <= hour && time.end > hour;
}

function checkLastTIme(time) {
  const hour = new Date().getHours();

  return time.end === hour;
}

cron.schedule(
  "0 9-19 * * 1-5",
  () => {
    const day = new Date().getDay();

    const currentWorkers = workers.filter((worker) =>
      worker.all ? checkTime(worker.work) : checkTime(worker.days[day])
    );

    const lastTimeWorkers = workers.filter((worker) =>
      worker.all ? checkLastTIme(worker.work) : checkLastTIme(worker.days[day])
    );

    console.log("CURRENT WORKERS", currentWorkers);

    if (currentWorkers.length > 0) {
      const markWorkers = currentWorkers
        .map((worker) => `@${worker.user}`)
        .join(", ");
      const message = `${markWorkers} напишите в чат своё текущее задание. \nЕсли задания нет, то возьмите его у Максима, далее уведомите о нём в текущий чат.`;

      bot.telegram.sendMessage(chat_id, message, {
        reply_markup: {
          keyboard: NOT_WORK_KEYBOARD,
          one_time_keyboard: true,
          resize_keyboard: true,
        },
      });

      checkMessages = true;
    }

    if (lastTimeWorkers.length > 0) {
      const markWorkers = lastTimeWorkers
        .map((worker) => `@${worker.user}`)
        .join(", ");
      const message = `${markWorkers} напишите на какой задаче вы закончили рабочий день и выполнили ли вы её до конца?`;

      bot.telegram.sendMessage(chat_id, message);
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

    wellDone = [];
    checkMessages = false;
  },
  {
    scheduled: true,
    timezone: "Europe/Moscow",
  }
);

bot.start((ctx) => ctx.reply("Привет."));
bot.on("message", (ctx) => {
  console.log(ctx);
  // console.log(ctx.message.chat);
  // console.log(ctx);
  console.log(ctx.update.message.chat);

  const user = ctx.message.from.username;
  const isWorker = workers.map((worker) => worker.user).includes(user);

  if (ctx.message.text === "Этот час не работаю" && isWorker) {
    wellDone.push(user);
    return;
  }

  if (checkMessages && ctx.message.chat.id === chat_id) {
    if (isWorker) {
      if (!wellDone.includes(user)) {
        ctx.forwardMessage(reply_chat_id);
      }
      wellDone.push(user);
    }
  }
});

bot.launch();

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
