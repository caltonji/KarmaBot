/**
 * Created by AltonjiC on 7/20/15.
 */
var express = require('express');
var http = require('http');
var https = require('https');
var jQuery = require('jquery');

var botEndpoint = "http://altonji.com:8081/m"
var groupMeApiBase = "api.groupme.com";
var botService = require('../services/botService.js');
var applicationService = require('../services/applicationService.js');
var groupMeBotService = require('../services/GroupMeAPI/groupMeBotService');

var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    if (req.query.access_token) {
        var options = {
            hostname: groupMeApiBase,
            port: 443,
            path: '/v3/groups?per_page=100&token=' + req.query.access_token,
            method: 'GET'
        };

        var groupsReq = https.request(options, function(groupsRes) {
            console.log('STATUS: ' + groupsRes.statusCode);
            console.log('HEADERS: ' + JSON.stringify(groupsRes.headers));

            var str = '';
            //another chunk of data has been recieved, so append it to `str`
            groupsRes.on('data', function (chunk) {
                str += chunk;
            });
            //the whole response has been recieved, so we just print it out here
            groupsRes.on('end', function () {
                var groups = JSON.parse(str).response;
                var groupJson = {};
                for (var key in groups) {
                    var group = groups[key];
                    groupJson[group.group_id] = group.name;
                }
                //console.log(groups);
                applicationService.getAllNames(function(app_names) {
                    //console.log(app_names);
                    res.render('../views/add', {"groups" : groups, "app_names" : app_names, "token" : req.query.access_token});
                });
            });
        })
        groupsReq.end();

        groupsReq.on('error', function(e) {
            console.error(e);
        });
    }
});

router.post('/bot', function(req, res, next) {
    if (req.body.app_name && req.body.group_id) {
        var app_name = req.body.app_name;
        var group_id = req.body.group_id;
        var token = req.body.token;

        applicationService.getByName(app_name, function(app) {
            botService.checkForBot(app, group_id, function(existingBot) {
                if (existingBot) {
                    if (typeof existingBot === Object) {
                        console.log("existing bot: " + existingBot);
                        //this bot already exists
                        //TODO: Handle this by making sure that bot still exists in groupme
                    } else {
                        //error
                        console.log("error of some type");
                    }
                } else {
                    //bot is not yet in database, add one
                    groupMeBotService.createBot(app, group_id, token, function(info) {
                        if (info) {
                            console.log("success!");
                            console.log(info);
                            botService.add(info.bot.bot_id, info.bot.group_id, app, function(success) {
                                if (success) {
                                    console.log("added bot: " + info.bot.bot_id + " to db.");
                                    var ThisBot = require(app.bot_path);
                                    var thisBot = new ThisBot(info.bot.bot_id);

                                    thisBot.botCreated();
                                } else {
                                    console.log("failed to add bot to db.");
                                    //TODO: delete this bot from groupme and handle error
                                }
                            });
                        }
                    });
                }
            })
        });
    }

});



module.exports = router;