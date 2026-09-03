import characterData from "./data/characters.json"
import nightOrderData from "./data/nightsheet.json"

export interface Character {
    id: string
    name: string
    characterType: CharacterType
    ability: string
    edition?: string
    setup: boolean
    firstNightInstruction?: string
    otherNightInstruction?: string
    reminders?: string[]
    globalReminders?: string[]
    flavor?: string
}

interface RawCharacter {
    id: string
    name: string
    team: string
    ability: string
    edition?: string
    setup?: boolean
    firstNightReminder?: string
    otherNightReminder?: string
    reminders?: string[]
    remindersGlobal?: string[]
    flavor?: string
}

export type CharacterType = "townsfolk" | "outsider" | "minion" | "demon" | "traveller" | "fabled" | "loric"

function characterFromRaw(data: RawCharacter) : Character {
    return {
        id: data.id,
        name: data.name,
        characterType: data.team as CharacterType,
        ability: data.ability,
        edition: data.edition,
        setup: data.setup ?? false,
        firstNightInstruction: data.firstNightReminder,
        otherNightInstruction: data.otherNightReminder,
        reminders: data.reminders,
        globalReminders: data.remindersGlobal,
        flavor: data.flavor
    }
}

function loadCharacters() : Record<string, Character> {
    const processedCharacterData = characterData.map(characterFromRaw)
    const idMap = processedCharacterData.map((char) : [string, Character] => [char.id, char])
    return Object.fromEntries(idMap)
}

const characters = loadCharacters()
export const fabledLorics = Object.values(characters).filter(char => char.characterType === "fabled" || char.characterType === "loric").map(character => character.id)
export const travellers = Object.values(characters).filter(char => char.characterType === "traveller")

export function getCharacter(id : string) : Character | undefined {
    return characters[id]
}

export interface NightOrder {
    firstNight: Record<string, number>
    otherNight: Record<string, number>
}

export function loadNightOrder(): NightOrder {
    return {
        firstNight: Object.fromEntries(nightOrderData.firstNight.map((id, index) => [id, index])),
        otherNight: Object.fromEntries(nightOrderData.otherNight.map((id, index) => [id, index]))
    }
}

const nightOrder = loadNightOrder()

export function getFirstNightOrder(id : string) : number | undefined  {
    return nightOrder.firstNight[id]
}

export function getOtherNightOrder(id : string) : number | undefined {
    return nightOrder.otherNight[id]
}