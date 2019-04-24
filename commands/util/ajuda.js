const { stripIndents, oneLine } = require('common-tags');
const Command = require('../../structures/Command');

module.exports = class HelpCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'ajuda',
			group: 'util',
			memberName: 'ajuda',
			description: 'Mostra uma lista de comandos permitidos, ou informações detalhadas de um comando específico',
			examples: ['ajuda', 'prefixo ajuda'],
			guarded: true,

			args: [
				{
					key: 'command',
					prompt: 'Qual comando você precisa de ajuda?',
					type: 'string',
					default: '',
				},
			],
		});
	}

	async run(msg, args) { // eslint-disable-line complexity
		const groups = this.client.registry.groups;
		const commands = this.client.registry.findCommands(args.command, false, msg);
		const showAll = args.command && args.command.toLowerCase() === 'all';
		if(args.command && !showAll) {
			if(commands.length === 1) {
				let help = stripIndents`
					${oneLine`
						__Comando \`${commands[0].name}\`:__ ${commands[0].description}
						${commands[0].guildOnly ? ' (Usável apenas em servidores)' : ''}
						${commands[0].nsfw ? ' (NSFW)' : ''}
					`}

					**Forma de usar:** ${msg.anyUsage(`${commands[0].name}${commands[0].format ? ` ${commands[0].format}` : ''}`)}
				`;
				if(commands[0].aliases.length > 0) help += `\n**Aliases:** ${commands[0].aliases.join(', ')}`;
				help += `\n${oneLine`
					**Grupo:** ${commands[0].group.name}
					(\`${commands[0].groupID}:${commands[0].memberName}\`)
				`}`;
				if(commands[0].details) help += `\n**Detalhes:** ${commands[0].details}`;
				if(commands[0].examples) help += `\n**Exemplos:**\n${commands[0].examples.join('\n')}`;
				const messages = [];
				try {
					messages.push(await msg.direct(help));
					if(msg.channel.type !== 'dm') messages.push(await msg.reply('📬 Enviado uma mensagem para o seu DM.'));
				}
				catch(err) {
					messages.push(await msg.reply('Não foi possível te enviar um DM. Você está com DMs desativados?'));
				}
				return messages;
			}
			else if(commands.length > 15) {
				return msg.reply('Múltiplos comandos encontrados. Especifique melhor');
			}
			else {
				return msg.reply(
					`Não foi capaz de encontrar o comando. Use ${msg.usage(
						null, msg.channel.type === 'dm' ? null : undefined, msg.channel.type === 'dm' ? null : undefined
					)} para ver todos os comandos.`
				);
			}
		}
		else {
			const messages = [];
			try {
				messages.push(await msg.direct(stripIndents`
					${oneLine`
						Para executar um comando em ${msg.guild ? msg.guild.name : 'qualquer servidor'},
						use ${Command.usage('s!comando', null, null)}.
						Por exemplo, ${Command.usage('s!sanae', msg.guild ? msg.guild.commandPrefix : null)}.
					`}
					Para executar um comando neste DM, use ${Command.usage('comando', null, null)} sem nenhum prefixo.

					Use ${this.usage('<comando>', null, null)} para ver o comando detalhadamente.

					__**${`Comandos disponíveis para ${msg.guild || 'esta DM'}`}**__

					${(showAll ? groups : groups.filter(grp => grp.commands.some(cmd => cmd.isUsable(msg))))
		.map(grp => stripIndents`
							__${grp.name}__
							${(showAll ? grp.commands : grp.commands.filter(cmd => cmd.isUsable(msg)))
		.map(cmd => `**\`s!${cmd.name}\` :** ${cmd.description}${cmd.nsfw ? ' (NSFW)' : ''}`).join('\n')
}
						`).join('\n\n')
}

				`, { split: true }));
				if(msg.channel.type !== 'dm') messages.push(await msg.reply('📬 Enviado uma mensagem para o seu DM.'));
			}
			catch(err) {
				messages.push(await msg.reply('Não foi possível te enviar um DM. Você está com DMs desativados?'));
			}
			return messages;
		}
	}
};
