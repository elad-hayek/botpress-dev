import { IntegrationDefinition, messages } from "@botpress/sdk";
import { name } from "./package.json";
import { z } from "zod";

export default new IntegrationDefinition({
  name: "telegramtest",
  description: "a test for telegram integration",
  version: "0.0.1",
  configuration: {
    schema: z.object({
      botToken: z.string(),
      appender: z.string(),
    }),
  },
  states: {
    user: {
      type: "user",
      schema: z.object({
        remindAt: z.date(),
      }),
    },
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
