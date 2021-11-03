const { SlashCommandBuilder } = require('@discordjs/builders');
const loc = require('.././loc.js');
const format = require ('string-format');
const SpotifyWebApi = require('spotify-web-api-node');
const sqlite3 = require('sqlite3').verbose();
const { MessageEmbed } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('spofty')
		.setDescription('Retrieves a random song/album/playlist')
		.addStringOption(option =>
			option.setName('type')
				.setDescription('The type of media to retrieve')
				.setRequired(true)
				.addChoice('album', 'album')
				.addChoice('song', 'song')),
	async execute(interaction)
	{
		await interaction.deferReply();
		const userId = interaction.user.id;
		const db = new sqlite3.Database('./spotify.db', (err) =>
		{
			if (err)
			{
				interaction.editReply(`Failed to connect to database.`);
				return console.error(err.message);
			}
			console.log('Connected to the spofty cache db.');
		});

		let albumIds = [];
		let trackIds = [];
		db.get(`
		SELECT * FROM spotify WHERE discordID = ${userId};
		`, (error, row) =>
		{
			albumIds = row.albumsCSV.split(',');
			trackIds = row.tracksCSV.split(',');
		});
		const spotifyApi = new SpotifyWebApi({
			clientId: '9566f41fae67442193a089505287ae2d',
			clientSecret: '219f35a43cda4bbaaab719b92904e1dc',
		});
		if (albumIds.length == 0 && trackIds.length == 0)
		{
			interaction.editReply('User not found in database. Have you run /updatespofty before?');
			return;
		}
		spotifyApi.clientCredentialsGrant()
			.then(function(result)
			{
				spotifyApi.setAccessToken(result.body.access_token);
				if (interaction.options.getString('type') == 'album')
				{
					spotifyApi.getAlbum(albumIds[Math.floor(Math.random() * albumIds.length)])
						.then(function(data)
						{
							const embed = new MessageEmbed()
								.setColor('#1DB954')
								.setTitle(data.body.name)
								.setURL(data.body.external_urls.spotify)
								.setDescription(`${data.body.total_tracks} track ${data.body.album_type}`)
								.setAuthor(data.body.artists[0].name, undefined, data.body.artists[0].external_urls.spotify)
								.setThumbnail(data.body.images[0].url);

							interaction.editReply({ content: 'I think you should listen to:', embeds: [embed] });
						}, function(err)
						{
							console.error(err);
						});
				}
				else
				{
					spotifyApi.getTrack(trackIds[Math.floor(Math.random() * trackIds.length)])
						.then(function(data)
						{
							const embed = new MessageEmbed()
								.setColor('#1DB954')
								.setTitle(data.body.name)
								.setURL(data.body.external_urls.spotify)
								.setDescription(`on ${data.body.album.name}`)
								.setAuthor(data.body.artists[0].name, undefined, data.body.artists[0].external_urls.spotify)
								.setThumbnail(data.body.album.images[0].url);

							interaction.editReply({ content: 'I think you should listen to:', embeds: [embed] });
						}, function(err)
						{
							console.error(err);
						});
				}
			}, function(err)
			{
				console.error(err);
			});

		// await interaction.reply(`lol it doesnt do anything yet`);
	},
};