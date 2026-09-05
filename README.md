# One Person CEO 🏢

A clickable, retro **16-bit office sim** prototype that gamifies the multi-agent
workflow of a solo founder. Ride the elevator between your apps, walk each
floor's department cubicles, and pull agents into a round-table meeting where
they chat, take actions, and update their to-do lists live.

> Prototype only — every agent reply and integration is **mocked**. No backend.

## Run

```bash
npm install
npm run dev
```

Then open the printed local URL (usually http://localhost:5173).

Build a production bundle with `npm run build` and preview it with `npm run preview`.

## Flow

1. **Login** — pixel splash, any name works → **Elevator**.
2. **Elevator / Lobby** — one button per app (floor), plus **+ Create App** and
   **Registration**. Picking a floor plays an elevator-door transition.
3. **Floor** — top-down office with 5 department cubicles, a conference room, and
   the elevator. Click cubicles to select departments, then **Meet Now**.
4. **Round Table** — only the selected agents appear, seated around a pixel
   conference table with the CEO at its head. An auto-seeded standup plays out,
   agents raise typing bubbles over their seats, and the right-hand panel
   toggles between **CHAT** (text + mocked file/image), **WHITEBOARD**, and
   **TO-DOS**. Below 1024px the panel undocks and stacks under the room.
5. **Registration** — create a new project and toggle mocked integrations
   (GitHub, App Store Connect, Instagram, Gmail). Submitting adds a new floor
   seeded with 5 agents.

Everything (apps, chats, toggles) persists to `localStorage`.

## Where to plug in a real LLM

All agent behavior is routed through two functions in
[src/data/agentEngine.ts](src/data/agentEngine.ts):

- `routeDepartments(message, present)` — decides which departments respond
  (keyword routing with round-robin fallback).
- `getAgentReply(deptId, ceoMessage, context)` — returns `{ text, action? }`.

Replace the body of `getAgentReply` with a real API call (keep it returning the
same `AgentReply` shape) and the rest of the app — chat rendering, to-do
mutation, artifacts, status changes — keeps working unchanged.

## Structure

```
src/
  App.tsx                 screen router + transitions
  types.ts                shared state model
  state/store.ts          Zustand store (+ localStorage persistence)
  data/
    departments.ts        the 5 department personas + seeding
    agentEngine.ts        mocked reply engine + canned scripts
    sfx.ts                chiptune blip helper (WebAudio)
  components/
    Login.tsx  Elevator.tsx  Lobby.tsx  Floor.tsx
    RoundTable.tsx          meeting screen: chrome + room + side panel
    MeetingRoom.tsx         the pixel meeting room itself
    pixel/PixelSprites.tsx  shared pixel-art sprites
    ChatWindow.tsx  Whiteboard.tsx
    AgentTodoPanel.tsx  Registration.tsx  Hud.tsx
```

## Notes

- Fonts: "Press Start 2P" + "VT323" via Google Fonts.
- Toggle the **CRT** scanline overlay and **SFX** from the top-right HUD.
- Sprites are emoji-on-tile fallbacks with `image-rendering: pixelated`, so the
  app runs with zero external image assets. The meeting room is the exception:
  its people, furniture and skyline are CSS pixel art built from coloured
  blocks, outlined with the `.sprite-outline-*` drop-shadow stacks in
  `index.css`.
- The room is authored at a fixed 1312x940 design size and scaled to fit its
  container, so the pixel art never reflows mid-sprite; it sheds the window art
  and then the projector chart as it gets small.
