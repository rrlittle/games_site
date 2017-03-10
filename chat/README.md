Chat is an app that lets you include chat functionality in your website. 

you can interface with it in 3 ways. 

1. you can include the chat.urls in your {site}.urls.py and use the built-in chat webpage
2. you can include a modal from chat/modal.html that can be embedded in your webpages
3. or you can build your own front ened using the following messaging protocol.

messaging protocol:
1. connect to the stream using your custom url
2. send a packet containing:
{   room: {room name [varchar < 255 characters long]}
    'command': [join, create, leave, send]
}

if you use the join/leave/create command you do not need to provide any other

you will receive messages that look like 
{   'message': { message [varchar < 500 characters long]}
    'username': {username < 20 characters long}
    'created': 
}
