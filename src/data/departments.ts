import type { Agent, DeptId } from '../types';

export const uid = () => Math.random().toString(36).slice(2, 10);

interface DeptMeta {
  dept: DeptId;
  name: string;
  title: string;
  color: string;
  sprite: string;
  /** Pixel-sprite palette used by the round-table meeting room. */
  hair: string;
  skin: string;
  starterTodos: string[];
}

/** Pixel-sprite palette for the CEO seat and CEO chat avatar. */
export const CEO_LOOK = {
  name: 'CEO',
  color: '#f5c542',
  hair: '#2b1d14',
  skin: '#e8b88a',
  shirt: '#2b2b4a',
};

export const DEPARTMENTS: DeptMeta[] = [
  {
    dept: 'dev',
    name: 'Ada',
    title: 'Development',
    color: '#5aa9e0',
    sprite: '👩‍💻',
    hair: '#2b2b3a',
    skin: '#e8b88a',
    starterTodos: ['Ship login flow', 'Fix payments null-pointer'],
  },
  {
    dept: 'design',
    name: 'Milo',
    title: 'Design',
    color: '#c46be0',
    sprite: '🎨',
    hair: '#f5c542',
    skin: '#f0c8a0',
    starterTodos: ['New app icon options', 'Dark theme a11y pass'],
  },
  {
    dept: 'marketing',
    name: 'Nova',
    title: 'Marketing',
    color: '#f5934b',
    sprite: '📣',
    hair: '#8a3a2a',
    skin: '#c68a5a',
    starterTodos: ['Schedule teaser post', 'Write launch taglines'],
  },
  {
    dept: 'devops',
    name: 'Rex',
    title: 'DevOps',
    color: '#5bd67a',
    sprite: '🛠️',
    hair: '#3a2a1a',
    skin: '#a86a3a',
    starterTodos: ['Automate SSL renewal', 'Wire up prod alerts'],
  },
  {
    dept: 'finance',
    name: 'Vera',
    title: 'Finance',
    color: '#f5c542',
    sprite: '💰',
    hair: '#e8e6d0',
    skin: '#f0c8a0',
    starterTodos: ['Review cloud burn', 'Model waitlist conversion'],
  },
];

export function seedAgents(): Agent[] {
  return DEPARTMENTS.map((d) => ({
    id: uid(),
    dept: d.dept,
    name: d.name,
    title: d.title,
    color: d.color,
    sprite: d.sprite,
    status: 'idle',
    todos: d.starterTodos.map((t) => ({ id: uid(), text: t, done: false })),
  }));
}

export const deptMeta = (dept: DeptId): DeptMeta =>
  DEPARTMENTS.find((d) => d.dept === dept)!;
