const fs = require("fs");

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
