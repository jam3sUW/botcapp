# Blood on the Clocktower Grimoire (Name WIP)

A browser-based "Grimoire" (storyteller's tool) for running games of [Blood on the Clocktower](https://bloodontheclocktower.com/), built for my uni's BOTC club.

**Status: EXTREMELY work in progress.** Barely anything is done. Core state management and a functional token/script/bluff/reminder UI are working. Fancy stuff forthcoming.

## Why

I wanted a grim tool optimized for local play with features other (excellent!) tools lack. Specifically auto-resolution, offline modes, and co-storytelling support. I run games for the 100+ member university club I founded, so I'm builing the tool I want to use.

## Current features

- Add, remove, kill, revive, and rotate tokens on the board
- Load offical and custom scripts (but not homebrew, yet) and scope character selection to it
- Bluff support with auto-generation
- Track and add per-character and global reminder tokens
- View in-play jinxes
- Full undo/redo history!

## Planned features

- MAJOR UI OVERHAULS FOR EVERYTHING
- Automatic role assignment
- Step-by-step storyteller instructions and auto-resolution
- Offline support as an installable PWA
- Online support for co-storytelling

## Architecture notes

- State is managed with a single `useReducer` over a discriminated-union `GrimAction` type, with an undo/redo history wrapper around it.
- All actions are plain, deterministic JSON to support future multiplayer features.
- Game logic was first prototyped in Python (see `/prototype`) as I figured out the shape of things.

## Tech stack

React, TypeScript, Vite. Character/script data vendored locally from [Pocket Grimoire](https://github.com/Skateside/pocket-grimoire)'s excellent dataset rather than fetched at runtime.

## Running locally

```bash
npm install
npm run dev
```
