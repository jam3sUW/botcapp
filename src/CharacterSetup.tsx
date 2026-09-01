import { useState } from "react"
import Modal from "./Modal"
import type { GrimAction, GrimState } from "./Grimoire"
import DisplayToken from "./DisplayToken"
import { getCharacterTypeCounts, getScriptCharacterTypes } from "./Scripts"
import "./CharacterSetup.css"
import { getCharacter, type CharacterType } from "./Characters"

function addAllSelected(dispatch : React.Dispatch<GrimAction>, state : GrimState) {
    dispatch({
        type: "batch",
        actions: [
            ...state.selectedCharacterIds.map(id => ({
                type: "addToken" as const,
                id: crypto.randomUUID(),
                characterId: id
            })),
            { type: "clearSelectedCharacterIds" },
        ]
    })
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
    const counts = getSelectedTypeCounts(state)
    const expectedCounts = getCharacterTypeCounts(7) /* TODO: Change with expected player count */

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
                    <div> {/* TODO: fix button colors */}
                        <button onClick={() => setType("townsfolk")}>Townsfolk {counts.townsfolk}</button>
                        <button onClick={() => setType("outsider")}>Outsiders {counts.outsider}</button>
                        <button onClick={() => setType("minion")}>Minions {counts.minion}</button>
                        <button onClick={() => setType("demon")}>Demons {counts.demon}</button>
                    </div>
                    <div>
                        {characterIdsByType["traveller"].length !== 0 && <button onClick={() => setType("traveller")}>Travellers</button>}
                        {characterIdsByType["fabled"].length !== 0 && <button onClick={() => setType("fabled")}>Fabled</button>}
                        {characterIdsByType["loric"].length !== 0 && <button onClick={() => setType("loric")}>Lorics</button>}
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