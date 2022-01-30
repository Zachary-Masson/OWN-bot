const { Interaction, Client } = require("discord.js");

exports._name = "interactionCreate";
/**
 *
 * @param {Client} client
 * @param {Interaction} interaction
 */
exports.exec = (client, interaction) => {
  if (interaction.isCommand())
    return require("../utils/Interaction/InteractionCommands").find(
      client,
      interaction
    );
  if (interaction.isButton())
    return require("../utils/Interaction/InteractionButtons").find(
      client,
      interaction
    );
};
