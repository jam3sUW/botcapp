import { useCallback, useRef, useState } from "react"
import Modal from "./Modal"
import type { GrimAction, GrimState } from "./Grimoire"
import DisplayToken from "./DisplayToken"
import { getCharacterTypeCounts, getScriptCharacterTypes } from "./Scripts"
import "./CharacterSetup.css"
import { getCharacter, type CharacterType } from "./Characters"

function addAllSelected(dispatch : React.Dispatch<GrimAction>, state : GrimState) { /* TODO: make work with fabled/lorics */
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
    const expectedCounts = getCharacterTypeCounts(state.expectedPlayerCount) /* TODO: Change with expected player count */
    const [containerWidth, setContainerWidth]  = useState(0)
    const observerRef = useRef<ResizeObserver | null>(null)

    const containerRef = useCallback((node: HTMLDivElement | null) => {
        observerRef.current?.disconnect()
        if (!node) return
        observerRef.current = new ResizeObserver(entries => {
            setContainerWidth(entries[0]!.contentRect.width)
        })
        observerRef.current.observe(node)
    }, [])

    const MAX_DIAMETER = 120
    const MIN_DIAMETER = 60
    const GAP = 10
    const tokenDiameter = Math.max(MIN_DIAMETER, Math.min(MAX_DIAMETER, (containerWidth - ((top.length - 1) * GAP)) / top.length))

    return (
        <>
            <button disabled={state.script.name === "No Script"} onClick={() => { setType("townsfolk"); setOpen(true); }}>Select roles</button>
            <Modal className="character-setup-modal" onClose={() => setOpen(false)} open={open}>
                <div>
                    <label>Player count: </label>
                    <input type="number" value={state.expectedPlayerCount} min={5} max={15} onChange={(e) => dispatch({ type: "setExpectedPlayerCount", count: Number(e.target.value) })}/>
                </div>
                <div className="selection-list" style={{ "--token-diameter": `${tokenDiameter}px` } as React.CSSProperties} ref={containerRef}>
                    <div className="selection-rows">
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
                </div>
                <div> {/* TODO: fix button colors */}
                    <button onClick={() => setType("townsfolk")}>Townsfolk {counts.townsfolk}/{expectedCounts.townsfolk}</button>
                    <button onClick={() => setType("outsider")}>Outsiders {counts.outsider}/{expectedCounts.outsiders}</button>
                    <button onClick={() => setType("minion")}>Minions {counts.minion}/{expectedCounts.minions}</button>
                    <button onClick={() => setType("demon")}>Demons {counts.demon}/{expectedCounts.demons}</button>
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
                    }}>Add all</button> {/* Minor visual glitch, unselection upon closing popup */}
                    <button onClick={() => dispatch({ type: "clearSelectedCharacterIds" })}>Clear</button>
                </div>
                <div>
                </div>
            </Modal>
        </>
    )
}

export default CharacterSetup