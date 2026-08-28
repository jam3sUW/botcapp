import type { GrimState } from "./Grimoire"
import { nRandom } from "./Utils"
import { getCharacter } from "./Characters"

export interface BluffSet {
    id: string
    characterIds: string[]
}

export function validBluffs(state: GrimState) : string[] {
    return state.script.characterIds.filter(id => {
        const character = getCharacter(id)
        return character != undefined && (character.characterType === "townsfolk" || character.characterType === "outsider")
    })
}

export function eligibleBluffs(state: GrimState) : string[] {
    const inPlayIds = new Set(state.tokens.map(token => token.characterId))
    return state.script.characterIds.filter(id => {
        const character = getCharacter(id)
        return character != undefined && !inPlayIds.has(id) && (character.characterType === "townsfolk" || character.characterType === "outsider")
    })
}

export function generateBluffs(state: GrimState) : string[] {
    if (state.script.characterIds.length < 3) {
        return ["", "", ""]
    }
    return nRandom(eligibleBluffs(state), 3)
}