import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import "./Modal.css"

interface ModalProps {
    children: ReactNode,
    onClose: () => void,
    open: boolean,
    className?: string
}

function Modal({ children, onClose, open, className } : ModalProps) {
    const [rendered, setRendered] = useState(open)

    useEffect(() => {
        if (open) {
            setRendered(true)
        }
    }, [open])

    const root = document.getElementById("modal-root")
    if (!rendered || root === null) {
        return null
    }

    return createPortal(
        <div
            className={`modal-background ${open ? "fade-in" : "fade-out"}`}
            onClick={onClose}
            onAnimationEnd={() =>  { if (!open) setRendered(false) }}
        >
            <div 
                className={`modal-content ${className ?? ""} ${open ? "fade-in" : "fade-out"}`}
                onClick={(e) => e.stopPropagation()}
                onAnimationEnd={() =>  { if (!open) setRendered(false) }}
            >
                {children}
            </div>
        </div>,
        root
    )
}

export default Modal