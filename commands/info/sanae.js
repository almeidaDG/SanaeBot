const Command = require('../../structures/Command');
const { RichEmbed } = require('discord.js');
const moment = require('moment');
require('moment-duration-format');
const { version, dependencies } = require('../../package.json');
const { SANAE_GITHUB_REPO_USERNAME, SANAE_GITHUB_REPO_NAME } = require ('../../config.json');
const source = SANAE_GITHUB_REPO_NAME && SANAE_GITHUB_REPO_USERNAME;

module.exports = class SanaeCommand extends Command {
	constructor(client) {
		super(client, {
			name:'sanae',
			aliases: ['sanaezinha'],
			group: 'info',
			memberName: 'sanae ',
			description: 'Informações sobre mim',
			clientPermissions: ['EMBED_LINKS'],
		});
	}
	run(msg) {
		const embed = new RichEmbed()
			.setColor('#5359af')
			.setThumbnail(this.client.user.displayAvatarURL)
			.addField('🤖 Código Fonte',
				source ? `[GitHub](https://github.com/${SANAE_GITHUB_REPO_USERNAME}/${SANAE_GITHUB_REPO_NAME})` : 'N/A', true)
			.addField('💾 Uso da Memória', `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`, true)
			.addField('🕒 Tempo Ativo', moment.duration(this.client.uptime).format('ddd:hh:mm:ss', { trim: false }), true)
			.addField('📦 Versão', `v${version}`, true)
			.addBlankField()
			.addField('📚 Dependências', this.parseDependencies())
			.setFooter('©2019 - Maemi#0501', 'https://i.imgur.com/WZlFoOU.gif');
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