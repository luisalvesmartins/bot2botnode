// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const { ActivityTypes } = require('botbuilder');
const { TurnContext } = require('botbuilder-core');
const requestpromise = require('request-promise');

var conversationList=[];

class MyBot {
    /**
     *
     * @param {TurnContext} on turn context object.
     */
    async onTurn(turnContext) {
        // See https://aka.ms/about-bot-activity-message to learn more about the message and other activity types.
        if (turnContext.activity.type === ActivityTypes.Message) {

            //#region BOT2BOT CODE
            // In a production scenario the childbot could be choosen based on an intent or a menu option
            var childBot =this.getChildBotList()[0];

            var newConversation = 
            {
                BotId: childBot.id,
                ConversationId: turnContext.activity.conversation.id,
                OriginalServiceUri: turnContext.activity.serviceUrl,
                ConvReference: TurnContext.getConversationReference(turnContext.activity)
            };
            var p=conversationList.find(x=> x.BotId==childBot.id && x.OriginalServiceUri==turnContext.activity.serviceUrl);
            if (p==null)
            {
                conversationList.push(newConversation);
            }

            // send the activity to the child bot
            await ConversationForwardActivity(turnContext, childBot, 'http://localhost:3981');
            // it will not continue to the echo bot
            //#endregion BOT2BOT CODE

            await turnContext.sendActivity(`You said '${ turnContext.activity.text }'`);
        } else {
            await turnContext.sendActivity(`[${ turnContext.activity.type } event detected]`);
        }
    }

    //#region BOT2BOT CODE
    // In a production scenario the childbot list could be read from storage or configuration
    getChildBotList(){
        return [
            {
                id: 'one bot',
                appId: "c7467981-4885-45bc-xxxxxxx",
                appPassword: "nheblZUGDMN7xxxxx",
                uri: "http://localhost:3979/api/messages",
            }
        ];
    }
    
    getConversation (conversationId){
        return conversationList.find(x=> x.ConversationId==conversationId);
    }
    //#endregion BOT2BOT CODE
}

//#region BOT2BOT CODE
function GetTokenAsync(microsoftAppId, microsoftAppPassword)
{
    var OAuthEndpoint = 'https://login.microsoftonline.com/botframework.com/oauth2/v2.0/token';
    return new Promise(function(resolve,reject) {
        requestpromise({
            method: 'POST',
            uri: OAuthEndpoint,
            json: true,
            headers: {},
            form: {
                grant_type: 'client_credentials',
                client_id: microsoftAppId,
                client_secret: microsoftAppPassword,
                scope: microsoftAppId + '/.default'
            }
        }).then( function( auth ) {
            resolve(auth.access_token);
        });
    });
}

async function ConversationForwardActivity(context, bot, replyUri) {
    var activity = context.activity;

    // Change the ServiceUrl to point to the master bot
    activity.serviceUrl = replyUri;
    var json = JSON.stringify(activity);

    await GetTokenAsync(bot.appId, bot.appPassword).then(
        function(authToken){

    //console.log("SEND ACTIVITY")
    //console.log(json);

        requestpromise({
            uri: bot.uri,
            method: 'POST',
            headers: {
                'Authorization' : 'Bearer ' + authToken,
                'Host':"localhost:3980",
                'Content-Type':'application/json'
            },
            body: json
        }).then(function(result){
            //console.log("ACITIVTY SENT");
            //console.log(result);
        }
        ,function(error){
            console.log("ERROR sending the activity");
            console.log(error.statusCode);
            console.log(error.message);    
        });
        }
    );
}
//#endregion BOT2BOT CODE

module.exports.MyBot = MyBot;