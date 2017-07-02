/* My first time with Node */
const util = require('util'); //System Functions
var cheerio = require('cheerio'); //HTML parsing
var chalk = require('chalk'); //Colors Fonts and Outputs
var request = require('request'); //HTTP requests
var SlackBot = require('slackbots');
//var Nightmare = require('nightmare'); //Browser automation
var header = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/27.0.1453.110 Safari/537.36'
};

var refreshTime = 10000;

// create a bot
var bot = new SlackBot({
    token: '', // Add a bot https://my.slack.com/services/new/bot and put the token
    name: 'Restock Monitor'
});

const supreme_url = 'http://www.supremenewyork.com/shop/all';
var soldOutItems = [];
var newItems = [];


bot.postMessageToChannel('monitor', 'Now Monitoring For Restocks🤠\nRefresh time set at ' + refreshTime/1000 + " seconds!");

function gatherInitialData(arrayToWriteTo) {
    request({
        url: supreme_url,
        headers: header
    }, function(error, response, html) {

        if (response && response.statusCode != 200) {
            console.log(error);
            return null;
        }

        let $ = cheerio.load(html);

        $('.inner-article').each(function(i, elm) {
            if (elm.children[0].children[0].next == null) {} //end if
            else {
                arrayToWriteTo.push((elm.children[0].children[0].next.parent.attribs['href']));
            } //end else
        }); //end of loop jQuery function
    }); //end of request call
    return arrayToWriteTo;
}; // end gather data function

function findDifferences(firstArray, secondArray) {

    var first = new Array();
    first = gatherInitialData(firstArray);
    var second = new Array();
    var diff;

    setTimeout(function() {
        second.push(gatherInitialData(secondArray));
    }, 2000);

    setTimeout(function() {
        var diff = cheerio(first).not(second[0]).get();
    }, 4000);

    setTimeout(function() {
        if (diff != undefined) {
            console.log('http://www.supremenewyork.com' + diff);
            soldOutItems.length = 0;
            newItems.length = 0;
        }
        else{
          soldOutItems.length = 0;
          newItems.length = 0;
        }

    }, 6000);

};

setInterval(function() {
    findDifferences(soldOutItems, newItems);
}, refreshTime); //every 10 seconds
