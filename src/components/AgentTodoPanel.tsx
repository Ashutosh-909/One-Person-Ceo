import { AnimatePresence, motion } from 'framer-motion';
import type { Agent } from '../types';
import { useStore } from '../state/store';

const STATUS_COLOR: Record<Agent['status'], string> = {
  idle: '#8a86a8',
  working: '#5bd67a',
  blocked: '#e05a5a',
};

interface Props {
  appId: string;
  agents: Agent[];
}

export default function AgentTodoPanel({ appId, agents }: Props) {
  const toggleTodo = useStore((s) => s.toggleTodo);

  return (
    <div className="panel flex h-full flex-col overflow-hidden">
      <div className="border-b-2 border-black bg-crt-panel2 px-3 py-2">
        <span className="pixel-font text-[10px] text-crt-gold">
          AGENTS &amp; TO-DOS
        </span>
      </div>
      <div className="flex-1 space-y-3 overflow-y-auto p-3">
        {agents.map((a) => (
          <div key={a.id} className="panel bg-crt-bg p-2">
            <div className="mb-2 flex items-center gap-2">
              <span className="text-2xl">{a.sprite}</span>
              <div className="flex-1">
                <div className="term-font text-lg leading-none text-crt-ink">
                  {a.name}
                </div>
                <div className="flex items-center gap-1">
                  <span
                    className="inline-block h-2 w-2 rounded-full"
                    style={{ background: STATUS_COLOR[a.status] }}
                  />
                  <span className="term-font text-sm text-crt-blue">
                    {a.status}
                  </span>
                </div>
              </div>
            </div>
            <ul className="space-y-1">
              <AnimatePresence initial={false}>
                {a.todos.map((t) => (
                  <motion.li
                    key={t.id}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-start gap-2"
                  >
                    <button
                      onClick={() => toggleTodo(appId, a.dept, t.id)}
                      className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center border-2 border-black bg-crt-panel2 text-[10px] text-crt-green"
                    >
                      {t.done ? '✓' : ''}
                    </button>
                    <span
                      className={`term-font text-base leading-tight ${
                        t.done
                          ? 'text-crt-panel2 line-through'
                          : 'text-crt-ink'
                      }`}
                    >
                      {t.text}
                    </span>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
