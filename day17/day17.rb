#!/usr/bin/ruby
# frozen_string_literal: true

# TERRIBLE BRUTE FORCED :D
class Day17
  IN_RANGE = 0
  ON_TARGET = 1
  OUT_OF_RANGE = -1

  def initialize
    file_data = File.read('day17/input.txt')
    input = file_data.split(',')
    input = input.map { |i| i.split('=') }.flatten

    @min_x = input[1].split('..')[0].to_i
    @max_x = input[1].split('..')[1].to_i
    @min_y = input[3].split('..')[0].to_i
    @max_y = input[3].split('..')[1].to_i
    @position = [0, 0]
  end

  def relative_to_target(position)
    x = position[0]
    y = position[1]
    return ON_TARGET if x >= @min_x && x <= @max_x && y <= @max_y && y >= @min_y
    return OUT_OF_RANGE if y < @min_y || x > @max_x

    IN_RANGE
  end

  def do_step(velocity)
    @position = [@position[0] + velocity[0], @position[1] + velocity[1]]
    if (velocity[0]).positive?
      velocity = [velocity[0] - 1, velocity[1]]
    elsif (velocity[0]).negative?
      velocity = [velocity[0] + 1, velocity[1]]
    end

    [velocity[0], velocity[1] - 1]
  end

  def solution_1
    max_y = -1
    reset_position = @position

    (-500..500).each do |vel_x|
      (-500..500).each do |vel_y|
        @position = reset_position
        velocity = [vel_x, vel_y]
        local_max_y = -1
        while relative_to_target(@position) == IN_RANGE
          velocity = do_step(velocity)
          local_max_y = [local_max_y, @position[1]].max
        end
        max_y = [local_max_y, max_y].max if relative_to_target(@position) == ON_TARGET
      end
    end

    max_y
  end

  def solution_2
    reset_position = @position
    valid_starts = []

    (-500..500).each do |vel_x|
      (-500..500).each do |vel_y|
        @position = reset_position
        velocity = [vel_x, vel_y]
        local_max_y = -1
        velocity = do_step(velocity) while relative_to_target(@position) == IN_RANGE
        valid_starts << [vel_x, vel_y] if relative_to_target(@position) == ON_TARGET
      end
    end

    valid_starts.count
  end
end

puts(Day17.new.solution_1)
puts(Day17.new.solution_2)
