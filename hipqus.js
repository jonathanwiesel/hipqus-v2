var Hipchat     =   require('hipchatter'),
    hip         =   new Hipchat(process.env.HIPCHAT_API_V2_KEY),
    rooms       =   process.env.HIPCHAT_ROOM_ID.split('-'),
    roomTokens  =   process.env.HIPCHAT_ROOM_TOKEN.split('-'),
    params      =   { color: 'green', notify: true };

var buildMessage = function (comment){

    var commentDate = new Date(comment.createdAt);

    var url = comment.thread.link + '#comment-' + comment.id;

    var message = '<b>' + comment.author.name + '</b> created <a href="'+ url +'"> a new comment</a>';
    message += ' on entry <a href="'+ comment.thread.link +'">' +  comment.thread.title + '</a>:<br>';
    message += comment.message;
    message = message.replace(/<p>/g, '').replace(/<\/p>/g, '<br>');

    sendMessage(message);
}


function sendMessage(message){

    params.message = message;
    params.message_format = 'html';

    for(var k=0; k < rooms.length; k++){

        params.token = roomTokens[k];

        hip.notify(rooms[k], params, function(err) {
            if(err){
                console.log(err);
            }else{
                console.log('New Disqus comment!. Message sent to Hipchat room.');
            }
        });
    }

    if(process.env.HIPCHAT_ROOM_MENTION){
        sendMetions();
    }
}


function sendMetions(){

    var mentionsVar =   process.env.HIPCHAT_ROOM_MENTION.split('-');
    for(var k=0; k < rooms.length; k++){

        var mentions = '';
        for(var j=0; j < mentionsVar.length; j++){
            mentions += ' @' + mentionsVar[j];
        }
        var mentionMessage = 'Alerting' + mentions + ' about new comment.';

        params.message = mentionMessage;
        params.message_format = 'text';
        params.token = roomTokens[k];

        hip.notify(rooms[k], params, function(data) {
            console.log('Mentioning alert sent.');
        });
    }
}


module.exports.buildMessage = buildMessage;
