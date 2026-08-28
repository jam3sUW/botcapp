import { type GrimAction, type GrimState} from "./Grimoire";
import { formatToken, type Token } from "./Tokens";
import ReminderManager from "./ReminderManager";
import { useState } from "react";
import "./Token.css"

interface TokenProps {
    dispatch: React.Dispatch<GrimAction>
    token: Token
    state: GrimState
}

export default function Token({ dispatch, token, state }: TokenProps) {
    const [selected, setSelected] = useState(false)
    return (
        <li className="token-row">
            <div className="token-circle" onClick={() => setSelected(!selected)}>
                <img src="/assets/placeholder.webp"></img>
            </div>
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