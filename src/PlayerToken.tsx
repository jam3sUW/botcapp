import { type GrimAction, type GrimState} from "./Grimoire";
import { formatToken, type Token } from "./Tokens";
import ReminderManager from "./ReminderManager";
import { useState } from "react";
import "./PlayerToken.css"
import DisplayToken from "./DisplayToken";

interface PlayerTokenProps {
    dispatch: React.Dispatch<GrimAction>
    token: Token
    state: GrimState
}

export default function PlayerToken({ dispatch, token, state }: PlayerTokenProps) {
    const [selected, setSelected] = useState(false)
    return (
        <li className="token-row">
            <DisplayToken characterId={token.characterId} onClick={() => setSelected(!selected)}/>
            {formatToken(token)}
            {selected && (
                <>
                    <div>
                        {token.isAlive ? 
                        <button onClick={() => dispatch({ type: "killToken", id: token.id })}>Kill</button> :
                        <button onClick={() => dispatch({ type: "reviveToken", id: token.id })}>Revive</button>}
                        <button onClick={() => dispatch({ type: "toggleTokenDeadVote", id: token.id })}>Toggle DV</button>
                        <button onClick={() => dispatch({ type: "rotateToken", id: token.id })}>Rotate</button>
                        <button onClick={() => dispatch({ type: "removeToken", id: token.id })}>Remove</button>
                    </div>
                    <ReminderManager dispatch={dispatch} state={state} token={token}/>
                </>
            )}
        </li>
    )
}