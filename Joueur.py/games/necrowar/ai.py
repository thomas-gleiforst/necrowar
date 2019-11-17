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
        # <<-- Creer-Merge: start -->> - Code you add between this comment and the end comment will be preserved between Creer re-runs.
        '''
        Find coordinates of all the mines (among other things)
        '''
        self.num_units = 0
        self.cleansers = 0
        self.aoes = 0
        self.towers = 0
        self.all_built = False
        self.phase = 1
        self.our_mines = []
        self.river_mines = []
        self.left_primary_cleanser_targets = [self.game.get_tile_at(4,8), self.game.get_tile_at(4,9), self.game.get_tile_at(4,12), self.game.get_tile_at(4,13), self.game.get_tile_at(4,16), self.game.get_tile_at(4,17), self.game.get_tile_at(4,20), self.game.get_tile_at(4,21), self.game.get_tile_at(7,8), self.game.get_tile_at(7,9), self.game.get_tile_at(7,12), self.game.get_tile_at(7, 13), self.game.get_tile_at(7,16), self.game.get_tile_at(7,17), self.game.get_tile_at(7,20), self.game.get_tile_at(7,21)]
        self.left_primary_aoe_targets = []
        self.river_mines = [self.game.get_tile_at(31, 15), self.game.get_tile_at(31, 16), self.game.get_tile_at(31, 17)]

        # Scan for gold mines, worker spawn tile, mob spawn tile
        for tile in self.player.side:
            if tile.is_gold_mine:
                self.our_mines.append(tile)
            elif tile.is_worker_spawn:
                self.worker_spawn = tile
            elif tile.is_unit_spawn:
                self.unit_spawn = tile

        '''
        # Scan for river mines
        for tile in self.game.tiles:
            if tile.x > 28 and tile.x < 35:
                if tile.y > 15 and tile.y < 20:
                    if title.is_gold_mine:
                        self.river_mines.append(tile)
        '''

        if self.worker_spawn.x > 31:
            self.river_spots = [self.game.get_tile_at(33,7),self.game.get_tile_at(33,8),self.game.get_tile_at(33,9),self.game.get_tile_at(33,10),self.game.get_tile_at(33,11),self.game.get_tile_at(33,12),self.game.get_tile_at(33,13),self.game.get_tile_at(33,19),self.game.get_tile_at(33,20),self.game.get_tile_at(33,21),self.game.get_tile_at(33,22)]
        else:
            self.river_spots = [self.game.get_tile_at(29,7),self.game.get_tile_at(29,8),self.game.get_tile_at(29,9),self.game.get_tile_at(29,10),self.game.get_tile_at(29,11),self.game.get_tile_at(29,12),self.game.get_tile_at(29,13),self.game.get_tile_at(29,19),self.game.get_tile_at(29,20),self.game.get_tile_at(29,21),self.game.get_tile_at(29,22)]

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
        while(self.num_units <= 25 and self.player.gold >= 10):
            print(self.game.current_turn, self.player.units)
            if self.worker_spawn.unit == None:
                spawned = self.worker_spawn.spawn_worker()
            else:
                break
            if self.num_units < 4 and spawned: ##inland miners
                if self.player.units[-1].tile.x > 31:
                    for j in range(4-self.num_units):
                        self.player.units[-1].move(self.player.units[-1].tile.tile_north)
                else:
                    for j in range(4-self.num_units):
                        self.player.units[-1].move(self.player.units[-1].tile.tile_south)
                self.num_units += 1

            elif self.num_units < 7 and spawned: ##island miners
                if self.player.units[-1].tile.x > 31:
                    for j in range(7-self.num_units):
                        self.player.units[-1].move(self.player.units[-1].tile.tile_west)
                else:
                    for j in range(7-self.num_units):
                        self.player.units[-1].move(self.player.units[-1].tile.tile_east)
                self.num_units += 1

            elif self.num_units < 11 and spawned: ##wall side builders
                self.num_units += 1
                if self.player.units[-1].tile.x > 31:
                    for j in range(15-self.num_units):
                        self.player.units[-1].move(self.player.units[-1].tile.tile_south)
                else:
                    for j in range(15-self.num_units):
                        self.player.units[-1].move(self.player.units[-1].tile.tile_north)
            elif self.num_units < 16 and spawned: ##fishers
                self.num_units += 1
                if self.player.units[-1].tile.x > 31:
                    for j in range(16-self.num_units):
                        self.player.units[-1].move(self.player.units[-1].tile.tile_west)
                else:
                    for j in range(16-self.num_units):
                        self.player.units[-1].move(self.player.units[-1].tile.tile_east)
            elif self.num_units < 21 and spawned: ##river side builders
                self.num_units += 1
                if self.player.units[-1].tile.x > 31:
                    for j in range(21-self.num_units):
                        self.player.units[-1].move(self.player.units[-1].tile.tile_west)
                else:
                    for j in range(21-self.num_units):
                        self.player.units[-1].move(self.player.units[-1].tile.tile_east)
            elif self.num_units < 25 and spawned:
                self.num_units += 1
                if self.player.units[-1].tile.x > 31:
                    for j in range(25-self.num_units):
                        self.player.units[-1].move(self.player.units[-1].tile.tile_north)
                else:
                    for j in range(25-self.num_units):
                        self.player.units[-1].move(self.player.units[-1].tile.tile_south)


        if self.game.current_turn == self.game.river_phase - 2 or self.game.current_turn == self.game.river_phase - 3:
            i = 0
            while self.player.gold > 0 and i < 3:
                self.worker_spawn.spawn_worker()
                if self.player.units[-1].tile.x > 31:
                    for j in range(3-i):
                        self.player.units[-1].move(self.player.units[-1].tile.tile_west)
                    i += 1
                else:
                    for j in range(3-i):
                        self.player.units[-1].move(self.player.units[-1].tile.tile_east)
                    i += 1



        '''
        Make workers go to the mines/river mines
        '''
        if len(self.player.units) != 0:
            # For all of our mining spots...
            for mine in self.our_mines:
                if mine.unit == None:
                    closest_worker = self.closest_worker(mine, 1, 4)
                    if closest_worker == None:
                        break
                    path = self.find_path(closest_worker.tile, mine)
                    #print(mine, path)
                    for tiles in path:
                        closest_worker.move(tiles)
                        if closest_worker.moves == 0:
                            break
                if mine.unit != None:
                    # The unit on the mine (mine.unit) needs
                    # to mine the mine(mine(mine))
                    mine.unit.mine(mine)
                    #print(self.player.gold)

            if self.num_units > 20:
                min_index = 23
                max_index = 9999
            else:
                min_index = 5
                max_index = 7
            for river_mine in self.river_mines:
                if river_mine.unit == None:
                    closest_worker = self.closest_worker(river_mine, min_index, max_index)
                    if closest_worker == None:
                        break
                    path = self.find_path(closest_worker.tile, river_mine)
                    for tiles in path:
                        closest_worker.move(tiles)
                        if closest_worker.moves == 0:
                            break
                if river_mine.unit != None:
                    print("Mining the river")
                    river_mine.unit.mine(river_mine)

            '''
            Move fisherman
            '''
            for fishing_spots in self.river_spots:
                if fishing_spots.unit == None:
                    closest_worker = self.closest_worker(fishing_spots, 11, 21)
                    if closest_worker == None:
                        break
                    path = self.find_path(closest_worker.tile, fishing_spots)
                    for tiles in path:
                        closest_worker.move(tiles)
                        if closest_worker.moves == 0:
                            break
                if fishing_spots.unit != None:
                    print(fishing_spots.x, fishing_spots.y, fishing_spots.tile_east.is_river, fishing_spots.tile_west.is_river)
                    if fishing_spots.tile_east.is_river:
                        fishing_spots.unit.fish(fishing_spots.tile_east)
                    else:
                        fishing_spots.unit.fish(fishing_spots.tile_west)


            '''
            Move tower builders
            '''
            if self.player.side[0].x>31:
                print("hi")
            else:
                for cleanser_target in self.left_primary_cleanser_targets:
                    self.build_tower(cleanser_target)



        '''
        Generating towers
        '''
        i = 0
        while(i < len(self.player.side) and self.player.gold >= 30 and self.player.mana >= 30 and not self.all_built):
            ##if i > len(self.player.side):
            ##    self.all_built = True

            if(self.player.side[i].is_path):
                for neighbor in self.player.side[i].get_neighbors():
                    if self.phase == 1 and neighbor.is_grass and not neighbor.is_tower:
                        self.build_tower(neighbor)
                        break
                    elif self.phase == 2:
                        for neighborsneighbor in neighbor.get_neighbors():
                            if neighborsneighbor.is_grass and neighborsneighbor.is_tower:
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
            while(self.player.gold >= 20 and self.player.mana >= 5):
                self.unit_spawn.spawn_unit("ghoul")

                for unit in self.player.units:
                    # Ghouls move if there is no castle tile. Otherwise ATTACK!
                    if unit.job == "ghoul":
                        ghoul_path = self.find_path(unit.tile, self.player.opponent.home_base())

                        # If ghoul has moves it will move closer to the enemy
                        if not unit.moves:
                            for tile in ghoul_path:
                                unit.move(tile)

                                if unit.moves == 0:
                                    break

                            # Ghouls will attack any castle in sight
                            for neighbor in unit.tile.get_neighbors():
                                if neighbor.is_castle():
                                    unit.attack(neighbor)


        return True
        # <<-- /Creer-Merge: runTurn -->>

    def build_tower(self, tile):
        if len(self.player.units):
            if tile.x == 4:
                unit = self.closest_worker(tile, 8, 11)
            elif tile.x == 7:
                unit = self.closest_worker(tile, 21, 25)
            else:
                unit = self.closest_worker(tile, 8, 11)

            if unit == None:
                return
            ##unit = self.closest_worker(tile, 21, 25)
            path = self.find_path(unit.tile,tile)
            for tiles in path:
                unit.move(tiles)
                if unit.moves == 0:
                    return
            if unit.tile == tile:
                if self.towers % 4 < 2 and self.player.gold >= 30 and self.player.mana >= 30:
                    unit.build("cleansing")
                    self.cleansers += 1
                elif self.towers % 4 < 4 and self.player.gold >= 40 and self.player.mana >= 15:
                    unit.build("aoe")
                    self.aoes += 1
                return
        else:
            return

    def closest_worker(self, tile, low, high):
        best_distance = 9999
        best_worker = None
        #print("default", self.game.units[0])
        worker_count = 0
        for unit in self.game.units:
            #print(unit.owner, self.player)
            #print(unit.job.title)
            if unit.job.title == "worker" and unit.owner == self.player:
                worker_count += 1
                #print(worker_count >= low, worker_count <= high, unit.acted, unit.moves > 0)
                if worker_count >= low and worker_count <= high and not unit.acted and unit.moves > 0:
                    #print("AHHH")
                    distance = len(self.find_path(unit.tile, tile))
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
                if neighbor and neighbor.id not in came_from and neighbor.unit == None and not neighbor.is_river:
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
