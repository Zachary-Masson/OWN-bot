const fs = require("fs");

exports.deploy = (client) => {
  console.log("\n[\x1b[32mDEBUG\x1b[0m] Enregistrement des commandes ⤵");
  const filesCommands = fs.readdirSync("./interactions/commands");
  filesCommands
    .filter((f) => f.endsWith(".js"))
    .forEach((file) => {
      const command = require(`../../interactions/commands/${file}`);
      client.commands.push({
        data: command.data,
        execute: command.execute,
      });
      console.log(
        `   - [\x1b[34mCOMMANDS\x1b[0m] "${command.data.name}" Initialiser ✅ `
      );
    });
  return;
};

exports.find = (client, interaction) => {
  const command = client.commands.filter(
    (cmd) => cmd.data.name === interaction.commandName
  )[0];
  command.execute(client, interaction);
};
