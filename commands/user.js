const Discord = require("discord.js");
const polyfill = require("es6-promise").polyfill();
const fetch = require("isomorphic-fetch");
const Unsplash = require("unsplash-js").default;
const toJson = require("unsplash-js").toJson;

exports.run = async (client, message, args) => {
	if (!args[0]) return message.reply("Please enter a user.");

	// Delete all @'s in the username argument to minimize confusion.
	let inputUsername = args[0].replace(/@/g, "");

	// Cooldown system.
	if (!client.cooldownUser) {
		client.cooldownUser = new Set();
	}

	let cooldownEmbed = new Discord.MessageEmbed()
		.setAuthor(message.author.tag, message.author.avatarURL())
		.setColor(client.config.colors.primary)
		.setDescription(
			`Please wait ${exports.help.cooldown} seconds between commands.`
		);

	if (client.cooldownUser.has(message.author.id))
		return message.channel.send(cooldownEmbed);

	client.cooldownUser.add(message.author.id);
	setTimeout(() => {
		client.cooldownUser.delete(message.author.id);
	}, exports.help.cooldown * 1000);

	if (!inputUsername) return message.reply("Please enter a username.");

	// Create new instance of the API.
	const unsplash = new Unsplash({
		applicationId: client.config.unsplashAccessKey,
		secret: client.config.unsplashSecretKey,
	});

	// Get the profile.
	unsplash.users
		.profile(inputUsername)
		.then(toJson)
		.then((json) => {
			if (json.errors) {
				// Any errors returned by the API will be displayed.
				let errembed = new Discord.MessageEmbed()
					.setAuthor("An error occured!", "https://i.imgur.com/FCZNSQa.png")
					.setDescription(json.errors.join("\n"))
					.setColor(client.config.colors.primary)
					.setTimestamp();

				return message.channel.send(errembed);
			}

			// Send the information about the user and his profile.
			let embed = new Discord.MessageEmbed()
				.setTitle(`${json.name} (@${json.username}) on Unsplash`)
				.setURL(json.links.html)
				.setColor(client.config.colors.primary)
				.setThumbnail(json.profile_image.large)
				.setFooter(`ID: ${json.id}`);

			if (json.bio) embed.setDescription(json.bio);
			if (json.location) embed.addField("Location", json.location, true);

			embed
				.addField("Photos", json.total_photos, true)
				.addField("Followers", json.followers_count, true)
				.addField("Following", json.following_count, true)
				.addField("Collections", json.total_collections, true)
				.addField("Downloads", json.downloads, true)
				.addField("Likes", json.total_likes, true);

			message.channel.send(embed);
		})
		.catch((err) => {
			let embed = new Discord.MessageEmbed()
				.setAuthor("An error occured!", "https://i.imgur.com/FCZNSQa.png")
				.setDescription(err)
				.setColor(client.config.colors.primary)
				.setTimestamp();

			return message.channel.send(embed);
		});
};

exports.help = {
	name: "user",
	description: "Get information about a user.",
	cooldown: "5",
	usage: "user <username>",
};
