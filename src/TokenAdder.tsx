import { useState } from "react";
import type { GrimAction, GrimState } from "./Grimoire";
import Modal from "./Modal";
import TokenGrid from "./TokenGrid";
import type { CharacterType } from "./Characters";
import { getScriptCharacterTypes } from "./Scripts";

export default function TokenAdder({ dispatch, state } : { dispatch: React.Dispatch<GrimAction>, state: GrimState }) {
    const [open, setOpen] = useState(false)
    const [chosenType, setType] = useState<CharacterType>("townsfolk")
    const characterIdsByType = getScriptCharacterTypes(state.script)
    const ids = characterIdsByType[chosenType]
    
    return (
        <>
            <button disabled={state.script.name === "No Script"} onClick={() => { setType("townsfolk"); setOpen(true) }}>Add token</button>
            <Modal className="character-setup-modal" onClose={() => setOpen(false)} open={open}>
                <TokenGrid ids={ids} onClickId={id => { dispatch({ type: "addToken", characterId: id, id: crypto.randomUUID() }); setOpen(false) }}/>
                <div>
                    <button onClick={() => setType("townsfolk")}>Townsfolk</button>
                    <button onClick={() => setType("outsider")}>Outsiders</button>
                    <button onClick={() => setType("minion")}>Minions</button>
                    <button onClick={() => setType("demon")}>Demons</button>
                </div>
            </Modal>
        </>
    )
}