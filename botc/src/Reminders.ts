import { characters } from "./Characters"
import type { GrimState } from "./Grimoire"

export interface Reminder {
    id: string,
    text: string,
    originId: string
}

const ALWAYS_REMINDERS: Omit<Reminder, "id">[] = [
    { text: "Good team", originId: "Global" },
    { text: "Evil Team", originId: "Global" }
]

export function scriptReminders(state: GrimState) : Omit<Reminder, "id">[] {
    const reminders: Omit<Reminder, "id">[] = [...ALWAYS_REMINDERS]
    state.script.characterIds.forEach((id) => {
        characters[id].reminders?.forEach((reminder) => {reminders.push({ text: reminder, originId: id })})
        characters[id].globalReminders?.forEach((reminder) => {reminders.push({ text: reminder, originId: "global" })})
    })
    return reminders
}