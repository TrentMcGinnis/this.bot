const ytaudio = require("ytdl-core"); //Youtube download for audio
const ytapi = require("youtube-api");
const credentials = require("../credentials.json");
const apikey = credentials["youtubeapikey"];
ytapi.authenticate({ type: "key", key: apikey });
const Discord = require("discord.js");

module.exports = {
  name: "yt",
  description:
    "Bot join user's channel and streams audio of the linked youtube video",
  async execute(message, args) {
    const voiceChannel = message.member.voiceChannel;
    let url = "";

    if (args[1] == "search") {
      const searchTerm = args.slice(2).join(" ");
      console.log("yt search for " + searchTerm);
      // try grabbing just one video first?
      await ytapi.search.list(
        {
          part: "snippet",
          type: "video",
          maxResults: 5,
          q: searchTerm
        },
        function(err, data) {
          videoIds = data.items.map(item => item.id.videoId);
          // send pretty message with enumerated results
          var embed = new Discord.RichEmbed()
            .setColor("#0099ff")
            .setTitle("Search Results")
            .setDescription(searchTerm)
            .addField(
              "1) " + data.items[0].snippet.title,
              "http://www.youtube.com/watch?v=" + videoIds[0]
            )
            .addField(
              "2) " + data.items[1].snippet.title,
              "http://www.youtube.com/watch?v=" + videoIds[1]
            )
            .addField(
              "3) " + data.items[2].snippet.title,
              "http://www.youtube.com/watch?v=" + videoIds[2]
            )
            .addField(
              "4) " + data.items[3].snippet.title,
              "http://www.youtube.com/watch?v=" + videoIds[3]
            )
            .addField(
              "5) " + data.items[4].snippet.title,
              "http://www.youtube.com/watch?v=" + videoIds[4]
            );

          message.author.send(embed);
          // listen for user message picking an option
          const collector = new Discord.MessageCollector(
            message.author.dmChannel,
            m => m.author.id === message.author.id,
            { max: 1, maxMatches: 1 }
          );
          collector.on("collect", dm => {
            console.log(dm.content);
            let prefix = "http://www.youtube.com/watch?v=";
            if (dm.content.includes("1")) {
              url = prefix + videoIds[0];
            }
            else if (dm.content.includes("2")) {
              url = prefix + videoIds[1];
            }
            else if (dm.content.includes("3")) {
              url = prefix + videoIds[2];
            }
            else if (dm.content.includes("4")) {
              url = prefix + videoIds[3];
            }
            else if (dm.content.includes("5")) {
              url = prefix + videoIds[4];
            }
            collector.stop();
            streamSong(url, message, voiceChannel);
          });
        }
      );
    } else {
      url = args.join(" ");
      streamSong(url, message, voiceChannel);
    }
  }
};

function streamSong(url, message, voiceChannel) {
  if (!voiceChannel) {
    return message.channel.send("Join a voice channel!");
  }

  voiceChannel
    .join()
    .then(connection => {
      let stream = ytaudio(url, { audioonly: true });

      ytaudio.getInfo(url, function(err, info) {
        if (err) {
          throw err;
        }
        console.log(message.author.username + ": " + info.title);
        const title = new Discord.RichEmbed()
          .setTitle("Now Playing")
          .setDescription(info.title);
        message.channel.send(title);
      });

      const dispatcher = connection.playStream(stream);
      dispatcher.on("end", () => {
        voiceChannel.leave();
      });
    })
    .catch(e => {
      console.error(e);
    });
}
