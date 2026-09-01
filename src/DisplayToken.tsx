import "./DisplayToken.css"
import { getCharacter } from "./Characters";

function DisplayToken({ characterId, className, onClick }: { characterId?: string, className?: string, onClick?: () => void }) {
    const character = characterId !== undefined ? getCharacter(characterId) : undefined
    const imgFilepath = character && `/assets/characters/${character.edition}/${characterId}.webp`
    return (
        <div className={`token-circle ${className ?? ""}`} onClick={onClick}> 
            {imgFilepath && <img src={imgFilepath}/>}
        </div>
    )
}

export default DisplayToken