const Discord = require("discord.js");

exports.run = async (client, message, args) => {
	if (!args[0]) {
		// Sends help menu and about menu.
		let embed = new Discord.MessageEmbed()
			.setAuthor(message.author.tag, message.author.avatarURL())
			.setColor(client.config.colors.primary)
			.setDescription(`I've sent the help menu to your DMs!`);

		let help1 = new Discord.MessageEmbed()
			.setTitle("About")
			.setColor(client.config.colors.primary)
			.setDescription(
				`${client.user} is a discord bot that brings you beautiful photos from **unsplash.com** straight to your discord server!\nMade by \`ejer#9484\`\n\n[Website](http://ejer.ga/unsplash)\n[Invite](https://discordapp.com/oauth2/authorize?client_id=560568497801789443&permissions=388160&scope=bot)\n[Support Server](https://discord.gg/vkRkMue)\n[Vote](http://ejer.ga/unsplash/?vote)\n[Donate](http://donate.ejer.ga)`
			);

		let help2 = new Discord.MessageEmbed()
			.setTitle("Commands")
			.setColor(client.config.colors.primary)
			.setDescription(
				"Type `u!help [command]` to get information about a command.\n\n" +
					client.commands
						.filter((cmd) => !cmd.help.dev)
						.map((cmd) => `\`${cmd.help.name}\` - ${cmd.help.description}`)
						.join("\n")
			);

		return message.author
			.send(help1)
			.then(() =>
				message.author.send(help2).then(() => message.channel.send(embed))
			)
			.catch(() => {
				let error = new Discord.MessageEmbed()
					.setAuthor("An error occured!", "https://i.imgur.com/FCZNSQa.png")
					.setDescription("Could not send a DM!")
					.setColor(client.config.colors.primary)
					.setTimestamp();

				return message.channel.send(error);
			});
	} else if (args[0]) {
		// Gets the command from the command collection.
		let command = client.commands.get(args[0]);
		// Checks if command exists.
		if (!command) return message.reply("Please enter a valid command!");

		// Gets information from the exports.help and sends it.
		let props = require(`./${args[0]}.js`);

		let embed = new Discord.MessageEmbed()
			.setTitle(`Command`)
			.setColor(client.config.colors.primary)
			.setDescription(
				`**Name:** ${props.help.name}\n**Description:** ${props.help.description}\n**Cooldown:** ${props.help.cooldown} seconds\n**Usage:** ${client.config.prefix}${props.help.usage}`
			);

		message.channel.send(embed);
	}
};

exports.help = {
	name: "help",
	description: "Display the help menu or get information about a command.",
	cooldown: "0",
	usage: "help [command]",
};
