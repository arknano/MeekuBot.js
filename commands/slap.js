const { SlashCommandBuilder } = require('@discordjs/builders');

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
		const target = interaction.options.getMember('user');
		const user = interaction.user;
		if (target.user == interaction.client.user)
		{
			await interaction.reply(`${target} slaps ${user} around a bit with a large trout instead.`);
		}
		else
		{
			await interaction.reply(`${user} slaps ${target} around a bit with a large trout.`);
		}
	},
};