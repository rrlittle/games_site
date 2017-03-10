from channels.routing import route
import consumers_lobby as lobby
import consumers_game as game

websocket_lobby_routing = [
	route('websocket.connect', lobby.ws_connect),
	route('websocket.receive', lobby.ws_receive),
	route('websocket.disconnect', lobby.ws_disconnect),
]

channel_lobby_routing = [
	route('catan.lobby.receive', lobby.new_player, command=r'^join$'),
	route('catan.lobby.receive', lobby.set_color, command=r'^set_color$'),
	route('catan.lobby.receive', lobby.remove_player, command=r'^leave$'),
	route('catan.lobby.receive', lobby.begin_game, command=r'^begin$'),
	route('catan.lobby.receive', lobby.set_vote, command=r'^vote$'),
]


websocket_game_routing = [
	route('websocket.connect', game.ws_connect),
	route('websocket.receive', game.ws_receive),
	route('websocket.disconnect', game.ws_disconnect),
]

channel_game_routing = [
	route('catan.game.receive', game.join_game, command=r'^join$'),
]
