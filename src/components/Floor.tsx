import { motion } from 'framer-motion';
import { useStore, useCurrentApp } from '../state/store';
import { blip } from '../data/sfx';
import { DEPARTMENTS } from '../data/departments';
import type { Agent, DeptId } from '../types';

const STATUS_COLOR: Record<Agent['status'], string> = {
  idle: '#8a86a8',
  working: '#5bd67a',
  blocked: '#e05a5a',
};

// Desk positions on the layout image (percent of the square container).
// Order follows the numbered desks 1-5 in layout.png.
const DESK_POS: Record<DeptId, { x: number; y: number }> = {
  dev: { x: 13.5, y: 48 }, // desk 1
  design: { x: 43.5, y: 47 }, // desk 2
  marketing: { x: 68, y: 48 }, // desk 3
  devops: { x: 32, y: 68 }, // desk 4
  finance: { x: 61.5, y: 69 }, // desk 5
};
const MEETING_POS = { x: 32, y: 26 };

export default function Floor() {
  const app = useCurrentApp();
  const {
    selectedDepts,
    toggleDept,
    clearSelection,
    startMeeting,
    setScreen,
    sound,
  } = useStore();

  if (!app) {
    return (
      <div className="flex h-full items-center justify-center">
        <button className="btn" onClick={() => setScreen('elevator')}>
          BACK TO ELEVATOR
        </button>
      </div>
    );
  }

  const canMeet = selectedDepts.length > 0;
  const goElevator = () => {
    blip('door', sound);
    setScreen('elevator');
  };
  const agentOf = (dept: DeptId) => app.agents.find((a) => a.dept === dept)!;

  return (
    <div className="flex h-full w-full flex-col px-3 pb-3 pt-16">
      {/* Floor header */}
      <div className="mb-2 flex items-center justify-between">
        <div className="panel px-3 py-2">
          <span className="pixel-font text-[10px] text-crt-gold">
            FLOOR {app.floor}
          </span>
          <span className="term-font ml-2 text-xl text-crt-ink">
            {app.name}
          </span>
          <span className="term-font ml-3 text-base text-crt-blue">
            🏢 click a desk to pick a department
          </span>
        </div>
        <button className="btn btn-ghost" onClick={goElevator}>
          🛗 ELEVATOR
        </button>
      </div>

      {/* ===== OFFICE (image layout) ===== */}
      <div className="grid min-h-0 flex-1 place-items-center overflow-auto">
        <div
          className="relative select-none"
          style={{ width: 'min(84vh, 100%)', aspectRatio: '1 / 1' }}
        >
          <img
            src="/layout.png"
            alt="office layout"
            className="pixelated h-full w-full"
            draggable={false}
          />

          {/* Meeting room tag */}
          <button
            onClick={() => {
              if (canMeet) {
                blip('door', sound);
                startMeeting();
              } else {
                blip('error', sound);
              }
            }}
            className="absolute z-10 -translate-x-1/2 -translate-y-full"
            style={{ left: `${MEETING_POS.x}%`, top: `${MEETING_POS.y}%` }}
            title="Board room"
          >
            <motion.div
              animate={canMeet ? { y: [0, -3, 0] } : {}}
              transition={{ repeat: Infinity, duration: 1 }}
              className="panel-raised flex items-center gap-1 px-2 py-1"
              style={{ borderColor: canMeet ? '#5bd67a' : '#000' }}
            >
              <span className="text-base leading-none">🚪</span>
              <span className="pixel-font text-[8px] text-crt-gold">
                MEETING ROOM
              </span>
            </motion.div>
            <span className="mx-auto block h-0 w-0 border-x-[6px] border-t-[7px] border-x-transparent border-t-black" />
          </button>

          {/* Desk tags */}
          {DEPARTMENTS.map((d) => {
            const agent = agentOf(d.dept);
            const pos = DESK_POS[d.dept];
            const selected = selectedDepts.includes(d.dept);
            const open = agent.todos.filter((t) => !t.done).length;
            return (
              <button
                key={d.dept}
                onClick={() => {
                  blip('select', sound);
                  toggleDept(d.dept);
                }}
                className="absolute z-10 -translate-x-1/2 -translate-y-full"
                style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
              >
                <motion.div
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.96 }}
                  animate={selected ? { y: [0, -3, 0] } : {}}
                  transition={{ repeat: selected ? Infinity : 0, duration: 0.9 }}
                  className="relative flex flex-col items-center border-2 px-2 py-1"
                  style={{
                    background: '#161426',
                    borderColor: selected ? d.color : '#000',
                    boxShadow: selected
                      ? `0 0 0 2px ${d.color}, 0 0 10px 2px ${d.color}aa`
                      : '2px 2px 0 0 #000',
                  }}
                >
                  {/* dept color header */}
                  <span
                    className="absolute inset-x-0 top-0 h-[3px]"
                    style={{ background: d.color }}
                  />
                  <span className="flex items-center gap-1">
                    <span className="text-sm leading-none">{d.sprite}</span>
                    <span
                      className="pixel-font text-[8px]"
                      style={{ color: d.color }}
                    >
                      {d.title.toUpperCase()}
                    </span>
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="term-font text-sm leading-none text-crt-ink">
                      {d.name}
                    </span>
                    <span
                      className="inline-block h-2 w-2 rounded-full"
                      style={{ background: STATUS_COLOR[agent.status] }}
                    />
                  </span>

                  {open > 0 && (
                    <span className="pixel-font absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-crt-red px-1 text-[8px] text-crt-bg shadow-bevel">
                      {open}
                    </span>
                  )}
                  {selected && (
                    <span className="pixel-font absolute -left-1 -top-2 rounded bg-crt-green px-1 text-[7px] text-crt-bg">
                      ✓
                    </span>
                  )}
                </motion.div>
                {/* pointer to desk */}
                <span
                  className="mx-auto block h-0 w-0 border-x-[6px] border-t-[7px] border-x-transparent"
                  style={{ borderTopColor: selected ? d.color : '#000' }}
                />
              </button>
            );
          })}
        </div>
      </div>

      {/* Action bar */}
      <div className="mt-2 flex items-center justify-center gap-3">
        <span className="term-font mr-2 text-base text-crt-blue">
          {canMeet
            ? `${selectedDepts.length} dept(s) selected`
            : 'no departments selected'}
        </span>
        <button
          className="btn btn-ghost"
          disabled={!canMeet}
          onClick={() => {
            blip('click', sound);
            clearSelection();
          }}
        >
          NOT NOW
        </button>
        <button
          className="btn btn-green"
          disabled={!canMeet}
          onClick={() => {
            blip('door', sound);
            startMeeting();
          }}
        >
          MEET NOW ▶
        </button>
      </div>
    </div>
  );
}
