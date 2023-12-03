import { Bot } from "@botpress/sdk";
import { z } from "zod";
import { telegramtest } from ".botpress"; /** uncomment to get generated code */

const bot = new Bot({
  integrations: {
    telegramtest: new telegramtest.Telegramtest({
      enabled: true,
      config: {
        botToken: "6875692446:AAGbeU9IpGw06dcgf8L1M8mXOFBnBYQKt-I",
      },
    }),
  },
  configuration: {
    schema: z.object({}),
  },
  states: {},
  events: {},
  recurringEvents: {},
});

bot.message(async ({ message, client, ctx }) => {
  console.info("Received message", message);

  await client.createMessage({
    conversationId: message.conversationId,
    userId: ctx.botId,
    tags: {},
    type: "text",
    payload: {
      text: `You said: ${message.payload.text}`,
    },
  });

  console.info("text message sent");
});

export default bot;
