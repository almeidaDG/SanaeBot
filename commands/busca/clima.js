const Command = require('../../structures/Command');
const { RichEmbed } = require('discord.js');
const request = require('node-superfetch');
const { CLIMA_KEY } = require ('../../config.json');

module.exports = class WeatherCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'clima',
			group: 'busca',
			memberName: 'busca',
			description: 'Responde informações sobre o clima de um lugar.',
			clientPermissions: ['EMBED_LINKS'],
			credit: [
				{
					name: 'OpenWeatherMap API',
					url: 'https://openweathermap.org/api',
				},
			],
			args: [
				{
					key: 'cidade',
					prompt: 'Qual cidade você quer obter informações sobre o clima?',
					type: 'string',
					parse: cidade => {
						if (/^[0-9]+$/.test(cidade)) return { type: 'zip', data: cidade };
						return { type: 'q', data: cidade };
					},
				},
			],
		});
	}

	async run(msg, { cidade }) {
		try {
			const { body } = await request
				.get('https://api.openweathermap.org/data/2.5/weather')
				.query({
					q: cidade.type === 'q' ? cidade.data : '',
					zip: cidade.type === 'zip' ? cidade.data : '',
					units: 'metric',
					lang: 'pt',
					appid: CLIMA_KEY,
				});
			const embed = new RichEmbed()
				.setColor('#5359af')
				.setAuthor(
					`${body.name}, ${body.sys.country}`,
					'https://i.imgur.com/NjMbE9o.png',
					'https://openweathermap.org/city'
				)
				.setURL(`https://openweathermap.org/city/${body.id}`)
				.setTimestamp()
				.addField('Condição Atual', body.weather.map(data => `${data.main} (${data.description})`).join('\n'))
				.addField('Temperatura', `${body.main.temp}°C`, true)
				.addField('Umidade', `${body.main.humidity}%`, true)
				.addField('Velocidade do Vento', `${body.wind.speed} km/h`, true);
			return msg.embed(embed);
		}
		catch (err) {
			if (err.status === 404) return msg.say('Não foi encontrado nenhum resultado.');
			return msg.say(`Um erro ocorreu: \`${err.message}\`. Tente novamente mais tarde!`);
		}
	}
};