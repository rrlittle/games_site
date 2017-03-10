from channels.routing import route
from consumers import add_player, recive_mouse, disconnect

websocket_routes = [
	route("websocket.connect", add_player, path=r'/(?P<lobby>[0-9]+)$'),
    route("websocket.receive", recive_mouse, path=r'/(?P<lobby>[0-9]+)$'),
    route("websocket.disconnect", disconnect, path=r'/(?P<lobby>[0-9]+)$'),
]