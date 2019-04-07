//
//          Unsplash
//			by ejer
//
//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
//
// http://ejer.ga/
//
// ejer#9484
//

const Discord = require("discord.js");
const fs = require("fs");

const client = new Discord.Client({
    disableEveryone: true
});
const config = require("./config.json");

client.config = config;
client.cooldown = new Set();

// Load all events from folder.
fs.readdir("./events/", (err, files) => {
    if (err) return console.error(err);
    files.forEach(file => {
        const event = require(`./events/${file}`);
        let eventName = file.split(".")[0];
        // Create a listener for the events.
        client.on(eventName, event.bind(null, client));
    });
});

// Create command collection
client.commands = new Discord.Collection();

// Load all commands from folder.
fs.readdir("./commands/", (err, files) => {
    if (err) return console.error(err);
    console.log("[Commands] Loading...");
    files.forEach(file => {
        if (!file.endsWith(".js")) return;
        let props = require(`./commands/${file}`);
        console.log(`[Commands] Loaded ${file}`);
        // Add command to collection
        client.commands.set(props.help.name, props);
    });
    console.log(`[Commands] Loaded ${files.length} commands!`);
});

client.login(config.token);