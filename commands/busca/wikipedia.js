const Command = require('../../structures/Command');
const { RichEmbed } = require('discord.js');
const request = require('node-superfetch');
const { shorten } = require('../../util/Util');

module.exports = class WikipediaCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'wikipedia',
			group: 'busca',
			memberName: 'wikipedia',
			description: 'Busca e apresenta um artigo da Wikipedia.',
			clientPermissions: ['EMBED_LINKS'],
			credit: [
				{
					name: 'Wikipedia',
					url: 'https://www.wikipedia.org/',
				},
			],
			args: [
				{
					key: 'texto',
					prompt: 'Qual artigo você procura?',
					type: 'string',
				},
			],
		});
	}

	async run(msg, { texto }) {
		try {
			const { body } = await request
				.get('https://pt.wikipedia.org/w/api.php')
				.query({
					action: 'query',
					prop: 'extracts|pageimages',
					format: 'json',
					titles: texto,
					exintro: '',
					explaintext: '',
					pithumbsize: 150,
					redirects: '',
					formatversion: 2,
				});
			const data = body.query.pages[0];
			if (data.missing) return msg.say('Não foi encontrado nenhum resultado.');
			const embed = new RichEmbed()
				.setColor('#5359af')
				.setTitle(data.title)
				.setAuthor('Wikipedia', 'https://i.imgur.com/Z7NJBK2.png', 'https://www.wikipedia.org/')
				.setThumbnail(data.thumbnail ? data.thumbnail.source : null)
				.setURL(`https://pt.wikipedia.org/wiki/${encodeURIComponent(texto).replace(/\)/g, '%29')}`)
				.setDescription(shorten(data.extract.replace(/\n/g, '\n\n')));
			return msg.embed(embed);
		}
		catch (err) {
			return msg.reply(`Um erro ocorreu: \`${err.message}\`. Tente novamente mais tarde!`);
		}
	}
};