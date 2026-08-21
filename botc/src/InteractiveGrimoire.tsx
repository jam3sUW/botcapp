import { useEffect, useReducer } from "react";
import { useState } from "react";
import { aliveCount, availableVotes, blockVotes, exileVotes, firstNightOrder, historyReducer, initialGrimState, otherNightOrder } from "./Grimoire";
import ScriptLoader from "./ScriptLoader";
import { getCharacter, fabledLorics, type Character } from "./Characters";
import BluffManager from "./BluffManager";
import Token from "./Token";
import { getInPlayJinxes } from "./Jinxes";

function InteractiveGrimoire() {
    const [{ present: state, past, future }, dispatch] = useReducer(historyReducer, { past: [], present: initialGrimState, future: []})
    const [chosenChar, setChosenChar] = useState("")
    const [chosenName, setChosenName] = useState("")
    const [chosenFabledLoric, setChosenFabledLoric] = useState("")
    const sortedTokens = [...state.tokens].sort((a, b) => (a.seat ?? 999) - (b.seat ?? 999))
    const inPlayJinxes = getInPlayJinxes(state)

    // Temporary backdoor for console testing
    useEffect(() => {
        (window as any).testDispatch = dispatch;
        (window as any).testState = state;
    }, [state, dispatch]);

    return (
        <div>
            <button disabled={past.length === 0} onClick={() => { dispatch({ type: "undo" }) }}>Undo</button>
            <button disabled={future.length === 0} onClick={() => { dispatch({ type: "redo" }) }}>Redo</button>

            <ScriptLoader dispatch={dispatch}/>

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

            <h2>Tokens:</h2>
            <ul>
                {sortedTokens.map(token => (
                    <Token dispatch={dispatch} token={token} state={state}/>
                ))}
            </ul>
            
            <h2>First night:</h2>
            <ul>
                {firstNightOrder(state.tokens).map(token => (
                    <li key={token.id}>
                        <strong>{token.character.name}: </strong>
                        {token.character.firstNightInstruction}
                    </li>
                ))}
            </ul>
            <h2>Other night:</h2>
            <ul>
                {otherNightOrder(state.tokens).map(token => (
                    <li key={token.id}>
                        <strong>{token.character.name}: </strong>
                        {token.character.otherNightInstruction}
                    </li>
                ))}
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
                {fabledLorics.filter(fabledLoric => !state.fabledLorics.includes(fabledLoric)).map(name =>
                    <option key={name} value={name}>
                        {name}
                    </option>
                )}
            </select>
            <ul>
                {state.fabledLorics.map(fabledLoric => (
                    <li key={fabledLoric}>
                        {fabledLoric}
                        <button onClick={() => dispatch({ type: "removeFabledLoric", characterId: fabledLoric })}>Remove</button>
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