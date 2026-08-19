import characterData from "./data/characters.json"

export interface Character {
    id: string
    name: string
    characterType: string
    ability: string
    edition?: string
    firstNightOrder: number
    otherNightOrder: number
    setup: boolean
    firstNightInstruction?: string
    otherNightInstruction?: string
    reminders?: string[]
    globalReminders?: string[]
}

interface RawCharacter {
    id: string
    name: string
    team: string
    ability: string
    edition?: string
    firstNight?: number
    otherNight?: number
    setup?: boolean
    firstNightReminder?: string
    otherNightReminder?: string
    reminders?: string[]
    remindersGlobal?: string[]
}

function characterFromRaw(data: RawCharacter) : Character {
    return {
        id: data.id,
        name: data.name,
        characterType: data.team,
        ability: data.ability,
        edition: data.edition,
        firstNightOrder: data.firstNight ?? 0,
        otherNightOrder: data.otherNight ?? 0,
        setup: data.setup ?? false,
        firstNightInstruction: data.firstNightReminder,
        otherNightInstruction: data.otherNightReminder,
        reminders: data.reminders,
        globalReminders: data.remindersGlobal
    }
}

export function loadCharacters() : Record<string, Character> {
    const processedCharacterData = characterData.map(characterFromRaw)
    const idMap = processedCharacterData.map((char) : [string, Character] => [char.id, char])
    return Object.fromEntries(idMap)
}

export const characters = loadCharacters()
export const fabledLorics = Object.values(characters).filter(char => char.characterType === "fabled" || char.characterType === "loric").map(char => char.name)