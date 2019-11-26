module.exports = {
    name: "ping",
    description: "Use this command to test if the bot is working!",
    execute(message, args) {
        message.channel.send("Pong");
    }
}