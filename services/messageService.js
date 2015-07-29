/**
 * Created by AltonjiC on 7/27/15.
 */
var mongoose = require('mongoose');

var Message = mongoose.model('Message');

module.exports = {
    add: function(body, callback) {
        console.log("body given to message : ");
        console.log(body);
        var message = new Message(body);
        message.save(function (err, doc) {
            if (err) {
                console.log("error in saving message: " + err);
                callback(false)
            } else {
                callback(doc);
            }
        });
    },
    get: function(id, callback) {
        Message.findOne({'_id' : id}, function (err, doc) {
            if (err) {
                console.log("error in finding message");
                callback(false);
            }
            console.log(doc);
            if (!doc) {
                console.log("this message is not in db: " + id);
                callback(false);
            } else {
                callback(doc);
            }
        });
    },
}