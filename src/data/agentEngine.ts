import type { AgentReply, DeptId, Artifact } from '../types';
import { uid } from './departments';

// Canned reply lines per department, some carry a side-effect action.
const LINES: Record<DeptId, AgentReply[]> = {
  dev: [
    { text: 'Login flow is done, but the elevator animation is eating 300ms — I can optimize.', action: { type: 'addTodo', deptId: 'dev', todo: 'Optimize elevator animation' } },
    { text: 'Found a null-pointer in the payments path. Patching now, ETA 1 hour.', action: { type: 'setStatus', deptId: 'dev', status: 'working' } },
    { text: 'Feature-flagged the new dashboard. Want it on for the demo?' },
    { text: "Code review's clean. Merging to main. 🚀", action: { type: 'postArtifact', deptId: 'dev', artifact: makeArtifact('code', 'PR #142', '+248 −73') } },
  ],
  design: [
    { text: 'New app icon options are ready — going with the pixel rocket, it slaps.', action: { type: 'postArtifact', deptId: 'design', artifact: makeArtifact('image', 'icon_rocket.png', '🚀') } },
    { text: 'Contrast on the dark theme was failing a11y, fixed it.', action: { type: 'addTodo', deptId: 'design', todo: 'Re-audit color contrast' } },
    { text: "Whiteboard me a rough layout and I'll pixel it up by EOD." },
    { text: 'Can we NOT use Comic Sans this time. Please.' },
  ],
  marketing: [
    { text: 'Teaser post is scheduled. We hit 2k impressions on the last one.', action: { type: 'postArtifact', deptId: 'marketing', artifact: makeArtifact('number', 'Impressions', '2,041') } },
    { text: 'Need one killer screenshot for the launch tweet — Design, help?', action: { type: 'addTodo', deptId: 'marketing', todo: 'Get launch screenshot from Design' } },
    { text: 'Waitlist crossed 500. People are hyped.', action: { type: 'postArtifact', deptId: 'marketing', artifact: makeArtifact('number', 'Waitlist', '512') } },
    { text: "I wrote three taglines. My favorite: 'Run your whole company. Solo.'" },
  ],
  devops: [
    { text: "Prod is green. p99 latency is 180ms, we're fine.", action: { type: 'postArtifact', deptId: 'devops', artifact: makeArtifact('number', 'p99 latency', '180ms') } },
    { text: "Staging deploy succeeded. Rolling to prod after Dev's merge.", action: { type: 'setStatus', deptId: 'devops', status: 'working' } },
    { text: 'Heads up: SSL cert renews in 6 days, automating it.', action: { type: 'addTodo', deptId: 'devops', todo: 'Automate SSL renewal' } },
    { text: 'Set up alerts so I stop finding out about outages on Twitter.' },
  ],
  finance: [
    { text: 'Runway is 7.2 months at current burn. Tightening cloud spend.', action: { type: 'postArtifact', deptId: 'finance', artifact: makeArtifact('number', 'Runway', '7.2 mo') } },
    { text: 'Stripe fees are creeping up — suggest annual plans.', action: { type: 'addTodo', deptId: 'finance', todo: 'Draft annual pricing tiers' } },
    { text: 'If we convert 3% of the waitlist we break even in Q3.' },
    { text: 'Approving the design tool subscription. Denying the office snacks. Sorry.' },
  ],
};

export const CEO_KICKOFF = [
  'Morning team — where are we on the launch?',
  "Okay, quick sync. What's blocking us today?",
  'Investor demo is Friday. What can we ship?',
];

interface Banter {
  from: DeptId;
  text: string;
}
export const BANTER: Banter[] = [
  { from: 'marketing', text: 'Ship me that icon and I\'ll make us trend. — @Milo' },
  { from: 'devops', text: "Merge whenever, I've got the rollback ready. — @Ada" },
  { from: 'finance', text: "Every 'quick feature' has a cloud bill attached. Just saying." },
];

// Keyword routing -> which department should respond.
const KEYWORDS: Record<DeptId, string[]> = {
  dev: ['bug', 'feature', 'ship', 'code', 'merge', 'deploy feature', 'api', 'crash', 'fix'],
  design: ['logo', 'icon', 'design', 'ui', 'mockup', 'brand', 'color', 'layout', 'pixel'],
  marketing: ['launch', 'campaign', 'social', 'post', 'tweet', 'growth', 'waitlist', 'hype', 'copy'],
  devops: ['deploy', 'prod', 'server', 'latency', 'incident', 'outage', 'monitor', 'ssl', 'alert'],
  finance: ['price', 'pricing', 'cost', 'budget', 'runway', 'burn', 'invoice', 'revenue', 'money'],
};

function makeArtifact(kind: Artifact['kind'], label: string, value: string): Artifact {
  return { id: uid(), kind, label, value };
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/** Decide which of the present departments should respond to a CEO message. */
export function routeDepartments(message: string, present: DeptId[]): DeptId[] {
  const lower = message.toLowerCase();
  const matched = present.filter((d) =>
    KEYWORDS[d].some((k) => lower.includes(k)),
  );
  if (matched.length > 0) return matched.slice(0, 2);
  // Fallback: round-robin one agent.
  return [pick(present)];
}

/**
 * Mocked agent reply. Structured so a real LLM call could drop in here later.
 * Returns canned text plus an optional side-effect action.
 */
export function getAgentReply(
  deptId: DeptId,
  _ceoMessage: string,
  _context?: unknown,
): AgentReply {
  return pick(LINES[deptId]);
}

export { makeArtifact };
