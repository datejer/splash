const Discord = require("discord.js");
const polyfill = require("es6-promise").polyfill();
const fetch = require("isomorphic-fetch");
const Unsplash = require("unsplash-js").default;
const toJson = require("unsplash-js").toJson;

exports.run = async (client, message, args) => {
	// Cooldown system.
	if (!client.cooldownCollection) {
		client.cooldownCollection = new Set();
	}

	let cooldownEmbed = new Discord.MessageEmbed()
		.setAuthor(message.author.tag, message.author.avatarURL())
		.setColor(client.config.colors.primary)
		.setDescription(
			`Please wait ${exports.help.cooldown} seconds between commands.`
		);

	if (client.cooldownCollection.has(message.author.id))
		return message.channel.send(cooldownEmbed);

	client.cooldownCollection.add(message.author.id);
	setTimeout(() => {
		client.cooldownCollection.delete(message.author.id);
	}, exports.help.cooldown * 1000);

	if (!args[0]) return message.reply("Please enter a keyword.");

	// Create new instance of the API.
	const unsplash = new Unsplash({
		applicationId: client.config.unsplashAccessKey,
		secret: client.config.unsplashSecretKey,
	});

	// Search for a collection by keyword.
	unsplash.search
		.collections(args[0], 1)
		.then(toJson)
		.then((json) => {
			if (json.total <= 0) {
				// Any errors returned by the API will be displayed.
				let errembed = new Discord.MessageEmbed()
					.setAuthor("An error occured!", "https://i.imgur.com/FCZNSQa.png")
					.setDescription("Couldn't find Collection")
					.setColor(client.config.colors.primary)
					.setTimestamp();

				return message.channel.send(errembed);
			}

			// Get a random collection from the results array.
			let imgNumber = Math.floor(Math.random() * json.results.length);

			unsplash.collections
				.getCollection(json.results[imgNumber].id)
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

					// Send the collection link with all of it's information.
					let embed = new Discord.MessageEmbed()
						.setAuthor(
							`${json.user.name} (@${json.user.username})`,
							json.user.profile_image.medium,
							json.user.links.html
						)
						.setTitle(json.title)
						.setURL(json.links.html)
						.setDescription(
							`Keyword: \`${args[0]}\`\n\n${
								json.description ? json.description : "No description."
							}`
						)
						.setColor(json.cover_photo.color)
						.setThumbnail(json.cover_photo.urls.raw)
						.setImage(json.preview_photos[1].urls.raw)
						.setTimestamp(json.published_at)
						.setFooter(`ID: ${json.id}`)
						.addField("Tags", json.tags.map((t) => t.title).join(", "), true)
						.addField("Photos", json.total_photos, true);

					message.channel.send(embed);
				});
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
	name: "collection",
	description: "Get a collection by keyword.",
	cooldown: "5",
	usage: "collection <keyword>",
};
