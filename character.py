from dataclasses import dataclass
import json

def load_characters(path):
    with open(path) as f:
        data = json.load(f)
        return {character["id"]: Character.from_dict(character) for character in data}

@dataclass
class Character:
    id: str
    name: str
    character_type: str
    ability: str
    edition: str | None = None
    first_night_order: int = 0
    first_night_instruction: str | None = None
    other_night_order: int = 0
    other_night_instruction: str | None = None
    reminders: list[str] | None = None
    global_reminders: list[str] | None = None
    setup: bool = False

    @classmethod
    def from_dict(cls, data: dict) -> "Character":
        return cls(
            id = data["id"],
            name = data["name"],
            character_type = data["team"],
            ability = data["ability"],
            edition = data.get("edition", None),
            first_night_order = data.get("firstNight", 0),
            first_night_instruction = data.get("firstNightReminder", None),
            other_night_order = data.get("otherNight", 0),
            other_night_instruction = data.get("otherNightReminder", None),
            reminders = data.get("reminders", None),
            global_reminders = data.get("remindersGlobal", None),
            setup = data.get("setup", False),
        )