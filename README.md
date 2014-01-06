#Diqus-HipChat Notifier
***
This simple application monitors a Disqus forum and sends a notification to a HipChat room when a new comment is made in said forum. Can be easily deployed to Heroku. You only need to set the following enviroment variables:

```
DISQUS_API_KEY=disqus_api_key
DISQUS_API_SECRET=api_secret
DISQUS_API_ACCESS_TOKEN=api_access_token
DISQUS_FORUM=your_disqus_forum
HIPCHAT_API_V2_KEY=hipchat_api_key
HIPCHAT_ROOM_ID=123456-123457                       # separate multiple rooms by a dash (-)
HIPCHAT_ROOM_TOKEN=room1_token-room2_token
HIPCHAT_ROOM_MENTION=JonathanWiesel-here-all-...    # optional
```

The server will request every 10 seconds the comments from the forum that have been created since the last cron run. You could change the interval to a smaller value but remember that Disqus API is limited to 1000 requests per hour.

Notice that if you want to support multiple rooms you **MUST** specify the same order for the rooms and tokens.

The `HIPCHAT_ROOM_MENTION` variable is **optional**, it will send an additional message to the channel mentioning those specified (separated by a dash). Remember `all` will mention every member on the channel and `here` will mention every available room members.
(It cannot be sent along the original message because the first one is HTML-formated and the HipChat API states that to use @mentions the message needs to be text-formated).

***

##Notes
This application was built using:
* [node-disqus](https://github.com/hay/node-disqus)
* [node-hipchat](https://github.com/nkohari/node-hipchat)
* [cron](https://github.com/ncb000gt/node-cron)

