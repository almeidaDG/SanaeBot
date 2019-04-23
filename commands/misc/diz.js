const { Command } = require('discord.js-commando');

module.exports = class SayCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'diz',
			group: 'misc',
			memberName: 'diz',
			description: 'Faz o bot dizer algo que você escreveu',
			args: [
				{
					key: 'text',
					prompt: 'O que eu devo escrever?',
					type: 'string',
				},
			],
		});
	}

	async run(msg, { text }) {
		if (msg.channel.type === 'text' && msg.deletable) await msg.delete();
		return msg.say(text);
	}
};