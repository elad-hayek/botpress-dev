import axios from "axios";
import { Client } from "@botpress/client";
import getUuidByString from "uuid-by-string";
import { randomUUID } from "crypto";
import { Telegraf } from "telegraf";

// const API_BASE = " http://localhost:3000";
const API_BASE = "https://deep-pianos-behave.loca.lt";

export const startListener = async () => {
  console.log("start listening");
  const botpressToken = "bp_pat_3Z0lsrrE4QRk3kjHweFXCJzsEFiCLkGtZxwu";
  const botpressClient = new Client({ botId: botpressToken });

  const telegramToken = "6875692446:AAGbeU9IpGw06dcgf8L1M8mXOFBnBYQKt-I";
  const telegramClient = new Telegraf(telegramToken);

  const intervalId = setInterval(async () => {
    await log("Starting interval --------------------------------");
    const users = await fetchStates();

    users.forEach(async (user: any) => {
      if (user.remindAt) {
        await sendMessage(user.conversationId, botpressClient, telegramClient);
        await updateUser(user.id, { remindAt: null });
      }
    });
  }, 5 * 1000);

  setTimeout(() => clearInterval(intervalId), 100 * 1000);
  // await sleep(10)
  // await sendMessage(user.conversationId, botpressClient, telegramClient);
};

const fetchStates = async () => {
  const states = await axios.get(`${API_BASE}/states`);
  return states.data;
};

const sleep = (time: number) => {
  const promise = new Promise((resolve) => setTimeout(resolve, time * 1000));
  return promise;
};

const log = (text: string) => {
  const promise = new Promise<void>((resolve) => {
    console.log(text);
    resolve();
  });
  return promise;
};

export const getOrCreateUser = async (userId: string, body: any) => {
  const user = await axios.get(`${API_BASE}/state/${userId}`);
  if (!user.data) await axios.post(`${API_BASE}/state/${userId}`, body);
};

const updateUser = async (userId: string, body: any) => {
  await axios.post(`${API_BASE}/state/${userId}`, body);
};

const sendMessage = async (
  conversationId: string,
  botpressClient: Client,
  telegramClient: Telegraf
) => {
  // await client.createMessage({
  //     type: "text",
  //     userId: getUuidByString("6035673625"),
  //     conversationId: getUuidByString("6035673625"),
  //     payload: { text: "hello again" },
  //     schedule:{ dateTime: dateTime},
  //     tags: { "telegramtest:id": `${randomUUID()}` },
  // })

  const message = await telegramClient.telegram.sendMessage(
    conversationId,
    "sent automatically"
  );
  console.log("🚀 ~ file: api.ts:54 ~ sendMessage ~ message:", message);
};
