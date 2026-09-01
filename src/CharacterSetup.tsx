import { useState } from "react"
import Modal from "./Modal"
import type { GrimAction, GrimState } from "./Grimoire"
import DisplayToken from "./DisplayToken"
import { getScriptCharacterTypes, type CharacterType } from "./Scripts"
import "./CharacterSetup.css"

function addAllSelected(dispatch : React.Dispatch<GrimAction>, state : GrimState) {
    state.selectedCharacterIds.forEach(id => {
        dispatch({ type: "addToken", id: crypto.randomUUID(), characterId: id })
    })
    dispatch({ type: "clearSelectedCharacterIds" })
}

function rows(ids : string[]) : { top: string[], bottom: string[] } {
    const midpoint = Math.ceil(ids.length / 2)
    return { top: ids.slice(0, midpoint), bottom: ids.slice(midpoint, ids.length) }
}


function CharacterSetup({ dispatch, state } : { dispatch: React.Dispatch<GrimAction>, state: GrimState }) {
    const [open, setOpen] = useState(false)
    const [chosenType, setType] = useState<CharacterType>("townsfolk")
    const characterIdsByType = getScriptCharacterTypes(state.script)
    const ids = characterIdsByType[chosenType]
    const { top, bottom } = ids.length > 2 ? rows(ids) : { top: ids, bottom: []}

    function closePopup() {
        setType("townsfolk")
        setOpen(false)
    }

    return (
        <>
            <button disabled={state.script.name === "No Script"} onClick={() => setOpen(true)}>Select roles</button>
            {open && (
                <Modal className="character-setup-modal" onClose={() => closePopup()}>
                    <div className="selection-list">
                            <div className="selection-row">
                                {top.map(id => (
                                    <DisplayToken key={id} className={state.selectedCharacterIds.includes(id) ? "selected" : ""} characterId={id} onClick={() => {
                                        dispatch({ type: "toggleSelectedCharacterId", characterId: id })
                                    }}/>
                                ))}
                            </div>
                            {bottom.length != 0 &&
                                <div className={"selection-row bottom"}>
                                    {bottom.map(id => (
                                        <DisplayToken key={id} className={state.selectedCharacterIds.includes(id) ? "selected" : ""} characterId={id} onClick={() => {
                                            dispatch({ type: "toggleSelectedCharacterId", characterId: id })
                                        }}/>
                                    ))}
                                </div>
                            }
                    </div>
                    <div>
                        <button onClick={() => setType("townsfolk")}>Townsfolk</button>
                        <button onClick={() => setType("outsiders")}>Outsiders</button>
                        <button onClick={() => setType("minions")}>Minions</button>
                        <button onClick={() => setType("demons")}>Demons</button>
                    </div>
                    <div>
                        {characterIdsByType["travellers"].length !== 0 && <button onClick={() => setType("travellers")}>Travellers</button>}
                        {characterIdsByType["fabled"].length !== 0 && <button onClick={() => setType("fabled")}>Fabled</button>}
                        {characterIdsByType["lorics"].length !== 0 && <button onClick={() => setType("lorics")}>Lorics</button>}
                    </div>
                    <div>
                        <button disabled={state.selectedCharacterIds.length == 0} onClick={() => {
                            closePopup()
                            addAllSelected(dispatch, state)
                        }}>Add all</button>
                        <button onClick={() => dispatch({ type: "clearSelectedCharacterIds" })}>Clear</button>
                    </div>
                </Modal>
            )}
        </>
    )
}

export default CharacterSetup