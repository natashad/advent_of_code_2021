#!/usr/bin/ruby
# frozen_string_literal: true

require 'set'

class Day19
  def initialize
    file_data = File.read('day19/input.txt').split("\n")
    @scanners = []
    ind = -1
    file_data.each do |beacon|
      beacon = beacon.strip
      next unless beacon.length.positive?

      if beacon.start_with?('--- scanner')
        ind += 1
        @scanners[ind] = []
        next
      end
      @scanners[ind].append(beacon.split(',').map(&:to_i))
    end
  end

  def array_sub(a, b)
    # [x1, y1, z1] - [x2, y2, z2] = [x1-x2, y1-y2, z1-z2]
    [a, b].transpose.map { |x| x[0] - x[1] }
  end

  def array_sum(a, b)
    [a, b].transpose.map(&:sum)
  end

  def rotate_on_x(beacon)
    # [x, z, -y]
    [beacon[0], beacon[2], -beacon[1]]
  end

  def rotate_on_y(beacon)
    # [-z, y, x]
    [-beacon[2], beacon[1], beacon[0]]
  end

  def rotate_on_z(beacon)
    # [y -x z]
    [beacon[1], -beacon[0], beacon[2]]
  end

  def generate_orientations_per_beacon(beacon)
    results = [beacon]

    4.times do
      b1 = results[-1]
      results.append(rotate_on_x(b1))
      4.times do
        b2 = results[-1]
        results.append(rotate_on_y(b2))
        4.times do
          b3 = results[-1]
          results.append(rotate_on_z(b3))
        end
      end
    end

    results = Set.new(results).to_a
  end

  def generate_orientations(beacons)
    alts = Array.new(48).fill([])
    beacons.each do |b|
      generate_orientations_per_beacon(b).each_with_index do |b1, i|
        alts[i] += [b1]
      end
    end
    alts
  end

  def find_aligned_pairs(scanner_a, scanner_b, transformer)
    differences = {}

    scanner_a.each_with_index do |a, ind_a|
      scanner_b.each_with_index do |b, ind_b|
        diff = array_sub(a, b)
        differences[diff] = (differences[diff] || []).append([ind_a, ind_b])
      end
    end

    differences.each do |difference, occurrences|
      return array_sum(transformer, difference) if occurrences.length >= 12
    end

    nil
  end

  def find_beacon_offsets(root, potential_matches)
    to_be_matched = [[@scanners[root], [0, 0, 0]]]
    offsets = [[@scanners[root], [0, 0, 0]]]

    while to_be_matched.length.positive?
      new_to_be_matched = []
      to_be_matched.each_with_index do |base_scanner, _base_scanner_idx|
        matched = []
        potential_matches.each do |potential_match|
          orientations = generate_orientations(@scanners[potential_match])
          orientations.each do |orientation|
            alignment = find_aligned_pairs(base_scanner[0], orientation, base_scanner[1])
            next unless alignment

            new_to_be_matched.append([orientation, alignment])
            offsets.append([orientation, alignment])
            matched.append(potential_match)
            break
          end
        end
        matched.each do |match|
          potential_matches.delete(match)
        end
      end
      to_be_matched = new_to_be_matched
    end

    offsets
  end

  def manhatten_distance(a, b)
    array_sub(a, b).map(&:abs).reduce(&:+)
  end

  def solution_1
    offsets = find_beacon_offsets(0, (1..@scanners.length - 1).to_a)

    beacons = Set.new

    offsets.each do |offset|
      scanner = offset[0]
      transform = offset[1]
      transformed_to_root = scanner.map { |b| array_sum(b, transform) }
      beacons.merge(transformed_to_root)
    end

    beacons.length
  end

  def solution_2
    offsets = find_beacon_offsets(0, (1..@scanners.length - 1).to_a)
    offsets = offsets.map { |offset| offset[1] }

    max_manhatten_distance = 0
    (0..offsets.length - 1).each do |i|
      (i..offsets.length - 1).each do |j|
        max_manhatten_distance = [max_manhatten_distance, manhatten_distance(offsets[i], offsets[j])].max
      end
    end

    max_manhatten_distance
  end
end

puts(Day19.new.solution_1)
puts(Day19.new.solution_2)
