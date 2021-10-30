module.exports = {
	name: 'messageCreate',
	once: false,
	execute(message)
	{
		if (message.author == message.client.user)
		{
			return;
		}

		// Order here determines priority. If any function returns true no following functions will run.
		// if (mentionBot(message)) return;
		if (respondToText(message)) return;
	},
};

function mentionBot(message)
{
	if (message.mentions.has(message.client.user.id))
	{
		message.channel.sendTyping();
		setTimeout(function()
		{
			message.channel.send('OK.');
		}, 3000);
		return true;
	}
	else
	{
		return false;
	}
}

function respondToText(message)
{
	if (message.cleanContent.toLowerCase().includes('meeku'))
	{
		message.channel.send('MEEKU!');
		return true;
	}
	else
	{
		return false;
	}
}