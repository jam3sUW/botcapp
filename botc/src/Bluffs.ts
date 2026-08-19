import type { GrimState } from "./Grimoire"
import { nRandom } from "./Utils"
import { characters } from "./Characters"

export interface BluffSet {
    id: string
    characterIds: string[]
}

export function validBluffs(state: GrimState) : string[] {
    return state.script.characterIds.filter(id => characters[id].characterType === "townsfolk" || characters[id].characterType === "outsider")
}

export function eligibleBluffs(state: GrimState) : string[] {
    const inPlayIds = new Set(state.tokens.map(token => token.character.id))
    return state.script.characterIds.filter(id => !inPlayIds.has(id) && (characters[id].characterType === "townsfolk" || characters[id].characterType === "outsider"))
}

export function generateBluffs(state: GrimState) : string[] {
    if (state.script.characterIds.length < 3) {
        return ["", "", ""]
    }
    return nRandom(eligibleBluffs(state), 3)
}