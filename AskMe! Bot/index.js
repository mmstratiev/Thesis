const discord = require('discord.js');
const localization = require('./localization.json');
const utilities = require('./utilities.js');
const { prefix, token } = require('./config.json');
const { help_command } = require('./commands.json');

const client = new discord.Client();

// Setup commands
client.commands = utilities.getCommandsCollection();

client.on('ready', () => {
    console.log('Bot is online!');
    client.user.setActivity('people Tag Me!', { type: 'WATCHING' });
});

client.on('message', message => {
    if (!message.author.bot) {
        if (message.content.startsWith(prefix)) {
            const args = message.content.slice(prefix.length).split(/ +/);
            const commandName = args.shift().toLowerCase();

            if (client.commands.has(commandName)) {
                const command = client.commands.get(commandName);

                if (!command.args.includes(args.length)) { // invalid number of arguments
                    var reply = `${localization.response_invalid_argument_count}\n${localization.response_proper_command} \`${prefix}${command.name} ${command.usage}\``;
                    message.reply(reply);
                }
                else { // proper command usage, execute command
                    try {
                        command.execute(message, args);
                    }
                    catch (error) {
                        console.error(error);
                        message.reply(localization.response_command_failed);
                    }
                }
            }
        }
        else if (message.mentions.users.has(client.user.id)) // Mentioned bot
        {
            console.log(`User ${message.author.username} mentioned the bot in channel ${message.channel.name}.`);

            message.reply(`Howdy! I'm here to help - use \`${prefix}${help_command}\` for detailed information on how to use me!`);
        }
    }
});

client.login(token);