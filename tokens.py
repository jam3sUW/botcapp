from typing import Optional

class Token:
    
    def __init__(self, character : str, name: Optional[str] = None, seat: Optional[int] = None):
        self.character = character
        self.name = name
        self.seat = seat
        self.is_alive = True
        self.is_rotated = False
        self.has_dead_vote = True
    
    def kill(self):
        self.is_alive = False
    
    def revive(self):
        self.is_alive = True
        self.has_dead_vote = True
    
    def toggle_dead_vote(self):
        self.has_dead_vote = not self.has_dead_vote

    def rotate(self):
        self.rotate = not self.rotate

    def __str__(self):
        parts = ["Alive" if self.is_alive else "Dead", self.character.name]
        if self.name:
            parts.append(self.name)
        if not self.is_alive:
            parts.append("(with DV)" if self.has_dead_vote else "(no DV)")
        if self.is_rotated:
            parts.append("(rotated)")
        return " ".join(parts)

    def __repr__(self):
        return self.__str__()