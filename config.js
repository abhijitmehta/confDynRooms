// Define app configuration in a single location, but pull in values from
// system environment variables (so we don't check them in to source control!)
module.exports = {
    // Twilio Account SID - found on your dashboard
    accountSid: process.env.TWILIO_ACCOUNT_SID,

    // Twilio Auth Token - found on your dashboard
    authToken: process.env.TWILIO_AUTH_TOKEN,

    // A Twilio number that you have purchased through the twilio.com web
    // interface or API
    twilioNumber: process.env.TWILIO_NUMBER,

    // Defines whether or not this application is deployed in a production
    // environment
    nodeEnv: process.env.NODE_ENV || 'development',

    // In production, this is the base host name for web app on the public
    // internet, like "jimmysbbq.herokuapp.com".  This should be the same host
    // you use in your Twilio Number config for voice or messaging URLs
    host: process.env.HOST || 'localhost',
    // The port your web application will run on
    port: process.env.PORT || 3006
};
