exports.commands = {
	eng: 'en',
	en: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox(
			"Official chat rooms are English only. Other languages are allowed in battle rooms, private messages, and unofficial chat rooms.<br />" +
			"- <a href=\"https://translate.google.com/#en/en/Official%20chat%20rooms%20are%20English%20only.%20Other%20languages%20are%20allowed%20in%20battle%20rooms%2C%20private%20messages%2C%20and%20unofficial%20chat%20rooms.\">TRANSLATION</a><br />" +
			"- <a href=\"http://www.pokecommunity.com/showthread.php?t=289012#rules\">PC Battle Server Rules</a>"
		);
	},

	autojoinroom: function (target, room, user) {
		if (!this.can('makeroom')) return;
		if (target === 'off') {
			delete room.autojoin;
			this.addModCommand("" + user.name + " removed this room from the autojoin list.");
			delete room.chatRoomData.autojoin;
			Rooms.global.writeChatRoomData();
		} else {
			room.autojoin = true;
			this.addModCommand("" + user.name + " added this room to the autojoin list.");
			room.chatRoomData.autojoin = true;
			Rooms.global.writeChatRoomData();
		}
	},

	toggleladdermessage: 'toggleladdermsg',
	toggleladdermessages: 'toggleladdermsg',
	toggleladdermsg: function (target, room, user) {
		if (!this.can('warn', null, room)) return false;
		room.enableLadderMessages = !room.enableLadderMessages;
		this.sendReply("Allowing ladder messages is set to " + room.enableLadderMessages + " in this room.");
		if (room.enableLadderMessages) {
			this.add("|raw|<div class=\"broadcast-red\"><b>Ladder messages are enabled!</b><br>Messages will be sent via the "Look for a battle" button.</div>");
		} else {
			this.add("|raw|<div class=\"broadcast-blue\"><b>Ladder messages are disabled!</b><br>Messages will no longer be sent via the "Look for a battle" button.</div>");
		}
	},
	toggleladdermsghelp: ["/toggleladdermsg - Toggle ladder messages on or off."],

	ascii: function (target, room, user) {
		if (!target) return;
		if (!this.canBroadcast()) return;
		var originalVersion = target;
		var newVersion = target;
		newVersion = newVersion.replace(/[^\x00-\x7F]/g, "?");
		this.sendReplyBox(
			"Original version: " + originalVersion + "<br />" +
			"ASCII-only version: " + newVersion
		);
	}
};
