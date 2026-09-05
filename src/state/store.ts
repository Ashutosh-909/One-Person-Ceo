import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  AppProject,
  ChatMessage,
  DeptId,
  Status,
  Todo,
  Integrations,
  AgentAction,
} from '../types';
import { seedAgents, uid } from '../data/departments';

export type Screen = 'login' | 'elevator' | 'lobby' | 'floor' | 'roundtable' | 'registration';

interface State {
  // session
  loggedIn: boolean;
  ceoName: string;
  screen: Screen;

  // data
  apps: AppProject[];
  currentAppId: string | null;
  selectedDepts: DeptId[];
  meetingDepts: DeptId[];
  meetingId: string | null;
  chats: Record<string, ChatMessage[]>; // keyed by appId

  // ui
  crt: boolean;
  sound: boolean;

  // actions
  login: (name: string) => void;
  logout: () => void;
  setScreen: (s: Screen) => void;
  createApp: (name: string, integrations: Integrations) => string;
  enterFloor: (appId: string) => void;
  toggleDept: (dept: DeptId) => void;
  clearSelection: () => void;
  startMeeting: () => void;
  leaveMeeting: () => void;
  addMessage: (appId: string, msg: Omit<ChatMessage, 'id' | 'ts'>) => void;
  applyAction: (appId: string, action: AgentAction) => void;
  toggleTodo: (appId: string, dept: DeptId, todoId: string) => void;
  toggleCrt: () => void;
  toggleSound: () => void;
}

function defaultApps(): AppProject[] {
  return [
    {
      id: uid(),
      name: 'PixelPay',
      floor: 1,
      agents: seedAgents(),
      integrations: { github: 'github.com/solo/pixelpay', apple: true },
    },
    {
      id: uid(),
      name: 'Chirp',
      floor: 2,
      agents: seedAgents(),
      integrations: { github: 'github.com/solo/chirp', instagram: true },
    },
  ];
}

export const useStore = create<State>()(
  persist(
    (set, get) => ({
      loggedIn: false,
      ceoName: '',
      screen: 'login',
      apps: defaultApps(),
      currentAppId: null,
      selectedDepts: [],
      meetingDepts: [],
      meetingId: null,
      chats: {},
      crt: true,
      sound: false,

      login: (name) =>
        set({ loggedIn: true, ceoName: name || 'CEO', screen: 'elevator' }),

      logout: () =>
        set({ loggedIn: false, screen: 'login', currentAppId: null }),

      setScreen: (s) => set({ screen: s }),

      createApp: (name, integrations) => {
        const apps = get().apps;
        const floor = apps.length + 1;
        const app: AppProject = {
          id: uid(),
          name: name || `App ${floor}`,
          floor,
          agents: seedAgents(),
          integrations,
        };
        set({ apps: [...apps, app] });
        return app.id;
      },

      enterFloor: (appId) =>
        set({
          currentAppId: appId,
          screen: 'floor',
          selectedDepts: [],
        }),

      toggleDept: (dept) => {
        const cur = get().selectedDepts;
        set({
          selectedDepts: cur.includes(dept)
            ? cur.filter((d) => d !== dept)
            : [...cur, dept],
        });
      },

      clearSelection: () => set({ selectedDepts: [] }),

      startMeeting: () =>
        set({
          meetingDepts: get().selectedDepts,
          meetingId: uid(),
          screen: 'roundtable',
        }),

      leaveMeeting: () =>
        set({ screen: 'floor', meetingDepts: [], selectedDepts: [] }),

      addMessage: (appId, msg) => {
        const chats = get().chats;
        const list = chats[appId] ?? [];
        set({
          chats: {
            ...chats,
            [appId]: [...list, { ...msg, id: uid(), ts: Date.now() }],
          },
        });
      },

      applyAction: (appId, action) => {
        const apps = get().apps.map((app) => {
          if (app.id !== appId) return app;
          const agents = app.agents.map((a) => {
            if (a.dept !== (action as { deptId: DeptId }).deptId) return a;
            if (action.type === 'addTodo') {
              const todo: Todo = { id: uid(), text: action.todo, done: false };
              return { ...a, todos: [...a.todos, todo] };
            }
            if (action.type === 'setStatus') {
              return { ...a, status: action.status as Status };
            }
            return a;
          });
          return { ...app, agents };
        });
        set({ apps });

        if (action.type === 'postArtifact') {
          get().addMessage(appId, {
            author: action.deptId,
            kind: 'text',
            content: `📎 ${action.artifact.label}`,
            artifact: action.artifact,
          });
        }
      },

      toggleTodo: (appId, dept, todoId) => {
        const apps = get().apps.map((app) => {
          if (app.id !== appId) return app;
          const agents = app.agents.map((a) => {
            if (a.dept !== dept) return a;
            return {
              ...a,
              todos: a.todos.map((t) =>
                t.id === todoId ? { ...t, done: !t.done } : t,
              ),
            };
          });
          return { ...app, agents };
        });
        set({ apps });
      },

      toggleCrt: () => set({ crt: !get().crt }),
      toggleSound: () => set({ sound: !get().sound }),
    }),
    {
      name: 'one-person-ceo',
      partialize: (s) => ({
        apps: s.apps,
        chats: s.chats,
        crt: s.crt,
        sound: s.sound,
        ceoName: s.ceoName,
      }),
    },
  ),
);

export const useCurrentApp = () => {
  const { apps, currentAppId } = useStore();
  return apps.find((a) => a.id === currentAppId) ?? null;
};
