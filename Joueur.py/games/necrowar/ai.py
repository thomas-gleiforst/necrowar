# This is where you build your AI for the Necrowar game.

from joueur.base_ai import BaseAI

# <<-- Creer-Merge: imports -->> - Code you add between this comment and the end comment will be preserved between Creer re-runs.
# you can add additional import(s) here
# <<-- /Creer-Merge: imports -->>

class AI(BaseAI):
    """ The AI you add and improve code inside to play Necrowar. """

    @property
    def game(self):
        """The reference to the Game instance this AI is playing.

        :rtype: games.necrowar.game.Game
        """
        return self._game # don't directly touch this "private" variable pls

    @property
    def player(self):
        """The reference to the Player this AI controls in the Game.

        :rtype: games.necrowar.player.Player
        """
        return self._player # don't directly touch this "private" variable pls

    def get_name(self):
        """ This is the name you send to the server so your AI will control the
            player named this string.

        Returns
            str: The name of your Player.
        """
        # <<-- Creer-Merge: get-name -->> - Code you add between this comment and the end comment will be preserved between Creer re-runs.
        return "PythonPlusPlus" # REPLACE THIS WITH YOUR TEAM NAME
        # <<-- /Creer-Merge: get-name -->>

    def start(self):
        """ This is called once the game starts and your AI knows its player and
            game. You can initialize your AI here.
        """

        '''
        Find coordinates of all the mines
        '''
        self.cleansers = 0
        self.aoes = 0
        self.towers = 0
        self.all_built = False
        self.phase = 1
        self.our_mines = []
        for x in range(self.game.map_width()):
            for y in range(self.game.map_height()):
                for unit in self.game.units():
                    if self.game.get_tile_at(x,y).is_gold_mine:
                        if self.get_tile_at(x+1, y).owner() is NULL and self.get_tile_at(x-1, y).owner() is self:
                            self.our_mines += self.game.get_tile_at(x,y)
                        if self.get_tile_at(x-1, y).owner() is self and self.get_tile_at(x+1, y).owner() is NULL:
                            self.our_mines += self.game.get_tile_at(x,y)
                        if (self.get_tile_at(x+1, y).owner() is self and self.get_tile_at(x-1, y).owner() is not self) or (self.get_tile_at(x+1, y).owner() is not self and self.get_tile_at(x-1, y).owner() is self):
                            self.our_mines += self.game.get_tile_at(x,y)

        # <<-- Creer-Merge: start -->> - Code you add between this comment and the end comment will be preserved between Creer re-runs.
        self.past_tower_list = [] # How many towers we built last round
        self.past_tower_num = 0 # Number of towers that we last had
        self.destroyed_towers = [] # Towers that we lost
        self.new_towers = [] # Towers that we just built

        # TODO: Initialize our AI here!!!!!


        # <<-- /Creer-Merge: start -->>

    def game_updated(self):
        """ This is called every time the game's state updates, so if you are
        tracking anything you can update it here.
        """
        # <<-- Creer-Merge: game-updated -->> - Code you add between this comment and the end comment will be preserved between Creer re-runs.
        '''
        This code detects any new or destroyed towers
        '''
        # Runs when our number of towers are different from last round
        if self.past_tower_num != self.towers:
            self.destroyed_towers = []
            self.new_towers = []

            # For all current towers...
            for cur_tower in self.player.towers:
                # If it is not in past towers, that means that this is a new tower
                if cur_tower not in self.past_tower_list:
                    self.new_towers.append(cur_tower)

            # For all past past towers...
            for past_tower in self.past_tower_list:
                # If past tower isn't in current tower list, we lost that tower
                if past_tower not in self.player.towers:
                    self.destroyed_towers.append(past_tower)

        self.past_tower_num = self.towers # Update our number of towers
        self.past_tower_list = self.player.towers # Update our tower list

        # <<-- /Creer-Merge: game-updated -->>

    def end(self, won, reason):
        """ This is called when the game ends, you can clean up your data and
            dump files here if need be.

        Args:
            won (bool): True means you won, False means you lost.
            reason (str): The human readable string explaining why your AI won
            or lost.
        """
        # <<-- Creer-Merge: end -->> - Code you add between this comment and the end comment will be preserved between Creer re-runs.
        # replace with your end logic
        # <<-- /Creer-Merge: end -->>
    def run_turn(self):

        """ This is called every time it is this AI.player's turn.

        Returns:
            bool: Represents if you want to end your turn. True means end your turn, False means to keep your turn going and re-call this function.
        """
        # <<-- Creer-Merge: runTurn -->> - Code you add between this comment and the end comment will be preserved between Creer re-runs.
        # Put your game logic here for runTurn
        '''
        Rebuild
        '''
        for towers in self.destroyed_towers:
            build_tower(towers)


        """
        Generating workers on strategic turns
        """
        if self.turnCount == 1:
            i = 0
            while i < 10:
                self.tile.spawn_worker()
                i += 1
        elif self.game.river_phase():
            i = 0
            while self._gold > 0 and i < 3:
                self.tile.spawn_worker()
                i += 1



        #Make workers go to the mines/river

        for mine in our_mines:
            if not mine.unit():
                closest_worker = self.closest_worker(mine)
                path = closest_worker.find_path(mine)
                for tiles in path:
                    closest_worker.move(tiles)
                    if closest_worker.moves() == 0:
                        return
            if mine.unit():
                mine.unit().mine()


        '''
        Generating towers
        '''
        i = 0
        while(self.player.gold() >= 30 and self.player.mana() >= 30 and not self.all_built):
            if i >= len(self.player.side()):
                self.all_built = True

            if(self.player.side()[i].is_path()):
                for neighbor in self.player.side()[i].get_neighbors():
                    if self.phase == 1 and neighbor.is_grass() and not neighbor.is_tower():
                        self.build_tower(neighbor)
                        break
                    elif self.phase == 2:
                        for neighborsneighbor in neighbor.get_neighbors():
                            if neighborsneighbor.is_grass() and neighborsneighbor.is_tower():
                                self.build_tower(neighbor)
                                break
                        else:
                            continue
                        break
            i+=1

        '''
        Spawn time
        '''

        if self.phase == 3:
            while(self.player.gold() >= 20 and self.player.mana() >= 5):
                self.tile.spawn_unit("ghoul")


        return True
        # <<-- /Creer-Merge: runTurn -->>
    def build_tower(self, tile):
        unit = self.closest_worker()
        path = worker.find_path(neighbor)
        for tiles in path:
            worker.move(tiles)
            if worker.moves() == 0:
                return
        if worker.x() == neighbor.x() and worker.y() is neighbor.y():
            if self.towers % 4 < 2 and self.player.gold() >= 30 and self.player.mana() >= 30:
                worker.build("cleansing")
                self.cleansers += 1
            elif self.towers % 4 < 4 and self.player.gold() >= 40 and self.player.mana() >= 15:
                worker.build("aoe")
                self.aoe += 1
            return

    def closest_worker(self, tile):
        best_distance = 9999
        best_worker = 0
        for unit in self.game.units():
            if unit.job() == "worker" and not unit.acted() and unit.moves() > 0:
                distance = (((tile.x()-unit.x())**2+(tile.y()-unit.y())**2))**(1/2)
                if distance < best_distance:
                    best_distance = distance
                    best_worker = unit

        return best_worker

    def find_path(self, start, goal):
        """A very basic path finding algorithm (Breadth First Search) that when
            given a starting Tile, will return a valid path to the goal Tile.

        Args:
            start (games.necrowar.tile.Tile): the starting Tile
            goal (games.necrowar.tile.Tile): the goal Tile
        Returns:
            list[games.necrowar.tile.Tile]: A list of Tiles
            representing the path, the the first element being a valid adjacent
            Tile to the start, and the last element being the goal.
        """

        if start == goal:
            # no need to make a path to here...
            return []

        # queue of the tiles that will have their neighbors searched for 'goal'
        fringe = []

        # How we got to each tile that went into the fringe.
        came_from = {}

        # Enqueue start as the first tile to have its neighbors searched.
        fringe.append(start)

        # keep exploring neighbors of neighbors... until there are no more.
        while len(fringe) > 0:
            # the tile we are currently exploring.
            inspect = fringe.pop(0)

            # cycle through the tile's neighbors.
            for neighbor in inspect.get_neighbors():
                # if we found the goal, we have the path!
                if neighbor == goal:
                    # Follow the path backward to the start from the goal and
                    # # return it.
                    path = [goal]

                    # Starting at the tile we are currently at, insert them
                    # retracing our steps till we get to the starting tile
                    while inspect != start:
                        path.insert(0, inspect)
                        inspect = came_from[inspect.id]
                    return path
                # else we did not find the goal, so enqueue this tile's
                # neighbors to be inspected

                # if the tile exists, has not been explored or added to the
                # fringe yet, and it is pathable
                if neighbor and neighbor.id not in came_from and (
                    neighbor.is_pathable()
                ):
                    # add it to the tiles to be explored and add where it came
                    # from for path reconstruction.
                    fringe.append(neighbor)
                    came_from[neighbor.id] = inspect

        # if you're here, that means that there was not a path to get to where
        # you want to go; in that case, we'll just return an empty path.
        return []

    # <<-- Creer-Merge: functions -->> - Code you add between this comment and the end comment will be preserved between Creer re-runs.
    # if you need additional functions for your AI you can add them here
    # <<-- /Creer-Merge: functions -->>
