var Hipchat     =   require('hipchatter'),
    hip         =   new Hipchat(),
    rooms       =   process.env.HIPCHAT_ROOM_ID.split('-'),
    roomTokens  =   process.env.HIPCHAT_ROOM_TOKEN.split('-'),
    params      =   { color: 'green', notify: true };

var Hipqus = function(){}

Hipqus.prototype = {

    buildMessage: function (comment, callback){

        var commentDate = new Date(comment.createdAt);

        var url = comment.thread.link + '#comment-' + comment.id;

        var message = '<b>' + comment.author.name + '</b> created <a href="'+ url +'"> a new comment</a>';
        message += ' on entry <a href="'+ comment.thread.link +'">' +  comment.thread.title + '</a>:<br>';
        message += comment.message;
        message = message.replace(/<p>/g, '').replace(/<\/p>/g, '<br>');

        callback(message);
    },


    sendMessage: function(message, callback){

        params.message = message;
        params.message_format = 'html';

        error = null;
        for(var k=0; k < rooms.length; k++){

            params.token = roomTokens[k];

            hip.notify(rooms[k], params, function(err) {
                if(err) error = err;
            });
        }
        if(error) callback(error, 'Error notifying room');
        else callback(null,'New Disqus comment!. Message sent to Hipchat rooms.');
    },

    prepareMentions: function(mentions, callback){

        var paramsArray = [];
        var mentionsArray = mentions.split('-');
        for(var k=0; k < rooms.length; k++){

            var mentions = '';
            for(var j=0; j < mentionsArray.length; j++){
                mentions += ' @' + mentionsArray[j];
            }
            var mentionMessage = 'Alerting' + mentions + ' about new comment.';

            params.message = mentionMessage;
            params.message_format = 'text';
            params.token = roomTokens[k];

            paramsArray.push(params);

        }

        callback(paramsArray);
    },

    sendMentions: function(paramsArray){

        for(var k=0; k < rooms.length; k++){
            hip.notify(rooms[k], paramsArray[k], function(data) {
                console.log('Mentioning alert sent.');
            });
        }
    }
}

module.exports = Hipqus;
