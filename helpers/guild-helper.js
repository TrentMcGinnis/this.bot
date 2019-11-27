module.exports = {
    _ListOfGuilds: [],
    _ListOfDefaultChannels: [],
    initialize(bot) {
        bot.guilds.array().forEach(guild => {
            this.addGuild(guild);
            this.addNotifyChannel(guild.channels.filter(channel => channel.type === 'text').first());
        });
    },
    addNotifyChannel(channel) {
        this._ListOfDefaultChannels.push(channel);
    },
    addGuild(guild) {
        const channel = guild.channels.filter(channel => channel.type === 'text').first();
        if (!this._ListOfGuilds.includes(guild)) {
            this._ListOfGuilds.push(guild);
            if (this._ListOfDefaultChannels.includes(channel)) {
                this.addNotifyChannel(channel);
            }
        }
    },
    getNotifyChannels() {
        return this._ListOfDefaultChannels;
    },
    getGuildList() {
        return this._ListOfGuilds;
    },
    removeGuild(guild) {
        this._ListOfGuilds.splice(this._ListOfGuilds.indexOf(guild), 1);
        this.removeNotifyChannel(guild.id);
    },
    removeNotifyChannel(id) {
        this._ListOfDefaultChannels.splice(this._ListOfDefaultChannels.indexOf(this._ListOfDefaultChannels.filter(x => x.guild.id === id)), 1);
    }
}