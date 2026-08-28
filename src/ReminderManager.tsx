import { useState } from "react"
import type { GrimAction, GrimState } from "./Grimoire"
import { scriptReminders } from "./Reminders"
import type { Token } from "./Tokens"
import { getCharacter } from "./Characters"

interface ReminderManagerProps {
    dispatch: React.Dispatch<GrimAction>
    state: GrimState
    token: Token
}

export default function ReminderManager({ dispatch, state, token }: ReminderManagerProps) {
    const [chosenReminder, setChosenReminder] = useState("")
    // TODO: Check reminder name undefined check to see if it's clean/idiomatic
    return (
        <div>
            <select value={chosenReminder} onChange={(e) => setChosenReminder(e.target.value)}>
                <option value="" disabled>Choose...</option>
                {scriptReminders(state).map(reminder => {
                    let name = getCharacter(reminder.originId)?.name
                    if (name == undefined) {
                        name = "Global"
                    }
                    return (
                        <option key={`${name} - ${reminder.text}`} value={JSON.stringify(reminder)}>
                            {name + ": " +reminder.text}
                        </option>
                    )
                })}
            </select>
            <button disabled={chosenReminder === ""} onClick={() => {
                const parsedReminder = JSON.parse(chosenReminder)
                dispatch({ type: "addReminder", id: crypto.randomUUID(), text: parsedReminder.text, tokenId: token.id, originId: parsedReminder.originId})
            }}>Add reminder</button>
            <br/>
            <ul> 
                {token.reminders.map(reminder => {
                    let name = getCharacter(reminder.originId)?.name
                    if (name == undefined) {
                        name = "Global"
                    }
                    return (
                         <li key={reminder.id}>
                            {name + ": " + reminder.text}
                            <button onClick={() => dispatch({ type: "removeReminder", reminderId: reminder.id, tokenId: token.id})}>Remove</button>
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}