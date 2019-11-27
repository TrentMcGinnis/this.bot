require("dotenv").config()
const discord = require("discord.js");
const bot = new discord.Client();
const fs = require("fs");

const scheduler = require("./helpers/schedule-helper");
const guildHelper = require("./helpers/guild-helper");

bot.on("ready", () => {
  init();
  console.log("Bot Online!");
})

const PREFIX = "!";
bot.on("message", message => {
  try {
    let args = message.content.substring(PREFIX.length).split(" ");
    if (message.author === bot.user) {
      return;
    }
    if (message.content.indexOf("!") == 0) {
      try {
        bot.commands.get(args[0].toLowerCase()).execute(message, args);
      } catch (e) {
        message.channel.send(e);
      }
    } else {
      return;
    }
  } catch (e) {
    message.channel.send(e);
  }
});

bot.on("guildCreate", (guild) => {
  guildHelper.addGuild(guild);
});

bot.on("guildDelete", (guild) => {
  guildHelper.removeGuild(guild);
});

bot.on("guildMemberAdd", (member) => {
  let embed = new discord.RichEmbed();
  embed
  .setTitle(`Welcome to ${member.guild.name}!`)
  //TODO add user info to embed.
  member.guild.channels.find("name", "general").send(embed);
});

bot.login(process.env.DiscordToken);

init = function () {
  bot.commands = new discord.Collection();
  const commandFiles = fs
    .readdirSync("./commands")
    .filter(file => file.endsWith(".js"));

  for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    bot.commands.set(command.name, command);
    console.log(command.name + " loaded");
  }
  guildHelper.initialize(bot);
  scheduler.startNewsSchedule();
}