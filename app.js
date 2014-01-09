var cronJob     =   require('cron').CronJob,
    D           =   require('./disqus-config.js'),
    hipChatIt   =   require('./hipchat-it.js');

var lastTimestamp = null;

new cronJob('*/10 * * * * *', function (){

    D.disqus.request('posts/list', D.disqus_options, function(data) {

        if(data.error) console.log('Something went wrong: ' + data);
        else{
            var response = JSON.parse(data).response;
            if(response.length > 0){
                if(!lastTimestamp) lastTimestamp = new Date(response[0].createdAt);
                else{
                    var mostRecentTimestamp = null;
                    for(var i=0; i < response.length; i++){
                        var postDate = new Date(response[i].createdAt);
                        if(postDate > lastTimestamp){

                            hipChatIt(response[i])

                            if(!mostRecentTimestamp) mostRecentTimestamp = postDate;
                        }else{
                            console.log('Nothing new to send. Last comment timestamp: ' + lastTimestamp.toISOString());
                            break;
                        }
                    }
                    if(mostRecentTimestamp) lastTimestamp = mostRecentTimestamp;
                }
            }
        }
    });

}, null, true, null);

