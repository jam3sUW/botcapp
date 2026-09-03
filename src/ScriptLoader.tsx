import type { GrimAction } from "./Grimoire";
import React, { useState } from "react";
import { loadScript } from "./Scripts";
import officalScripts from "./data/scripts.json"

interface ScriptLoaderProps {
    dispatch: React.Dispatch<GrimAction>
}

export default function ScriptLoader({ dispatch }: ScriptLoaderProps) {
    const [error, setError] = useState<string | null>(null)

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (!files || files.length === 0) return;

        const file = files[0]
        if (!file) return

        try {
            const content = await file.text()
            const jsonContent = JSON.parse(content)
            const script = loadScript(jsonContent)
            dispatch({ type: "setScript", script: script})
            setError(null)
        } catch {
            setError("Invalid  or corrupt file!")
        }
    }

    return (
        <div>
            {Object.values(officalScripts).map(script => (
                <button key={script.name} onClick={() => dispatch({ type: "setScript", "script": script })}>{script.name}</button>
            ))}
            <input type="file" accept=".json" onChange={handleFileUpload} />
            {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
    )
}