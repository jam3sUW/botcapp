import { useState } from "react";
import type { GrimAction, GrimState } from "./Grimoire";
import Modal from "./Modal";
import TokenGrid from "./TokenGrid";
import { fabledLorics, getCharacter } from "./Characters";
import { getScriptCharacterTypes, type ScriptCharacterIdsByType } from "./Scripts";

function firstAvailableType(idsByType: ScriptCharacterIdsByType): "fabled" | "loric" {
    return idsByType["loric"].length !== 0 ? "loric" : "fabled"
}

export default function FabledLoricAdder({ dispatch, state } : { dispatch: React.Dispatch<GrimAction>, state: GrimState }) {
    const [open, setOpen] = useState(false)
    const [showAll, setShowAll] = useState(false)
    const characterIdsByType = getScriptCharacterTypes(state.script)
    const [chosenType, setType] = useState<"fabled" | "loric">(firstAvailableType(characterIdsByType))
    const hasFabled = characterIdsByType["fabled"].length !== 0
    const hasLoric = characterIdsByType["loric"].length !== 0
    const showingAll = showAll || (!hasFabled && !hasLoric)
    const ids = showingAll ? fabledLorics.filter(id => getCharacter(id)?.characterType === chosenType) : characterIdsByType[chosenType]
    const showTabs = showingAll || (hasFabled && hasLoric)

    return (
        <>
            <button onClick={() => { setOpen(true); setShowAll(false); setType(firstAvailableType(characterIdsByType)) }}>Add Fabled/Loric</button>
            <Modal className="character-setup-modal" onClose={() => setOpen(false)} open={open}>
                <TokenGrid ids={ids} onClickId={id => { dispatch({ type: "addFabledLoric", characterId: id }); setOpen(false) }}/>
                
                {showTabs &&
                    <div>
                        <button onClick={() => setType("fabled")}>Fabled</button>
                        <button onClick={() => setType("loric")}>Lorics</button>
                    </div>
                }

                {(hasFabled || hasLoric) &&
                    <button onClick={() => setShowAll(!showAll)}>{!showAll ? "Show all" : "Show on script"}</button>
                }
                
            </Modal>
        </>
    )
}