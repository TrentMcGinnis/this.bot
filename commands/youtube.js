const yt = require("ytdl-core"); //Youtube download for audio

module.exports = {
    name: "yt",
    description: "Bot join user's channel and streams audio of the linked youtube video",
    execute(message, args) {
        const url = args[1];
        const voiceChannel = message.member.voiceChannel;

        if (!voiceChannel){
            return message.channel.send("Join a voice channel!");
        }

        voiceChannel.join().then(connection => {
            const args = message.content.split(" ").slice(1);

            let stream = yt(args.join(" "), {audioonly: true});

            yt.getInfo(args.join(" "), function(err, info) {
                if (err) {
                    throw err;
                }
                console.log(message.author.username + ": " + info.title);
                const title = info.title;
                message.channel.send(`Now playing \`${title}\``);
            });

            const dispatcher = connection.playStream(stream);

            dispatcher.on('end', () => {
                voiceChannel.leave();
            });
        }).catch(e =>{
            console.error(e);
        });
    }
};