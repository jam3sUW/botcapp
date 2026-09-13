import { useState } from "react"
import Modal from "./Modal";
import "./DemoPopup.css"

const DEMO_VERSION = "1"
const DEMO_KEY = "demo-seen"

export default function DemoPopup() {
    const [open, setOpen] = useState(() => {
        try {
            return localStorage.getItem(DEMO_KEY) !== DEMO_VERSION
        } catch {
            return false
        }
    })

    const handleClose = () => {
        try {
            localStorage.setItem(DEMO_KEY, DEMO_VERSION)
        } catch {}
        setOpen(false)
    }

    return (
        <Modal className="demo-modal" onClose={handleClose} open={open}>
            <h2>Welcome to the UW BOTC web app!</h2>
            <p>For more information, visit the <a target="_blank" rel="norefererr" href="https://github.com/jam3suw/botcapp">GitHub repo.</a></p>
            <img src="/Demo.gif"/>
        </Modal>
    )
}