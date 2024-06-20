"use strict";

const { Client, GatewayIntentBits } = require("discord.js");
const { CHANNELID_DISCORD, TOKEN_DISCORD } = process.env;

class LoggerService {
  constructor() {
    this.client = new Client({
      intents: [
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
      ],
    });

    this.chanelId = CHANNELID_DISCORD;

    this.client.on("ready", () => {
      console.log("Logged is as ", this.client.user.tag);
    });

    this.client.login(TOKEN_DISCORD);
  }

  sendToFormatCode(logData) {
    const {
      code,
      message = "This is some additional information about the code.",
      title = "Code example",
    } = logData;

    const codeMessage = {
      content: message,
      embeds: [
        {
          color: parseInt("00ff00", 16),
          title: title,
          description: "```json\n" + JSON.stringify(code, null, 2) + "\n```",
        },
      ],
    };

    this.sendToMessage(codeMessage);
  }

  sendToMessage(codeMessage) {
    const channel = this.client.channels.cache.get(this.chanelId);
    if (!channel) {
      console.error("Counldn't find channel... ", this.chanelId);
      return;
    }

    channel.send(codeMessage).catch((e) => console.log(e));
  }
}

module.exports = new LoggerService();
