const Discord = require("discord.js");

exports.run = async (client, message, args) => {
	// Make sure only I (ejer) can use this command.
	if (message.author.id !== "214651290234388480")
		return message.reply("This is a developer only command.");

	// Check if user has inputted a command to reload.
	if (!args[0] || args.size < 1)
		return message.reply("Must provide a command name to reload.");
	// Check if command exists in command collection.
	let commandName = args[0];
	if (!client.commands.has(commandName)) {
		return message.reply("That command does not exist.");
	}

	// Reloading system.
	delete require.cache[require.resolve(`./${commandName}.js`)];

	try {
		let props = require(`./${commandName}.js`);
		client.commands.delete(commandName);
		client.commands.set(commandName, props);
	} catch (e) {
		// Errors while reloading will not be spat out into the console but instead nicely put into an embed.
		let embed = new Discord.MessageEmbed()
			.setAuthor("An error occured!", "https://i.imgur.com/FCZNSQa.png")
			.setDescription(e)
			.setColor(client.config.colors.primary)
			.setTimestamp();

		return message.channel.send(embed);
	}

	let embed = new Discord.MessageEmbed()
		.setAuthor(
			"Reload Successful!",
			"https://mxpez29397.i.lithium.com/html/images/emoticons/2705.png"
		)
		.setDescription(`Reloaded **${commandName}.js**!`)
		.setColor(client.config.colors.primary)
		.setTimestamp();

	message.channel.send(embed);

	console.log(`[Commands] Manual reload of ${commandName}.js completed!`);
};

exports.help = {
	name: "reload",
	description: "Reload a command.",
	cooldown: "0",
	usage: "reload <command>",
	dev: true,
};
