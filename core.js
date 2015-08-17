/**
 * Core
 * Created by CreaturePhil - https://github.com/CreaturePhil
 *
 * This is where essential core infrastructure of
 * Pokemon Showdown extensions for private servers.
 * Core contains standard streams, profile infrastructure,
 * elo rating calculations, and polls infrastructure.
 *
 * @license MIT license
 */

var fs = require("fs");
var path = require("path");

var core = exports.core = {

	stdin: function (file, name) {
		var data = fs.readFileSync('config/' + file + '.csv', 'utf8').split('\n');

		var len = data.length;
		while (len--) {
			if (!data[len]) continue;
			var parts = data[len].split(',');
			if (parts[0].toLowerCase() === name) {
				return parts[1];
			}
		}
		return 0;
	},

	stdout: function (file, name, info, callback) {
		var data = fs.readFileSync('config/' + file + '.csv', 'utf8').split('\n');
		var match = false;

		var len = data.length;
		while (len--) {
			if (!data[len]) continue;
			var parts = data[len].split(',');
			if (parts[0] === name) {
				data = data[len];
				match = true;
				break;
			}
		}

		if (match === true) {
			var re = new RegExp(data, 'g');
			fs.readFile('config/' + file + '.csv', 'utf8', function (err, data) {
				if (err) return console.log(err);

				var result = data.replace(re, name + ',' + info);
				fs.writeFile('config/' + file + '.csv', result, 'utf8', function (err) {
					if (err) return console.log(err);
					typeof callback === 'function' && callback();
				});
			});
		} else {
			var log = fs.createWriteStream('config/' + file + '.csv', {
				'flags': 'a'
			});
			log.write('\n' + name + ',' + info);
			typeof callback === 'function' && callback();
		}
	},

	profile: {

		color: '#2ECC40',

		avatarurl: 'http://cbc.pokecommunity.com/config',

		avatar: function (online, user, img) {
			if (online === true) {
				if (typeof (img) === typeof ('')) {
					return '<img src="' + this.avatarurl + '/avatars/' + img + '" width="80" height="80" align="left">';
				}
				return '<img src="http://play.pokemonshowdown.com/sprites/trainers/' + img + '.png" width="80" height="80" align="left">';
			}
			for (var name in Config.customAvatars) {
				if (user === name) {
					return '<img src="' + this.avatarurl + '/avatars/' + Config.customAvatars[name] + '" width="80" height="80" align="left">';
				}
			}
			var trainersprites = [1, 2, 101, 102, 169, 170, 265, 266, 168];
			return '<img src="http://play.pokemonshowdown.com/sprites/trainers/' + trainersprites[Math.floor(Math.random() * trainersprites.length)] + '.png" width="80" height="80" align="left">';
		},

		name: function (online, user) {
			if (online === true) {
				return '&nbsp;<strong><font color="' + this.color + '">Name:</font></strong>&nbsp;' + user.name;
			}
			return '&nbsp;<strong><font color="' + this.color + '">Name:</font></strong>&nbsp;' + user;
		},

		group: function (online, user) {
			if (online === true) {
				if (user.group === ' ') {
					return '<br>&nbsp;<strong><font color="' + this.color + '">Group:</font></strong>&nbsp;' + 'Regular User';
				}
				return '<br>&nbsp;<strong><font color="' + this.color + '">Group:</font></strong>&nbsp;' + Config.groups[user.group].name;
			}
			var g = Core.stdin('usergroups', user);
			if (g === 0) {
				return '<br>&nbsp;<strong><font color="' + this.color + '">Group:</font></strong>&nbsp;' + 'Regular User';
			}
			return '<br>&nbsp;<strong><font color="' + this.color + '">Group:</font></strong>&nbsp;' + Config.groups[g].name;
		},

		title: function (user) {
			return Core.stdin('title', user);
		},

		bp: function (user) {
			return Core.stdin('bp', user);
		},

		tourWins: function (user) {
			return Core.stdin('tourWins', user);
		},

		pclWins: function (user) {
			return Core.stdin('pclWins', user);
		},

		display: function (args, info) {
			if (args === 'title') return '<div class="profile-title">&nbsp;' + info + '</div>';
			if (args === 'bp') return '<br>&nbsp;<strong><font color="' + this.color + '">Battle Points:</font></strong>&nbsp;' + info;
			if (args === 'tourWins') return '<br>&nbsp;<strong><font color="' + this.color + '">Tournament Wins:</font></strong>&nbsp;' + info;
			if (args === 'pclWins') return '<br>&nbsp;<strong><font color="' + this.color + '">PCL Tournament Wins:</font></strong>&nbsp;' + info;
		},

	},

	ladder: function (limit) {
		var data = fs.readFileSync('config/tourWins.csv', 'utf-8');
		var row = ('' + data).split("\n");

		var list = [];

		for (var i = row.length; i > -1; i--) {
			if (!row[i] || row[i].indexOf(',') < 0) continue;
			var parts = row[i].split(",");
			list.push([toId(parts[0]), Number(parts[1])]);
		}

		list.sort(function (a, b) {
			return a[1] - b[1];
		});

		if (list.length > 1) {
			var ladder = '<table border="1" cellspacing="0" cellpadding="3"><tbody><tr><th>Rank</th><th>User</th><th>Tournament Wins</th></tr>';
			var len = list.length;

			limit = len - limit;
			if (limit > len) limit = len;

			while (len--) {
				ladder = ladder + '<tr><td>' + (list.length - len) + '</td><td>' + list[len][0] + '</td><td>' + Math.floor(list[len][1]) + '</td></tr>';
				if (len === limit) break;
			}
			ladder += '</tbody></table>';
			return ladder;
		}
		return 0;
	},

	pclLadder: function (limit) {
		var data = fs.readFileSync('config/pclWins.csv', 'utf-8');
		var row = ('' + data).split("\n");

		var list = [];

		for (var i = row.length; i > -1; i--) {
			if (!row[i] || row[i].indexOf(',') < 0) continue;
			var parts = row[i].split(",");
			list.push([toId(parts[0]), Number(parts[1])]);
		}

		list.sort(function (a, b) {
			return a[1] - b[1];
		});

		if (list.length > 1) {
			var ladder = '<table border="1" cellspacing="0" cellpadding="3"><tbody><tr><th>Rank</th><th>User</th><th>PCL Tournament Wins</th></tr>';
			var len = list.length;

			limit = len - limit;
			if (limit > len) limit = len;

			while (len--) {
				ladder = ladder + '<tr><td>' + (list.length - len) + '</td><td>' + list[len][0] + '</td><td>' + Math.floor(list[len][1]) + '</td></tr>';
				if (len === limit) break;
			}
			ladder += '</tbody></table>';
			return ladder;
		}
		return 0;
	},

	bpLadder: function (limit) {
		var data = fs.readFileSync('config/bp.csv', 'utf-8');
		var row = ('' + data).split("\n");

		var list = [];

		for (var i = row.length; i > -1; i--) {
			if (!row[i] || row[i].indexOf(',') < 0) continue;
			var parts = row[i].split(",");
			list.push([toId(parts[0]), Number(parts[1])]);
		}

		list.sort(function (a, b) {
			return a[1] - b[1];
		});

		if (list.length > 1) {
			var ladder = '<table border="1" cellspacing="0" cellpadding="3"><tbody><tr><th>Rank</th><th>User</th><th>Battle Points</th></tr>';
			var len = list.length;

			limit = len - limit;
			if (limit > len) limit = len;

			while (len--) {
				ladder = ladder + '<tr><td>' + (list.length - len) + '</td><td>' + list[len][0] + '</td><td>' + Math.floor(list[len][1]) + '</td></tr>';
				if (len === limit) break;
			}
			ladder += '</tbody></table>';
			return ladder;
		}
		return 0;
	},

	shop: function (showDisplay) {
		var shop = [
			['Star', 'Buy a \u2606 to go in front of your name and puts you at the top of the user list. (Goes away if you leave for more than one hour or the server restarts.)', 3],
			['Poof', 'Buy a poof message to be added into your pool of possible poofs. Poofs are custom leave messages.', 20],
			['Fix', 'Buy the ability to alter your current custom avatar. (Don\'t buy this if you don\'t have a custom avatar. If you have a custom avatar and would like to apply it to other usernames, contact the admin "wolf" and don\'t buy this.)', 25],
			['Title', 'Buy a user title for your profile. (Can be seen via "/profile username". Check "/profile wolf" for an example.)', 30],
			['BlackStar', 'Buy a \u2605 to go in front of your name and puts you at the top of the user list. (Lasts for three weeks.)', 40],
			['Avatar', 'Buy a custom avatar to be applied to your name. (You supply. Images larger than 80x80 may not show correctly.)', 50]
		];

		if (showDisplay === false) {
			return shop;
		}

		var s = '<div class="broadcast-lobby"><table border="1" cellspacing="0" cellpadding="5" width="100%"><tbody><tr><th>Command</th><th>Description</th><th>Cost</th></tr>';
		var start = 0;
		while (start < shop.length) {
			s = s + '<tr><td>' + shop[start][0] + '</td><td>' + shop[start][1] + '</td><td>' + shop[start][2] + '</td></tr>';
			start++;
		}
		s += '</tbody></table><center>To buy an item from the shop, use the /buy <em>command</em>.</center></div>';
		return s;
	},

	poll: function () {
		var poll = {};
		var components = {

			reset: function (roomId) {
				poll[roomId] = {
					question: undefined,
					optionList: [],
					options: {},
					display: '',
					topOption: ''
				};
			},

			splint: function (target) {
				var parts = target.split(',');
				var len = parts.length;
				while (len--) {
					parts[len] = parts[len].trim();
				}
				return parts;
			}

		};

		for (var i in components) {
			if (components.hasOwnProperty(i)) {
				poll[i] = components[i];
			}
		}

		for (var id in Rooms.rooms) {
			if (Rooms.rooms[id].type === 'chat' && !poll[id]) {
				poll[id] = {};
				poll.reset(id);
			}
		}

		return poll;
	},

	tournaments: {
		tourSize: 8,
		amountEarn: 10,
		earningBP: function () {
			if (this.amountEarn === 10) return '<u>Standard (8 players = 1 Battle Point)</u> Double (4 players = 1 Battle Point) Quadruple (2 players = 1 Battle Point) PC Custom (1 player = 1 Battle Point)';
			if (this.amountEarn === 4) return 'Standard (8 players = 1 Battle Point) <u>Double (4 players = 1 Battle Point)</u> Quadruple (2 players = 1 Battle Point) PC Custom (1 player = 1 Battle Point)';
			if (this.amountEarn === 2) return 'Standard (8 players = 1 Battle Point) Double (4 players = 1 Battle Point) <u>Quadruple (2 players = 1 Battle Point)</u> PC Custom (1 player = 1 Battle Point)';
			if (this.amountEarn === 1.5) return 'Standard (8 players = 1 Battle Point) Double (4 players = 1 Battle Point) Quadruple (2 players = 1 Battle Point) <u>PC Custom (1 player = 1 Battle Point)</u>';
		}
	},

};
