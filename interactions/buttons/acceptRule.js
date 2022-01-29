const { MessageButton } = require("discord.js");

exports.data = {
  name: "Accepter Réglement",
  description: "Se boutons sert a accepter le réglement",
  emoji: "✅",
  label: "J'accepte le réglement!",
  style: "SECONDARY",
  customID: "accept_rule#{{ QUERY }}",
};

exports.button = (QUERY) => {
  const button = new MessageButton();
  button.setEmoji(this.data.emoji);
  button.setLabel(this.data.label);
  button.setStyle(this.data.style);
  button.setCustomId(
    this.data.customID.replace("#{{ QUERY }}", QUERY ? `#${QUERY}` : "")
  );
  return button;
};

exports.execute = (interaction) => {
  interaction.reply("test");
};
