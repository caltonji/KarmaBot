/**
 * Created by AltonjiC on 6/21/15.
 */
var mongoose = require('mongoose');

var KarmaUser = mongoose.model('KarmaUser');

module.exports = {
    /*
     params: User user, the User associated with this Node
     function callback(string privateKey)
     */
    updateKarma: function (user_id, bot_id, group_id, diff, callback) {

        var query = {'bot_id': bot_id, 'user_id': user_id};

        KarmaUser.findOne(query, function(err, doc) {
            var retVal = false;
            if (err) {
                console.log("error in finding karma user");
                callback(false);
            }
            console.log(doc);
            if (!doc) {
                doc = new KarmaUser({user_id: user_id, group_id: group_id, bot_id: bot_id, karma: diff});
            } else {
                doc.karma = doc.karma + diff;
                retVal = doc.karma;
            }
            doc.save(function (err) {
                if (err) {
                    console.log("error in saving karma user");
                    callback(false);
                }
                callback(retVal);
            });
        });


    }
};