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
        session.dialogData.host = results.response;
        builder.Prompts.text(session, 'Great! What is your phone number?');
    },
    function (session, results) {
        session.dialogData.phone_number = results.response;
        builder.Prompts.text(session, 'What is the guests name?');
    },
    function (session, results) {
        session.dialogData.guest = results.response;
        builder.Prompts.choice(session, 'WHat company does the guest work for', ["I'd rather not say"]);
    },
    function (session, results) {
        session.dialogData.company = results.response;
        builder.Prompts.choice(session, 'What tower is this for?', ['Tower Two', 'Tower Three']);
    },
    function(session, results) {
        session.dialogData.tower = results.response;
        builder.Prompts.text(session, 'What floor are they visiting?');
    },
    function (session, results) {
        session.dialogData.level = results.response;
        builder.Prompts.time(session, 'When is this guest pass for?');
    },
    function (session, results) {
        console.log(JSON.stringify(session.dialogData));
        session.dialogData.time = results.response;
        var guestpass_fmt = '';
        guestpass_fmt += 'Host Name: ' + session.dialogData.host;
        guestpass_fmt += '\nGuest Name: ' + session.dialogData.guest;
        guestpass_fmt += '\nGuest Company: ' + session.dialogData.company;
        guestpass_fmt += '\nTower: ' + session.dialogData.tower + ', Level: ' + session.dialogData.level;
        guestpass_fmt += '\nVisitation date: ' + session.dialogData.time;
        session.send('Thank you. The guest pass currently looks like: ' + guestpass_fmt);    
    }
])
