/**
 * Created by AltonjiC on 7/12/15.
 */
var Bot = require('./bot.js');
console.log("printing imported module");
console.log(Bot);
/* boring bot is a subclass of bot */
function BoringBot(bot_id) {
    Bot.call(this, bot_id); // call super constructor.
    this.name = "BoringBot_" + this.bot_id;
};

// subclass extends superclass
BoringBot.prototype = Object.create(Bot.prototype);
BoringBot.prototype.constructor = BoringBot;

BoringBot.prototype.botCreated = function() {
    this.send("hey, I'm your new BoringBot! You can call me " + this.name);
};

BoringBot.prototype.receive = function(body) {
    console.log("message received");
    this.send("I hear you!");
};



module.exports = BoringBot;