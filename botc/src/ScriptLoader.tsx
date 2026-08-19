import type { GrimAction } from "./Grimoire";
import React, { useState } from "react";
import { loadScript } from "./Scripts";

interface ScriptLoaderProps {
    dispatch: React.Dispatch<GrimAction>
}

export default function ScriptLoader({ dispatch }: ScriptLoaderProps) {
    const [error, setError] = useState<string | null>(null)

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (!files || files.length === 0) return;

        const file = files[0]

        try {
            const content = await file.text()
            const jsonContent = JSON.parse(content)
            const script = loadScript(jsonContent)
            dispatch({ type: "setScript", script: script})
            setError(null)
        } catch(err) {
            setError("Invalid  or corrupt file!")
        }
    }

    return (
        <div>
            <input type="file" accept=".json" onChange={handleFileUpload} />
            {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
    )
}