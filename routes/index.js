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
        req.body.attachments.forEach(function(attachment) {
            if (attachment.type == "mentions") {
                console.log("mentions " + attachment.user_ids + " at " + attachment.loci);
            }
        });
    }
});


module.exports = router;