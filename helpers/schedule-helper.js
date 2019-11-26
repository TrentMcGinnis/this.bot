const schedule = require("node-schedule");
const newsapi = require("../external_apis/news");
const embed = require("discord.js").RichEmbed;
const guildHelper = require("./guild-helper");

module.exports = {
    startNewsSchedule() {
        schedule.scheduleJob({ hour: 10, minute: 0 }, () => {
            newsapi.getLatest('', 'technology', (err, res) => {
                try {
                    if (!err) {
                        let urlList = "";
                        let newsEmbed = new embed();
                        for (let i = 0; i < 3; i++) {
                            urlList += (res.articles[i].title + "\n" + res.articles[i].url + "\n\n")
                        }
                        newsEmbed.setTitle('Tech news today').addField('Links to articles', urlList);
                        guildHelper.getNotifyChannels().forEach(channel => {
                            channel.send(newsEmbed);
                        })
                    } else {
                        const error = new Error(err);
                        next(error);
                    }
                } catch (e) {
                    const error = new Error(e);
                    next(error);
                }
            })
        })
    }
}