const { main_command_usage, response_unknown_question } = require('../localization.json');
const { main_command } = require('../commands.json');
const questionObjects = require('./askme.json');

module.exports = {
    name: main_command,
    description: 'Answers the asked questions.',
    args: [0, 1], // possible numbers of arguments for command
    usage: main_command_usage, // correct usage of arguments

    execute(message, args) {
        console.log(`User ${message.author.username} issued command ${message.content} in channel ${message.channel.name}.`);

        let messageReply = '';
        if (args.length == 0) { // no arguments, display possible questions
            messageReply = 'What would you like to know? You can ask me any of the following questions: \n'

            for (let key in questionObjects) {
                messageReply += `\`${key}\`\n`;
            }
        }
        else { // one argument, try to answer question that matches argument
            if (questionObjects.hasOwnProperty(args[0])) {
                messageReply = questionObjects[args[0]];
            }
            else {
                messageReply = response_unknown_question;
            }
        }
        message.reply(messageReply);
    }
};