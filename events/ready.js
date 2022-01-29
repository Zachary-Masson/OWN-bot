require("dotenv").config();
const { Client, MessageEmbed, MessageActionRow } = require("discord.js");
exports._name = "ready";
/**
 *
 * @param {Client} client
 */
exports.exec = async (client) => {
  const { database } = client;
  const infoRules = await database.query(
    "SELECT * FROM bot_rules WHERE id = 1"
  );

  let currentInfo = new Object();

  setInterval(async () => {
    if (currentInfo["id"] === undefined && infoRules[0].data.split("/")[1]) {
      currentInfo = infoRules[0];
      const guild = client.guilds.cache.get(process.env.GUILD_ID);
      const channel = guild.channels.cache.get(infoRules[0].data.split("/")[0]);
      const message = await channel.messages.fetch(
        infoRules[0].data.split("/")[1]
      );
      message.edit({
        embeds: [
          new MessageEmbed()
            .setTitle(currentInfo.title)
            .setColor(currentInfo.color)
            .setDescription(currentInfo.text),
        ],
        components: [
          new MessageActionRow().addComponents(
            require("../interactions/buttons/acceptRule").button()
          ),
        ],
      });
    } else if (
      currentInfo["id"] === undefined &&
      !infoRules[0].data.split("/")[1] &&
      infoRules[0].data.split("/")[0]
    ) {
      currentInfo = infoRules[0];
      const guild = client.guilds.cache.get(process.env.GUILD_ID);
      const channel = guild.channels.cache.get(infoRules[0].data.split("/")[0]);
      const message = await channel.send({
        embeds: [
          new MessageEmbed()
            .setTitle(currentInfo.title)
            .setColor(currentInfo.color)
            .setDescription(currentInfo.text),
        ],
        components: [
          new MessageActionRow().addComponents(
            require("../interactions/buttons/acceptRule").button()
          ),
        ],
      });
      currentInfo["data"] = `${channel.id}/${message.id}`;
      database.query("UPDATE bot_rules SET data = ? WHERE id = 1", [
        currentInfo.data,
      ]);
    } else if (currentInfo !== undefined) {
      const newInfoRules = await database.query(
        "SELECT * FROM bot_rules WHERE id = 1"
      );
      if (
        currentInfo["id"] === newInfoRules[0].id &&
        currentInfo["title"] === newInfoRules[0].title &&
        currentInfo["text"] === newInfoRules[0].text &&
        currentInfo["color"] === newInfoRules[0].color
      ) {
        return;
      } else {
        currentInfo = newInfoRules[0];
        const guild = client.guilds.cache.get(process.env.GUILD_ID);
        const channel = guild.channels.cache.get(
          newInfoRules[0].data.split("/")[0]
        );
        const message = await channel.messages.fetch(
          newInfoRules[0].data.split("/")[1]
        );
        message.edit({
          embeds: [
            new MessageEmbed()
              .setTitle(currentInfo.title)
              .setColor(currentInfo.color)
              .setDescription(currentInfo.text),
          ],
          components: [
            new MessageActionRow().addComponents(
              require("../interactions/buttons/acceptRule").button()
            ),
          ],
        });
      }
    }
  }, 10 * 60 * 1000);
};
