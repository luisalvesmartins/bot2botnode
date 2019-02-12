# bot2botnode
Bot master to Bot childs communication in node using REST

Sample nodejs code to demonstrate a master bot communicating with child bots.

# Prerequisites

Child bot application ID, secret and endpoint needs to be known.

Master bot needs to be acessible from the child bot to enable reply communication.

# How it works

The master bot will have two api endpoints: one for the api/messages and the other for the conversation callback from the childbots.
When a message is decided to be delivered to a child bot, a REST call is made. In this message the serviceURL is pointing to the master bot.
The conversation endpoint from the master bot will then send the message back to the channel.

The code is commented and is built on top of the echo bot sample.
