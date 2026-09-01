import { type GrimAction, type GrimState} from "./Grimoire";
import { formatToken, type Token as TokenData } from "./Tokens";
import ReminderManager from "./ReminderManager";
import { useState } from "react";
import "./PlayerToken.css"
import { getCharacter } from "./Characters";
import Token from "./Token";

interface PlayerTokenProps {
    dispatch: React.Dispatch<GrimAction>
    token: TokenData
    state: GrimState
}

export default function PlayerToken({ dispatch, token, state }: PlayerTokenProps) {
    const [selected, setSelected] = useState(false)
    const edition = getCharacter(token.characterId)?.edition ?? "homebrew"
    const imgFilepath = `/assets/characters/${edition}/${token.characterId}.webp`
    return (
        <li className="token-row">
            <Token characterId={token.characterId} onClick={() => setSelected(!selected)}></Token>
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