const mongoose = require('mongoose');
const { MONGO_URI } = require('./config');
const axios = require('axios');
const cheerio = require('cheerio');
const cron = require('node-cron');
const { BreakingNew } = require('./models');


mongoose.connect(MONGO_URI, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}, (err, resp) => {
    if (err) throw err;
    console.log('DB Online');
});

// First parameter: How often is it going to run / Url Contab.guru (0 */4 * * * :: every four hours)
cron.schedule("0 */4 * * *", async() => {
    console.log('Cron Job executed!');
    const html = await axios.get('https://cnnespanol.cnn.com/');
    const $ = cheerio.load(html.data);
    const titles = $(".news__title");
    const breakingNewsFinal = [];

    titles.each((index, element) => {
        const breakingNew = {
            title: $(element).children().text().trim(),
            link: $(element).children().attr("href")
        }
        breakingNewsFinal.push(breakingNew);
    });

    BreakingNew.create(breakingNewsFinal);

});