import os

import random


class Game:

    def __init__(self):
        """

        Initial valuse of players marks

        and board as a list of number 
        """

        self._player = 'X'
        self._computer = 'O'

        self._board = [i for i in range(1, 10)]

    def display_board(self):
        """ Draws the board """

        print(f'{self._board[0]} | {self._board[1]} | {self._board[2]}')
        print('--|---|--')
        print(f'{self._board[3]} | {self._board[4]} | {self._board[5]}')
        print('--|---|--')
        print(f'{self._board[6]} | {self._board[7]} | {self._board[8]}')
        print()

    def is_winner(self, player):
        """ Check for winner """

        if (self._board[0] == player and self._board[1] == player and self._board[2] == player) or \
            (self._board[3] == player and self._board[4] == player and self._board[5] == player) or \
            (self._board[6] == player and self._board[7] == player and self._board[8] == player) or \
            (self._board[0] == player and self._board[3] == player and self._board[6] == player) or \
            (self._board[1] == player and self._board[4] == player and self._board[7] == player) or \
            (self._board[2] == player and self._board[5] == player and self._board[8] == player) or \
            (self._board[0] == player and self._board[4] == player and self._board[8] == player) or \
                (self._board[2] == player and self._board[4] == player and self._board[6] == player):

            return True

        return False

    def is_draw(self):
        """ Check for draw """

        for cell in self._board:
            if cell != self._player and cell != self._computer:
                return False
        return True

    def valid_cell(self, number):
        """ Check if the player provids a valid cell """

        if number >= 1 and number <= 9:
            return True
        return False

    def computer_choice(self):
        """ Random valid choice as a move of computer """

        choice = random.randint(0, 8)
        while not self.is_choice_valid(choice):
            choice = random.randint(0, 8)
        return choice

    def is_choice_valid(self, choice):
        """ Check if the player or the compute choose a valid move """

        if self._board[choice] == self._player or self._board[choice] == self._computer:
            return False
        return True

    def play(self):
        """ Main game Logic loop """

        print("Welcome to Tic Tac Toe game.")
        print("Your mark is 'X'")
        print("Computer mark is 'O'")
        self.display_board()

        while True:
            print("Please choose a number of cell to mark")
            try:
                cell = int(input("> "))
            except ValueError:
                print("Please choose a letter")
                continue
            else:
                # validate the player choice
                if self.valid_cell(cell) and self.is_choice_valid(cell - 1):
                    self._board[cell-1] = self._player
                else:
                    print("Enter a valid cell number")
                    continue

                # player is a winner
                if self.is_winner(self._player):
                    self.display_board()
                    print("You won the game! :)")
                    break

                # is a draw - always after the player choice as a last one to play
                if self.is_draw():
                    self.display_board()
                    print("It is a draw :|")
                    break

                comp_choice = self.computer_choice()
                self._board[comp_choice] = self._computer

                # computer is a winner
                if self.is_winner(self._computer):
                    self.display_board()
                    print("You lose! :( the computer wins!")
                    break

                os.system("clear || clss")  # or os.system("cls")
                self.display_board()
