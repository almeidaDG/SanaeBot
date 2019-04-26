const Command = require('../../structures/Command');
const { RichEmbed } = require('discord.js');
const request = require('node-superfetch');
const { formatNumber } = require('../../util/Util');
const moment = require('moment');
const { OSU_KEY } = require ('../../config.json');

module.exports = class OsuCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'osu',
			group: 'busca',
			memberName: 'osu',
			description: 'Envia no chat informações sobre um jogador de osu!',
			clientPermissions: ['EMBED_LINKS'],
			credit: [
				{
					name: 'osu!api',
					url: 'https://github.com/ppy/osu-api/wiki',
				},
			],
			args: [
				{
					key: 'user',
					prompt: 'Qual usuário você deseja buscar informações?',
					type: 'string',
				},
			],
		});
	}

	async run(msg, { user }) {
		try {
			const { body } = await request
				.get('https://osu.ppy.sh/api/get_user')
				.query({
					k: OSU_KEY,
					u: user,
					type: 'string',
				});
			if (!body.length) return msg.say('Não foi encontrado nenhum resultado.');
			const data = body[0];
			const embed = new RichEmbed()
				.setColor('#5359af')
				.setAuthor('osu!', 'https://i.imgur.com/hWrw2Sv.png', 'https://osu.ppy.sh/')
				.setFooter(`https://osu.ppy.sh/users/${data.user_id}`, `https://a.ppy.sh/${data.user_id}`)
				.addField('Usuário', data.username, true)
				.addField('PP\'s', data.pp_raw ? `${Math.round(data.pp_raw)}` : '???', true)
				.addField('Level', data.level ? `${Math.round(data.level)}` : '???', true)
				.addField('Precisão', data.accuracy ? `${Math.round(data.accuracy)}%` : '???', true)
				.addField('Play Count', data.playcount ? formatNumber(data.playcount) : '???', true)
				.addField('País', data.country || '???', true)
				.addField('Membro desde', moment.utc(data.join_date).format('DD/MM/YYYY h:mm A'), true)
				.addField('Ranked Score', data.ranked_score ? formatNumber(data.ranked_score) : '???', true)
				.addField('Total Score', data.total_score ? formatNumber(data.total_score) : '???', true)
				.addField('SS', data.count_rank_ss ? formatNumber(data.count_rank_ss) : '???', true)
				.addField('S', data.count_rank_s ? formatNumber(data.count_rank_s) : '???', true)
				.addField('A', data.count_rank_a ? formatNumber(data.count_rank_a) : '???', true);
			return msg.embed(embed);
		}
		catch (err) {
			return msg.reply(`Oh não, um erro ocorreu: \`${err.message}\`. Tente novamente mais tarde, ou contate meu mestre se o problema persistir!`);
		}
	}
};