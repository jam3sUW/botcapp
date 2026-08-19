import { useState } from "react"
import type { GrimAction, GrimState } from "./Grimoire"
import { scriptReminders } from "./Reminders"
import type { Token } from "./Tokens"

interface ReminderManagerProps {
    dispatch: React.Dispatch<GrimAction>
    state: GrimState
    token: Token
}

export default function ReminderManager({ dispatch, state, token }: ReminderManagerProps) {
    const [chosenReminder, setChosenReminder] = useState("")

    return (
        <div>
            <select value={chosenReminder} onChange={(e) => setChosenReminder(e.target.value)}>
                <option value="" disabled>Choose...</option>
                {scriptReminders(state).map(reminder => 
                    <option key={`${reminder.originId} - ${reminder.text}`} value={JSON.stringify(reminder)}>
                        {reminder.originId + ": " +reminder.text}
                    </option>
                )}
            </select>
            <button disabled={chosenReminder === ""} onClick={() => {
                const parsedReminder = JSON.parse(chosenReminder)
                dispatch({ type: "addReminder", text: parsedReminder.text, tokenId: token.id, originId: parsedReminder.originId})
            }}>Add reminder</button>
            <br/>
            <ul>
                {token.reminders.map(reminder =>
                    <li key={reminder.id}>
                        {reminder.originId + ": " +reminder.text}
                        <button onClick={() => dispatch({ type: "removeReminder", reminderId: reminder.id, tokenId: token.id})}>Remove</button>
                    </li>
                )}
            </ul>
            
        </div>
    )
}