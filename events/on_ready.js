const loc = require('.././loc.js');
const { devChannel, guildId } = require('.././config.json');

module.exports = {
	name: 'ready',
	once: true,
	async execute(client)
	{
		console.log(`Ready! Logged in as ${client.user.tag}`);
		const channel = await client.guilds.cache.get(guildId).channels.fetch(devChannel);
		// channel.send(loc.getTL('botOnline'));
		client.user.setActivity(loc.getTL('status'), {
			type: 'PLAYING',
		});
	},
};