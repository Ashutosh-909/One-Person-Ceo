# Prototype Build Prompt — "One Person CEO"

> Paste everything below into your AI coding agent (or use it as the project spec).
> It is written as a single, self-contained instruction to generate a working, clickable prototype.

---

## ROLE

You are a senior full-stack engineer + pixel-art game UI designer. Build a **clickable web prototype** for a game-like productivity app called **"One Person CEO"**. Prioritize a working, navigable click-through demo over real backend integrations. Mock/stub any external service.

## ONE-LINE CONCEPT

Gamify the multi-agent workflows a solo founder goes through to run an app, by letting them "walk" through a pixel-art office building where each department is an AI agent persona they can meet, chat with, and assign work to.

## VISUAL DIRECTION (non-negotiable)

- **Old-school pixel art / retro 16-bit office aesthetic.** Think top-down/isometric SNES-era office sim.
- Limited, warm palette; chunky pixel fonts (e.g. "Press Start 2P" or "VT323" via Google Fonts).
- Crisp pixels: `image-rendering: pixelated;` on all sprites, no anti-aliasing blur.
- Retro UI chrome: beveled buttons, dialog boxes with pixel borders, blinking cursors, subtle CRT scanline overlay (toggleable).
- Chiptune-style optional SFX on clicks/transitions (muted by default, with a sound toggle).

## TECH STACK (suggested — keep it simple)

- **React + TypeScript + Vite.**
- **Tailwind CSS** for layout + a small custom pixel theme.
- Simple client-side state via React context or Zustand. **No real backend required** — use in-memory/mock data and `localStorage` for persistence.
- Framer Motion (or CSS) for screen transitions (elevator doors, zoom-into-floor).
- All agent replies are **mocked** with canned/randomized responses (see chat script section). Structure the code so a real LLM call could drop in later behind a `getAgentReply()` function.

## DEPARTMENTS (the 5 agents)

Each app "floor" has 5 department cubicles, each represented by a pixel-art persona with a name, avatar, color, and a personal to-do list:

| Dept | Persona | Vibe | Sample owned tasks |
|------|---------|------|--------------------|
| Development | "Dev" / Ada | pragmatic engineer | ship features, fix bugs, code review |
| Design | "Pix" / Milo | creative, playful | UI mockups, icons, brand kit |
| Marketing | "Buzz" / Nova | hype, growth | campaigns, social posts, launch copy |
| DevOps | "Ops" / Rex | calm, reliability-obsessed | deploys, monitoring, incidents |
| Finance | "Cash" / Vera | precise, cautious | runway, pricing, invoices |

Each agent has: `id`, `name`, `title`, `avatarSprite`, `themeColor`, `todos: Todo[]`, `status: 'idle' | 'working' | 'blocked'`.

---

## SCREENS & FLOW (build all of these)

### 1. Login (retro splash)
- Pixel-art title screen "ONE PERSON CEO", blinking "PRESS START / LOGIN".
- Fake login (any input works) → goes to the **Elevator Lobby**.

