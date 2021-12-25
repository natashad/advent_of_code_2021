#!/usr/bin/ruby
# frozen_string_literal: true

class Day25
  def initialize
    @file_data = File.read('day25/input.txt').split("\n")
    sea_state = @file_data.map { |line| line.split('') }
    @sea_map = {}
    @width = sea_state[0].length
    @height = sea_state.length
    (0..@height - 1).each do |row|
      (0..@width - 1).each do |col|
        val = sea_state[row][col]
        @sea_map[[row, col]] = val if val != '.'
      end
    end
  end

  def solution1
    movement = true
    step = 0

    while movement
      movement = false

      updated_sea_map = @sea_map.clone

      @sea_map.each do |key, val|
        next unless val == '>'

        row, col = key
        next_col_idx = (col + 1) % @width

        next if @sea_map.include?([row, next_col_idx])

        movement = true
        updated_sea_map.delete(key)
        updated_sea_map[[row, next_col_idx]] = '>'
      end

      @sea_map = updated_sea_map.clone
      updated_sea_map.each do |key, val|
        next unless val == 'v'

        row, col = key
        next_row_idx = (row + 1) % @height

        next if updated_sea_map.include?([next_row_idx, col])

        movement = true
        @sea_map.delete(key)
        @sea_map[[next_row_idx, col]] = 'v'
      end

      step += 1
    end

    step
  end
end

puts(Day25.new.solution1)
