var express = require('express');
var router = express.Router();
var wordService = require("../services/wordService.js");

/* GET home page. */
router.get('/', function(req, res, next) {
  wordService.getOrderedArray(function(words) {
      res.render('index', { title: 'StatBot',  words: words});
  });
});

router.post('/', function(req, res, next_) {
    if (req.body.attachments) {
        console.log(req.body);
        var message = req.body.text;
        req.body.attachments.forEach(function(attachment) {
                if (attachment.type == "mentions") {
                    var i;
                    for (i = 0; i < attachment.user_ids.length; i++) {
                        var user_id = attachment.user_ids[i];
                        var loc = attachment.loci[i];
                        var name = message.substring(loc[0], loc[0] + loc[1]);
                        console.log("mentions " + user_id + " or " + name + "  at " + loc);
                        var j;
                        // start after the last letter in mention and parse for increment or decrement
                        for (j = (loc[0] + loc[1]); j < message.length; j++) {
                            var c = message[j];
                            if (c == '+') {
                                if ((j + 1) < message.length) {
                                    var nextc = message[j + 1];
                                    if (nextc == '+') {
                                        console.log("add");
                                        return;
                                    }
                                }
                            } else if (c == '-') {
                                if ((j + 1) < message.length) {
                                    var nextc = message[j + 1];
                                    if (nextc == '-') {
                                        console.log("minus");
                                        return;
                                    }
                                }
                            } else {
                                var patt = /\s/g;
                                if (!patt.test(c)) {
                                    console.log("nothing");
                                    return;
                                } 
                            } 
                        }
                        console.log("nothing");
                    }
                }
        });
       }
});


module.exports = router;
