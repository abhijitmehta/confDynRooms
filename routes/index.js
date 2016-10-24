var path = require('path');
var express = require('express');
var morgan = require('morgan')
var twilio = require('twilio');
var config = require('../config');

// Configure appplication routes
module.exports = function(app) {

    // Mount Express middleware for serving static content from the "public" 
    // directory
    app.use(express.static(path.join(process.cwd(), 'public')));

    // Use morgan for HTTP request logging
    app.use(morgan());

    // In production, validate that inbound requests have in fact originated
    // from Twilio. In our node.js helper library, we provide Express middleware 
    // for this purpose. This validation will only be performed in production
    if (config.nodeEnv === 'production') {
        // For all webhook routes prefixed by "/twilio", apply validation 
        // middleware
        app.use('/twilio/*', twilio.webhook(config.authToken, {
            host: config.host,
            protocol: 'https' // Assumes you're being safe and using SSL
        }));
    }

    // Configure a Twilio webhook URL that could be used to respond to an
    // incoming voice call or as instructions for an outbound call
    app.post('/twilio/voice', function(request, response) {
        // Our response to this request will be an XML document in the "TwiML"
        // format. Our node.js library provides a helper for generating one
        // of these documents
        var twiml = new twilio.TwimlResponse();
        twiml.say('hello, monkey!', {
            voice: 'alice'
        });

        // Render the twiml instructions as XML
        response.type('text/xml');
        response.send(twiml.toString());
    });

    // Configure a Twilio webhook URL that could be used to respond to an
    // incoming message
    app.post('/twilio/message', function(request, response) {
        // As the voice example above, our response to this request will be 
        // an XML document in the "TwiML" format
        var twiml = new twilio.TwimlResponse();
        twiml.message('hello, monkey!');

        // Render the twiml instructions as XML
        response.type('text/xml');
        response.send(twiml.toString());
    });

};