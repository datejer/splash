const Discord = require("discord.js");
const fs = require("fs");

let packageFile = JSON.parse(fs.readFileSync("./package.json", "utf8"));

exports.run = async (client, message, args) => {
    let botping = new Date() - message.createdAt;

    let totalSeconds = process.uptime();
    let realTotalSecs = Math.floor(totalSeconds % 60);
    let days = Math.floor((totalSeconds % 31536000) / 86400);
    let hours = Math.floor((totalSeconds / 3600) % 24);
    let mins = Math.floor((totalSeconds / 60) % 60);
    let used = process.memoryUsage().heapUsed / 1024 / 1024;

    let embed = new Discord.RichEmbed()
        .setTitle("Information")
        .setColor('#ffffff')
        .setTimestamp()
        .setThumbnail(client.user.avatarURL)
        .setDescription(`
            Creator - \`ejer#9484\`
            Prefix - \`${client.config.prefix}\`
            Version - \`v${packageFile.version}\`
            Commands - \`${client.commands.array().length}\`
            Guilds - \`${client.guilds.size}\`
            Channels - \`${client.channels.size}\`
            Users - \`${client.users.size}\`
            Uptime - \`Days: ${days} | Hours: ${hours} | Minutes: ${mins} | Seconds: ${realTotalSecs}\`
            Memory Usage - \`${Math.round(used * 100) / 100}MB\`
            Node Version - \`${process.version}\`
            Latency - \`${Math.floor(botping)}ms\`
            API Ping - \`${Math.floor(client.ping)}ms\`
        `);

    message.channel.send(embed);
}

exports.help = {
    name: "info",
    description: "Get information about the bot.",
    cooldown: "0",
    usage: "info"
};
