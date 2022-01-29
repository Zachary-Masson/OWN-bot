const fs = require("fs");

exports.deploy = (client) => {
  console.log("\n[\x1b[32mDEBUG\x1b[0m] Enregistrement des InteractionUsers ⤵");
  const filesUsers = fs.readdirSync("./interactions/users");
  filesUsers
    .filter((f) => f.endsWith(".js"))
    .forEach((file) => {
      const users = require(`../../interactions/users/${file}`);
      client.commands.push({
        data: users.data,
        execute: users.execute,
      });
      console.log(
        `   - [\x1b[34mUSERS\x1b[0m] "${users.data.name}" Initialiser ✅ `
      );
    });
  return;
};
