#!/usr/bin/ruby
# frozen_string_literal: true

class Day20
  def initialize(reps)
    file_data = File.read('day20/input.txt').split("\n")
    @algorithm = file_data.shift
    file_data.shift
    @image = file_data.map { |x| x.split('') }
    @image_map = {}
    @reps = reps
    start_at = @reps + 1
    @image.each_with_index do |row, row_index|
      row.each_with_index do |val, col_index|
        @image_map[[row_index + start_at, col_index + start_at]] = 1 if val == '#'
      end
    end
  end

  def max_row_and_col(img)
    img.keys.reduce([0, 0]) { |acc, curr| [[curr[0], acc[0]].max, [curr[1], acc[1]].max] }
  end

  def get_pixel_binary_val(row, col, img, offboard_value, max_x, max_y)
    offsets =
      [[-1, -1], [-1, 0], [-1, 1],
       [0, -1], [0, 0], [0, 1],
       [1, -1], [1, 0], [1, 1]]

    return offboard_value if row.zero? || col.zero? || row == max_x || col == max_y

    bin = offsets.map do |offset|
      x = row + offset[0]
      y = col + offset[1]

      img[[x, y]] || 0
    end
    bin.join('').to_i(2)
  end

  def solution
    og_image = @image_map.clone

    max_row, max_col = max_row_and_col(og_image)
    max_row += @reps + 1
    max_col += @reps + 1

    @reps.times do |_round|
      new_image = {}
      offboard_value = og_image[[0, 0]] == 1 ? @algorithm.length - 1 : 0

      (0..max_row).each do |row|
        (0..max_row).each do |col|
          algo_index = get_pixel_binary_val(row, col, og_image, offboard_value, max_row, max_col)
          new_image[[row, col]] = 1 if @algorithm[algo_index] == '#'
        end
      end
      og_image = new_image.clone
    end

    og_image.keys.length
  end

  # DEBUG
  def draw_image(img)
    max_row, max_col = max_row_and_col(img)

    (0..max_row).each do |row|
      row_out = []
      (0..max_col).each do |col|
        output = img[[row, col]] == 1 ? '#' : '.'
        row_out << output
      end
      puts(row_out.join(''))
    end
  end
end

puts(Day20.new(2).solution)
puts(Day20.new(50).solution)
