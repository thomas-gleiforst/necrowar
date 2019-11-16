# Player: A player in this game. Every AI controls one player.

# DO NOT MODIFY THIS FILE
# Never try to directly create an instance of this class, or modify its member variables.
# Instead, you should only be reading its variables and calling its functions.

from games.necrowar.game_object import GameObject

# <<-- Creer-Merge: imports -->> - Code you add between this comment and the end comment will be preserved between Creer re-runs.
# you can add additional import(s) here
# <<-- /Creer-Merge: imports -->>

class Player(GameObject):
    """The class representing the Player in the Necrowar game.

    A player in this game. Every AI controls one player.
    """

    def __init__(self):
        """Initializes a Player with basic logic as provided by the Creer code generator."""
        GameObject.__init__(self)

        # private attributes to hold the properties so they appear read only
        self._client_type = ""
        self._gold = 0
        self._health = 0
        self._home_base = []
        self._lost = False
        self._mana = 0
        self._name = "Anonymous"
        self._opponent = None
        self._reason_lost = ""
        self._reason_won = ""
        self._side = []
        self._time_remaining = 0
        self._towers = []
        self._units = []
        self._won = False

    @property
    def client_type(self):
        """What type of client this is, e.g. 'Python', 'JavaScript', or some other language. For potential data mining purposes.

        :rtype: str
        """
        return self._client_type

    @property
    def gold(self):
        """The amount of gold this Player has.

        :rtype: int
        """
        return self._gold

    @property
    def health(self):
        """The amount of health remaining for this player's main unit.

        :rtype: int
        """
        return self._health

    @property
    def home_base(self):
        """The tile that the home base is located on.

        :rtype: list[games.necrowar.tile.Tile]
        """
        return self._home_base

    @property
    def lost(self):
        """If the player lost the game or not.

        :rtype: bool
        """
        return self._lost

    @property
    def mana(self):
        """The amount of mana this player has.

        :rtype: int
        """
        return self._mana

    @property
    def name(self):
        """The name of the player.

        :rtype: str
        """
        return self._name

    @property
    def opponent(self):
        """This player's opponent in the game.

        :rtype: games.necrowar.player.Player
        """
        return self._opponent

    @property
    def reason_lost(self):
        """The reason why the player lost the game.

        :rtype: str
        """
        return self._reason_lost

    @property
    def reason_won(self):
        """The reason why the player won the game.

        :rtype: str
        """
        return self._reason_won

    @property
    def side(self):
        """All tiles that this player can build on and move workers on.

        :rtype: list[games.necrowar.tile.Tile]
        """
        return self._side

    @property
    def time_remaining(self):
        """The amount of time (in ns) remaining for this AI to send commands.

        :rtype: float
        """
        return self._time_remaining

    @property
    def towers(self):
        """Every Tower owned by this player.

        :rtype: list[games.necrowar.tower.Tower]
        """
        return self._towers

    @property
    def units(self):
        """Every Unit owned by this Player.

        :rtype: list[games.necrowar.unit.Unit]
        """
        return self._units

    @property
    def won(self):
        """If the player won the game or not.

        :rtype: bool
        """
        return self._won



    # <<-- Creer-Merge: functions -->> - Code you add between this comment and the end comment will be preserved between Creer re-runs.
    # if you want to add any client side logic (such as state checking functions) this is where you can add them
    # <<-- /Creer-Merge: functions -->>
