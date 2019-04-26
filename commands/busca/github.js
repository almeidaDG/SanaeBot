const Command = require('../../structures/Command');
const moment = require('moment');
const { RichEmbed } = require('discord.js');
const request = require('node-superfetch');
const { shorten, formatNumber, base64 } = require('../../util/Util');
const { GITHUB_USERNAME, GITHUB_PASSWORD } = require ('../../config.json');

module.exports = class GithubCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'github',
			aliases: ['repositorio', 'git'],
			group: 'busca',
			memberName: 'github',
			description: 'Mostra informações sobre um repositório do GitHub.',
			clientPermissions: ['EMBED_LINKS'],
			credit: [
				{
					name: 'GitHub API',
					url: 'https://developer.github.com/v3/',
				},
			],
			args: [
				{
					key: 'autor',
					prompt: 'Quem é o autor deste repositório?',
					type: 'string',
					parse: author => encodeURIComponent(author),
				},
				{
					key: 'repositorio',
					prompt: 'Qual o nome do repositório?',
					type: 'string',
					parse: repository => encodeURIComponent(repository),
				},
			],
		});
	}

	async run(msg, { autor, repositorio }) {
		try {
			const { body } = await request
				.get(`https://api.github.com/repos/${autor}/${repositorio}`)
				.set({ Authorization: `Basic ${base64(`${GITHUB_USERNAME}:${GITHUB_PASSWORD}`)}` });
			const embed = new RichEmbed()
				.setColor('#5359af')
				.setAuthor('GitHub', 'https://i.imgur.com/e4HunUm.png', 'https://github.com/')
				.setTitle(body.full_name)
				.setURL(body.html_url)
				.setDescription(body.description ? shorten(body.description) : 'Sem descrição.')
				.setThumbnail(body.owner.avatar_url)
				.addField('Estrelas', formatNumber(body.stargazers_count), true)
				.addField('Forks', formatNumber(body.forks), true)
				.addField('Issues em aberto', formatNumber(body.open_issues), true)
				.addField('Linguagem', body.language || '???', true)
				.addField('Data de Criação', moment.utc(body.created_at).format('DD/MM/YYYY h:mm A'), true)
				.addField('Última Modificação', moment.utc(body.updated_at).format('DD/MM/YYYY h:mm A'), true);
			return msg.embed(embed);
		}
		catch (err) {
			if (err.status === 404) return msg.say('Não foi encontrado nenhum resultado.');
			return msg.reply(`Um erro foi encontrado: \`${err.message}\`. Tente novamente mais tarde!`);
		}
	}
};