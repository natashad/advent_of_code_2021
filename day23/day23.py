#!/usr/bin/ruby
# frozen_string_literal: true
import heapq

class Field:
    def __init__(self, field):
      room_assignments = {
        'A': 0,
        'B': 1,
        'C': 2,
        'D': 3,
        '.': None,
      }
      self.room_counter_assignments = ['A', 'B', 'C', 'D']

      self.score_multiplier = [1, 10, 100, 1000]

      hallway = field[0]
      self.hallway = list(map(lambda spot: None if spot=='.' else room_assignments[spot], list(hallway)))
      first_room_idx = 2
      self.rooms = []
      self.room_entries = []
      for room in range(0,4):
        room_idx = first_room_idx + (room * 2)
        self.rooms.append([])
        for row in field[1:]:
          self.rooms[-1].append(room_assignments[row[room_idx]])
        self.room_entries.append(room_idx)


    def create_new_field(self, hallway, rooms):
      output_field = self.output_as_array(hallway, rooms)
      return Field(output_field)

    def output_as_array(self, hallway, rooms):
      output_field = []
      hallway_array = []
      for spot in hallway:
        if spot != None:
          hallway_array.append(self.room_counter_assignments[spot])
        else:
          hallway_array.append('.')

      output_field.append(hallway_array)

      length_of_room = len(rooms[0])

      for room_internal_pos in range(0, length_of_room):
        room_row = ["#", "#"]
        for room in rooms:
          if room[room_internal_pos] != None:
            room_row.append(self.room_counter_assignments[room[room_internal_pos]])
          else:
            room_row.append('.')
          room_row.append('#')
        output_field.append(room_row + ["#"])
      return output_field

    def to_array(self):
      return self.output_as_array(self.hallway, self.rooms)

    def __str__(self):
      arr = self.to_array()
      return "".join(["".join(item) for item in arr])

    def is_complete(self):
      complete = True
      for idx, _ in enumerate(self.rooms):
        complete = complete and self.is_room_complete(idx)
      return complete

    def is_room_complete(self, room_idx):
      room = self.rooms[room_idx]
      for amphi in room:
        if amphi != room_idx:
          return False
      return True

    def get_valid_moves(self):
      final_valid_moves = []

      amphis = self.get_amphis()
      for amphi_loc in amphis:
        amphi_type = None
        valid_moves = self.get_valid_moves_per_amphi(amphi_loc)
        for move in valid_moves:
          new_rooms = []
          new_hallway = self.hallway.copy()
          for room in self.rooms:
            new_rooms.append(room.copy())

          if amphi_loc[0] == 'r':
            new_rooms[amphi_loc[1]][amphi_loc[2]] = None
            amphi_type = self.rooms[amphi_loc[1]][amphi_loc[2]]
          elif amphi_loc[0] == 'h':
            new_hallway[amphi_loc[1]] = None
            amphi_type = self.hallway[amphi_loc[1]]

          final_location = move[0]
          if final_location[0] == 'r':
            new_rooms[final_location[1]][final_location[2]] = amphi_type
          elif final_location[0] == 'h':
            new_hallway[final_location[1]] = amphi_type

          final_valid_moves.append([self.create_new_field(new_hallway, new_rooms), move[1]])
      return final_valid_moves

    def get_valid_moves_per_amphi(self, amphi_loc):
      l, outer_loc, inner_loc = amphi_loc
      if l == 'h':
        amphi_type = self.hallway[outer_loc]
        best_available_spot_in_room = self.best_available_spot_in_room(amphi_type)
        if best_available_spot_in_room == None:
          return []

        room_entry_hallway_idx = self.get_hallway_roomentry_idx(best_available_spot_in_room[0])
        direction = -1 if room_entry_hallway_idx < outer_loc else 1
        current = outer_loc + direction
        steps = 1
        while current != room_entry_hallway_idx:
          if self.hallway[current] != None:
            return []
          steps += 1
          current += direction
        steps += (1 + best_available_spot_in_room[1])
        final_spot = ['r'] + best_available_spot_in_room
        return [[final_spot, steps*self.score_multiplier[amphi_type]]]

      elif l == 'r':
        valid_moves = []
        # Check if all are home if so move on
        amphi_type = self.rooms[outer_loc][inner_loc]
        if self.is_room_complete(outer_loc):
          return []
        # Check if can leave room (not blocked in)
        for i in range(0, inner_loc):
          if self.rooms[outer_loc][i] != None: return []
        # Walk to hallway and walk both directions until you hit a roadblock
        current_room_entry = self.get_hallway_roomentry_idx(outer_loc)
        steps = inner_loc+1 #steps it takes to get to the hallway
        best_available_spot_in_room = self.best_available_spot_in_room(amphi_type)
        if best_available_spot_in_room and outer_loc == best_available_spot_in_room[0] and inner_loc > best_available_spot_in_room[1]:
          # Already in the best spot
          return []

        hallway_entry_to_room = self.get_hallway_roomentry_idx(amphi_type)

        current = current_room_entry
        current_steps = steps
        while current >= 0:
          if self.hallway[current] != None:
            break
          if current not in self.room_entries:
            valid_moves.append([['h', current, None], current_steps*self.score_multiplier[amphi_type]])
          if best_available_spot_in_room and current == hallway_entry_to_room:
            final_spot = ['r'] + best_available_spot_in_room
            valid_moves.append([final_spot, (best_available_spot_in_room[1] + 1 + current_steps)*self.score_multiplier[amphi_type]])
          current_steps += 1
          current -= 1

        current = current_room_entry
        current_steps = steps
        while current < len(self.hallway):
          if self.hallway[current] != None:
            break
          if current not in self.room_entries:
            valid_moves.append([['h', current, None], current_steps*self.score_multiplier[amphi_type]])
          if best_available_spot_in_room and current == hallway_entry_to_room:
            final_spot = ['r'] + best_available_spot_in_room
            valid_moves.append([final_spot, (best_available_spot_in_room[1] + 1 + current_steps)*self.score_multiplier[amphi_type]])
          current_steps += 1
          current += 1

        return valid_moves


    def get_amphis(self):
      amphi_locations = []
      for idx, spot in enumerate(self.hallway):
        if spot != None:
          amphi_locations.append(["h", idx, None])

      for idx, room in enumerate(self.rooms):
        for room_pos, spot in enumerate(room):
          if spot != None:
            amphi_locations.append(["r", idx, room_pos])

      return amphi_locations


    def get_hallway_roomentry_idx(self, room_idx):
      # Gets the index of the hallway spot outside the room
      return (room_idx)*2 + 2

    def best_available_spot_in_room(self, amphi_type):
      if self.is_room_complete(amphi_type): return None
      room = self.rooms[amphi_type]

      best_spot = None
      for idx, spot in enumerate(room):
        if spot == None:
          best_spot = idx
        elif spot != amphi_type:
          return None

      return [amphi_type, best_spot]


