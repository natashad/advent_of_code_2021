#!/usr/bin/ruby
# frozen_string_literal: true

class Day16
  def initialize
    file_data = File.read('day16/input.txt')
    @binary_data = file_data.split('').map { |c| hex_char_to_bin(c) }.join
  end

  def hex_char_to_bin(hex)
    hex.to_i(16).to_s(2).rjust(4, '0')
  end

  def bin_to_i(bin)
    bin.join.to_i(2)
  end

  def parse_packet(packet, version_sum)
    version = bin_to_i(packet.shift(3))
    version_sum += version
    type = bin_to_i(packet.shift(3))

    if type == 4
      val = []
      val.append(packet.shift(4)) while packet.shift == '1'
      val.append(packet.shift(4))
      [bin_to_i(val), packet, version_sum]
    else

      if packet.shift == '0'
        total_length = bin_to_i(packet.shift(15))
        sub_packets = packet.shift(total_length)

        result = []
        until sub_packets.empty?
          sub_result, sub_packets, version_sum = parse_packet(sub_packets, version_sum)
          result.append(sub_result)
        end
      else
        total_count = bin_to_i(packet.shift(11))

        result = []
        total_count.times do
          sub_result, packet, version_sum = parse_packet(packet, version_sum)
          result.append(sub_result)
        end
      end

      case type
      when 0
        [result.sum, packet, version_sum]
      when 1
        [result.reduce(&:*), packet, version_sum]
      when 2
        [result.min, packet, version_sum]
      when 3
        [result.max, packet, version_sum]
      when 5
        [result.reduce(&:>) ? 1 : 0, packet, version_sum]
      when 6
        [result.reduce(&:<) ? 1 : 0, packet, version_sum]
      when 7
        [result.reduce(&:==) ? 1 : 0, packet, version_sum]
      end

    end
  end

  def solution_1
    _, _, version_sum = parse_packet(@binary_data.split(''), 0)
    version_sum
  end

  def solution_2
    result, = parse_packet(@binary_data.split(''), 0)
    result
  end
end

puts(Day16.new.solution_1)
puts(Day16.new.solution_2)
