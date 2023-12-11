import * as botpress from ".botpress";
import { Telegraf } from "telegraf";
import getUuidByString from "uuid-by-string";

console.info("starting integration");

class NotImplementedError extends Error {
  constructor() {
    super("not implemented");
  }
}

export default new botpress.Integration({
  register: async ({ webhookUrl, ctx }) => {
    const telegraf = new Telegraf(ctx.configuration.botToken);
    await telegraf.telegram.setWebhook(webhookUrl);
  },

  unregister: async ({ ctx }) => {
    const telegraf = new Telegraf(ctx.configuration.botToken);
    await telegraf.telegram.deleteWebhook({ drop_pending_updates: true });
  },

  handler: async ({ req, client }) => {
    const data = JSON.parse(req.body ?? "");
    console.log("from user: ", data);

    const conversationId = data?.message?.chat?.id;
    const userId = data?.message?.from?.id;
    const messageId = data?.message?.message_id;

    if (!conversationId || !userId || !messageId) {
      throw new Error("Handler didn't receive a valid message");
    }

    const { conversation } = await client.getOrCreateConversation({
      channel: "group",
      tags: { "telegramtest:id": `${conversationId}` },
    });

    const { user } = await client.getOrCreateUser({
      tags: { "telegramtest:id": `${userId}` },
    });

    if (data.message.text === "delete") {
      await client.deleteConversation({ id: conversation.id });
      return;
    }

    await client.createMessage({
      tags: { "telegramtest:id": `${messageId}` },
      type: "text",
      userId: user.id,
      conversationId: conversation.id,
      payload: { text: data.message.text },
    });
  },

  actions: {},
  channels: {
    group: {
      messages: {
        text: async ({ payload, ctx, conversation, ack }) => {
          console.log("from bot:", payload);
          const client = new Telegraf(ctx.configuration.botToken);
          const message = await client.telegram.sendMessage(
            conversation.tags["telegramtest:id"]!,
            `${ctx.configuration.appender} ${payload.text}`
          );
          await ack({ tags: { "telegramtest:id": `${message.message_id}` } });
        },
      },
    },
  },
});
