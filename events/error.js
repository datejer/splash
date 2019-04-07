const Discord = require("discord.js");

module.exports = (client, error) => {
    // Bot errors due to connection problems.

    // Log the error to the console.
    console.error;

    // Get me (ejer).
    let ejer = client.users.get("214651290234388480");

    let embed = new Discord.RichEmbed()
        .setAuthor("An error occured!", "https://i.imgur.com/FCZNSQa.png")
        .setDescription(error)
        .setColor("#ffffff")
        .setTimestamp();

    // Send a DM notification of the error.
    return ejer.send(embed);
}