### 2. Elevator / Lobby
- The user starts **inside an elevator**. A pixel elevator panel shows **one button per app (floor)**.
- **Lobby** has two extra actions:
  - **"+ Create App"** → adds a new floor (adds a new button to the elevator panel). Opens the **Registration** flow (see #6).
  - **"Registration"** → connect integrations for a project (see #6).
- Clicking a floor button plays an **elevator-door-open transition**, then enters that **Floor**.

### 3. Floor (bird's-eye view of the office)
- Top-down / isometric pixel office for the selected app.
- Contains **5 cubicles** (one per department, labeled + agent sprite at their desk), a **Conference Room**, and the **Elevator** (to go back).
- Each cubicle shows the agent's status and a small badge with their open to-do count.
- The CEO can **select 1 or more departments** (click cubicles to toggle a "selected" highlight).
- A **"Meet Now"** button (enabled when ≥1 dept selected) and a **"Not Now"** button.
  - **Not Now** → deselect / stay on floor.
  - **Meet Now** → transition (walk into conference room / zoom) to the **Round Table** view with exactly the selected agents present.

### 4. Round Table (the meeting)
Layout: a pixel **round conference table** with the CEO seat + one seat per selected agent persona (only selected departments appear).

Includes these panels:
- **Chat window** (main): CEO and each department can post **text, files, or images**. Show sender avatar + name + timestamp. File/image uploads are mocked (show a pixel file chip / thumbnail preview; no real upload).
- **Whiteboard**: a canvas the CEO can **draw on** (freehand pen, color picker, clear button). Retro grid background.
- **Agent behavior**: when the CEO writes a message, the **relevant agent(s) reply** and may **take an action** — e.g. add an item to their to-do list, change status to `working`, or post a mock artifact (a "generated" image chip, a code-diff chip, a budget number). Reflect to-do changes live in a side "Agents & To-Dos" panel.
- **Leave Meeting** → back to the Floor.

### 5. Agents & To-Dos side panel (persistent in Round Table)
- Live list per present agent with their to-dos and statuses. Items added during chat animate in.

### 6. Registration (from Lobby)
- Form to **create a new project / app** and connect integrations (all mocked, no real OAuth):
  - **GitHub repo** (repo URL / "Connect GitHub")
  - **Apple account / App Store Connect API** (key id, issuer id — mocked)
  - **Instagram API** ("Connect Instagram")
  - **Gmail** ("Connect Google")
- On submit → creates a new floor in the elevator and seeds the 5 department agents with a couple of starter to-dos each.

---

## AGENT REPLY ENGINE (mocked)

Implement `getAgentReply(deptId, ceoMessage, context)` returning `{ text, action? }` where `action` can be:
- `{ type: 'addTodo', deptId, todo }`
- `{ type: 'setStatus', deptId, status }`
- `{ type: 'postArtifact', deptId, artifact }` (mock image/code/number chip)

Use **keyword routing** (e.g. "bug/deploy/price/logo/launch") to pick which department responds, and fall back to the selected agents round-robin. Randomize among 3–5 canned lines per department so it feels alive.

### Random conference chat script (seed these)

When the CEO clicks **Meet Now** with departments selected, pre-populate the chat with a short, funny, realistic "standup" so the room feels alive. Randomly pick a few lines from the pools below (only for departments present):

**Kickoff (CEO auto-line options):**
- "Morning team — where are we on the launch?"
- "Okay, quick sync. What's blocking us today?"
- "Investor demo is Friday. What can we ship?"

**Development (Ada):**
- "Login flow is done, but the elevator animation is eating 300ms — I can optimize."
- "Found a null-pointer in the payments path. Patching now, ETA 1 hour."
- "Feature-flagged the new dashboard. Want it on for the demo?"
- "Code review's clean. Merging to main. 🚀"

**Design (Milo):**
- "New app icon options are ready — going with the pixel rocket, it slaps."
- "Contrast on the dark theme was failing a11y, fixed it."
- "Whiteboard me a rough layout and I'll pixel it up by EOD."
- "Can we NOT use Comic Sans this time. Please."

**Marketing (Nova):**
- "Teaser post is scheduled. We hit 2k impressions on the last one."
- "Need one killer screenshot for the launch tweet — Design, help?"
- "Waitlist crossed 500. People are hyped."
- "I wrote three taglines. My favorite: 'Run your whole company. Solo.'"

**DevOps (Rex):**
- "Prod is green. p99 latency is 180ms, we're fine."
- "Staging deploy succeeded. Rolling to prod after Dev's merge."
- "Heads up: SSL cert renews in 6 days, automating it."
- "Set up alerts so I stop finding out about outages on Twitter."

**Finance (Vera):**
- "Runway is 7.2 months at current burn. Tightening cloud spend."
- "Stripe fees are creeping up — suggest annual plans."
- "If we convert 3% of the waitlist we break even in Q3."
- "Approving the design tool subscription. Denying the office snacks. Sorry."

**Cross-talk / banter (pick 0–2):**
- Nova → Milo: "Ship me that icon and I'll make us trend."
- Rex → Ada: "Merge whenever, I've got the rollback ready."
- Vera → everyone: "Every 'quick feature' has a cloud bill attached. Just saying."

Render these as staggered, animated chat bubbles (150–400ms apart) so the room "comes to life" on entry.

---

## STATE MODEL (TypeScript sketch)

```ts
type Status = 'idle' | 'working' | 'blocked';
interface Todo { id: string; text: string; done: boolean; }
interface Agent {
  id: string; dept: 'dev'|'design'|'marketing'|'devops'|'finance';
  name: string; title: string; color: string; sprite: string;
  status: Status; todos: Todo[];
}
interface App { id: string; name: string; floor: number; agents: Agent[]; integrations: Integrations; }
interface Integrations { github?: string; apple?: boolean; instagram?: boolean; gmail?: boolean; }
interface ChatMessage {
  id: string; author: 'ceo' | Agent['dept']; kind: 'text'|'image'|'file';
  content: string; ts: number;
}
```

## ACCEPTANCE CRITERIA (definition of done)

1. Can "log in", ride the elevator, and enter a floor.
2. Floor shows 5 cubicles + conference room + elevator; can select multiple depts.
3. "Meet Now" opens the Round Table with only selected agents + auto-seeded random standup chat.
4. Chat supports text + mocked file/image; agents reply and mutate their to-dos live.
5. Whiteboard draws and clears.
6. "+ Create App" / Registration adds a new floor with 5 seeded agents.
7. Everything looks like cohesive retro pixel art with smooth transitions.
8. Persists apps + chats to `localStorage`.

## DELIVERABLES

- Runnable project (`npm install && npm run dev`).
- Clean component structure: `Elevator`, `Floor`, `Cubicle`, `RoundTable`, `ChatWindow`, `Whiteboard`, `AgentTodoPanel`, `Registration`.
- A short `README.md` with run steps and a note on where to plug in a real LLM (`getAgentReply`).
- Placeholder pixel sprites (generate simple CSS/SVG pixel art or emoji-on-tile fallbacks if no assets) so the app runs without external image files.

Build it now. Start by scaffolding the Vite + React + TS + Tailwind project and the state model, then implement screens in flow order (Login → Elevator → Floor → Round Table → Registration).
