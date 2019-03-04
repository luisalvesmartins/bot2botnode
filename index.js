// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const dotenv = require('dotenv');
const path = require('path');
const restify = require('restify');

// Import required bot services.
// See https://aka.ms/bot-services to learn more about the different parts of a bot.
const { BotFrameworkAdapter } = require('botbuilder');


// Import required bot configuration.
const { BotConfiguration } = require('botframework-config');

// This bot's main dialog.
const { MyBot } = require('./bot');

// Read botFilePath and botFileSecret from .env file
// Note: Ensure you have a .env file and include botFilePath and botFileSecret.
const ENV_FILE = path.join(__dirname, '.env');
dotenv.config({ path: ENV_FILE });

// bot endpoint name as defined in .bot file
// See https://aka.ms/about-bot-file to learn more about .bot file its use and bot configuration.
const DEV_ENVIRONMENT = 'development';

// bot name as defined in .bot file
// See https://aka.ms/about-bot-file to learn more about .bot file its use and bot configuration.
const BOT_CONFIGURATION = (process.env.NODE_ENV || DEV_ENVIRONMENT);

// Create HTTP server
const server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3981, () => {
    console.log(`\n${ server.name } listening to ${ server.url }`);
    console.log(`\nGet Bot Framework Emulator: https://aka.ms/botframework-emulator`);
    console.log(`\nTo talk to your bot, open bot2botnode.bot file in the Emulator`);
});

// .bot file path
const BOT_FILE = path.join(__dirname, (process.env.botFilePath || ''));

// Read bot configuration from .bot file.
let botConfig;
try {
    botConfig = BotConfiguration.loadSync(BOT_FILE, process.env.botFileSecret);
} catch (err) {
    console.error(`\nError reading bot file. Please ensure you have valid botFilePath and botFileSecret set for your environment.`);
    console.error(`\n - The botFileSecret is available under appsettings for your Azure Bot Service bot.`);
    console.error(`\n - If you are running this bot locally, consider adding a .env file with botFilePath and botFileSecret.`);
    console.error(`\n - See https://aka.ms/about-bot-file to learn more about .bot file its use and bot configuration.\n\n`);
    process.exit();
}

// Get bot endpoint configuration by service name
const endpointConfig = botConfig.findServiceByNameOrId(BOT_CONFIGURATION);

// Create adapter.
// See https://aka.ms/about-bot-adapter to learn more about .bot file its use and bot configuration.
const adapter = new BotFrameworkAdapter({
    appId: endpointConfig.appId || process.env.microsoftAppID,
    appPassword: endpointConfig.appPassword || process.env.microsoftAppPassword
});

// Catch-all for errors.
adapter.onTurnError = async (context, error) => {
    // This check writes out errors to console log .vs. app insights.
    console.error(`\n [onTurnError]: ${ error }`);
    // Send a message to the user
    await context.sendActivity(`Oops. Something went wrong!`);
};

// Create the main dialog.
const myBot = new MyBot();

// Listen for incoming requests.
server.post('/api/messages', (req, res) => {
    adapter.processActivity(req, res, async (context) => {
        // Route to main dialog.
        await myBot.onTurn(context);
    });
});

//#region BOT2BOT CODE
const jwt = require('jsonwebtoken');
const { MicrosoftAppCredentials, ConnectorClient } = require('botframework-connector');



server.use(restify.plugins.bodyParser())
// conversation backchannel
server.post('/v3/conversations/:conversationId/activities/:activityId', conversationCallBack);

async function conversationCallBack(req, res, next) {
    //console.log("CALLBACK")
    var json=JSON.stringify(req.body);

    //CHECK AUTHORIZATION OF THE CALLBACK MESSAGE
    var p=myBot.getConversation(req.params.conversationId);

    var appId=GetClientAppIdFromAuthorization(req)
    if (appId==false){
        console.log("NOT AUTHORIZED");
        res.send(400);
    }

    var l=myBot.getChildBotList();
    if (l.length>0){
        l.find(x=> x.id==p.BotId && x.appId==appId);
        if (l)
        {
            //this should be read from the .bot file
            //here just for simplicity
            var appId=process.env.appId;
            var appPassword = process.env.appPassword;
    
            MicrosoftAppCredentials.trustServiceUrl(p.OriginalServiceUri);
            var cred=new MicrosoftAppCredentials(appId, appPassword);
            var botClient = new ConnectorClient(cred, {baseUri:p.OriginalServiceUri});
            var activity=JSON.parse(json);
            await botClient.conversations.sendToConversation(activity.conversation.id,activity);        
        }
        else
        {
            console.log("NOT FOUND " + l);
        }    
    }
    res.send(200);
}

function GetClientAppIdFromAuthorization(req){
    var authHeader=req.header('Authorization','');
    if (authHeader.startsWith("Bearer ")) 
    {
        var bearerToken = authHeader.substring(7); 
        var decoded = jwt.decode(bearerToken);
        if (decoded.aud!="https://api.botframework.com" || decoded.idp!="https://sts.windows.net/d6d49420-f39b-4df7-a1dc-d59a935871db/")
        {
            //INVALID AUDIENCE OR ISSUER
            console.log("INVALID AUDIENCE OR ISSUER")
            return false;
        }
        return decoded.appid;
    }

    return null;
}
//#endregion BOT2BOT CODE
