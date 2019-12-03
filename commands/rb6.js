const R6API = require('r6api.js');
const credentials = require("../credentials.json");
const Discord = require('discord.js');
const r6 = new R6API(credentials["ubisoftEmail"], credentials["ubisoftPassword"]);

module.exports = {
    name: "rb6",
    description: "Returns various stats about RB6 with the passed username.",
    async execute(message, args) {
            const username = args[1];
            const region = args[2] != undefined ? args[2] : 'ncsa';
            const id = await r6.getId('uplay', username).then(res => res[0].id);

            var level = await r6.getLevel('uplay', id).then(res => res[0].level);
            var rankedPlaytime = await r6.getPlaytime('uplay', id).then(res => res[0].ranked);
            var casualPlaytime = await r6.getPlaytime('uplay', id).then(res => res[0].casual);
            var currentRank = await r6.getRank('uplay', id).then(res => res[0].seasons['16'].regions[region].current.name);
            var rankUrl = await r6.getRank('uplay', id).then(res => res[0].seasons['16'].regions[region].current.image);
            var maxRank = await r6.getRank('uplay', id).then(res => res[0].seasons['16'].regions[region].max.name);

            var rankedConverted = Math.floor(rankedPlaytime / 3600) + 'h ' + Math.floor((rankedPlaytime % 3600) / 60) + 'm ' + rankedPlaytime % 3600 % 60 + 's';
            var casualConverted = Math.floor(casualPlaytime / 3600) + 'h ' + Math.floor((casualPlaytime % 3600) / 60) + 'm ' + casualPlaytime % 3600 % 60 + 's';

            // build the embed
            var statsEmbed = new Discord.RichEmbed()
                            .setColor('#0099ff')
                            .setTitle(username)
                            .setDescription('Rainbow Six stats')
                            .addField('Level', level)
                            .addField('Casual Playtime', casualConverted, true)
                            .addField('Ranked Playtime', rankedConverted);
                            // don't want to show ranked info if player is unranked
                            if (currentRank !== 'Unranked') 
                            {
                                statsEmbed
                                .setThumbnail(rankUrl)
                                .addField('Current Rank', currentRank, true)
                                .addField('Max Rank', maxRank, true);
                            }        

            message.channel.send(statsEmbed);
    }
}