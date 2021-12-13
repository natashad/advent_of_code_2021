#!/usr/bin/ruby
# frozen_string_literal: true
require 'json'
require 'set'

class Day13

  def initialize
    file_data = File.read('day13/input.txt').split("\n")
    @dots = Set.new
    @folds = []
    file_data.each do |line|
      next if line.strip()==""
      if line.start_with?('fold')
        @folds.append(line["fold along ".length..])
      else
        dot = JSON.parse("[#{line}]")
        @dots.add([dot[1], dot[0]])
      end
    end
  end

  def fold_along_y(y)
    new_dots = Set.new
    @dots.each do |dot|
      if dot[0] < y
        new_dots.add(dot)
      else
        new_dots.add([y - (dot[0] - y), dot[1]])
      end
    end
    return new_dots
  end

  def fold_along_x(x)
    new_dots = Set.new
    @dots.each do |dot|
      if dot[1] < x
        new_dots.add(dot)
      else
        new_dots.add([dot[0], x - (dot[1] - x)])
      end
    end
    return new_dots
  end

  def solution_1
    fold = @folds[0]
    if fold.start_with?('x=')
      return (fold_along_x(fold["x=".length..].to_i)).length
    else
      return (fold_along_y(fold["y=".length..].to_i)).length
    end
  end

  def solution_2
    @folds.each do |fold|
      if fold.start_with?('x=')
        @dots = fold_along_x(fold["x=".length..].to_i)
      else
        @dots = fold_along_y(fold["y=".length..].to_i)
      end
    end


    max_x = @dots.map {|dot| dot[0]}.max
    max_y = @dots.map {|dot| dot[1]}.max

    output = []
    (0 .. max_x + 1).to_a.each do |row|
      output.append(Array.new(max_y + 1).fill(' '))
    end

    @dots.each do |dot|
      output[dot[0]][dot[1]] = "x"
    end

    output.each do |line|
      puts(line.join)
    end

    return nil
  end
end

puts(Day13.new.solution_1)
puts(Day13.new.solution_2)

# SOLUTION 2 OUTPUT:
=begin
xxxx  xx  xxxx x  x x    x  x xxxx xxxx
x    x  x x    x  x x    x  x    x x
xxx  x    xxx  xxxx x    xxxx   x  xxx
x    x    x    x  x x    x  x  x   x
x    x  x x    x  x x    x  x x    x
xxxx  xx  x    x  x xxxx x  x xxxx x
=end
