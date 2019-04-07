const Discord = require("discord.js");
const polyfill = require('es6-promise').polyfill();
const fetch = require('isomorphic-fetch');
const Unsplash = require('unsplash-js').default;
const toJson = require("unsplash-js").toJson;

exports.run = async (client, message, args) => {
    // Cooldown system.
    if (!client.cooldownFeatured) {
        client.cooldownFeatured = new Set();
    }

    let cooldownEmbed = new Discord.RichEmbed()
        .setAuthor(message.author.tag, message.author.avatarURL)
        .setColor('#ffffff')
        .setDescription(`Please wait ${exports.help.cooldown} seconds between commands.`)

    if (client.cooldownFeatured.has(message.author.id)) return message.channel.send(cooldownEmbed);

    client.cooldownFeatured.add(message.author.id);
    setTimeout(() => {
        client.cooldownFeatured.delete(message.author.id);
    }, exports.help.cooldown * 1000);

    // Create new instance of the API.
    const unsplash = new Unsplash({
        applicationId: client.config.unsplashAccessKey,
        secret: client.config.unsplashSecretKey
    });

    // Get a random photo that is marked as featured.
    unsplash.photos.getRandomPhoto({ featured: true })
        .then(toJson)
        .then(json => {
            if (json.errors) {
                // Any errors returned by the API will be displayed.
                let errembed = new Discord.RichEmbed()
                    .setAuthor("An error occured!", "https://i.imgur.com/FCZNSQa.png")
                    .setDescription(json.errors.join("\n"))
                    .setColor("#ffffff")
                    .setTimestamp();

                return message.channel.send(errembed);
            }

            // Send the photo with all of it's information.
            let embed = new Discord.RichEmbed()
                .setTitle(`${json.user.name} (@${json.user.username})`)
                .setURL(json.user.links.html)
                .setDescription(json.alt_description)
                .setColor(json.color)
                .setImage(json.urls.raw)
                .setTimestamp(json.created_at)
                .setFooter(`ID: ${json.id} | ${json.links.html}`)
                .addField("Views", json.views, true)
                .addField("Downloads", json.downloads, true)
                .addField("Likes", json.likes, true);

            message.channel.send(embed);
        })
        .catch(err => {
            let embed = new Discord.RichEmbed()
                .setAuthor("An error occured!", "https://i.imgur.com/FCZNSQa.png")
                .setDescription(err)
                .setColor("#ffffff")
                .setTimestamp();

            return message.channel.send(embed);
        });
}

exports.help = {
    name: "featured",
    description: "Get a random featured photo.",
    cooldown: "5",
    usage: "featured"
};