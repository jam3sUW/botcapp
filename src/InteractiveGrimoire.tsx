import { useReducer } from "react";
import { useState } from "react";
import { aliveCount, availableVotes, blockVotes, exileVotes, firstNightOrder, historyReducer, generateInitialGrimState, otherNightOrder } from "./Grimoire";
import ScriptLoader from "./ScriptLoader";
import { getCharacter, fabledLorics, type Character } from "./Characters";
import BluffManager from "./BluffManager";
import PlayerToken from "./PlayerToken";
import { getInPlayJinxes } from "./Jinxes";
import "./InteractiveGrimoire.css"
import CharacterSetup from "./CharacterSetup";

function InteractiveGrimoire() {
    const [{ present: state, past, future }, dispatch] = useReducer(historyReducer, { past: [], present: generateInitialGrimState(), future: []})
    const [chosenChar, setChosenChar] = useState("")
    const [chosenName, setChosenName] = useState("")
    const [chosenFabledLoric, setChosenFabledLoric] = useState("")
    const sortedTokens = [...state.tokens].sort((a, b) => (a.seat ?? 999) - (b.seat ?? 999))
    const inPlayJinxes = getInPlayJinxes(state)

    return (
        <div>
            <button disabled={past.length === 0} onClick={() => { dispatch({ type: "undo" }) }}>Undo</button>
            <button disabled={future.length === 0} onClick={() => { dispatch({ type: "redo" }) }}>Redo</button>

            <ScriptLoader dispatch={dispatch}/>

            <CharacterSetup dispatch={dispatch} state={state}></CharacterSetup>

            <button onClick={() => dispatch({ type: "addToken", id: crypto.randomUUID(), characterId: chosenChar, name: chosenName })}>Add token</button>
            <select value={chosenChar} onChange={(e) => setChosenChar(e.target.value)}>
                <option value="" disabled>Select a character...</option>
                {state.script.characterIds.map(id => getCharacter(id)).filter((character): character is Character => character != undefined && character.characterType != "fabled" && character.characterType != "loric").map(character =>
                    <option key={character.id} value={character.id}>
                        {character.name}
                    </option>
                )}
            </select>
            <input type="text" placeholder="Name..." value={chosenName} onChange={(e) => setChosenName(e.target.value)}/>

            <button onClick={() => dispatch({ type: "clear"})}>Clear</button>
            
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
                {firstNightOrder(state.tokens).map(token => {
                    const character = getCharacter(token.characterId)
                    if (!character) return null
                    return (
                        <li key={token.id}>
                            <strong>{character.name}: </strong>
                            {character.firstNightInstruction}
                        </li>
                    )
                })}
            </ul>
            <h2>Other night:</h2>
            <ul>
                {otherNightOrder(state.tokens).map(token => {
                    const character = getCharacter(token.characterId)
                    if (!character) return null
                    return (
                        <li key={token.id}>
                            <strong>{character.name}: </strong>
                            {character.otherNightInstruction}
                        </li>
                    )
                })}
            </ul>

           <BluffManager dispatch={dispatch} state={state}/>

           <h2>Fabled/Loric</h2>
           <button disabled={chosenFabledLoric === ""} onClick={() => {
                dispatch({ type: "addFabledLoric", characterId: chosenFabledLoric});
                setChosenFabledLoric("")
            }}>Add Fabled/Loric</button>
           <br/>
            <select value={chosenFabledLoric} onChange={(e) => setChosenFabledLoric(e.target.value)}>
                <option value="" disabled>Select a Fabled/Loric...</option>
                {fabledLorics.filter(fabledLoric => !state.fabledLorics.includes(fabledLoric)).map(id =>
                    <option key={id} value={id}>
                        {getCharacter(id)!.name}
                    </option>
                )}
            </select>
            <ul>
                {state.fabledLorics.map(id => (
                    <li key={id}>
                        {getCharacter(id)!.name}
                        <button onClick={() => dispatch({ type: "removeFabledLoric", characterId: id })}>Remove</button>
                    </li>
                ))}
            </ul>

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