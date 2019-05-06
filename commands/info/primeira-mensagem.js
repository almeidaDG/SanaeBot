const Command = require('../../structures/Command');
const { RichEmbed } = require('discord.js');

module.exports = class FirstMessageCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'primeira-mensagem',
			group: 'info',
			memberName: 'primeira-mensagem',
			description: 'Responde com a primeira mensagem enviada no canal.',
			clientPermissions: ['EMBED_LINKS', 'READ_MESSAGE_HISTORY'],
			args: [
				{
					key: 'channel',
					prompt: 'Qual canal você quer ver a primeira mensagem enviada nele?',
					type: 'channel',
					default: msg => msg.channel,
				},
			],
		});
	}

	async run(msg, { channel }) {
		if (channel.type === 'text' && !channel.permissionsFor(this.client.user).has('READ_MESSAGE_HISTORY')) {
			return msg.reply(`Desculpe, não tenho permissão para isso ${channel}...`);
		}
		const messages = await channel.fetchMessages({ after: 1, limit: 1 });
		const message = messages.first();
		const embed = new RichEmbed()
			.setColor(message.member ? message.member.displayHexColor : 0x5359af)
			.setThumbnail(message.author.displayAvatarURL)
			.setAuthor(message.author.tag, message.author.displayAvatarURL)
			.setTimestamp(message.createdAt)
			.setFooter(`ID: ${message.id}`)
			.addField('⬇ Pular', message.url);
		return msg.embed(embed);
	}
};