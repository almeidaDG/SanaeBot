const { oneLine } = require('common-tags');
const Command = require('../../structures/Command');

module.exports = class PingCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'ping',
			group: 'util',
			memberName: 'ping',
			description: 'Checa o ping do usuário e do bot com o servidor do discord',
		});
	}

	async run(msg) {
		if(!msg.editable) {
			const pingMsg = await msg.reply('🏓 Ping!');
			return pingMsg.edit(oneLine`
				${msg.channel.type !== 'dm' ? `${msg.author},` : ''}
				🏓 Pong! Sua latência: ${pingMsg.createdTimestamp - msg.createdTimestamp}ms.
				${this.client.ping ? `Minha latência: ${Math.round(this.client.ping)}ms.` : ''}
			`);
		}
		else {
			await msg.edit('🏓 Ping!');
			return msg.edit(oneLine`
				🏓 Pong! Sua latência: ${msg.editedTimestamp - msg.createdTimestamp}ms.
				${this.client.ping ? `Minha latência: ${Math.round(this.client.ping)}ms.` : ''}
			`);
		}
	}
};
