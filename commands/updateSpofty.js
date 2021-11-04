const { SlashCommandBuilder } = require('@discordjs/builders');
const loc = require('../loc.js');
const format = require ('string-format');
const SpotifyWebApi = require('spotify-web-api-node');
const sqlite3 = require('sqlite3').verbose();
const { MessageEmbed } = require('discord.js');
const { spotifyClientID, spotifyClientSecret } = require('.././config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('updatespofty')
		.setDescription('Update your cached library')
		.addStringOption(option =>
			option.setName('token')
				.setDescription('Your generated authentication token.')
				.setRequired(true)),
	async execute(interaction)
	{
		await interaction.deferReply();
		const db = new sqlite3.Database('./spotify.db', (err) =>
		{
			if (err)
			{
				interaction.editReply(`Failed to connect to database.`);
				return console.error(err.message);
			}
			console.log('Connected to the spofty cache db.');
		});

		db.run(`
		CREATE TABLE IF NOT EXISTS spotify (
			discordID integer NOT NULL PRIMARY KEY,
			albumsCSV text NOT NULL,
			tracksCSV text NOT NULL
		);
		`);

		// SET UP SPOTIFY API
		const userId = interaction.user.id;
		const token = interaction.options.getString('token');
		const spotifyApi = new SpotifyWebApi({
			clientId: spotifyClientID,
			clientSecret: spotifyClientSecret,
		});
		spotifyApi.setAccessToken(token);
		const albumIds = [];
		let albumsCount;

		// GET ALBUMS
		spotifyApi.getMySavedAlbums({
			limit: 50,
			offset: 0,
		})
			.then(function(data)
			{
				// Output items
				const iterations = Math.ceil(data.body.total / 50) - 1; // we -1 because we will handle the first iteration outside of the loop
				albumsCount = data.body.total;
				for (let i = 0; i < data.body.items.length; i++)
				{
					const obj = data.body.items[i];
					albumIds.push(obj.album.id);
				}
				for (let i = 0; i < iterations; i++)
				{
					spotifyApi.getMySavedAlbums({
						limit: 50,
						offset: i * 50,
					})
						.then(function(data2)
						{
							for (let j = 0; j < data2.body.items.length; j++)
							{
								const obj = data2.body.items[j];
								albumIds.push(obj.album.id);
							}
						}
						,
						function(err)
						{
							console.error(err);
							console.log(`error on iteration ${i}`);
							interaction.editReply(`Error communicating with spotify.`);
							return;
						});
				}
			}
			,
			function(err)
			{
				console.error(err);
				console.log(`error on initial request`);
				interaction.editReply(`Error communicating with spotify.`);
				return;
			});


		// GET TRACKS
		let tracksTotal;
		const trackIds = [];
		spotifyApi.getMySavedTracks({
			limit: 50,
			offset: 0,
		})
			.then(function(data)
			{
				// Output items
				const iterations = Math.ceil(data.body.total / 50) - 1; // we -1 because we will handle the first iteration outside of the loop
				tracksTotal = data.body.total;
				for (let i = 0; i < data.body.items.length; i++)
				{
					const obj = data.body.items[i];
					trackIds.push(obj.track.id);
				}
				for (let i = 0; i < iterations; i++)
				{
					spotifyApi.getMySavedTracks({
						limit: 50,
						offset: i * 50,
					})
						.then(function(data2)
						{
							for (let j = 0; j < data2.body.items.length; j++)
							{
								const obj = data2.body.items[j];
								trackIds.push(obj.track.id);
							}
						}
						,
						function(err)
						{
							console.error(err);
							console.log(`error on iteration ${i}`);
							interaction.editReply(`Error communicating with spotify.`);
							return;
						});
				}
			}
			,
			function(err)
			{
				console.error(err);
				console.log(`error on initial request`);
				interaction.editReply(`Error communicating with spotify.`);
				return;
			});


		await new Promise(r => setTimeout(r, 5000));
		if (albumsCount == undefined) return;
		db.run('INSERT OR REPLACE INTO spotify(discordID, albumsCSV, tracksCSV) VALUES(?, ?, ?)', [userId, albumIds.join(), trackIds.join()], (err) =>
		{
			if (err)
			{
				interaction.editReply(`Failed to insert data into database`);
				return console.log(err.message);

			}
		});
		db.close();
		interaction.editReply(`${albumsCount} albums & ${tracksTotal} tracks saved to cache.`);
	},
};