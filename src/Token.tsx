import { type GrimAction, type GrimState} from "./Grimoire";
import { formatToken, type Token } from "./Tokens";
import ReminderManager from "./ReminderManager";

interface TokenProps {
    dispatch: React.Dispatch<GrimAction>
    token: Token
    state: GrimState
}

export default function Token({ dispatch, token, state }: TokenProps) {
    return (
        <li>
            {formatToken(token)}
            <br/>
            {token.isAlive ? 
            <button onClick={() => dispatch({ type: "killToken", id: token.id })}>Kill</button> :
            <button onClick={() => dispatch({ type: "reviveToken", id: token.id })}>Revive</button>}
            <button onClick={() => dispatch({ type: "toggleTokenDeadVote", id: token.id })}>Toggle DV</button>
            <button onClick={() => dispatch({ type: "rotateToken", id: token.id })}>Rotate</button>
            <button onClick={() => dispatch({ type: "removeToken", id: token.id })}>Remove</button>
            
            <ReminderManager dispatch={dispatch} state={state} token={token}/>
        </li>
    )
}