from dataclasses import dataclass
import json

def load_script(path, char_dict):
    with open(path) as f:
        data = json.load(f)
        name = ""
        author = ""
        bootlegger = None
        char_ids = set()
        for entry in data:
            if isinstance(entry, dict):
                if entry["id"] == "_meta":
                    name = entry.get("name", "")
                    author = entry.get("author", "")
                    bootlegger = entry.get("bootlegger")
                    continue
                else:
                    char_id = entry["id"]
            else:
                char_id = entry
            char_ids.add(char_id)
        return Script(character_ids=char_ids, name=name, author=author, bootlegger=bootlegger)

@dataclass
class Script:
    character_ids: set[str]
    name: str = ""
    author: str = ""
    bootlegger: list[str] | None