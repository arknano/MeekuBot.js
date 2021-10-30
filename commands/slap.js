const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('slap')
		.setDescription('Slaps a user')
		.addUserOption(option =>
			option.setName('user')
				.setDescription('The user to slap.')
				.setRequired(true)),
	async execute(interaction) {
		const target = interaction.options.getMember('user');
		const user = interaction.user;
		await interaction.reply(`${user} slaps ${target} around a bit with a large trout.`);
	},
};