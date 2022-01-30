const fs = require("fs");
const { Client, Interaction } = require("discord.js");

exports.deploy = (client) => {
  console.log("\n[\x1b[32mDEBUG\x1b[0m] Enregistrement des Buttons ⤵");
  const filesButtons = fs.readdirSync("./interactions/buttons");
  filesButtons
    .filter((f) => f.endsWith(".js"))
    .forEach((file) => {
      const button = require(`../../interactions/buttons/${file}`);
      client.interactions.buttons.push({
        data: button.data,
        execute: button.execute,
      });
      console.log(
        `   - [\x1b[34mBUTTONS\x1b[0m] "${button.data.name}" Initialiser ✅ `
      );
    });
  return;
};
/**
 *
 * @param {Client} client
 * @param {Interaction} interaction
 */
exports.find = (client, interaction) => {
  const button = client.interactions.buttons.filter(
    (btn) =>
      btn.data.customID.split("#")[0] === interaction.customId.split("#")[0]
  )[0];
  button.execute(client, interaction);
};
