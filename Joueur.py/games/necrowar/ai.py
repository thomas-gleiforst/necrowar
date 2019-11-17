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
        self.right = self.player.side[0].x > 31
        # First direction corresponds to side of the screen, and second
        # direction corresponds to the side of the path
        self.left_left_primary_targets = [self.game.get_tile_at(4,8), self.game.get_tile_at(4,9), self.game.get_tile_at(4,10), self.game.get_tile_at(4,11), self.game.get_tile_at(4,12), self.game.get_tile_at(4,13), self.game.get_tile_at(4,14), self.game.get_tile_at(4,15), self.game.get_tile_at(4,16), self.game.get_tile_at(4,17), self.game.get_tile_at(4,18), self.game.get_tile_at(4,19), self.game.get_tile_at(4,20), self.game.get_tile_at(4,21), self.game.get_tile_at(4, 22), self.game.get_tile_at(4,23), self.game.get_tile_at(4,24), self.game.get_tile_at(4,25), self.game.get_tile_at(4,26)]
        self.left_right_primary_targets = [self.game.get_tile_at(7,8), self.game.get_tile_at(7,9), self. game.get_tile_at(7,10), self.game.get_tile_at(7,11), self.game.get_tile_at(7,12), self.game.get_tile_at(7, 13), self.game.get_tile_at(7,14), self.game.get_tile_at(7,15), self.game.get_tile_at(7,16), self.game.get_tile_at(7,17), self.game.get_tile_at(7,18), self.game.get_tile_at(7,19), self.game.get_tile_at(7,20), self.game.get_tile_at(7,21), self.game.get_tile_at(4,22)]
        self.left_left_secondary_targets = [self.game.get_tile_at(3,8), self.game.get_tile_at(3,9), self.game.get_tile_at(3,10), self.game.get_tile_at(3,11), self.game.get_tile_at(3,12), self.game.get_tile_at(3,13), self.game.get_tile_at(3,14), self.game.get_tile_at(3,15), self.game.get_tile_at(3,16), self.game.get_tile_at(3,17), self.game.get_tile_at(3,18), self.game.get_tile_at(3,19), self.game.get_tile_at(3,20), self.game.get_tile_at(3,21), self.game.get_tile_at(3, 22), self.game.get_tile_at(3,23), self.game.get_tile_at(3,24), self.game.get_tile_at(3,25), self.game.get_tile_at(3,26)]
        self.left_right_secondary_targets = [self.game.get_tile_at(8,8), self.game.get_tile_at(8,9), self. game.get_tile_at(8,10), self.game.get_tile_at(8,11), self.game.get_tile_at(8,12), self.game.get_tile_at(8, 13), self.game.get_tile_at(8,14), self.game.get_tile_at(8,15), self.game.get_tile_at(8,16), self.game.get_tile_at(8,17), self.game.get_tile_at(8,18), self.game.get_tile_at(8,19), self.game.get_tile_at(8,20), self.game.get_tile_at(8,21), self.game.get_tile_at(4,22)]
        self.right_left_primary_targets = [self.game.get_tile_at(55, 26), self.game.get_tile_at(55,25), self.game.get_tile_at(55,24), self.game.get_tile_at(55,23), self.game.get_tile_at(55,22), self.game.get_tile_at(55,21), self.game.get_tile_at(55,20), self.game.get_tile_at(55,19), self.game.get_tile_at(55,18), self.game.get_tile_at(55,17), self.game.get_tile_at(55,16), self.game.get_tile_at(55,15), self.game.get_tile_at(55,14), self.game.get_tile_at(55,13), self.game.get_tile_at(55,12), self.game.get_tile_at(55,11), self.game.get_tile_at(55, 10), self.game.get_tile_at(55,9)]
        self.right_right_primary_targets = [self.game.get_tile_at(58, 26), self.game.get_tile_at(58,25), self.game.get_tile_at(58,24), self.game.get_tile_at(58,23), self.game.get_tile_at(58,22), self.game.get_tile_at(58,21), self.game.get_tile_at(58,20), self.game.get_tile_at(58,19), self.game.get_tile_at(58,18), self.game.get_tile_at(58,17), self.game.get_tile_at(58,16), self.game.get_tile_at(58,15), self.game.get_tile_at(58,14), self.game.get_tile_at(58,13), self.game.get_tile_at(58,12), self.game.get_tile_at(58,11)]
        self.right_left_secondary_targets = [self.game.get_tile_at(54, 26), self.game.get_tile_at(54,25), self.game.get_tile_at(54,24), self.game.get_tile_at(54,23), self.game.get_tile_at(54,22), self.game.get_tile_at(54,21), self.game.get_tile_at(54,20), self.game.get_tile_at(54,19), self.game.get_tile_at(54,18), self.game.get_tile_at(54,17), self.game.get_tile_at(54,16), self.game.get_tile_at(54,15), self.game.get_tile_at(54,14), self.game.get_tile_at(54,13), self.game.get_tile_at(54,12), self.game.get_tile_at(54,11), self.game.get_tile_at(54, 10), self.game.get_tile_at(54,9)]
        self.right_right_secondary_targets = [self.game.get_tile_at(59, 26), self.game.get_tile_at(59,25), self.game.get_tile_at(59,24), self.game.get_tile_at(59,23), self.game.get_tile_at(59,22), self.game.get_tile_at(59,21), self.game.get_tile_at(59,20), self.game.get_tile_at(59,19), self.game.get_tile_at(59,18), self.game.get_tile_at(59,17), self.game.get_tile_at(59,16), self.game.get_tile_at(59,15), self.game.get_tile_at(59,14), self.game.get_tile_at(59,13), self.game.get_tile_at(59,12), self.game.get_tile_at(59,11)]
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

        if self.right:
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
        while(self.num_units < 23 and self.player.gold >= 10):
            if self.worker_spawn.unit == None:
                spawned = self.worker_spawn.spawn_worker()
            else:
                break
            if self.num_units < 4 and spawned: ##inland miners
                if self.right:
                    for j in range(4-self.num_units):
                        self.player.units[-1].move(self.player.units[-1].tile.tile_north)
                else:
                    for j in range(4-self.num_units):
                        self.player.units[-1].move(self.player.units[-1].tile.tile_south)
                self.num_units += 1

            elif self.num_units < 7 and spawned: ##island miners
                if self.right:
                    for j in range(7-self.num_units):
                        self.player.units[-1].move(self.player.units[-1].tile.tile_west)
                else:
                    for j in range(7-self.num_units):
                        self.player.units[-1].move(self.player.units[-1].tile.tile_east)
                self.num_units += 1

            elif self.num_units < 10 and spawned: ##wall side builders
                self.num_units += 1
                if self.right:
                    for j in range(15-self.num_units):
                        self.player.units[-1].move(self.player.units[-1].tile.tile_south)
                else:
                    for j in range(15-self.num_units):
                        self.player.units[-1].move(self.player.units[-1].tile.tile_north)
            elif self.num_units < 20 and spawned: ##fishers
                self.num_units += 1
                if self.right:
                    for j in range(20-self.num_units):
                        self.player.units[-1].move(self.player.units[-1].tile.tile_west)
                else:
                    for j in range(20-self.num_units):
                        self.player.units[-1].move(self.player.units[-1].tile.tile_east)
            elif self.num_units < 23 and spawned: ##river side builders
                self.num_units += 1
                if self.right:
                    if self.num_units == 20:
                        self.player.units[-1].move(self.player.units[-1].tile.tile_west)
                        self.player.units[-1].move(self.player.units[-1].tile._tile_south)
                    elif self.num_units == 21:
                        self.player.units[-1].move(self.player.units[-1].tile.tile_west)
                        self.player.units[-1].move(self.player.units[-1].tile.tile_north)
                    else:
                        self.player.units[-1].move(self.player.units[-1].tile.tile_west)
                else:
                    if self.num_units == 20:
                        self.player.units[-1].move(self.player.units[-1].tile.tile_east)
                        self.player.units[-1].move(self.player.units[-1].tile.tile_north)
                    elif self.num_units == 21:
                        self.player.units[-1].move(self.player.units[-1].tile.tile_east)
                        self.player.units[-1].move(self.player.units[-1].tile.tile_south)
                    else:
                        self.player.units[-1].move(self.player.units[-1].tile.tile_east)


        if self.game.current_turn == self.game.river_phase - 2 or self.game.current_turn == self.game.river_phase - 3:
            i = 0
            while self.player.gold > 0 and i < 3:
                self.worker_spawn.spawn_worker()
                if self.right:
                    for j in range(3-i):
                        self.player.units[-1].move(self.player.units[-1].tile.tile_west)
                    i += 1
                else:
                    for j in range(3-i):
                        self.player.units[-1].move(self.player.units[-1].tile.tile_east)
                    i += 1


        if self.game.current_turn == 3 or self.game.current_turn == 4:
            if self.right:
                for i in self.player.units[7:10]:
                    for j in range(4):
                        i.move(i.tile.tile_east)
                    for j in range(4):
                        i.move(i.tile.tile_north)
            else:
                for i in self.player.units[7:10]:
                    for j in range(4):
                        i.move(i.tile.tile_west)
                    for j in range(4):
                        i.move(i.tile.tile_south)

        if self.game.current_turn == 5 or self.game.current_turn == 6:
            if self.right:
                for i in self.player.units[7:10]:
                    for j in range(4):
                        i.move(i.tile.tile_north)
            else:
                for i in self.player.units[7:10]:
                    for j in range(4):
                        i.move(i.tile.tile_south)

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
                    for tiles in path:
                        closest_worker.move(tiles)
                        if closest_worker.moves == 0:
                            break
                if mine.unit != None:
                    # The unit on the mine (mine.unit) needs
                    # to mine the mine(mine(mine))
                    mine.unit.mine(mine)

            if self.num_units > 18:
                min_index = 18
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
                    river_mine.unit.mine(river_mine)

            '''
            Move fisherman
            '''
            for fishing_spots in self.river_spots:
                if fishing_spots.unit == None:
                    closest_worker = self.closest_worker(fishing_spots, 11, 20)
                    if closest_worker == None:
                        break
                    path = self.find_path(closest_worker.tile, fishing_spots)
                    for tiles in path:
                        closest_worker.move(tiles)
                        if closest_worker.moves == 0:
                            break
                if fishing_spots.unit != None:
                    if fishing_spots.tile_east.is_river:
                        fishing_spots.unit.fish(fishing_spots.tile_east)
                    else:
                        fishing_spots.unit.fish(fishing_spots.tile_west)


            '''
            Move tower builders
            '''
            if len(self.player.units) >= 23:
                counter = 0
                for target in range(len(self.right_left_primary_targets)):
                    counter += 1
                    if not self.right_left_primary_targets[target].is_tower:
                        if target % 4 < 2:
                            self.build_tower(self.right_left_primary_targets[target], "cleansing")
                        else:
                            self.build_tower(self.right_left_primary_targets[target], "aoe")
                        if counter == 3:
                            break
                counter = 0
                for target in range(len(self.right_right_primary_targets)):
                    counter += 1
                    if not self.right_right_primary_targets[target].is_tower:
                        if target % 4 < 2:
                            self.build_tower(self.right_right_primary_targets[target], "cleansing")
                        else:
                            self.build_tower(self.right_right_primary_targets[target], "aoe")
                        if counter == 3:
                            break

                else: ##only build once per unit turn
                    counter = 0
                    for target in range(len(self.left_left_primary_targets)):
                        counter += 1
                        if not self.left_left_primary_targets[target].is_tower:
                            if target % 4 < 2:
                                self.build_tower(self.left_left_primary_targets[target], "cleansing")
                            else:
                                self.build_tower(self.left_left_primary_targets[target], "aoe")
                            if counter == 3:
                                break
                    counter = 0
                    for target in range(len(self.left_right_primary_targets)):
                        counter += 1
                        if not self.left_right_primary_targets[target].is_tower:
                            if target % 4 < 2:
                                self.build_tower(self.left_right_primary_targets[target], "cleansing")
                            else:
                                self.build_tower(self.left_right_primary_targets[target], "aoe")
                            if counter == 3:
                                break

        '''
        Towers protecc and attacc

        for tower in self.player.towers:
            # Gets every tile that the tower could aim at
            radius = tower.tile.get_neighbors()
            radius.append(tower.tile.tile_north.tile_north)
            radius.append(tower.tile.tile_east.tile_east)
            radius.append(tower.tile.tile_south.tile_south)
            radius.append(tower.tile.tile_west.tile_west)

            hit_list = []

            # Getting the hit list and priority
            for tile in radius:
                # If there is a unit on this tile, add to attack list
                if tile.is_path:
                    if tile.unit:
                        if tower.job.title == "cleansing":
                            if tile.unit.job.title == "wraith":
                                priority = tile
                        elif tower.job.title == "aoe":
                            if self.num_zombies > 1:
                                priority = tile
                            elif self.num_ghouls > 1 or self.num_hounds > 1:
                                priority = tile

                        hit_list.append(tile)

            # Time to actually ATTACK!!!
            if priority:
                tower.attack(priority)
            elif len(hit_list) > 0:
                tower.attack(hit_list[0]) # Attacks first thing it saw
        '''


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

    def build_tower(self, tile, title):
        if len(self.player.units):
            if tile.x == 4:
                unit = self.closest_worker(tile, 8, 10)
            elif tile.x == 7:
                unit = self.closest_worker(tile, 21, 23)
            elif tile.x == 55:
                unit = self.closest_worker(tile, 8, 11)
            else:
                unit = self.closest_worker(tile, 21, 23)
            if unit == None:
                return
            ##unit = self.closest_worker(tile, 21, 25)
            path = self.find_path(unit.tile,tile)
            for tiles in path:
                unit.move(tiles)
                if unit.moves == 0:
                    return
            if unit.tile == tile:
                built = False
                if self.towers % 4 < 2 and self.player.gold >= 40 and self.player.mana >= 30 and title == "cleansing":
                    built = unit.build("cleansing")
                    self.cleansers += 1
                elif self.towers % 4 < 4 and self.player.gold >= 40 and self.player.mana >= 30 and title == "aoe":
                    built = unit.build("aoe")
                    self.aoes += 1
                if built:
                    if tile.x == 4:
                        unit.move(unit.tile.tile_west)
                        for i in range(3):
                            unit.move(unit.tile.tile_south)
                        unit.move(unit.tile.tile_east)
                    elif tile.x == 7:
                        unit.move(unit.tile.tile_east)
                        for i in range(3):
                            unit.move(unit.tile.tile_south)
                        unit.move(unit.tile.tile_west)
                    elif tile.x == 55:
                        unit.move(unit.tile.tile_west)
                        for i in range(3):
                            unit.move(unit.tile.tile_north)
                        unit.move(unit.tile.tile_east)
                    else:
                        unit.move(unit.tile.tile_east)
                        for i in range(3):
                            unit.move(unit.tile.tile_north)
                        unit.move(unit.tile.tile_west)
                return
        else:
            return

    def closest_worker(self, tile, low, high):
        best_distance = 9999
        best_worker = None
        worker_count = 0
        for unit in self.game.units:
            if unit.job.title == "worker" and unit.owner == self.player:
                worker_count += 1
                if unit.tile == tile:
                    return unit
                if worker_count >= low and worker_count <= high and not unit.acted and unit.moves > 0:
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
