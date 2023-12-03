import { IntegrationDefinition, messages } from "@botpress/sdk";
import { name } from "./package.json";
import { z } from "zod";

export default new IntegrationDefinition({
  name: "telegramtest",
  version: "0.0.1",
  configuration: {
    schema: z.object({
      botToken: z.string(),
    }),
  },
  channels: {
    group: {
      messages: { text: messages.defaults.text },
      message: {
        tags: {
          id: {
            title: "Message ID",
            description: "Message ID from telegram",
          },
        },
      },
      conversation: {
        tags: {
          id: {},
        },
      },
    },
  },
  user: {
    tags: {
      id: {},
    },
  },
});
