import os

import random


class Game:

    def __init__(self):
        """

        Initial valuse of players marks

        and board as a list of number 
        """

        self.player = 'X'
        self.computer = 'O'

        self.board = [i for i in range(1, 10)]

    def display_board(self):
        """ Draws the board """

        print(f'{self.board[0]} | {self.board[1]} | {self.board[2]}')
        print('--|---|--')
        print(f'{self.board[3]} | {self.board[4]} | {self.board[5]}')
        print('--|---|--')
        print(f'{self.board[6]} | {self.board[7]} | {self.board[8]}')
        print()

    def is_winner(self, player):
        """ Check for winner """

        if (self.board[0] == player and self.board[1] == player and self.board[2] == player) or \
            (self.board[3] == player and self.board[4] == player and self.board[5] == player) or \
            (self.board[6] == player and self.board[7] == player and self.board[8] == player) or \
            (self.board[0] == player and self.board[3] == player and self.board[6] == player) or \
            (self.board[1] == player and self.board[4] == player and self.board[7] == player) or \
            (self.board[2] == player and self.board[5] == player and self.board[8] == player) or \
            (self.board[0] == player and self.board[4] == player and self.board[8] == player) or \
                (self.board[2] == player and self.board[4] == player and self.board[6] == player):

            return True

        return False

    def is_draw(self):
        """ Check for draw """

        for cell in self.board:
            if cell != self.player and cell != self.computer:
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

        if self.board[choice] == self.player or self.board[choice] == self.computer:
            return False
        return True

    def play(self):
        """ Main game Logic loop """

        print("Welcome to my tic tac toe game.")
        print("Your sign is 'X'")
        print("Computer sign is 'O'")
        self.display_board()

        while True:
            print("Please choose a number to mark your sign")
            try:
                cell = int(input("> "))
            except ValueError:
                print("Please choose a number")
                continue

            # validate the player choice
            if self.valid_cell(cell) and self.is_choice_valid(cell - 1):
                self.board[cell-1] = self.player
            else:
                print("Enter a valid cell number")
                continue

            # player is a winner
            if self.is_winner(self.player):
                self.display_board()
                print("You won the game! :)")
                break

            # is a draw - always after the player choice as a last one to play
            if self.is_draw():
                self.display_board()
                print("It is a draw :|")
                break

            comp_choice = self.computer_choice()
            self.board[comp_choice] = self.computer

            # computer is a winner
            if self.is_winner(self.computer):
                self.display_board()
                print("You lose! :( the computer wins!")
                break

            os.system("clear") or os.system("cls")
            self.display_board()
