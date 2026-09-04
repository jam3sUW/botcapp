import { useReducer } from "react";
import { aliveCount, availableVotes, blockVotes, exileVotes, firstNightOrder, historyReducer, generateInitialGrimState, otherNightOrder } from "./Grimoire";
import ScriptLoader from "./ScriptLoader";
import { getCharacter } from "./Characters";
import BluffManager from "./BluffManager";
import PlayerToken from "./PlayerToken";
import { getInPlayJinxes } from "./Jinxes";
import "./InteractiveGrimoire.css"
import CharacterSetup from "./CharacterSetup";
import TokenAdder from "./TokenAdder";
import TravellerAdder from "./TravellerAdder";
import FabledLoricAdder from "./FabledLoricAdder";

function InteractiveGrimoire() {
    const [{ present: state, past, future }, dispatch] = useReducer(historyReducer, { past: [], present: generateInitialGrimState(), future: []})
    const sortedTokens = [...state.tokens].sort((a, b) => (a.seat ?? 999) - (b.seat ?? 999))
    const inPlayJinxes = getInPlayJinxes(state)
    const hasTokens = state.tokens.length !== 0 || state.fabledLorics.length !== 0

    return (
        <div>
            <button disabled={past.length === 0} onClick={() => { dispatch({ type: "undo" }) }}>Undo</button>
            <button disabled={future.length === 0} onClick={() => { dispatch({ type: "redo" }) }}>Redo</button>

            <ScriptLoader dispatch={dispatch}/>
            <p>{state.script.name}</p>

            <CharacterSetup dispatch={dispatch} state={state}/>

            <TokenAdder dispatch={dispatch} state={state}/>
            
            <TravellerAdder dispatch={dispatch} state={state}/>

            <FabledLoricAdder dispatch={dispatch} state={state}/>

            <button onClick={() => dispatch({ type: "clear"})}>Clear</button>
            {hasTokens &&
                <>
                    <p>Players: {state.tokens.length}</p>
                    <p>Alive: {aliveCount(state.tokens)}</p>
                    <p>Available votes: {availableVotes(state.tokens)}</p>
                    <p>Votes to condemn: {blockVotes(state.tokens)}</p>
                    <p>Votes to exile: {exileVotes(state.tokens)}</p>

                    <h2>Tokens (click each for options):</h2>
                    <ul className="token-list">
                        {sortedTokens.map(token => (
                            <PlayerToken key={token.id} dispatch={dispatch} token={token} state={state}/>
                        ))}
                    </ul>
                    
                    <h2>First night:</h2>
                    <ul>
                        {firstNightOrder(state.tokens, state.fabledLorics).map(id => {
                            const character = getCharacter(id)
                            if (!character) return null
                            return (
                                <li key={id}>
                                    <strong>{character.name}: </strong>
                                    {character.firstNightInstruction}
                                </li>
                            )
                        })}
                    </ul>
                    <h2>Other night:</h2>
                    <ul>
                        {otherNightOrder(state.tokens, state.fabledLorics).map(id => {
                            const character = getCharacter(id)
                            if (!character) return null
                            return (
                                <li key={id}>
                                    <strong>{character.name}: </strong>
                                    {character.otherNightInstruction}
                                </li>
                            )
                        })}
                    </ul>
                </>
            }
           <BluffManager dispatch={dispatch} state={state}/>

           {state.fabledLorics.length !== 0 &&
                <>
                    <h2>Fabled/Lorics</h2>
            <ul>
                {state.fabledLorics.map(id => (
                    <li key={id}>
                        {getCharacter(id)!.name}
                        <button onClick={() => dispatch({ type: "removeFabledLoric", characterId: id })}>Remove</button>
                    </li>
                ))}
            </ul>
                </>
            }

            {inPlayJinxes.length > 0 && <div>
                <h2>Jinxes</h2>
                <ul>
                    {inPlayJinxes.map(jinx => {
                        const character1 = getCharacter(jinx.characterId1)
                        const character2 = getCharacter(jinx.characterId2)
                        if (character1 == undefined || character2 == undefined) {
                            return null
                        }
                        return (
                        <li key={`${jinx.characterId1}-${jinx.characterId2}`}>
                            {character1.name + " + " + character2.name + ": " + jinx.reason}
                        </li>
                    )})}
                </ul>
            </div>}
        </div>
    )
}

export default InteractiveGrimoire