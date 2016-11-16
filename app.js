var restify = require('restify');
var builder = require('botbuilder');

var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function() {
    console.log("%s listening to %s", server.name, server.url);
});

var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});

var bot = new builder.UniversalBot(connector);
server.post('/api/messages', connector.listen());

// Root message
bot.dialog('/', [
    function (session) {
        builder.Prompts.text(session, 'Hey! For us to create the guest pass we need to ask you a few questions, firstly who will be their host?');
    },
    function (session, results) {
        session.guestPassData.host = results.response;
        builder.Prompts.text(session, 'Great! What is your phone number?');
    },
    function (session, results) {
        session.guestPassData.phone_number = results.response;
        builder.Prompts.text(session, 'What is the guests name?');
    },
    function (session, results) {
        session.guestPassData.guest = results.response;
        builder.Prompts.choice(session, 'WHat company does the guest work for', ["I'd rather not say"]);
    },
    function (session, results) {
        session.guestPassData.company = results.response;
        builder.Prompts.choice(session, 'What tower is this for?', ['Tower Two', 'Tower Three']);
    },
    function(session, results) {
        session.guestPassData.tower = results.response;
        builder.Prompts.text(session, 'What floor are they visiting?');
    },
    function (session, results) {
        session.guestPassData.level = results.response;
        builder.Prompts.time(session, 'When is this guest pass for?');
    },
    function (session, results) {
        session.guestPassData.time = results.response;
        var guestpass_fmt = '';
        guestpass_fmt += 'Host Name: ' + session.guestPassData.host;
        guestpass_fmt += 'Guest Name: ' + session.guestPassData.guest;
        guestpass_fmt += 'Guest Company: ' + session.guestPassData.company;
        guestpass_fmt += 'Tower: ' + session.guestPassData.tower + ', Level: ' + session.guestPassData.level;
        guestpass_fmt += 'Visitation date: ' + session.guestPassData.time;
        session.send('Thank you. The guest pass currently looks like: ' + guestpass_fmt);    
    }
])
