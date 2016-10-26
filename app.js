var http = require('http');
var express = require('express');
var config = require('./config');
var twilio = require('twilio');
bodyParser = require('body-parser');

// Create an Express web app
var app = express();
app.use(bodyParser.urlencoded({ extended: true }));

// Configure routes and middleware for the application
require('./routes')(app);



app.post('/dialConf',
         function(i_Req,o_Res)
           {
               var ivrTwilRes = new twilio.TwimlResponse();
               //console.log(i_Req);
               var iGathered=i_Req.body.Digits ;
               var conferenceRoom="Conference"+iGathered;
               var owner=i_Req.query.owner;

               ivrTwilRes.say("Connecting you to "+ owner  +"'s conference now   "  )
                                  .dial(
                                         function()
                                             {
                                                  this.conference(conferenceRoom,
                                                                  {waitUrl:"http://twimlets.com/holdmusic?Bucket=com.twilio.music.ambient" ,
                                                                    waitMethod:"GET"
                                                                  }
                                                                 );
                                             }
                                        );

               o_Res.set('Content-Type','text/xml');
               o_Res.send(ivrTwilRes.toString());

           }
       );

// Create and start an HTTP server to run our application
var server = http.createServer(app);
server.listen(config.port, function() {
    console.log('Express server running on port ' + config.port);
});

// export the HTTP server as the public module interface
module.exports = server;
