import { actsOnFirstNight, actsOnOtherNight, killToken, reviveToken, toggleTokenDeadVote, rotateToken, type Token, addReminder, removeReminder, replaceToken } from "./Tokens"
import { getCharacter, getFirstNightOrder, getOtherNightOrder } from "./Characters"
import type { Script } from "./Scripts"
import type { BluffSet } from "./Bluffs"

export interface GrimState {
    tokens: Token[]
    fabledLorics: string[]
    script: Script
    bluffSets: BluffSet[]
    selectedCharacterIds: string[],
    expectedPlayerCount: number
}

export interface HistoryState {
    past: GrimState[]
    present: GrimState
    future: GrimState[]
}

export function generateInitialGrimState(): GrimState {
    return {
        tokens: [],
        fabledLorics: [],
        script: { characterIds: [], name: "No Script", author: "" },
        bluffSets: [{id: crypto.randomUUID(), characterIds: ["", "", ""] }],
        selectedCharacterIds: [],
        expectedPlayerCount: 7,
    }
}

export function aliveCount(tokens: Token[]) : number {
    return tokens.filter(token => token.isAlive).length
}

export function availableVotes(tokens: Token[]) : number {
    return tokens.filter(token => token.isAlive || token.hasDeadVote).length
}

export function blockVotes(tokens: Token[]) : number {
    return Math.ceil(tokens.filter(token => token.isAlive).length / 2)
}

export function exileVotes(tokens: Token[]) : number {
    return Math.ceil(tokens.length / 2)
}

export function firstNightOrder(tokens: Token[], currentFabledLorics: string[]) : string[] {
    const wakingTokens = tokens.filter(actsOnFirstNight).map(token => token.characterId)
    const wakingFabledLorics = currentFabledLorics.filter(id => getFirstNightOrder(id) !== undefined)
    return [...wakingTokens, ...wakingFabledLorics].toSorted((a, b) => getFirstNightOrder(a)! - getFirstNightOrder(b)!)
}

export function otherNightOrder(tokens: Token[], currentFabledLorics: string[]) : string[] {
    const wakingTokens = tokens.filter(actsOnOtherNight).map(token => token.characterId)
    const wakingFabledLorics = currentFabledLorics.filter(id => getOtherNightOrder(id) !== undefined)
    return [...wakingTokens, ...wakingFabledLorics].toSorted((a, b) => getOtherNightOrder(a)! - getOtherNightOrder(b)!)
}

export type GrimAction =
    | { type: "addToken"; id: string, characterId: string; name?: string }
    | { type: "removeToken"; id: string }
    | { type: "clear" }
    | { type: "killToken"; id: string }
    | { type: "reviveToken"; id: string }
    | { type: "toggleTokenDeadVote"; id: string }
    | { type: "rotateToken"; id: string }
    | { type: "replaceToken"; id: string, characterId: string}
    | { type: "swapSeats"; tokenId1: string, tokenId2: string}
    | { type: "setScript"; script: Script}
    | { type: "addBluffSet"; id: string, characterIds: string[]}
    | { type: "updateBluffSet"; id: string, characterIds: string[]}
    | { type: "removeBluffSet"; id: string}
    | { type: "addFabledLoric"; characterId: string}
    | { type: "removeFabledLoric"; characterId: string}
    | { type: "addReminder"; id: string, text: string, tokenId: string, originId: string}
    | { type: "removeReminder"; reminderId: string, tokenId: string}
    | { type: "toggleSelectedCharacterId"; characterId: string }
    | { type: "clearSelectedCharacterIds" }
    | { type: "setExpectedPlayerCount"; count: number }
    | { type: "batch"; actions: GrimAction[] }

