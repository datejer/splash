const fs = require("fs");

module.exports = (client) => {
    let package = JSON.parse(fs.readFileSync("./package.json", "utf8"));
    console.log(`\n             Unsplash v${package.version}\n`);
    console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`);
    console.log(`Logged in as ${client.user.tag} (ID: ${client.user.id})\n`);
    // Set the status and activity of the bot user.
    client.user.setStatus('available')
    client.user.setActivity(client.config.activityMessage, {
        type: client.config.activityType
    });
}
