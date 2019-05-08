const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');


module.exports = class UserInfoCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'user-info',
			group: 'util',
			memberName: 'user-info',
			description: 'Mostra informações de um usuário.',
			examples: ['user-info @Maemi#0501 ', 'user-info Maemi'],
			guildOnly: true,
			args: [{
				key: 'membro',
				label: 'user',
				prompt: 'Marque o usuário que você quer ver informações.',
				type: 'member',
			}],
		});
	}

	run(message, { membro }) {
		const { user } = membro;
		const embed = new RichEmbed()
			.setThumbnail(user.displayAvatarURL)
			.setDescription(`Informações de **${user.tag}** (ID: ${user.id})`)
			.setColor('0x5359af')
			.setTitle(user.tag)
			.addField('🛡️ **Servidor:**', `Nickname: ${membro.nickname ? membro.nickname : 'Nenhum'}\nCargos: ${membro.roles.map(roles => `\`${roles.name}\``).join(', ')}\nEntrou em: ${membro.joinedAt}`)
			.addField('🚶 **Informação do Usuário:**', `Conta criada em: ${user.createdAt}\n${user.bot ? 'Humano? Não.' : 'Humano? Sim.'}\nStatus: ${user.presence.status}\nGame: ${user.presence.game ? user.presence.game.name : 'Nenhum'}`);
		message.channel.send({ embed });
	}
};

