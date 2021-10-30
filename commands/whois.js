const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('whois')
		.setDescription('Get totally useless data about a user because this isn\'t irc')
		.addUserOption(option =>
			option.setName('user')
				.setDescription('The user to retrieve info on')
				.setRequired(true)),
	async execute(interaction)
	{
		const target = interaction.options.getMember('user');
		const joined = target.user.createdAt;
		const daysSinceJoined = (Date.now() - joined) / (1000 * 3600 * 24);
		const yearsSinceJoined = Math.round(daysSinceJoined / 365);
		const daysLeft = Math.round(daysSinceJoined % 365);
		const embed = new MessageEmbed()
			.setColor('#2ce6d9')
			.setTitle(target.displayName)
			.setAuthor(target.user.tag, target.user.avatarURL(), target.user.avatarURL())
			.setDescription(`Date created: ${joined.toDateString()} (${yearsSinceJoined} years and ${daysLeft} days old)`)
			.setThumbnail(target.user.avatarURL())
			.addField('ID', target.user.id);
		await interaction.reply({ embeds: [embed] });
	},
};