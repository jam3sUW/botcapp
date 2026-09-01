import { useState } from "react"
import Modal from "./Modal"
import type { GrimState } from "./Grimoire"
import DisplayToken from "./DisplayToken"
import { getScriptCharacterTypes, type CharacterType } from "./Scripts"
import "./CharacterSetup.css"

function rows(ids : string[]) : { top: string[], bottom: string[] } {
    const midpoint = Math.ceil(ids.length / 2)
    return { top: ids.slice(0, midpoint), bottom: ids.slice(midpoint, ids.length) }
}

function CharacterSetup({ state } : { state: GrimState }) {
    const [open, setOpen] = useState(false)
    const [chosenType, setType] = useState<CharacterType | "">("townsfolk")
    const characterIdsByType = getScriptCharacterTypes(state.script)

    return (
        <>
            <button disabled={state.script.name === "No Script"} onClick={() => setOpen(true)}>Select roles</button>
            {open && (
                <Modal className="character-setup-modal" onClose={() => {
                        setType("townsfolk")
                        setOpen(false)
                    }}>
                    <div className="selection-list">
                        {chosenType && characterIdsByType[chosenType].length > 2 && ( /* TODO: Better way to check length? ALso sizing */
                            <>
                                <div className="selection-row">
                                    {rows(characterIdsByType[chosenType]).top.map(id => (
                                        <DisplayToken key={id} characterId={id}/>
                                    ))}
                                </div>
                                <div className={"selection-row bottom"}>
                                    {rows(characterIdsByType[chosenType]).bottom.map(id => (
                                        <DisplayToken key={id} characterId={id}/>
                                    ))}
                                </div>
                            </>
                        )}
                        {chosenType && characterIdsByType[chosenType].length <= 2 && (
                            <div className="selection-row">
                                {characterIdsByType[chosenType].map(id => (
                                    <DisplayToken key={id} characterId={id}/>
                                ))}
                            </div>
                        )}
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
                </Modal>
            )}
        </>
    )
}

export default CharacterSetup