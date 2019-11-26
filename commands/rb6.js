const R6API = require('r6api.js');
const credentials = require("credentials.json");
const r6 = new R6API(credentials["ubisoftEmail"], credentials["ubisoftPassword"]);

module.exports = {
    name: "rb6",
    description: "Returns various stats about RB6 with the passed username.",
    execute(message, args) {
        const username = args[1];
        const id = await r6.getId('uplay', username).then(res => res[0].id);

        var level = await r6.getLevel('pc', id).then(res => res[0].level);
        var rankedPlaytime = await r6.getPlaytime('pc', id).then(res => res[0].ranked);
        var casualPlaytime = await r6.getPlaytime('pc', id).then(res => res[0].casual);
        var currentRank = await r6.getRank('pc', id).then(res => res.seasons[0].regions[0].current.name);
        var maxRank = await r6.getRank('pc', id).then(res => res.seasons[0].regions[0].max.name);

        var statString = `${username} is level ${level}\nCurrent Season Rank: ${currentRank}\n
                           Current Season Max Rank: ${maxRank}\nRanked Playtime: ${rankedPlaytime}\n
                           Casual Playtime: ${casualPlaytime}`;

        message.channel.send(statString);
    }
}