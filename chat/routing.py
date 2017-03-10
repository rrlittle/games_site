from channels.routing import route
import websocket_consumers
import channel_consumers

websocket_routes = [
	route('websocket.connect', websocket_consumers.ws_connect),
	route('websocket.disconnect', websocket_consumers.ws_disconnect),
	route('websocket.receive', websocket_consumers.ws_receive),
]

channel_routes = [
	route('chat.recieve', channel_consumers.chat_create, command=r'^create$'),
	route('chat.recieve', channel_consumers.chat_join, command=r'^join$'),
	route('chat.recieve', channel_consumers.chat_send, command=r'^send$'),
	route('chat.recieve', channel_consumers.chat_leave, command=r'^leave$'),
]
