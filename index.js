module.change_code = 1;
'use strict';

var alexa = require('alexa-app');
var app = new alexa.app('getmenu-skill');
var cheerio = require('cheerio');


var rp = require('request-promise');
var moment = require('moment');


app.launch(function(request, response) {
    response.say('Welcome to your test skill').reprompt('Way to go. You got it to run. Bad ass.').shouldEndSession(false);
});


app.error = function(exception, request, response) {
    console.log(exception)
    console.log(request);
    console.log(response);
    response.say('Sorry an error occured ' + error.message);
};

var options = {
    uri: 'http://menu.mensen.at/index/index/locid/55',
    transform: function(body) {
        return cheerio.load(body);
    }
};

app.intent('getMenu', {
    "slots": {
        "date": "AMAZON.DATE"
    },
    "utterances": [
        "Was gibt es {date} im techcafe",
        "Was gibt es {date} zum essen",
        "Was ist das menü im techcafe",
        "Was ist das menü von {date} im techcafe",
    ]
}, function(request, response) {
    return rp(options)
        .then(function($) {
            var output = "Tut mir leid, Keine Ahnung";
            var date = request.slot('date');
            if (date == null) {
                date = moment().format('YYYY-MM-DD');
            }
            console.log(date);
            $('.day').each(function() {
                var paramdate = moment($(this).find('.date').html(), "DD.MM.YYYY").format("YYYY-MM-DD");
                console.log("each date's value from techcafe website : " + paramdate);
                if (paramdate == date) {
                    console.log("this is the part that dates are equal ", date);
                    output = "";
                    $(this).find('.category').each(function() {
                        if ($(this).find('.category-content > p').length) {
                            output = output + $(this).find('.category-title').html() + ":";
                            $(this).find('.category-content > p').each(function() {
                                output = output + " " + $(this).html().replace(/ *\([^)]*\) */g, "");
                            })
                                output = output + ". ";
                        }
                    });
                    return false;
                }
            });
            response.say(output);
            return response.send();
            // Process html like you would with jQuery...
        })
        .catch(function(err) {
            // Crawling failed or Cheerio choked...
            response.say("Some error happened." + err);
            return response.send();
        });


});

module.exports = app;
