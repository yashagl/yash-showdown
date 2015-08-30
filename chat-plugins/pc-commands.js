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
