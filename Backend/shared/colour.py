from enum import Enum


class Colour(Enum):
    BLUE = 0
    GREEN = 1
    RED = 2

    def next(self):
        return Colour((self.value + 1) % 3)

    def __str__(self):
        return {Colour.BLUE: 'B', Colour.GREEN: 'G', Colour.RED: 'R'}[self]
