/**
 * Created by AltonjiC on 7/12/15.
 */
var Bot = require('bot.js');

/* boring bot is a subclass of bot */
function BoringBot() {
    Bot.call(this); // call super constructor.
    this.name = "BoringBot " + this.bot_id;
}

// subclass extends superclass
BoringBot.prototype = Object.create(Bot.prototype);
BoringBot.prototype.constructor = BoringBot;

BoringBot.prototype.botCreated = function() {
    this.send("hey, I'm your new bot! You can call me " + this.name);
}

BoringBot.prototype.receive = function(body) {
    console.log("message received");
}

module.exports = BoringBot;