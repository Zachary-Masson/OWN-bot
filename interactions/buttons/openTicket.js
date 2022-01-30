const { MessageButton, Client, Interaction } = require("discord.js");

exports.data = {
  name: "Ouverture de Ticket",
  description: "Se boutons sert a ouvrir un ticket",
  emoji: "",
  label: "",
  style: "SECONDARY",
  customID: "openticket#{{ QUERY }}",
};

exports.button = (QUERY, options) => {
  const button = new MessageButton();

  button.setEmoji(options.emoji);
  button.setLabel(options.label);

  button.setStyle(this.data.style);
  button.setCustomId(
    this.data.customID.replace("#{{ QUERY }}", QUERY ? `#${QUERY}` : "")
  );
  return button;
};
/**
 *
 * @param {Client} client
 * @param {Interaction} interaction
 */
exports.execute = async (client, interaction) => {
  const { database } = client;

  interaction.reply({
    content: "Vous avez correctement était vérifier !",
    ephemeral: true,
  });
};
