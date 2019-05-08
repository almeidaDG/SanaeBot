const Command = require('../../structures/Command');
const { RichEmbed } = require('discord.js');
const request = require('node-superfetch');

module.exports = class FoxCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'fox',
			aliases: ['raposa'],
			group: 'misc',
			memberName: 'fox',
			description: 'Envia no chat foto de raposas aleatórias.',
			clientPermissions: ['ATTACH_FILES'],
			credit: [
				{
					name: 'RandomFox',
					url: 'https://randomfox.ca/',
				},
			],
		});
	}

	async run(message) {
		try {
			const { body } = await request.get('https://randomfox.ca/floof/');
			const embed = new RichEmbed();
			embed.setColor('#5359af');
			embed.setImage(body.image);
			return message.channel.send({ embed });
		}
		catch (err) {
			return message.reply('Ocorreu um erro ao executar este comando.');
		}
	}
};