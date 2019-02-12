# bot2botnode
Bot master to Bot childs communication in node using REST

Sample nodejs code to demonstrate a master bot communicating with child bots. The bot is created using [Bot Framework][1]

## Prerequisites

Child bot application ID, secret and endpoint needs to be known.

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
The conversation endpoint from the master bot will then send the message back to the channel.

The code is commented and is built on top of the echo bot sample. Search for the region, easily found in VSCode:
```
//#region BOT2BOT CODE

//#endregion 
```

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
