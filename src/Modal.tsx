import { type ReactNode } from "react";
import { createPortal } from "react-dom";
import "./Modal.css"

function Modal({ children, onClose, className }: { children: ReactNode, onClose: () => void, className?: string }) {
    const root = document.getElementById("modal-root")
    if (root === null) {
        return null
    }

    return createPortal(
        <div className="modal-background" onClick={onClose}>
            <div className={`modal-content ${className ?? ""}`} onClick={(e) => e.stopPropagation()}>
                {children}
            </div>
        </div>,
        root
    )
}

export default Modal