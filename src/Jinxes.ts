import type { GrimState } from "./Grimoire"
import jinxData from "./data/jinxes.json"

export interface Jinx {
    characterId1: string
    characterId2: string
    reason: string
}

export function getScriptJinxes(state: GrimState) : Jinx[] {
    const jinxes : Jinx[] = []
    jinxData.forEach(character => {
        if (state.script.characterIds.includes(character.id)) {
            character.jinx.forEach(target => {
                if (state.script.characterIds.includes(target.id)) {
                    jinxes.push({ characterId1: character.id, characterId2: target.id, reason: target.reason })
                }
            })
        }
    })

    return jinxes
}

export function getInPlayJinxes(state: GrimState) : Jinx[] {
    const jinxes : Jinx[] = []
    const inPlayIds = new Set(state.tokens.map(token => token.character.id))
    jinxData.forEach(character => {
        if (inPlayIds.has(character.id)) {
            character.jinx.forEach(target => {
                if (inPlayIds.has(target.id)) {
                    jinxes.push({ characterId1: character.id, characterId2: target.id, reason: target.reason })
                }
            })
        }
    })

    return jinxes
}