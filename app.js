var cronJob = require('cron').CronJob,
    hipqus = require('./hipqus.js'),
    D  = require('./disqus-config.js');

var lastTimestamp = null;

new cronJob('*/10 * * * * *', function (){

    D.disqus.request('posts/list', D.disqus_options, function(data) {

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
                        hipqus.buildMessage(response[i]);
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

