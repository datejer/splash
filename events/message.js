const Discord = require("discord.js");

module.exports = (client, message) => {
    // Check if author is not a bot, if message is in a guild and if message starts with the prefix.
    if (message.author.bot) return;
    if (!message.guild) return;
    if (message.content.indexOf(client.config.prefix) !== 0) return;

    // Define the command and the arguments.
    const args = message.content.slice(client.config.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    // Get command from command collection.
    const cmd = client.commands.get(command);

    // If doesn't exist - return.
    if (!cmd) return;

    // Run the command file.
    cmd.run(client, message, args);
};
