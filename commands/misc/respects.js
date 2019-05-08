const { Command } = require('discord.js-commando');

module.exports = class RespectsCommand extends Command {
	constructor(bot) {
		super(bot, {
			name: 'respects',
			group: 'misc',
			memberName: 'respects',
			description: 'Envia no chat a mensagem Press F to Pay Respects, com uma reação.',
		});
	}

	run(message) {
		message.channel.send('Press F to Pay Respects').then(m => {
			m.react('🇫');
			message.delete();
		});
	}
};