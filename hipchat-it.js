var Hipqus      =   require('./hipqus.js'),
    hipqus      =   new Hipqus(),
    mentionsVar =   process.env.HIPCHAT_ROOM_MENTION;

module.exports = function(raw){
    hipqus.buildMessage(raw, function(message){
        hipqus.sendMessage(message, function(err, message){
            console.log(message);
            if(!err && mentionsVar){
                hipqus.prepareMentions(mentionsVar, function(paramsArray){
                    hipqus.sendMentions(paramsArray);
                });
            }
        });
    });
}
