import { type GrimAction, type GrimState} from "./Grimoire";
import { getCharacter } from "./Characters";
import { generateBluffs, validBluffs } from "./Bluffs";

interface BluffManagerProps {
    dispatch: React.Dispatch<GrimAction>
    state: GrimState
}

export default function BluffManager({ dispatch, state }: BluffManagerProps) {
    return (
        <div>
             <button onClick={() => dispatch({ type: "addBluffSet", id: crypto.randomUUID(), characterIds: ["", "", ""] })}>Add bluffs</button>
            {state.bluffSets.map(bluffSet =>
                <ul key={bluffSet.id}>
                    <li key={bluffSet.id}>
                        {bluffSet.characterIds.map((characterId, index) => (
                                <select key={index}
                                    value={characterId}
                                    onChange={(e) => {
                                        const newIds = [ ...bluffSet.characterIds]
                                        newIds[index] = e.target.value
                                        dispatch({ type: "updateBluffSet", id: bluffSet.id, characterIds: newIds})
                                    }}
                                >
                                    <option value="" disabled>Choose...</option>
                                    {validBluffs(state).map(id => {
                                        const character = getCharacter(id)
                                        return (
                                        <option key={id} value={id}>
                                            {character?.name ?? "Unknown character"}
                                        </option>
                                    )})}
                                </select>
                            
                        ))}
                    </li>
                    <li>
                        <button onClick={() => dispatch({ type: "updateBluffSet", id: bluffSet.id, characterIds: generateBluffs(state)})}>Auto bluffs</button>
                        <button onClick={() => dispatch({ type: "removeBluffSet", id: bluffSet.id})}>Remove bluffs</button>
                    </li>
                </ul>
            )}
        </div>
    )
}