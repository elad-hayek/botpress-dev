const { Telegraf } = require("telegraf");
const axios = require("axios");
const getUuidByString = require("uuid-by-string");
const { Client } = require("@botpress/client");
const { randomUUID } = require("crypto");

const API_BASE = "https://deep-pianos-behave.loca.lt";
const telegraf = new Telegraf("6875692446:AAGbeU9IpGw06dcgf8L1M8mXOFBnBYQKt-I");

const botpressClient = new Client({
  token: "bp_pat_UMuca9pc0BisBmMMeOILxPafDf0IoLZO3hov",
  headers: {
    "x-bot-id": "b13d5719-396e-4c6c-998c-f19d25457c4b",
    "x-integration-id": "intver_01HGK80ZN36R1ZM0Z4PYT0P4Q9",
  },
});

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

// const intervalId = setInterval(async () => {
//   await log("Starting interval --------------------------------");
//   await listener();
// }, 5 * 1000);

// setTimeout(() => clearInterval(intervalId), 5 * 60 * 1000);

const sendMessage = async (user) => {
  // const message = await telegraf.telegram.sendMessage(
  //   user.conversationId,
  //   "sent automatically"
  // );

  const currentDate = new Date();
  currentDate.setMinutes(currentDate.getMinutes() + 1);

  const response = await botpressClient.createMessage({
    type: "text",
    // userId: "b446dfd9-90a3-46bd-912f-0a77f270ba3e",
    userId: "0e797e81-eebc-4785-88bd-3a4e0de6ac9b",
    conversationId: "5bececa5-632a-4b2a-85a8-e379d546ad63",
    payload: { text: "@getBackToWork" },
    // schedule: { dateTime: currentDate.toISOString() },
    // schedule: { delay: 3000 },
    tags: { "telegramtest:id": "" },
  });

  await log(response.message);
};

const getMessages = async () => {
  const response = await botpressClient.listMessages({
    conversationId: "5bececa5-632a-4b2a-85a8-e379d546ad63",
  });

  await log(response.messages);
};

const getUsers = async () => {
  const response = await botpressClient.listUsers();

  await log(response.users);
};

// getMessages();
// getUsers()
sendMessage();
