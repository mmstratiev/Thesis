const fs = require('fs');
const discord = require('discord.js');
const localization = require('./localization.json');
const {prefix, main_command, token} = require('./config.json');
const questionObjects = require('./askme.json');

const client = new discord.Client();

// Setup commands
client.commands = new discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);

	// set a new item in the Collection
	// with the key as the command name and the value as the exported module
	client.commands.set(command.name, command);
}

client.on('ready', () =>{
    console.log('Bot is online!');
    client.user.setActivity('people Tag Me!', { type: 'WATCHING' });
});

client.on('message', message=>
{
    if(!message.author.bot)
    {
        if(message.content.startsWith(prefix))
        {
            const args = message.content.slice(prefix.length).split(/ +/);
            const commandName = args.shift().toLowerCase();

            if(client.commands.has(commandName))
            {
                const command = client.commands.get(commandName);
                if(command.args && !args.length)
                {
                    var reply = localization.response_no_arguments;
                    if(command.usage)
                    {
                        reply += '\n' + localization.response_proper_command + ` \`${prefix}${command.name} ${command.usage}\``;
                    }

                    message.reply(reply);
                }
                else
                {
                    try
                    {
                        command.execute(message,args);
                    }
                    catch (error)
                    {
                        console.error(error);
                        message.reply(localization.response_command_failed);
                    }
                }
            }
        }
        else if(message.mentions.users.has(client.user.id)) // Mentioned bot
        {
            console.log(`User ${message.author.username} mentioned the bot in channel ${message.channel.name}.`);

            var reply = localization.response_mentioned_self;
            reply = reply.replace('^1', `\`${prefix}${main_command} ${localization.main_command_usage}\``);

            for(var attributename in questionObjects)
            {
                reply += '\n' + `\`${attributename}\``;
            }

            message.reply(reply);
        } 
    }
});

client.login(token);