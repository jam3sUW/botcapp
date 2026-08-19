import { loadCharacters } from "./Characters"
import { killToken, reviveToken, toggleTokenDeadVote, rotateToken, formatToken } from "./Tokens"
import type { Token } from "./Tokens"
import { loadScript } from "./Scripts"
import { firstNightOrder, grimActionReducer, initialGrimState, otherNightOrder } from "./Grimoire"

const characters = loadCharacters()
console.log("=== Characters ===")
console.log(characters)

const washerwoman = characters["washerwoman"] // use a real id from your JSON
const t: Token = { id: "1", character: washerwoman, isAlive: true, isRotated: false, hasDeadVote: false }
console.log("=== Tokens ===")
console.log("original:      ", formatToken(t))
console.log("killed:        ", formatToken(killToken(t)))
console.log("revived:       ", formatToken(reviveToken(killToken(t))))
console.log("dead vote off: ", formatToken(toggleTokenDeadVote(t)))
console.log("rotated:       ", formatToken(rotateToken(t)))
console.log("original again (should be unchanged):", t)

const rawScript = [
  { id: "_meta", name: "Trouble Brewing", author: "The Pandemonium Institute" },
  "washerwoman",
  { id: "librarian" },
  "investigator",
]
console.log("=== Scripts ===")
const testScript = loadScript(rawScript)
console.log(testScript)

let state = initialGrimState
state = grimActionReducer(state, { type: "setScript", script: testScript})
console.log("=== Grim: after setScript ===", state)
state = grimActionReducer(state, { type: "addToken", characterId: "washerwoman", name: "Alice" })
console.log("=== Grim: after addToken ===", state)
state = grimActionReducer(state, { type: "addToken", characterId: "does-not-exist" })
console.log("after addToken w/ bad id (should be unchanged):", state)
state = grimActionReducer(state, { type: "removeToken", id: state.tokens[0].id })
console.log("after removeToken:", state)
state = grimActionReducer(state, { type: "clear" })
console.log("after clear (script should survive):", state)

console.log("=== Night Order ===")
state = grimActionReducer(state, { type: "addToken", characterId: "washerwoman", name: "Alice" })
state = grimActionReducer(state, { type: "addToken", characterId: "fortuneteller", name: "Bob" })
state = grimActionReducer(state, { type: "addToken", characterId: "monk", name: "Alice" })
state = grimActionReducer(state, { type: "addToken", characterId: "imp", name: "Eve" })
console.log("Initial state:", state)
console.log(firstNightOrder(state.tokens))
console.log(otherNightOrder(state.tokens))