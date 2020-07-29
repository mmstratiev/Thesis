const fs = require('fs');
const discord = require('discord.js');

module.exports = {
    getCommandsCollection() {
        // Setup commands
        var commands = new discord.Collection();

        // get all .js files in "commands" folder
        const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
        for (const file of commandFiles) {
            const command = require(`./commands/${file}`);

            // set a new item in the Collection
            // with the key as the command name and the value as the exported module
            commands.set(command.name, command);
        }
        return commands;
    }
};