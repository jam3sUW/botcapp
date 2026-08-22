from tokens import Token
from scripts import Script
from characters import Character, load_characters
from pathlib import Path
from typing import Optional

DATA_PATH = Path(__file__).parent / "data" / "characters.json"

class Grim:
    characters = load_characters(DATA_PATH)

    def __init__(self, script : Script):
        self.tokens = []
        self.script = script

    def __str__(self):
        return str(self.tokens)

    def add_token(self, role : str, name : Optional[str] = None):
        self.tokens.append(Token(self.characters[role], name))

    def remove_token(token : Token):
        self.tokens.remove(token)

    def clear(self):
        self.tokens = []