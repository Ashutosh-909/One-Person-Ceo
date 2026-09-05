import type { Agent, DeptId } from '../types';

export const uid = () => Math.random().toString(36).slice(2, 10);

interface DeptMeta {
  dept: DeptId;
  name: string;
  title: string;
  color: string;
  sprite: string;
  starterTodos: string[];
}

export const DEPARTMENTS: DeptMeta[] = [
  {
    dept: 'dev',
    name: 'Ada',
    title: 'Development',
    color: '#5aa9e0',
    sprite: '👩‍💻',
    starterTodos: ['Ship login flow', 'Fix payments null-pointer'],
  },
  {
    dept: 'design',
    name: 'Milo',
    title: 'Design',
    color: '#c46be0',
    sprite: '🎨',
    starterTodos: ['New app icon options', 'Dark theme a11y pass'],
  },
  {
    dept: 'marketing',
    name: 'Nova',
    title: 'Marketing',
    color: '#f5934b',
    sprite: '📣',
    starterTodos: ['Schedule teaser post', 'Write launch taglines'],
  },
  {
    dept: 'devops',
    name: 'Rex',
    title: 'DevOps',
    color: '#5bd67a',
    sprite: '🛠️',
    starterTodos: ['Automate SSL renewal', 'Wire up prod alerts'],
  },
  {
    dept: 'finance',
    name: 'Vera',
    title: 'Finance',
    color: '#f5c542',
    sprite: '💰',
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
