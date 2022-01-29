require("dotenv").config();
const config = require("../config.json");
const { Client, Intents } = require("discord.js");
const { readdirSync, readFileSync } = require("fs");
const Database = require("./Database");

// Interaction
const InteractionCommands = require("./Interaction/InteractionCommands");
const InteractionUsers = require("./Interaction/InteractionUsers");
const InteractionButtons = require("./Interaction/InteractionButtons");
const InteractionMenus = require("./Interaction/InteractionMenus");

class classClient {
  _client;

  constructor() {
    this.init();
  }

  async init() {
    this._client = new Client({
      partials: ["CHANNEL"],
      intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.DIRECT_MESSAGES,
        Intents.FLAGS.DIRECT_MESSAGE_TYPING,
      ],
    });
    this._client["commands"] = new Array();
    this._client["interactions"] = new Object({
      buttons: new Array(),
      menus: new Array(),
    });
    this._client["database"] = await new Database().init();
  }

  start() {
    console.log(readFileSync("./motd.txt", { encoding: "utf-8" }));
    this._client.login(process.env.TOKEN);
    this._client.once("ready", async (client) => {
      this.activity(client), this.loadInteraction(client);
      const DeployInteraction = require("./DeployInteraction");
      new DeployInteraction(client);
      this._client.database = this._client.database.getDb;
    });
    return this;
  }

  loadInteraction(client) {
    InteractionCommands.deploy(client);
    InteractionUsers.deploy(client);
    InteractionButtons.deploy(client);
    InteractionMenus.deploy(client);
    return (this._client = client);
  }

  activity(client) {
    return client.user.setActivity({
      name: config.bot.activity.name.replace(
        "$guild.memberCount",
        client.guilds.cache.get(process.env.GUILD_ID).memberCount
      ),
      type: config.bot.activity.type,
    });
  }

  events() {
    const filesEvents = readdirSync("./events");
    filesEvents.map((file) => {
      const event = require(`../events/${file}`);
      this._client.on(event._name, event.exec.bind(null, this._client));
    });
  }

  get getClient() {
    return this._client;
  }
}

module.exports = classClient;
