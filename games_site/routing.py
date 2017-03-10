from channels.routing import route, include

channel_routing = [
	include('chat.routing.channel_routes'),  # channel routes don't have a path
	include('chat.routing.websocket_routes', path=r'^/chat'), # websockets do
	include('blobio.routing.websocket_routes', path=r'^/blobio'),
	include("goodchat.routing.websocket_routing", path=r'^/goodchat/stream'),
	include("goodchat.routing.channel_routing"),
	include("catan.routing.websocket_lobby_routing", path=r'^/catan/lobby/(?P<lobbyid>[0-9]+)/stream'),
	include("catan.routing.channel_lobby_routing"),
	include("catan.routing.websocket_game_routing", path=r'^/catan/game/(?P<gameid>[0-9]+)/stream'),
	include("catan.routing.channel_game_routing"),
]
	