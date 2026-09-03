import { getCharacter } from "./Characters"

export interface Script {
    characterIds: string[]
    name: string
    author: string
    bootlegger?: string[]
}

export function loadScript(data: any[]) : Script {
    let name = ""
    let author = ""
    let bootlegger = null
    const charIds = []
    for (const entry of data) {
        if (typeof(entry) === "object" && entry !== null) {
            if (entry.id === "_meta") {
                name = entry.name ?? ""
                author = entry.author ?? ""
                bootlegger = entry.bootlegger ?? undefined
                continue
            } else {
                charIds.push(entry.id)
            }
        } else {
            charIds.push(entry)
        }
    }
    return {name: name, author: author, bootlegger: bootlegger, characterIds: charIds}
}

export interface CharacterTypeCount {
    townsfolk: number,
    outsider: number,
    minion: number,
    demon: number
}

const CHARACTER_TYPE_COUNTS: Record<number, CharacterTypeCount> = {
    5: { townsfolk: 3, outsider: 0, minion: 1, demon: 1 },
    6: { townsfolk: 3, outsider: 1, minion: 1, demon: 1 },
    7: { townsfolk: 5, outsider: 0, minion: 1, demon: 1 },
    8: { townsfolk: 5, outsider: 1, minion: 1, demon: 1 },
    9: { townsfolk: 5, outsider: 2, minion: 1, demon: 1 },
    10: { townsfolk: 7, outsider: 0, minion: 2, demon: 1 },
    11: { townsfolk: 7, outsider: 1, minion: 2, demon: 1 },
    12: { townsfolk: 7, outsider: 2, minion: 2, demon: 1 },
    13: { townsfolk: 9, outsider: 0, minion: 3, demon: 1 },
    14: { townsfolk: 9, outsider: 1, minion: 3, demon: 1 },
    15: { townsfolk: 9, outsider: 2, minion: 3, demon: 1 },
}

export function getCharacterTypeCounts(playerCount: number) : CharacterTypeCount {
    playerCount = Math.max(5, Math.min(playerCount, 15))
    return CHARACTER_TYPE_COUNTS[playerCount]!
}

export interface ScriptCharacterIdsByType {
    townsfolk: string[],
    outsider: string[],
    minion: string[],
    demon: string[],
    traveller: string[],
    fabled: string[],
    loric: string[],
}

export function getScriptCharacterTypes(script: Script) : ScriptCharacterIdsByType {
    return {
        townsfolk: script.characterIds.filter(id => getCharacter(id)?.characterType === "townsfolk"),
        outsider: script.characterIds.filter(id => getCharacter(id)?.characterType === "outsider"),
        minion: script.characterIds.filter(id => getCharacter(id)?.characterType === "minion"),
        demon: script.characterIds.filter(id => getCharacter(id)?.characterType === "demon"),
        traveller: script.characterIds.filter(id => getCharacter(id)?.characterType === "traveller"),
        fabled: script.characterIds.filter(id => getCharacter(id)?.characterType === "fabled"),
        loric: script.characterIds.filter(id => getCharacter(id)?.characterType === "loric"),
    }
}