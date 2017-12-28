const Botkit = require('../lib/Botkit.js');
var luis = require('../lib/luis-middleware.js');
const xml = require('@xmpp/xml');

var controller = Botkit.jabberbot({
    json_file_store: './bot_store/'
});

var bot = controller.spawn({
    client: {
        jid: 'demobot01@abc.inc',
        password: 'devbot',
        host: "10.10.20.17",
        port: 5222
    }
});

var luisOptions = {serviceUri:'https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/2a7a1eb7-132a-4533-b749-66899683acf2?subscription-key=fb69255999b446e8bffab0e6741813dc&verbose=true&timezoneOffset=0&q='};
controller.middleware.receive.use(luis.middleware.receive(luisOptions));

controller.hears(['hello','hi'],['direct_message','direct_mention','mention'], luis.middleware.hereIntent, function(bot,message) {
	    var entities = message.entities
	    var city = entities[0].entity;
	    var yw = require('weather-yahoo');
	    var ans = {};
	    yw.getSimpleWeather(city).then(function(res){
		    ans=res;
	    	    bot.reply(message,res.weather.condition);
	    }); // pulls just some of the info from yahoo weather
});
