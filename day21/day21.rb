#!/usr/bin/ruby
# frozen_string_literal: true

class Day21
  DICE_WRAP = 100
  BOARD_WRAP = 10
  WINNING_SCORE_1 = 1000
  P1 = 0
  P2 = 1

  def calculate_position(position, to_add)
    new_pos = (position + to_add) % BOARD_WRAP
    new_pos.zero? ? BOARD_WRAP : new_pos
  end

  def initialize
    file_data = File.read('day21/input.txt').split("\n")
    player1 = file_data.shift.split(': ')[1].to_i
    player2 = file_data.shift.split(': ')[1].to_i
    @positions = [player1, player2]
  end

  def solution1
    @dice_counter = 0
    @total_dice = 0
    @score = [0, 0]

    def next_dice
      @dice_counter = (@dice_counter + 1) % DICE_WRAP
      @dice_counter == DICE_WRAP if @dice_counter.zero?
      @total_dice += 1
      @dice_counter
    end

    def roll_3
      next_dice + next_dice + next_dice
    end

    def advance_player(player, to_add)
      @positions[player] = calculate_position(@positions[player], to_add)
      @score[player] = @score[player] + @positions[player]
    end

    def take_turn(player)
      dice_roll = roll_3
      advance_player(player, dice_roll)
    end

    def final_score
      @score.min * @total_dice
    end

    turn = 0
    while @score.max < WINNING_SCORE_1
      take_turn(turn.zero? ? P1 : P2)
      turn = (turn + 1) % 2
    end

    final_score
  end

  def solution2
    dice_rolls = {}
    [1, 2, 3].each do |roll1|
      [1, 2, 3].each do |roll2|
        [1, 2, 3].each do |roll3|
          total = roll1 + roll2 + roll3
          dice_rolls[total] = (dice_rolls[total] || 0) + 1
        end
      end
    end

    game_states = { [@positions[P1], @positions[P2], 0, 0] => 1 }
    player = P1

    loop do
      unwon_games = game_states.filter { |key, val| [key[2], key[3]].max < 21 && val.positive? }

      unwon_games.each_key do |game|
        number_of_games_in_pos = unwon_games[game]
        dice_rolls.each do |roll, times|
          p1_pos, p2_pos, p1_score, p2_score = game
          pos = [p1_pos, p2_pos]
          scores = [p1_score, p2_score]
          new_pos = calculate_position(pos[player], roll)
          pos[player] = new_pos
          scores[player] = scores[player] + new_pos
          new_key = pos + scores

          game_states[new_key] = (game_states[new_key] || 0) + (number_of_games_in_pos * times)
        end
        game_states[game] = game_states[game] - number_of_games_in_pos
        game_states.delete(game) if (game_states[game]).zero?
      end

      player = (player + 1) % 2
      break if unwon_games.length.zero?
    end

    p1_won_games = game_states.filter { |key, _val| key[2] >= 21 }
    p2_won_games = game_states.filter { |key, _val| key[3] >= 21 }

    p1_won_games_count = p1_won_games.values.reduce(&:+)
    p2_won_games_count = p2_won_games.values.reduce(&:+)

    [p1_won_games_count, p2_won_games_count].max
  end
end

puts(Day21.new.solution1)
puts(Day21.new.solution2)