export function grimActionReducer(state: GrimState, action: GrimAction): GrimState {
    switch (action.type) {
        case "clear":
            return { ...state, tokens: [], fabledLorics: [], bluffSets: [], selectedCharacterIds: [], expectedPlayerCount: 7, }
        case "removeToken": {
            const newSeating = state.tokens
                .filter(token => token.id !== action.id)
                .sort((a, b) => (a.seat ?? 0) - (b.seat ?? 0))
                .map((token, index) => ({ ...token, seat: index }))
            return { ...state, tokens: newSeating }
        }
        case "addToken":
            if (action.characterId === undefined || getCharacter(action.characterId) === undefined) {
                return state
            }
            const newToken = {
                id: action.id,
                characterId: action.characterId,
                name: action.name,
                seat: state.tokens.length,
                isAlive: true,
                isRotated: false,
                hasDeadVote: true,
                reminders: []
            }
            return { ...state, tokens: [ ...state.tokens, newToken]}
        case "killToken":
            return { ...state, tokens: state.tokens.map(token => token.id === action.id ? killToken(token) : token) }
        case "reviveToken":
            return { ...state, tokens: state.tokens.map(token => token.id === action.id ? reviveToken(token) : token) }
        case "toggleTokenDeadVote":
            return { ...state, tokens: state.tokens.map(token => token.id === action.id ? toggleTokenDeadVote(token) : token) }
        case "rotateToken":
            return { ...state, tokens: state.tokens.map(token => token.id === action.id ? rotateToken(token) : token) }
        case "replaceToken": {
            return { ...state, tokens: state.tokens.map(token => token.id === action.id ? replaceToken(token, action.characterId) : token) }
        }
        case "swapSeats":
            const id1Seat = state.tokens.find(token => token.id === action.tokenId1)?.seat ?? -1
            const id2Seat = state.tokens.find(token => token.id === action.tokenId2)?.seat ?? -1
            return { ...state, tokens: state.tokens.map(token => 
                token.id === action.tokenId1 ?
                    { ...token, seat: id2Seat }
                : token.id === action.tokenId2 ?
                    { ...token, seat: id1Seat }
                : token
            )}
        case "setScript":
            return { ...state, script: action.script}
        case "addBluffSet":
            return { ...state, bluffSets: [ ...state.bluffSets, { id: action.id, characterIds: action.characterIds }]}
        case "updateBluffSet":
            return { ...state, bluffSets: state.bluffSets.map(bluffSet => bluffSet.id === action.id ? { id: bluffSet.id, characterIds: action.characterIds } : bluffSet)}
        case "removeBluffSet":
            return { ...state, bluffSets: state.bluffSets.filter(bluffSet => bluffSet.id != action.id) }
        case "addFabledLoric":
            if (state.fabledLorics.includes(action.characterId)) {
                return state
            }
            return { ...state, fabledLorics: [ ...state.fabledLorics, action.characterId]}
        case "removeFabledLoric":
            return { ...state, fabledLorics: state.fabledLorics.filter(fabledLoric => fabledLoric != action.characterId) }
        case "addReminder":
            return { ...state, tokens: state.tokens.map(token => token.id === action.tokenId ? addReminder(token, { id: action.id, text: action.text, originId: action.originId }) : token) }
        case "removeReminder":
            return { ...state, tokens: state.tokens.map(token => token.id === action.tokenId ? removeReminder(token, action.reminderId) : token)}
        case "toggleSelectedCharacterId":
            return { ...state, selectedCharacterIds: state.selectedCharacterIds.includes(action.characterId) ? state.selectedCharacterIds.filter(id => id !== action.characterId) : [...state.selectedCharacterIds, action.characterId]}
        case "clearSelectedCharacterIds":
            return { ...state, selectedCharacterIds: [] }
        case "setExpectedPlayerCount":
            return { ...state, expectedPlayerCount: action.count }
        case "batch":
            return action.actions.reduce(grimActionReducer, state)
    }
}

export type HistoryAction =
    | { type: "undo" }
    | { type: "redo" }
    | GrimAction

const NON_HISTORY_ACTIONS: HistoryAction["type"][] = ["toggleSelectedCharacterId", "clearSelectedCharacterIds", "setExpectedPlayerCount"]

export function historyReducer(state: HistoryState, action: HistoryAction) : HistoryState {
    switch (action.type) {
        case "undo":
            if (state.past.length === 0 ) { return state }
            const pastGrimState = state.past[state.past.length - 1]!
            return {
                past: state.past.slice(0, -1),
                present: pastGrimState,
                future: [state.present, ...state.future]
            }
        case "redo":
            if (state.future.length === 0) { return state }
            const futureGrimState = state.future[0]!
            return {
                past: [...state.past, state.present],
                present: futureGrimState,
                future: state.future.slice(1)
            }
        default:
            const newGrimState = grimActionReducer(state.present, action)
            if (newGrimState === state.present) { return state }
            if (NON_HISTORY_ACTIONS.includes(action.type)) { return { ...state, present: newGrimState} }
            return {
                past: [ ...state.past, state.present],
                present: newGrimState,
                future: []
            }
    }
}