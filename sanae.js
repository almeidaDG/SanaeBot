const { Client } = require('discord.js-commando');
const path = require ('path');
const config = require ('./config.json');
const activities = require('./assets/json/activity');

const sanae = new Client({
	owner: config.owner,
	commandPrefix: config.prefix,
});

sanae.registry
	.registerDefaultTypes()
	.registerGroups([
		['misc', 'Diversos'],
		['util', 'Utilidades'],
	])
	.registerDefaultGroups({
		commands: false,
	})
	.registerDefaultCommands({
		help: false,
		eval: false,
		prefix: false,
		ping: false,
		commandState: false,
		unknownCommand: false,
	})
	.registerCommandsIn(path.join(__dirname, 'commands'));

sanae.on('ready', () => {
	console.log(`${sanae.user.tag} está online!`);
	sanae.setInterval(() => {
		const activity = activities[Math.floor(Math.random() * activities.length)];
		sanae.user.setActivity(activity.text, { type: activity.type });
	}, 60000);
});

sanae.on('error', err => sanae.logger.error(err));

sanae.on('commandError', (command, err) => sanae.logger.error(`[COMMAND:${command.name}]\n${err.stack}`));

sanae.login(config.token);