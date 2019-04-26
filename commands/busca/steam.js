const Command = require('../../structures/Command');
const { RichEmbed } = require('discord.js');
const request = require('node-superfetch');
const { formatNumber } = require('../../util/Util');

module.exports = class SteamCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'steam',
			group: 'busca',
			memberName: 'steam',
			description: 'Mostra informações sobre um jogo da steam.',
			clientPermissions: ['EMBED_LINKS'],
			credit: [
				{
					name: 'Steam',
					url: 'https://store.steampowered.com/',
				},
			],
			args: [
				{
					key: 'jogo',
					prompt: 'Qual jogo você está procurando informações?',
					type: 'string',
				},
			],
		});
	}

	async run(msg, { jogo }) {
		try {
			const id = await this.search(jogo);
			if (!id) return msg.say('Não foi encontrado nenhum resultado.');
			const data = await this.fetchGame(id);
			const current = data.price_overview ? `$${data.price_overview.final / 100}` : 'Grátis';
			const original = data.price_overview ? `$${data.price_overview.initial / 100}` : 'Grátis';
			const price = current === original ? current : `~~${original}~~ ${current}`;
			const platforms = [];
			if (data.platforms) {
				if (data.platforms.windows) platforms.push('Windows');
				if (data.platforms.mac) platforms.push('Mac');
				if (data.platforms.linux) platforms.push('Linux');
			}
			const embed = new RichEmbed()
				.setColor('#5359af')
				.setAuthor('Steam', 'https://i.imgur.com/xxr2UBZ.png', 'http://store.steampowered.com/')
				.setTitle(data.name)
				.setURL(`https://store.steampowered.com/app/${data.steam_appid}`)
				.setThumbnail(data.header_image)
				.addField('Preço (USD)', price, true)
				.addField('Metacritic', data.metacritic ? data.metacritic.score : '???', true)
				.addField('Recomendações', data.recommendations ? formatNumber(data.recommendations.total) : '???', true)
				.addField('Plataformas', platforms.join(', ') || 'None', true)
				.addField('Lançamento', data.release_date ? data.release_date.date : '???', true)
				.addField('DLC\'s', data.dlc ? formatNumber(data.dlc.length) : 0, true)
				.addField('Desenvolvedores', data.developers ? data.developers.join(', ') || '???' : '???')
				.addField('Editoras', data.publishers ? data.publishers.join(', ') || '???' : '???');
			return msg.embed(embed);
		}
		catch (err) {
			return msg.reply(`Um erro ocorreu: \`${err.message}\`. Tente novamente mais tarde!`);
		}
	}

	async search(query) {
		const { body } = await request
			.get('https://store.steampowered.com/api/storesearch/')
			.query({
				cc: 'br',
				l: 'pt',
				term: query,
			});
		if (!body.items.length) return null;
		return body.items[0].id;
	}

	async fetchGame(id) {
		const { body } = await request
			.get('https://store.steampowered.com/api/appdetails/')
			.query({ appids: id });
		return body[id.toString()].data;
	}
};