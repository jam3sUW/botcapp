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

interface CharacterTypeCount {
    townsfolk: number,
    outsiders: number,
    minions: number,
    demons: number
}

export type CharacterType = "townsfolk" | "outsiders" | "minions" | "demons" | "travellers" | "fabled" | "lorics"

const CHARACTER_TYPE_COUNTS: Record<number, CharacterTypeCount> = {
    5: { townsfolk: 3, outsiders: 0, minions: 1, demons: 1 },
    6: { townsfolk: 3, outsiders: 1, minions: 1, demons: 1 },
    7: { townsfolk: 5, outsiders: 0, minions: 1, demons: 1 },
    8: { townsfolk: 5, outsiders: 1, minions: 1, demons: 1 },
    9: { townsfolk: 5, outsiders: 2, minions: 1, demons: 1 },
    10: { townsfolk: 7, outsiders: 0, minions: 2, demons: 1 },
    11: { townsfolk: 7, outsiders: 1, minions: 2, demons: 1 },
    12: { townsfolk: 7, outsiders: 2, minions: 2, demons: 1 },
    13: { townsfolk: 9, outsiders: 0, minions: 3, demons: 1 },
    14: { townsfolk: 9, outsiders: 1, minions: 3, demons: 1 },
    15: { townsfolk: 9, outsiders: 2, minions: 3, demons: 1 },
}

export function getCharacterTypeCounts(playerCount: number) : CharacterTypeCount {
    playerCount = Math.max(5, Math.min(playerCount, 15))
    return CHARACTER_TYPE_COUNTS[playerCount]!
}

interface ScriptCharacterIdsByType {
    townsfolk: string[],
    outsiders: string[],
    minions: string[],
    demons: string[],
    travellers: string[],
    fabled: string[],
    lorics: string[],
}

export function getScriptCharacterTypes(script: Script) : ScriptCharacterIdsByType {
    return {
        townsfolk: script.characterIds.filter(id => getCharacter(id)?.characterType === "townsfolk"),
        outsiders: script.characterIds.filter(id => getCharacter(id)?.characterType === "outsider"),
        minions: script.characterIds.filter(id => getCharacter(id)?.characterType === "minion"),
        demons: script.characterIds.filter(id => getCharacter(id)?.characterType === "demon"),
        travellers: script.characterIds.filter(id => getCharacter(id)?.characterType === "traveller"),
        fabled: script.characterIds.filter(id => getCharacter(id)?.characterType === "fabled"),
        lorics: script.characterIds.filter(id => getCharacter(id)?.characterType === "loric"),
    }
}