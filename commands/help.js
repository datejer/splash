const Discord = require("discord.js");

exports.run = async (client, message, args) => {
    if (!args[0]) {
        // Sends help menu and about menu.
        let embed = new Discord.RichEmbed()
            .setAuthor(message.author.tag, message.author.avatarURL)
            .setColor('#ffffff')
            .setDescription(`I've sent the help menu to your DMs!`);

        let help1 = new Discord.RichEmbed()
            .setTitle("About")
            .setColor('#ffffff')
            .setDescription(`${client.user} is a discord bot that brings you beautiful photos from **unsplash.com** straight to your discord server!\nMade by \`ejer#9484\`\n\n[Invite](https://discordapp.com/api/oauth2/authorize?client_id=560568497801789443&permissions=8&scope=bot)\n[Donate](http://donate.ejer.ga)`);

        let help2 = new Discord.RichEmbed()
            .setTitle("Commands")
            .setColor('#ffffff')
            .setDescription("Type `u!help [command]` to get information about a command.\n\n" + client.commands.map(cmd => `\`${cmd.help.name}\` - ${cmd.help.description}`).join("\n"));

        message.channel.send(embed);
        message.author.send(help1);
        message.author.send(help2);
    } else if (args[0]) {
        // Gets the command from the command collection.
        let command = client.commands.get(args[0]);
        // Checks if command exists.
        if (!command) return message.reply("Please enter a valid command!");

        // Gets information from the exports.help and sends it.
        let props = require(`./${args[0]}.js`);

        let embed = new Discord.RichEmbed()
            .setTitle(`Command`)
            .setColor('#ffffff')
            .setDescription(`**Name:** ${props.help.name}\n**Description:** ${props.help.description}\n**Cooldown:** ${props.help.cooldown} seconds\n**Usage:** ${client.config.prefix}${props.help.usage}`)

        message.channel.send(embed);
    }
}

exports.help = {
    name: "help",
    description: "Display the help menu or get information about a command.",
    cooldown: "0",
    usage: "help [command]"
};
