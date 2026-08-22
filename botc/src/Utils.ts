export function nRandom<T>(items: T[], count: number) : T[] {
    const n = items.length
    const k = Math.min(Math.max(count, 0), n)
    if (k === 0) {
        return []
    }

    const map = new Map<number, T>()
    const arr: T[] = []

    for (let i = n - 1; i >= n - k; i--) {
        const j = Math.floor(Math.random() * (i + 1))

        const valI = map.has(i) ? map.get(i)! : items[i]!
        const valJ = map.has(j) ? map.get(j)! : items[j]!

        arr.push(valJ)
        map.set(j, valI)
    }

    return arr
}