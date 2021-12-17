#!/usr/bin/ruby
# frozen_string_literal: true

require 'set'

class Day12
  START_KEY = 'start'
  END_KEY = 'end'

  def initialize
    file_data = File.read('day12/input.txt').split
    @small_caves = Set.new
    @path_map = {}
    file_data.each do |path|
      from = path.split('-')[0]
      to = path.split('-')[1]
      @small_caves.add(from) if from == from.downcase
      @small_caves.add(to) if to == to.downcase
      @path_map[from] = (@path_map[from] || []).append(to)
      @path_map[to] = (@path_map[to] || []).append(from)
    end
  end

  def find_paths_to_exit
    valid_paths = @path_map[START_KEY].map { |cave| [START_KEY, cave] }
    finished_paths = []

    while valid_paths.length.positive?
      new_valid_paths = []
      valid_paths.each do |path|
        next_caves = @path_map[path[-1]] || []
        next_caves.each do |cave|
          next if yield(cave, path)

          if cave == END_KEY
            finished_paths.append(path + [cave])
          else
            new_valid_paths.append(path + [cave])
          end
        end
      end
      valid_paths = new_valid_paths
    end

    finished_paths
  end

  def solution_1
    paths_to_exit = find_paths_to_exit do |cave, path|
      @small_caves.include?(cave) && path.include?(cave)
    end

    paths_to_exit.length
  end

  def solution_2
    paths_to_exit = find_paths_to_exit do |cave, path|
      small_caves_on_path = path.filter { |p| @small_caves.include?(p) }
      duplicate_small_cave_exists = small_caves_on_path.length != Set.new(small_caves_on_path).length

      cave == START_KEY ||
        (duplicate_small_cave_exists && @small_caves.include?(cave) && path.include?(cave))
    end

    paths_to_exit.length
  end
end

puts(Day12.new.solution_1)
puts(Day12.new.solution_2)
