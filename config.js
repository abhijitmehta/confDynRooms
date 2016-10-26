// Define app configuration in a single location, but pull in values from
// system environment variables (so we don't check them in to source control!)
module.exports = {

    // The port your web application will run on
    port: process.env.PORT || 3006
};
