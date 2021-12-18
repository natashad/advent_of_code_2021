#!/usr/bin/ruby
# frozen_string_literal: true
require 'json'

class Day18

  PAIR_TYPE = [].class
  REGULAR_TYPE = 1.class

  class Node
    attr_accessor :value, :left, :right
    def initialize(value=nil)
      @value = value
      @left = nil
      @right = nil
    end

    def to_s
      return value.to_s if value
      "[#{left.to_s}, #{right.to_s}]"
    end

    def is_leaf?
      value != nil
    end

    def to_a
      return value if value
      return [left.to_a, right.to_a]
    end
  end

  def initialize
    file_data = File.read('day18/input.txt')
    @numbers = file_data.split("\n").map { |x| build_tree(JSON.parse(x)) }
  end

  def build_tree(tree)
    node = Node.new

    if is_pair(tree)
      node.left = build_tree(tree[0])
      node.right = build_tree(tree[1])
    else
      node.value = tree
    end

    node
  end

  def is_pair(a)
    a.class == PAIR_TYPE
  end

  def add_numbers(a, b)
    root = Node.new
    root.left = a
    root.right = b
    reduce(root)
    root
  end

  def reduce(tree)
    no_more = false
    until no_more do
      exploded = explode(tree)
      if !exploded
        split_done = split(tree)
      end
      no_more = !exploded && !split_done
    end
  end

  def find_explosion(tree, depth)
    return if !tree
    if depth == 4 && !tree.is_leaf? && !@found
      @found = tree
      return
    end

    @closest_pre_number = tree if tree.is_leaf? && !@found
    @closest_post_number = tree if tree.is_leaf? && @found && !@closest_post_number

    find_explosion(tree.left, depth+1) if tree.left
    find_explosion(tree.right, depth+1) if tree.right
  end

  def explode(tree)
    @found, @closest_post_number, @closest_pre_number = nil
    find_explosion(tree, 0)

    return unless @found

    @closest_pre_number.value = @closest_pre_number.value + @found.left.value if @closest_pre_number
    @closest_post_number.value = @closest_post_number.value + @found.right.value if @closest_post_number
    @found.left = nil
    @found.right = nil
    @found.value = 0
    return true
  end

  def find_split(tree)
    return if !tree
    return tree if tree.is_leaf? && tree.value >= 10

    return find_split(tree.left) || find_split(tree.right)
  end

  def split(tree)
    split = find_split(tree)
    return unless split

    split.left = Node.new((split.value/2.0).floor)
    split.right = Node.new((split.value/2.0).round)
    split.value = nil
    return true
  end

  def magnitude(tree)
    return tree.value if tree.is_leaf?

    return magnitude(tree.left)*3 + magnitude(tree.right)*2
  end

  def solution_1
    result = @numbers[1..].reduce(@numbers[0]) { |sum, val| add_numbers(sum, val) }
    magnitude(result)
  end

  def solution_2
    max_magnitude = 0
    for i in (0..@numbers.length-1)
      for j in (0..@numbers.length-1)
        next if i == j

        a = build_tree(@numbers[i].to_a)
        b = build_tree(@numbers[j].to_a)

        mag = magnitude(add_numbers(a, b))

        max_magnitude = [mag, max_magnitude].max
      end
    end
    max_magnitude
  end
end

puts(Day18.new.solution_1)
puts(Day18.new.solution_2)
