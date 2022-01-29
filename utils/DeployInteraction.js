require("dotenv").config();
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const rest = new REST({ version: "9" }).setToken(process.env.TOKEN);

class DeployInteraction {
  _client;

  constructor(client) {
    this._client = client;
    this.execute();
  }

  async execute() {
    const Commands = new Array();

    this._client.commands.map((cmd) => Commands.push(cmd.data));

    await (async () => {
      try {
        console.log(
          "\n[\x1b[32mDEBUG\x1b[0m] Lancement du deploiment des commandes."
        );
        await rest.put(
          Routes.applicationGuildCommands(
            this._client.user.id,
            process.env.GUILD_ID
          ),
          {
            body: Commands,
          }
        );

        console.log(
          "[\x1b[32mDEBUG\x1b[0m] Le deploiment des commandes ce sont fais avec succès."
        );
      } catch (error) {
        console.log(
          "[\x1b[31mERROR\x1b[0m] Une erreur est survenue pendant le deploiment des commandes."
        );
        process.exit(1);
      }
    })();
  }
}

module.exports = DeployInteraction;
