import { getCharacter, getFirstNightOrder, getOtherNightOrder } from "./Characters"
import type { Reminder } from "./Reminders"

export interface Token {
    id: string
    characterId: string
    name?: string
    seat?: number
    isAlive: boolean
    isRotated: boolean
    hasDeadVote: boolean
    reminders: Reminder[]
}


export function killToken(token: Token): Token {
    return { ...token, isAlive: false, hasDeadVote: true }
}

export function reviveToken(token: Token): Token {
    return { ...token, isAlive: true, hasDeadVote: true}
}

export function toggleTokenDeadVote(token: Token): Token {
    return { ...token, hasDeadVote: !token.hasDeadVote}
}

export function rotateToken(token: Token): Token {
    return { ...token, isRotated: !token.isRotated}
}

export function replaceToken(token: Token, characterId: string): Token {
    return { ...token, characterId: characterId}
}

export function addReminder(token: Token, reminder: Reminder) {
    return { ...token, reminders: [ ...token.reminders, reminder] }
}

export function removeReminder(token: Token, reminderId: string) {
    return { ...token, reminders: token.reminders.filter(reminder => reminder.id != reminderId)}
}

export function formatToken(token: Token): string {
    let name = getCharacter(token.characterId)?.name ?? "Unknown Role"
    const parts = [token.isAlive ? "" : "Dead", name ]
    if (token.name) {
        parts.push(token.name)
    }
    if (!token.isAlive) {
        parts.push(token.hasDeadVote ? "(with DV)" : "(no DV)")
    }
    if (token.isRotated) {
        parts.push("(rotated)")
    }
    return parts.join(" ")
}

export function actsOnFirstNight(token: Token): boolean {
    return token.isAlive && getFirstNightOrder(token.characterId) !== undefined
}

export function actsOnOtherNight(token: Token): boolean {
    return token.isAlive && getOtherNightOrder(token.characterId) !== undefined
}