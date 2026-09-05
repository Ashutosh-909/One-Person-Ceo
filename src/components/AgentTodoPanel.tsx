import { AnimatePresence, motion } from 'framer-motion';
import type { Agent } from '../types';
import { useStore } from '../state/store';
import { deptMeta } from '../data/departments';
import { PixelChatAvatar } from './pixel/PixelSprites';

const STATUS_COLOR: Record<Agent['status'], string> = {
  idle: '#8a88a8',
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
    <div className="dc-bevel-deep flex h-full min-h-0 flex-col border-4 border-black bg-crt-panel">
      <div className="flex h-12 flex-none items-center border-b-4 border-black bg-crt-panel2 px-[18px]">
        <span className="pixel-font text-[13px] text-crt-gold">AGENTS &amp; TO-DOS</span>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-[18px]">
        {agents.map((a) => {
          const look = deptMeta(a.dept);
          return (
            <div key={a.id} className="border-[3px] border-black bg-crt-bg p-3">
              <div className="mb-3 flex items-center gap-3">
                <PixelChatAvatar hair={look.hair} skin={look.skin} shirt={a.color} />
                <div className="flex-1">
                  <div className="pixel-font text-[11px]" style={{ color: a.color }}>
                    {a.name}
                  </div>
                  <div className="term-font mt-[6px] flex items-center gap-[6px] text-[17px] leading-none text-[#b8b6a8]">
                    <span
                      className="inline-block h-[10px] w-[10px] border-2 border-black"
                      style={{ background: STATUS_COLOR[a.status] }}
                    />
                    {a.status}
                  </div>
                </div>
              </div>

              <ul className="space-y-[6px]">
                <AnimatePresence initial={false}>
                  {a.todos.map((t) => (
                    <motion.li
                      key={t.id}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0 }}
                      className="flex items-start gap-[10px]"
                    >
                      <button
                        type="button"
                        onClick={() => toggleTodo(appId, a.dept, t.id)}
                        className="pixel-font mt-[3px] flex h-[16px] w-[16px] shrink-0 items-center justify-center border-2 border-black bg-crt-panel2 text-[8px] text-crt-green"
                      >
                        {t.done ? '✓' : ''}
                      </button>
                      <span
                        className={`term-font text-[19px] leading-[1.15] ${
                          t.done ? 'text-[#6f6f8c] line-through' : 'text-crt-ink'
                        }`}
                      >
                        {t.text}
                      </span>
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}
