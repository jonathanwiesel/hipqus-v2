var Disqus = require('disqus'),
    cronJob = require('cron').CronJob,
    hipchat = require('./hipchat.js');

var disqus = new Disqus({
    api_secret : process.env.DISQUS_API_SECRET,
    api_key : process.env.DISQUS_API_KEY,
    access_token : process.env.DISQUS_API_ACCESS_TOKEN
});

var disqus_options = {
    forum: process.env.DISQUS_FORUM,
    related: 'thread',
    limit: 10
};

var lastTimestamp = null;

new cronJob('*/10 * * * * *', function (){

    disqus.request('posts/list', disqus_options, function(data) {

        if(data.error){
            console.log('Something went wrong...');
            console.log(data);
        }else{
            var response = JSON.parse(data).response;

            if(!lastTimestamp){
                // initializing lastTimestamp with most recent comment date
                lastTimestamp = new Date(response[0].createdAt);
            }else{
                var mostRecentTimestamp = null;
                for(var i=0; i < response.length; i++){
                    var postDate = new Date(response[i].createdAt);
                    if(postDate > lastTimestamp){
                        hipchat.buildMessage(response[i]);
                        if(!mostRecentTimestamp){
                            mostRecentTimestamp = postDate;
                        }
                    }else{
                        console.log('Nothing new to send. Last comment timestamp: ' + lastTimestamp.toISOString());
                        break;
                    }
                }
                if(mostRecentTimestamp){
                    lastTimestamp = mostRecentTimestamp;
                }
            }
        }
    });

}, null, true, null);

