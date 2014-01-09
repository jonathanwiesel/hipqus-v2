#hipqus-v2
***
This simple application monitors a Disqus forum and sends a notification to HipChat (API v2) rooms when a new comment is made in said forum. Can be easily deployed to Heroku. You only need to set the following environment variables:

```
DISQUS_API_KEY=disqus_api_key
DISQUS_API_SECRET=api_secret
DISQUS_API_ACCESS_TOKEN=api_access_token
DISQUS_FORUM=your_disqus_forum
DISQUS_COMMENT_COUNT=10
HIPCHAT_ROOM_ID=123456-123457                       # separate multiple rooms by a dash (-)
HIPCHAT_ROOM_TOKEN=room1_token-room2_token
HIPCHAT_ROOM_MENTION=JonathanWiesel-here-all-...    # optional
```

The server will request every 10 seconds the 10 most recent comments (according to what's stated in the `DISQUS_COMMENT_COUNT` variable). If you consider that your forum could recieve more than 10 new comments in a 10 second window, feel free to increase that variable's number.

Notice that if you want to support multiple rooms you **MUST** specify the same order for the rooms and tokens.

The `HIPCHAT_ROOM_MENTION` variable is **optional**, it will send an additional message to the channel mentioning those specified (separated by a dash). Remember `all` will mention every member on the channel and `here` will mention every available room members.
(It cannot be sent along the original message because the first one is HTML-formated and the HipChat API states that to use @mentions the message needs to be text-formated).

To get the room's ID you can get it at:

`My Account tab -> Rooms subtab -> The Room You Want`

There you will find the room's ID under the name `API ID`.

To get the room's token, go to the tokens section in that same page's sidebar. Then create a token.

***

##Notes
This application was built using:
* [node-disqus](https://github.com/hay/node-disqus)
* [hipchatter](https://github.com/charltoons/hipchatter)
* [cron](https://github.com/ncb000gt/node-cron)

