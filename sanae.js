const { Client } = require('discord.js-commando');
const path = require ('path');
const config = require ('./config.json');

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
	.registerDefaultGroups()
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
	sanae.user.setActivity(config.currentGame);
});

sanae.login(config.token);