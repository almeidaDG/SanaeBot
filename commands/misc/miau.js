const Command = require('../../structures/Command');
const { RichEmbed } = require('discord.js');
const { get } = require('snekfetch');

module.exports = class CatCommand extends Command {
	constructor(client) {
		super(client, {
			name:'miau',
			aliases: ['gato', 'gatinho'],
			group: 'misc',
			memberName: 'miau',
			description: 'Envia no chat fotos de gatos aleatórios.',
		});
	}
	run(message) {
		get('https://aws.random.cat/meow').then(res => {
			const embed = new RichEmbed();
			embed.setColor('#5359af');
			embed.setImage(res.body.file);
			return message.channel.send({ embed });
		});
	}
};
