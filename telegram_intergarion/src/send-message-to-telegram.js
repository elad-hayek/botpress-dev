const { Telegraf } = require("telegraf");
const axios = require("axios");
const getUuidByString = require("uuid-by-string");
const  { Client } = require("@botpress/client");

const API_BASE = "https://beige-beds-smell.loca.lt";
const telegraf =  new Telegraf("6875692446:AAGbeU9IpGw06dcgf8L1M8mXOFBnBYQKt-I");

const botpressClient = new Client({
  token: 'bp_pat_3Z0lsrrE4QRk3kjHweFXCJzsEFiCLkGtZxwu',
  headers: {'x-bot-id': 'b13d5719-396e-4c6c-998c-f19d25457c4b'}
});

const sendMessage = async (user) => {
  // const message = await telegraf.telegram.sendMessage(
  //   user.conversationId,
  //   "sent automatically"
  // );

  const response = await botpressClient.createMessage({
      type: "text",
      userId: user.id,
      conversationId: user.conversationId,
      payload: { text: "hello again" },
      schedule:{ dateTime: user.remindAt},
      // tags: { "telegramtest:id": `${randomUUID()}` },
  })

  await log("🚀 ~ file: api.ts:58 ~ start ~ message:", response);
};

const getOrCreateUser = async (userId, body) => {
  const user = await axios.get(`${API_BASE}/state/${userId}`);
  if (!user.data) await axios.post(`${API_BASE}/state/${userId}`, body);
};

const updateUser = async (userId, body) => {
  await axios.post(`${API_BASE}/state/${userId}`, body);
};

const listener = async () => {
  const users = await fetchStates();
  users.forEach(async (user) => {
    if (user.remindAt) {
      await sendMessage(user);
      await updateUser(user.id, { remindAt: null });
    }
  });
};

const fetchStates = async () => {
  const states = await axios.get(`${API_BASE}/states`);
  // console.log(states.data);
  return states.data;
};

const log = (text, any) => {
  const promise = new Promise((resolve) => {
    console.log(text, any);
    resolve();
  });
  return promise;
};

const intervalId = setInterval(async () => {
  await log("Starting interval --------------------------------");
  await listener();
}, 5 * 1000);

setTimeout(() => clearInterval(intervalId), 5 * 60 * 1000);
