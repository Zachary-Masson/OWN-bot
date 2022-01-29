const fs = require("fs");

exports.deploy = (client) => {
  console.log("\n[\x1b[32mDEBUG\x1b[0m] Enregistrement des Menus ⤵");
  const filesMenus = fs.readdirSync("./interactions/menus");
  filesMenus
    .filter((f) => f.endsWith(".js"))
    .forEach((file) => {
      const menu = require(`../../interactions/menus/${file}`);
      client.interactions.menus.push({
        data: menu.data,
        execute: menu.execute,
      });
      console.log(
        `   - [\x1b[34mMENUS\x1b[0m] "${menu.data.name}" Initialiser ✅ `
      );
    });
  return;
};
