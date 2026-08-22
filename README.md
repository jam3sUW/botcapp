# Blood on the Clocktower Grimoire

A browser-based "Grimoire" (storyteller's tool) for running games of [Blood on the Clocktower](https://bloodontheclocktower.com/) — built because the existing digital tools were missing features I wanted for running games with my club.

**Status: work in progress.** Core state management and a functional token/script/bluff/reminder UI are working; seating layout, drag-and-drop, and the multiplayer stretch goal are not built yet.

## Why

Existing Grimoire tools are either paid, missing script/homebrew support, or don't track the things I actually want tracked as a storyteller (reminder tokens, bluffs, jinxes between characters in play). I run games for a 100+ member university club, so I built the tool I wanted to use.

## What it does today

- Add, remove, kill, revive, and rotate tokens on the board
- Load an official script (or upload a custom/homebrew script as JSON) and scope character selection to it
- Auto-generate demon bluffs, with a manual override
- Track and add per-character and global reminder tokens
- Surface jinxes between characters currently in play
- Full undo/redo history

## What's planned

- Seating layout and drag-and-drop token positioning
- Automatic role assignment and step-by-step storyteller instructions
- Offline support as an installable PWA
- Stretch goal: host-authoritative online play (one browser hosts, others connect in)

## Architecture notes

- State is managed with a single `useReducer` over a discriminated-union `GrimAction` type, with an undo/redo history wrapper around it.
- All actions are plain, JSON-serializable data — no functions or class instances — a constraint driven by the multiplayer stretch goal above: if state ever needs to sync across a host and connected clients, every action has to survive being sent over the wire and replayed deterministically.
- Game logic was first prototyped in Python (see `/prototype`) to work out the data model before committing to the TypeScript/React rewrite.

## Tech stack

React, TypeScript, Vite. Character/script data vendored locally from [a community-maintained BotC roles dataset](#) rather than fetched at runtime.

## Running locally

```bash
npm install
npm run dev
```
