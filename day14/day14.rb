#!/usr/bin/ruby
# frozen_string_literal: true

require 'set'

class Day14

  STEPS_1 = 10
  STEPS_2 = 40

  def initialize
    file_data = File.read('day14/input.txt').split("\n")
    @polymer = file_data[0]

    @rules = {}
    file_data[2..].each do |rule|
      @rules[rule[0..1]] = rule[-1]
    end
  end

  def polymer_insert(polymer)
      polymer_split = polymer.split("")
      new_inserts = []
      polymer_split.each_with_index do |_, ind|
        break if ind + 1 == polymer_split.length
        new_inserts.append(@rules["#{polymer_split[ind]}#{polymer_split[ind+1]}"])
      end
      return polymer_split.zip(new_inserts).flatten.join('')
  end

  def solution_1
    (1..STEPS_1).to_a.each do
      @polymer = polymer_insert(@polymer)
    end

    char_map = {}
    @polymer.split('').each do |el|
      char_map[el] = (char_map[el] || 0) + 1
    end
    max_char = char_map.values().max()
    min_char = char_map.values().min()

    return max_char - min_char
  end

  def polymer_insert_v2(polymer_pairs)
    new_polymer_pairs = {}

    polymer_pairs.keys().each do |pair|
      middle_el = @rules[pair]
      left_pair = "#{pair[0]}#{middle_el}"
      right_pair = "#{middle_el}#{pair[1]}"

      new_polymer_pairs[left_pair] = (new_polymer_pairs[left_pair] || 0) + polymer_pairs[pair]
      new_polymer_pairs[right_pair] = (new_polymer_pairs[right_pair] || 0) + polymer_pairs[pair]
      @char_count[middle_el] = (@char_count[middle_el] || 0) + polymer_pairs[pair]
    end

    return new_polymer_pairs
  end

  def solution_2
    polymer_pairs = {}
    @char_count = {}

    @polymer.split('').each_with_index do |key, ind|
      @char_count[key] = (@char_count[key]||0)+1
      break if ind + 1 == @polymer.length
      pair = "#{@polymer[ind]}#{@polymer[ind+1]}"
      polymer_pairs[pair] = (polymer_pairs[pair] || 0) + 1
    end

    STEPS_2.times do
      polymer_pairs = polymer_insert_v2(polymer_pairs)
    end

    max_char = @char_count.values().max()
    min_char = @char_count.values().min()

    return max_char - min_char
  end
end

puts(Day14.new.solution_1)
puts(Day14.new.solution_2)

