# bot2botnode
Bot master to Bot communication in node using REST (aka bot to bot)

Sample nodejs code to demonstrate a master bot communicating with child bots. The bot is created using [Bot Framework][1]

You can try it here: 
https://lambot.blob.core.windows.net/github/bot2bot/bot.html

## Prerequisites

For every child bot you'll need to know:
- application ID
- app secret
- endpoint.

Master bot needs to be acessible from the child bot to enable reply communication.

- [Node.js][4] version 8.5 or higher
    ```bash
    # determine node version
    node --version
    ```
# To run the bot
- Install modules
    ```bash
    npm install
    ```
- Start the bot
    ```bash
    npm start
    ```

## How it works

The master bot will have two api endpoints: one for the api/messages and the other for the conversation callback from the childbots.
When a message is decided to be delivered to a child bot, a REST call is made. In this message the serviceURL is pointing to the master bot.
The conversation endpoint from the master bot will then send the message back to the channel using a proactive message pattern - storing conversation reference and reusing it.

The code is commented and is built on top of the echo bot sample. Search for the region, easily found in VSCode:
```
//#region BOT2BOT CODE

//#endregion 
```

Client bot code not included. Business logic to decide which child bot to communicate not included.

Change the client bot info in the *getChildBotList* function.
*getChildBotList* returns an array to highlight there should be a list of child bots that are called from the master bot.

Child bots can call other child bots assuming the same principle. This communication will be invisible to the master bot.

## Going to Production

- The child bot list should be stored in the .bot file or storage outside the main bot.
- The conversationList should be stored outside the mainbot to ensure resiliency. 
- The child bots should send an event message to release the conversation to the master bot again.

## Testing the bot using Bot Framework Emulator **v4**
[Bot Framework Emulator][5] is a desktop application that allows bot developers to test and debug their bots on localhost or running remotely through a tunnel.

- Install the Bot Framework Emulator version 4.2.0 or greater from [here][6]

## Connect to the bot using Bot Framework Emulator **v4**
- Launch Bot Framework Emulator
- File -> Open Bot Configuration
- Navigate to `bot2botnode` folder
- Select `bot2botnode.bot` file

# Deploy the bot to Azure

## Prerequisites
- [Azure Deployment Prerequisites][41]

## Provision a Bot with Azure Bot Service
After creating the bot and testing it locally, you can deploy it to Azure to make it accessible from anywhere.  To deploy your bot to Azure:

```bash
# login to Azure
az login
```

```bash
# provision Azure Bot Services resources to host your bot
msbot clone services --name "botmaster" --code-dir "." --location <azure region like eastus, westus, westus2 etc.> --sdkLanguage "Node" --folder deploymentScripts/msbotClone --verbose
```

## Publishing Changes to Azure Bot Service
As you make changes to your bot running locally, and want to deploy those change to Azure Bot Service, you can _publish_ those change using either `publish.cmd` if you are on Windows or `./publish` if you are on a non-Windows platform.  The following is an example of publishing

```bash
# run the publish helper (non-Windows) to update Azure Bot Service.  Use publish.cmd if running on Windows
./publish
```


[1]: https://dev.botframework.com
[4]: https://nodejs.org
[5]: https://github.com/microsoft/botframework-emulator
[6]: https://github.com/Microsoft/BotFramework-Emulator/releases
[7]: https://docs.microsoft.com/en-us/cli/azure/?view=azure-cli-latest
[8]: https://docs.microsoft.com/en-us/cli/azure/install-azure-cli?view=azure-cli-latest
[9]: https://github.com/Microsoft/botbuilder-tools/tree/master/packages/MSBot
[10]: https://portal.azure.com
[11]: https://www.luis.ai
[20]: https://docs.botframework.com
[21]: https://docs.microsoft.com/en-us/azure/bot-service/bot-service-overview-introduction?view=azure-bot-service-4.0
[22]: https://docs.microsoft.com/en-us/azure/bot-service/?view=azure-bot-service-4.0
[30]: https://www.npmjs.com/package/restify
[31]: https://www.npmjs.com/package/dotenv
[32]: https://docs.microsoft.com/en-us/azure/bot-service/bot-builder-basics?view=azure-bot-service-4.0
[40]: https://aka.ms/azuredeployment
[41]: ./PREREQUISITES.md
