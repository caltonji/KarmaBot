/**
 * Created by AltonjiC on 6/21/15.
 */
var wordService = require('../../services/wordService.js');

module.exports = {

    updateWordCounts: function (message) {
        //TODO: quotes aren't actually geting erased
        message.replace(/[\.,!\?^@\(\);:/\\\*=\$%#"&\+\-<>]/g, "");
        var wordArray = message.split(" ");
        wordArray.forEach(function(word) {
            wordService.incrementWordCount(word, function (saved) {
                if (!saved) console.log("failed to increment: " + word);
            });
        });
    }
}