/**
 * Created by AltonjiC on 7/12/15.
 */
var mongoose = require('mongoose');

var Application = mongoose.model('Application');

module.exports = {

    getByName: function (name, callback) {

        var query = {'name': name};

        Application.findOne(query, function (err, doc) {
            var retVal = false;
            if (err) {
                console.log("error in finding application");
                callback(false);
            }
            console.log(doc);
            if (!doc) {
                console.log("this application is not in db: " + name);
                callback(false);
            } else {
                callback(doc);
            }
        });
    }
}