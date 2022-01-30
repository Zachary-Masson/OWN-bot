require("dotenv").config();
const { Client, MessageEmbed, MessageActionRow } = require("discord.js");
exports._name = "ready";

const refreshRule = async (client, database) => {
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

const refreshTickets = async (client, database) => {
  const ticketData = await database
    .query("SELECT * FROM bot_tickets_data WHERE id = 1")
    .then((request) => request[0]);

  let currentTicketData = new Object();

  setInterval(async () => {
    const newTicketData = await database
      .query("SELECT * FROM bot_tickets_data WHERE id = 1")
      .then((request) => request[0]);
    if (
      currentTicketData["id"] === undefined &&
      ticketData.messageID === null
    ) {
      currentTicketData = ticketData;
      const guild = client.guilds.cache.get(process.env.GUILD_ID);
      const channel = await guild.channels.fetch(ticketData.channelID);

      const embed = new MessageEmbed()
        .setTitle("Système Ticket")
        .setColor("#9b9b9b")
        .setTimestamp();
      const comp = new MessageActionRow();
      let description =
        "Bonjour/Bonjour voici tout les tickets que vous pouvez ouvrir :\n";

      const category = await database.query(
        "SELECT * FROM bot_tickets_category"
      );

      const dataBOT = await database
        .query("SELECT * FROM bot_data WHERE id = 1")
        .then((request) => request[0]);

      await category.map(async (cat) => {
        const data = JSON.parse(cat.data);
        description += `\n"${data.name}" | *${data.description}*`;
        comp.addComponents(
          require("../interactions/buttons/openTicket").button(data.uuid, {
            emoji: data.button.emoji,
            label: data.button.label,
          })
        );
      });

      embed.setDescription(description);

      const message = await channel.send({
        embeds: [embed],
        components: [comp],
      });

      database.query("UPDATE bot_tickets_data SET messageID = ? WHERE id = 1", [
        message.id,
      ]);
      category.map(async (cat) => {
        const data = JSON.parse(cat.data);
        if (data["categoryID"] === "undefined") {
          const ch = await guild.channels.create(data.category, {
            type: "GUILD_CATEGORY",
            permissionOverwrites: [
              {
                deny: "VIEW_CHANNEL",
                id: guild.id,
              },
              {
                allow: "VIEW_CHANNEL",
                id: dataBOT.ROLE_SUPPORT,
              },
            ],
          });
          data["categoryID"] = ch.id;
          database.query(
            "UPDATE bot_tickets_category SET data = ? WHERE id = ?",
            [data, cat.id]
          );
        }
      });
    } else if (newTicketData.edit === "true" && ticketData.messageID !== null) {
      const guild = client.guilds.cache.get(process.env.GUILD_ID);
      const channel = await guild.channels.fetch(newTicketData.channelID);
      const message = await channel.messages.fetch(newTicketData.messageID);

      const embed = new MessageEmbed()
        .setTitle("Système Ticket")
        .setColor("#9b9b9b")
        .setTimestamp();
      const comp = new MessageActionRow();
      let description =
        "Bonjour/Bonjour voici tout les tickets que vous pouvez ouvrir :\n";

      const category = await database.query(
        "SELECT * FROM bot_tickets_category"
      );

      const dataBOT = await database
        .query("SELECT * FROM bot_data WHERE id = 1")
        .then((request) => request[0]);

      await category.map(async (cat) => {
        const data = JSON.parse(cat.data);
        description += `\n"${data.name}" | *${data.description}*`;
        comp.addComponents(
          require("../interactions/buttons/openTicket").button(data.uuid, {
            emoji: data.button.emoji,
            label: data.button.label,
          })
        );
      });

      embed.setDescription(description);

      message.edit({
        embeds: [embed],
        components: [comp],
      });

      database.query("UPDATE bot_tickets_data SET edit = ? WHERE id = 1", [
        "false",
      ]);
      category.map(async (cat) => {
        const data = JSON.parse(cat.data);
        if (data["categoryID"] === "undefined") {
          const ch = await guild.channels.create(data.category, {
            type: "GUILD_CATEGORY",
            permissionOverwrites: [
              {
                deny: "VIEW_CHANNEL",
                id: guild.id,
              },
              {
                allow: "VIEW_CHANNEL",
                id: dataBOT.ROLE_SUPPORT,
              },
            ],
          });
          data["categoryID"] = ch.id;
          database.query(
            "UPDATE bot_tickets_category SET data = ? WHERE id = ?",
            [data, cat.id]
          );
        }
      });
    }
  }, 30 * 60 * 1000);
};

/**
 *
 * @param {Client} client
 */
exports.exec = async (client) => {
  const { database } = client;

  // Actualisation du réglement
  refreshRule(client, database);

  // Actualisation des tickets
  refreshTickets(client, database);
};
