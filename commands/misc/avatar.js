const Command = require('../../structures/Command');
const { RichEmbed } = require('discord.js');

module.exports = class AvatarCommand extends Command {
	constructor(client) {
		super(client, {
			name:'avatar',
			group: 'misc',
			memberName: 'avatar',
			description: 'Mostra o avatar de um usuário marcado ou o seu próprio',
			args: [
				{
					type:'user',
					prompt:'Marque o usuário que você quer ver o avatar.',
					key:'user',
					default: msg => msg.author,
				},
			],
		});
	}
	run(message, { user }) {
		const embed = new RichEmbed()
			.setTitle(`${user.tag}`)
			.setURL(user.displayAvatarURL)
			.setImage(user.displayAvatarURL)
			.setColor('#5359af');
		message.embed(embed);
	}
};