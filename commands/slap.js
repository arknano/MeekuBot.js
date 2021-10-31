const { SlashCommandBuilder } = require('@discordjs/builders');
const loc = require('.././loc.js');
const format = require ('string-format');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('slap')
		.setDescription('Slaps a user with a fish-based entity.')
		.addUserOption(option =>
			option.setName('user')
				.setDescription('The user to slap.')
				.setRequired(true)),
	async execute(interaction)
	{
		const args = { target: interaction.options.getMember('user'), author: interaction.user };
		format.extend (String.prototype, {});
		if (args.target.user == interaction.client.user)
		{
			await interaction.reply(loc.getTL('slapMeeku').format(args));
		}
		else
		{
			await interaction.reply(loc.getTL(`slap`).format(args));
		}
	},
};