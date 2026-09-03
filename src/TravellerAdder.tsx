import { useState } from "react";
import type { GrimAction, GrimState } from "./Grimoire";
import Modal from "./Modal";
import TokenGrid from "./TokenGrid";
import { travellers } from "./Characters";
import { getScriptCharacterTypes } from "./Scripts";

export default function TravellerAdder({ dispatch, state } : { dispatch: React.Dispatch<GrimAction>, state: GrimState }) {
    const [open, setOpen] = useState(false)
    const [showAll, setShowAll] = useState(false)
    const characterIdsByType = getScriptCharacterTypes(state.script)
    const ids = (!showAll && characterIdsByType["traveller"].length !== 0) ? characterIdsByType["traveller"] : travellers.map(traveller => traveller.id)
    
    return (
        <>
            <button disabled={state.script.name === "No Script"} onClick={() => { setOpen(true); setShowAll(false) }}>Add traveller</button>
            <Modal className="character-setup-modal" onClose={() => setOpen(false)} open={open}>
                <TokenGrid ids={ids} onClickId={id => { dispatch({ type: "addToken", characterId: id, id: crypto.randomUUID() }); setOpen(false) }}/>
                {characterIdsByType["traveller"].length !== 0 &&
                    <button onClick={() => setShowAll(!showAll)}>{!showAll ? "Show all" : "Show on script"}</button>
                }
            </Modal>
        </>
    )
}