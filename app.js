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

app.get('/welcomeMessage',
         function(i_Req,o_Res)
           {

               var ivrTwimlResp = new twilio.TwimlResponse();
               var owner=i_Req.query.owner;
               var actionUrl="/dialConf?owner="+owner;
               //console.log(i_Req);
               ivrTwimlResp.gather(
                                   {
                                        action:actionUrl,
                                        numDigits:'5',
                                        timeout : '5'
                                   },
                                   function()
                                      {
                                            this.pause({length:1})
                                                .say("Welcome to this conference hosted by " +  owner )
                                                .say("Please enter the Conference RoomID provided to you by " +  owner );

                                      }
                                 ) ;
               ivrTwimlResp.say("You have not entered any option.Please enter the Conference RoomID provided to you by "+owner).redirect( { method : 'GET' } );

               o_Res.set('Content-Type','text/xml');
               o_Res.send(ivrTwimlResp.toString());
           }
       );


app.post('/dialConf',
         function(i_Req,o_Res)
           {
               var ivrTwilRes = new twilio.TwimlResponse();
               //console.log(i_Req);
               var iGathered=i_Req.body.Digits ;
               var conferenceRoom="Conference"+iGathered;
               var owner=i_Req.query.owner;
               var milliseconds = (new Date).getTime();
               var musicFiles =  [  "http://twimlets.com/holdmusic?Bucket=com.twilio.music.classical" ,
                                  "http://twimlets.com/holdmusic?Bucket=com.twilio.music.ambient",
                                  "http://twimlets.com/holdmusic?Bucket=com.twilio.music.electronica",
                                  "http://twimlets.com/holdmusic?Bucket=com.twilio.music.guitars",
                                  "http://twimlets.com/holdmusic?Bucket=com.twilio.music.rock",
                                  "http://twimlets.com/holdmusic?Bucket=com.twilio.music.soft-rock"
                                 ];

               ivrTwilRes.say("Connecting you to "+ owner  +"'s conference now   "  )
                                  .dial(
                                         function()
                                             {
                                                  this.conference(conferenceRoom,
                                                                  {waitUrl:musicFiles[milliseconds % 6],
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