class Day23:

  def __init__(self):
    with open('day23/input.txt') as f:
      self.file_data = f.readlines()
    self.file_data = list(map(lambda line: line.strip()[1:-1], self.file_data))
    self.lowest_cost = float('inf')

  def play_djikstra(self, initial_field):
    costs_map = {str(initial_field): 0}
    priority_queue = [(0,initial_field.to_array())]
    heapq.heapify(priority_queue)
    ended = False
    end_field_string = ''

    while len(priority_queue) > 0:
      current_cost, current_field = heapq.heappop(priority_queue)
      current_field = Field(current_field)
      neighbours = current_field.get_valid_moves()

      for neighbour, cost in neighbours:
        ended = neighbour.is_complete()
        if ended:
          end_field_string = str(neighbour)

        existing_neighbour_cost = costs_map.get(str(neighbour))
        new_cost = current_cost + cost

        if not existing_neighbour_cost or new_cost < existing_neighbour_cost:
          costs_map[str(neighbour)] = new_cost
          if existing_neighbour_cost:
            if (existing_neighbour_cost, neighbour.to_array()) in priority_queue:
              priority_queue.remove((existing_neighbour_cost, neighbour.to_array()))

          heapq.heappush(priority_queue, (new_cost, neighbour.to_array()))

    return costs_map.get(end_field_string, "WHOOPS")


  def solution1(self):
    field = self.file_data[1:-1]
    field = Field(field)
    return self.play_djikstra(field)

  def solution2(self):
    field = self.file_data[1:-1]
    field.insert(2, '##D#C#B#A##')
    field.insert(3, '##D#B#A#C##')
    field = Field(field)
    return self.play_djikstra(field)

print(Day23().solution1())
print(Day23().solution2())
