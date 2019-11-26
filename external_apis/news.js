const credentials = require("../credentials.json");
const apikey = credentials['newsapikey']
const NewsAPI = require("newsapi");
const newsInterface = new NewsAPI(apikey);

module.exports = {
    getLatest(query, category, callback){
        newsInterface.v2.topHeadlines({
            q: query,
            category: category,
            language: 'en',
            country: 'us'
        }).then(res => {
            callback(null, res)
        }).catch(e => {
            const error = new Error(e);
            callback(error, null);
        })
    }
}

