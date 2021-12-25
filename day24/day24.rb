#!/usr/bin/ruby
# frozen_string_literal: true

class Day24
  ALU_POSITIONS = {
    'w': 0,
    'x': 1,
    'y': 2,
    'z': 3
  }.freeze

  def initialize
    @file_data = File.read('day24/input.txt').split("\n")

    @instructions = []

    active = []
    @file_data.each do |inst|
      operator, a, b = inst.split(' ')
      if operator == 'inp'
        @instructions << active.clone unless active.empty?
        active = []
      end
      active << [operator, a, b]
    end
    @instructions << active
  end

  def process_alu(instructions, inputs, alu_init = [0, 0, 0, 0])
    alu = alu_init
    inputs_counter = 0

    instructions.each do |instruction|
      inst, a, b = instruction

      a = ALU_POSITIONS[a.to_sym]
      if b
        b = alu[ALU_POSITIONS[b.to_sym]] if ALU_POSITIONS.keys.include?(b.to_sym)
        b = b.to_i
      end

      case inst
      when 'inp'
        alu[a] = inputs[inputs_counter]
        inputs_counter += 1
      when 'mul'
        alu[a] = alu[a] * b
      when 'add'
        alu[a] = alu[a] + b
      when 'div'
        puts 'ERROR ON DIV' if b.zero?
        alu[a] = alu[a] / b
      when 'mod'
        puts "ERROR ON MOD: a=#{alu[a]}, b=#{b}" if (alu[a]).negative? || b <= 0
        alu[a] = alu[a] % b
      when 'eql'
        alu[a] = alu[a] == b ? 1 : 0
      else
        puts 'INVALID OPERATION'
      end
    end

    alu
  end

  # Formula arrived at from studying input program
  # d = c - 7
  # f = e + 1
  # i = h + 5
  # k = j
  # l = g + 8
  # m = b + 7
  # n = a - 8

  def solution1
    instructions = @instructions.flatten(1)

    # Achieved manually from getting the max numbers after applying the above constraints
    # This will just verify that the z = 0 at the end
    model_no = 92_928_914_999_991
    input = model_no.to_s.split('').map(&:to_i)
    result = process_alu(instructions, input)
    puts result.to_s
    (result[3]).zero? ? model_no : 'FAILED'
  end

  def solution2
    instructions = @instructions.flatten(1)
    # Achieved manually from getting the min numbers after applying the above constraints
    # This will just verify that the z = 0 at the end
    model_no = 91_811_211_611_981
    input = model_no.to_s.split('').map(&:to_i)
    result = process_alu(instructions, input)
    puts result.to_s
    (result[3]).zero? ? model_no : 'FAILED'
  end
end

puts(Day24.new.solution1)
puts(Day24.new.solution2)
