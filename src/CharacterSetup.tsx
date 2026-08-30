import { useState } from "react"
import Modal from "./Modal"

function CharacterSetup() {
    const [open, setOpen] = useState(false)

    return (
        <>
            <button onClick={() => setOpen(true)}>Select roles</button>
            {open && (
                <Modal className="character-setup-modal" onClose={() => setOpen(false)}>{null}</Modal>
            )}
        </>
    )
}

export default CharacterSetup