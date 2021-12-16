#!/usr/bin/ruby
# frozen_string_literal: true

class Day15
  def initialize
    file_data = File.read('day15/input.txt').split("\n")
    @graph = file_data.map { |row| row.split('').map(&:to_i) }
    @priority_queue = []
    @queue_map = {}
  end

  def get_neighbours(point)
    x = point[0]
    y = point[1]
    neighbours = []
    neighbours.append([x - 1, y]) if x != 0
    neighbours.append([x + 1, y]) if x != @graph[0].length - 1
    neighbours.append([x, y - 1]) if y != 0
    neighbours.append([x, y + 1]) if y != @graph.length - 1

    neighbours
  end

  def add_to_queue(point, weight, path)
    @priority_queue.delete(point) if @queue_map.include?(point)

    @queue_map[point] = {
      weight: weight,
      path: path
    }

    index_to_add_at = @priority_queue.bsearch_index { |a| @queue_map[a][:weight] >= weight } || -1
    @priority_queue.insert(index_to_add_at, point)
  end

  def get_from_queue(point)
    @queue_map[point]
  end

  def djikstra_shortest_path
    starting = [0, 0]
    ending = [@graph.length - 1, @graph.length - 1]

    add_to_queue(starting, 0, nil)

    while @priority_queue.length.positive?
      current = @priority_queue.shift
      current_weight = get_from_queue(current)[:weight]
      neighbours = get_neighbours(current)

      neighbours.each do |neighbour|
        existing_neighbour = get_from_queue(neighbour)
        if !existing_neighbour || (@graph[neighbour[0]][neighbour[1]] + current_weight) < existing_neighbour[:weight]
          add_to_queue(neighbour, @graph[neighbour[0]][neighbour[1]] + current_weight, current)
        end
      end
    end

    get_from_queue(ending)
  end

  def solution_1
    path_to_ending = djikstra_shortest_path
    puts(path_to_ending[:weight])
  end

  def solution_2
    # Clone below
    tile = @graph.clone
    4.times do
      tile = tile.map do |row|
        row.map do |el|
          el == 9 ? 1 : el + 1
        end
      end
      @graph += tile
    end

    # clone to the right
    tile = @graph.clone
    4.times do
      tile = tile.map do |row|
        row.map do |el|
          el == 9 ? 1 : el + 1
        end
      end
      @graph = @graph.zip(tile).map(&:flatten)
    end

    path_to_ending = djikstra_shortest_path
    puts(path_to_ending[:weight])
  end
end

puts(Day15.new.solution_1)
puts(Day15.new.solution_2)
