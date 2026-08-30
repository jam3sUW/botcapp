import { type ReactNode } from "react";
import { createPortal } from "react-dom";

function Modal({ children, onClose }: { children: ReactNode, onClose: () => void }) {
    const root = document.getElementById("modal-root")
    if (root === null) {
        return null
    }

    return createPortal(
        <div className="modal-background" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                {children}
                <button onClick={onClose}>Close</button>
            </div>
        </div>,
        root
    )
}

export default Modal