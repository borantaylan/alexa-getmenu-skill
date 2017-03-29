module.change_code = 1;
'use strict';

var alexa = require( 'alexa-app' );
var app = new alexa.app( 'getmenu-skill' );


app.launch( function( request, response ) {
	response.say( 'Welcome to your test skill' ).reprompt( 'Way to go. You got it to run. Bad ass.' ).shouldEndSession( false );
} );


app.error = function( exception, request, response ) {
	console.log(exception)
	console.log(request);
	console.log(response);
	response.say( 'Sorry an error occured ' + error.message);
};

app.intent('getMenu',
  {
    "slots":{"date":"AMAZON.DATE"}
	,"utterances":[
		"was ist das {date} in menu"
]
  },
  function(request,response) {
    var date = request.slot('date');
    response.say("Zikkimin koku var "+ date);
  }
);

module.exports = app;
