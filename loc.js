const config = require('./config.json');
const csv = require('csv');
const fs = require('fs');


// eslint-disable-next-line no-var
var locJSON = '';

module.exports.loadLoc = function functionLoadLoc()
{
	fs.readFile('meekuLoc.tsv', 'utf8', function(err, csvText)
	{
		if (err) throw err;
		csv.parse(csvText, { columns: true, delimiter: '\t' }, function(err, data)
		{
			const res_obj = data.reduce(function(acc, cur)
			{
				acc[cur.Key] = cur;
				return acc;
			}, {});
			locJSON = JSON.parse(JSON.stringify(res_obj, null, 2));
		});
	});

};

module.exports.getTL = function getTL(key)
{
	return locJSON[key][config.locSetting];
};