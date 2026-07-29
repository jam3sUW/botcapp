class Token:
    
    def __init__(self, character : str, seat = None, name: bool = None):
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