import { useCallback, useRef, useState } from "react"
import DisplayToken from "./DisplayToken"

function rows(ids : string[]) : { top: string[], bottom: string[] } {
    const midpoint = Math.ceil(ids.length / 2)
    return { top: ids.slice(0, midpoint), bottom: ids.slice(midpoint, ids.length) }
}

interface TokenGridProps {
    ids: string[]
    onClickId: (id: string) => void
    isSelected?: (id: string) => boolean
}

export default function TokenGrid({ids, onClickId, isSelected }: TokenGridProps) {
    const { top, bottom } = ids.length > 2 ? rows(ids) : { top: ids, bottom: []}
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
        <div className="selection-list" style={{ "--token-diameter": `${tokenDiameter}px` } as React.CSSProperties} ref={containerRef}>
            <div className="selection-rows">
                <div className="selection-row">
                    {top.map(id => (
                        <DisplayToken key={id} className={isSelected?.(id) ? "selected" : ""} characterId={id} onClick={() => onClickId(id)}/>
                    ))}
                </div>
                {bottom.length != 0 &&
                    <div className={"selection-row bottom"}>
                        {bottom.map(id => (
                            <DisplayToken key={id} className={isSelected?.(id) ? "selected" : ""} characterId={id} onClick={() => onClickId(id)}/>
                        ))}
                    </div>
                }
            </div>
        </div>
    )
}