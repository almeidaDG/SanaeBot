const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');
const request = require('node-superfetch');

module.exports = class DuckCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'quack',
			aliases: ['pato', 'patinho'],
			group: 'misc',
			memberName: 'quack',
			description: 'Envia no chat fotos de patos aleatórios',
			clientPermissions: ['ATTACH_FILES'],
			credit: [
				{
					name: 'Random-d.uk',
					url: 'https://random-d.uk/',
				},
			],
		});
	}

	async run(message) {
		try {
			const { body } = await request.get('https://random-d.uk/api/v2/random');
			const embed = new RichEmbed();
			embed.setColor('#5359af');
			embed.setImage(body.url);
			return message.channel.send({ embed });
		}
		catch (err) {
			return message.reply('Ocorreu um erro ao executar este comando.');
		}
	}
};