const Command = require('../../structures/Command');
const { RichEmbed } = require('discord.js');
const request = require('node-superfetch');

module.exports = class DogCommand extends Command {
	constructor(client) {
		super(client, {
			name:'auau',
			aliases: ['dog', 'cachorro'],
			group: 'misc',
			memberName: 'auau',
			description: 'Envia no chat fotos de cachorros aleatórios.',
			clientPermissions: ['ATTACH_FILES'],
			credit: [
				{
					name: 'Dog API',
					url: 'https://dog.ceo/dog-api/',
				},
			],
		});
	}
	async run(message) {
		try {
			const { body } = await request.get('https://dog.ceo/api/breeds/image/random');
			const embed = new RichEmbed();
			embed.setColor('#5359af');
			embed.setImage(body.message);
			return message.channel.send({ embed });
		}
		catch (err) {
			return message.reply('Ocorreu um erro ao executar este comando.');
		}
	}
};