export interface Script {
    characterIds: string[]
    name: string
    author: string
    bootlegger?: string[]
}

export function loadScript(data: any[]) : Script {
    let name = ""
    let author = ""
    let bootlegger = null
    const charIds = []
    for (const entry of data) {
        if (typeof(entry) === "object" && entry !== null) {
            if (entry.id === "_meta") {
                name = entry.name ?? ""
                author = entry.author ?? ""
                bootlegger = entry.bootlegger ?? undefined
                continue
            } else {
                charIds.push(entry.id)
            }
        } else {
            charIds.push(entry)
        }
    }
    return {name: name, author: author, bootlegger: bootlegger, characterIds: charIds}
}