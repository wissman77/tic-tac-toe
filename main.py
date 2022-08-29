from game import Game


def main():
    while True:
        a_game = Game()
        a_game.play()
        if input("Do yo like to play again? (y/n): ").lower() == 'n':
            break


if __name__ == "__main__":
    main()
