const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('hail')
		.setDescription('Is Meeku awake? Find out!'),
	async execute(interaction)
	{
		await interaction.reply('<:mikusphere:860682931320520734> ALL HAIL THE MIKUSPHERE <:mikusphere:860682931320520734>');
	},
};