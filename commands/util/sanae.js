const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');
const moment = require('moment');
require('moment-duration-format');
const { version, dependencies } = require('../../package.json');
const { SANAE_GITHUB_REPO } = require ('../../config.json');

module.exports = class SanaeCommand extends Command {
	constructor(client) {
		super(client, {
			name:'sanae',
			aliases: ['sanaezinha'],
			group: 'util',
			memberName: 'sanae ',
			description: 'Informações sobre mim',
			clientPermissions: ['EMBED_LINKS'],
		});
	}
	run(msg) {
		const embed = new RichEmbed()
			.setColor('#5359af')
			.setThumbnail(this.client.user.displayAvatarURL)
			.addField('🤖 Código Fonte', `[GitHub](${SANAE_GITHUB_REPO})`, true)
			.addField('💾 Uso da Memória', `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`, true)
			.addField('🕒 Tempo Ativo', moment.duration(this.client.uptime).format('hh:mm:ss', { trim: false }), true)
			.addField('📦 Versão', `v${version}`, true)
			.addBlankField()
			.addField('📚 Dependências', this.parseDependencies())
			.setFooter('©2019 - Maemi#0501', 'https://avatars1.githubusercontent.com/u/35153488?s=460&v=4');
		return msg.embed(embed);
	}

	parseDependencies() {
		return Object.entries(dependencies).map(dep => {
			if (dep[1].startsWith('github:')) {
				const repo = dep[1].replace('github:', '').split('/');
				return `[${dep[0]}](https://github.com/${repo[0]}/${repo[1].replace(/#.+/, '')})`;
			}
			return `[${dep[0]}](https://npmjs.com/${dep[0]})`;
		}).join(', ');
	}
};