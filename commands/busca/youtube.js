const Command = require('../../structures/Command');
const moment = require('moment');
const { RichEmbed } = require('discord.js');
const request = require('node-superfetch');
const { YOUTUBE_KEY } = require ('../../config.json');

module.exports = class YoutubeCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'youtube',
			aliases: ['yt'],
			group: 'busca',
			memberName: 'youtube',
			description: 'Procura um vídeo do youtube.',
			clientPermissions: ['EMBED_LINKS'],
			credit: [
				{
					name: 'YouTube Data API',
					url: 'https://developers.google.com/youtube/v3/',
				},
			],
			args: [
				{
					key: 'texto',
					prompt: 'Qual o nome do vídeo que você está procurando?',
					type: 'string',
				},
			],
		});
	}

	async run(msg, { texto }) {
		try {
			const { body } = await request
				.get('https://www.googleapis.com/youtube/v3/search')
				.query({
					part: 'snippet',
					type: 'video',
					maxResults: 1,
					q: texto,
					key: YOUTUBE_KEY,
				});
			if (!body.items.length) return msg.say('Não foi encontrado nenhum resultado.');
			const data = body.items[0];
			const embed = new RichEmbed()
				.setColor('#ff0000')
				.setTitle(data.snippet.title)
				.setDescription(data.snippet.description)
				.setAuthor('YouTube', 'https://i.imgur.com/kKHJg9Q.png', 'https://www.youtube.com/')
				.setURL(`https://www.youtube.com/watch?v=${data.id.videoId}`)
				.setThumbnail(data.snippet.thumbnails.default ? data.snippet.thumbnails.default.url : null)
				.addField('❯ Canal', data.snippet.channelTitle, true)
				.addField('❯ Data da Publicação', moment.utc(data.snippet.publishedAt).format('DD/MM/YYYY h:mm A'), true);
			msg.reply(`https://www.youtube.com/watch?v=${data.id.videoId}`);
			msg.embed(embed);
		}
		catch (err) {
			return msg.reply(`Um erro ocorreu: \`${err.message}\`. Tente novamente mais tarde!`);
		}
	}
};