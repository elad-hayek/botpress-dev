const { Telegraf } = require("telegraf");
const axios = require("axios");
const getUuidByString = require("uuid-by-string");

const API_BASE = "https://long-buttons-lie.loca.lt";

const sendMessage = async (user) => {
  const telegraf = new Telegraf(
    "6875692446:AAGbeU9IpGw06dcgf8L1M8mXOFBnBYQKt-I"
  );
  const message = await telegraf.telegram.sendMessage(
    // "6035673625",
    user.conversationId,
    "sent automatically"
  );
  console.log("🚀 ~ file: api.ts:58 ~ start ~ message:", message);
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
  console.log(states.data);
  return states.data;
};

const log = (text) => {
  const promise = new Promise((resolve) => {
    console.log(text);
    resolve();
  });
  return promise;
};

const intervalId = setInterval(async () => {
  await log("Starting interval --------------------------------");
  await listener();
}, 2000);

setTimeout(() => clearInterval(intervalId), 10000);
