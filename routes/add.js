/**
 * Created by AltonjiC on 7/20/15.
 */
var express = require('express');
var http = require('http');


var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    if (req.query.access_token) {
        http.
        res.render('../views/add', {title : "Your Access token is: " + req.query.access_token});
    } else {
        res.render('../views/add', {title : "Add Some Bots! but first login."});
    }

});

router.post('/', function(req, res, next) {
    console.log(req.body);
    res.json(JSON.toString(req.body));
});

module.exports = router;