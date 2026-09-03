import { useState } from "react"
import Modal from "./Modal"
import type { GrimAction, GrimState } from "./Grimoire"
import { type CharacterTypeCount, getCharacterTypeCounts, getScriptCharacterTypes, type ScriptCharacterIdsByType } from "./Scripts"
import "./CharacterSetup.css"
import { getCharacter, type CharacterType } from "./Characters"
import { nRandom } from "./Utils"
import TokenGrid from "./TokenGrid"

function addAllSelected(dispatch : React.Dispatch<GrimAction>, state : GrimState) {
    dispatch({
        type: "batch",
        actions: [
            ...state.selectedCharacterIds.map(id => {
                if (getCharacter(id)!.characterType === "fabled" || getCharacter(id)!.characterType === "loric") {
                    return { type: "addFabledLoric" as const, characterId: id }
                } else {
                    return { type: "addToken" as const, id: crypto.randomUUID(), characterId: id }
                }
            }),
            { type: "clearSelectedCharacterIds" },
        ]
    })
}
/* dispatch({ type: "toggleSelectedCharacterId", characterId: id } state.selectedCharacterIds.includes(id) */
function selectRandom(dispatch: React.Dispatch<GrimAction>, options: ScriptCharacterIdsByType, counts: CharacterTypeCount) {
    dispatch({ type: "clearSelectedCharacterIds"} )
    const randomIds = [
        ...nRandom(options.townsfolk, counts.townsfolk),
        ...nRandom(options.outsider, counts.outsider),
        ...nRandom(options.minion, counts.minion),
        ...nRandom(options.demon, counts.demon),
    ]
    randomIds.forEach(id => (
        dispatch({ type: "toggleSelectedCharacterId", characterId: id })
    ))
}

function getSelectedTypeCounts(state: GrimState) : Record<"townsfolk" | "outsider" | "minion" | "demon", number> {
    const counts = { townsfolk: 0, outsider: 0, minion: 0, demon: 0,  }
    for (const id of state.selectedCharacterIds) {
        const type = getCharacter(id)?.characterType
        if (type === "townsfolk" || type === "outsider" || type === "minion" || type === "demon") {
            counts[type]++
        }
    }
    return counts
}

function CharacterSetup({ dispatch, state } : { dispatch: React.Dispatch<GrimAction>, state: GrimState }) {
    const [open, setOpen] = useState(false)
    const [chosenType, setType] = useState<CharacterType>("townsfolk")
    const characterIdsByType = getScriptCharacterTypes(state.script)
    const ids = characterIdsByType[chosenType]
    const counts = getSelectedTypeCounts(state)
    const expectedCounts = getCharacterTypeCounts(state.expectedPlayerCount)

    return (
        <>
            <button disabled={state.script.name === "No Script"} onClick={() => { setType("townsfolk"); setOpen(true); }}>Select roles</button>
            <Modal className="character-setup-modal" onClose={() => setOpen(false)} open={open}>
                <div>
                    <label>Player count: </label>
                    <input type="number" value={state.expectedPlayerCount} min={5} max={15} onChange={(e) => dispatch({ type: "setExpectedPlayerCount", count: Number(e.target.value) })}/>
                </div>
                <TokenGrid ids={ids} onClickId={id => dispatch({ type: "toggleSelectedCharacterId", characterId: id })} isSelected={id => state.selectedCharacterIds.includes(id)}/>
                <div> {/* TODO: fix button colors */}
                    <button onClick={() => setType("townsfolk")}>Townsfolk {counts.townsfolk}/{expectedCounts.townsfolk}</button>
                    <button onClick={() => setType("outsider")}>Outsiders {counts.outsider}/{expectedCounts.outsider}</button>
                    <button onClick={() => setType("minion")}>Minions {counts.minion}/{expectedCounts.minion}</button>
                    <button onClick={() => setType("demon")}>Demons {counts.demon}/{expectedCounts.demon}</button>
                </div>
                <div>
                    {characterIdsByType["traveller"].length !== 0 && <button onClick={() => setType("traveller")}>Travellers</button>}
                    {characterIdsByType["fabled"].length !== 0 && <button onClick={() => setType("fabled")}>Fabled</button>}
                    {characterIdsByType["loric"].length !== 0 && <button onClick={() => setType("loric")}>Lorics</button>}
                </div>
                <div>
                    <button disabled={state.selectedCharacterIds.length == 0} onClick={() => {
                        setOpen(false)
                        addAllSelected(dispatch, state) 
                    }}>Add all</button>
                    <button onClick={() => dispatch({ type: "clearSelectedCharacterIds" })}>Clear</button>
                    <button onClick={() => selectRandom(dispatch, characterIdsByType, expectedCounts)}>Random</button>
                </div>
                <div>
                </div>
            </Modal>
        </>
    )
}

export default CharacterSetup