from channels import route
from consumers import ws_connect, ws_receive, ws_disconnect # websockets
from consumers import chat_join, chat_leave, chat_send # channels

# paths maintained by the higher level of routing
websocket_routing = [
	route('websocket.connect', ws_connect),
	route('websocket.receive', ws_receive),
	route('websocket.disconnect', ws_disconnect),
]

channel_routing = [
	route('goodchat.receive', chat_join, command=r'^join$'),
	route('goodchat.receive', chat_leave, command=r'^leave$'),
	route('goodchat.receive', chat_send, command=r'^send$'),
]