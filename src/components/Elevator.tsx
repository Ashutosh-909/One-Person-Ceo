import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../state/store';
import { blip } from '../data/sfx';
import type { AppProject } from '../types';

const BAND_H = 76;
const SCENES = ['🏙️', '🌆', '🌃', '🏢', '🏬', '🌇', '🏗️'];

type Row =
  | { kind: 'app'; app: AppProject; floor: number }
  | { kind: 'lobby'; floor: 0 };

export default function Elevator() {
  const { apps, enterFloor, setScreen, sound } = useStore();

  // Building rows, top = highest floor, bottom = lobby.
  const rows = useMemo<Row[]>(() => {
    const appRows: Row[] = [...apps]
      .sort((a, b) => b.floor - a.floor)
      .map((app) => ({ kind: 'app', app, floor: app.floor }));
    return [...appRows, { kind: 'lobby', floor: 0 }];
  }, [apps]);

  const lobbyRow = rows.length - 1;
  const [carRow, setCarRow] = useState(lobbyRow);
  const [pending, setPending] = useState<null | { floor: number; appId?: string }>(
    null,
  );
  const [doorsOpen, setDoorsOpen] = useState(false);

  const rowIndexOfFloor = (floor: number) =>
    rows.findIndex((r) => r.floor === floor);

  const call = (floor: number, appId?: string) => {
    if (pending) return;
    blip('door', sound);
    setDoorsOpen(false);
    setPending({ floor, appId });
    setCarRow(rowIndexOfFloor(floor));
  };

  const onArrive = () => {
    if (!pending) return;
    setDoorsOpen(true);
    const { floor, appId } = pending;
    setTimeout(() => {
      if (floor === 0) setScreen('lobby');
      else if (appId) enterFloor(appId);
    }, 550);
  };

  const currentFloorLabel =
    rows[carRow]?.kind === 'lobby' ? 'L' : String(rows[carRow]?.floor ?? 'L');

  return (
    <div className="flex h-full w-full items-center justify-center gap-4 px-4 pt-16">
      {/* BUILDING CROSS-SECTION */}
      <div
        className="panel-raised relative overflow-hidden"
        style={{ width: 340, height: rows.length * BAND_H + 6 }}
      >
        {/* Floor bands */}
        {rows.map((r, i) => (
          <div
            key={i}
            className="absolute left-0 right-[92px] flex items-center gap-3 border-b-2 border-black px-3"
            style={{
              top: i * BAND_H,
              height: BAND_H,
              background: r.kind === 'lobby' ? '#20305a' : '#161426',
            }}
          >
            <span className="pixel-font flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-crt-panel2 text-crt-gold shadow-bevel">
              {r.kind === 'lobby' ? 'L' : r.floor}
            </span>
            <span className="text-2xl">
              {r.kind === 'lobby' ? '🛎️' : SCENES[r.floor % SCENES.length]}
            </span>
            <span className="min-w-0">
              <span className="term-font block truncate text-xl text-crt-ink">
                {r.kind === 'lobby' ? 'LOBBY' : r.app.name}
              </span>
              <span className="term-font block text-sm text-crt-green">
                {r.kind === 'lobby'
                  ? 'create / register'
                  : `${r.app.agents.length} agents`}
              </span>
            </span>
          </div>
        ))}

        {/* Elevator shaft on the right */}
        <div
          className="absolute bottom-0 top-0"
          style={{
            right: 0,
            width: 92,
            background:
              'repeating-linear-gradient(180deg,#0c0c16 0,#0c0c16 8px,#12121f 8px,#12121f 16px)',
            borderLeft: '3px solid #000',
          }}
        >
          {/* Cables */}
          <div className="absolute left-1/2 top-0 h-full w-[3px] -translate-x-3 bg-crt-panel2/60" />
          <div className="absolute left-1/2 top-0 h-full w-[3px] translate-x-3 bg-crt-panel2/60" />

          {/* The car */}
          <motion.div
            className="absolute left-1/2 -translate-x-1/2"
            style={{ width: 76, height: BAND_H - 12 }}
            initial={false}
            animate={{ top: carRow * BAND_H + 6 }}
            transition={{ type: 'tween', duration: 0.9, ease: 'easeInOut' }}
            onAnimationComplete={onArrive}
          >
            <div className="relative h-full w-full border-[3px] border-black bg-[#3a3a5a] shadow-bevel">
              {/* Occupant */}
              <div className="flex h-full items-end justify-center pb-1 text-2xl">
                🧑‍💼
              </div>
              {/* Doors */}
              <motion.div
                className="door absolute inset-y-0 left-0 w-1/2"
                animate={{ x: doorsOpen ? '-100%' : '0%' }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
              />
              <motion.div
                className="door absolute inset-y-0 right-0 w-1/2"
                animate={{ x: doorsOpen ? '100%' : '0%' }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* CALL PANEL */}
      <div className="panel-raised flex flex-col items-center gap-3 p-4">
        <h2 className="pixel-font text-xs text-crt-gold">ELEVATOR</h2>

        {/* Digital floor display */}
        <div className="panel flex w-full items-center justify-center gap-2 bg-crt-bg py-2">
          <span className="term-font text-sm text-crt-blue">FLOOR</span>
          <span className="pixel-font text-lg text-crt-green">
            {currentFloorLabel}
          </span>
          <AnimatePresence>
            {pending && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: [0.3, 1, 0.3] }}
                exit={{ opacity: 0 }}
                transition={{ repeat: Infinity, duration: 0.8 }}
                className="text-lg"
              >
                {pending.floor > (rows[carRow]?.floor ?? 0) ? '▲' : '▼'}
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* Buttons: one per app floor + Lobby */}
        <div className="grid grid-cols-2 gap-2">
          {[...apps]
            .sort((a, b) => a.floor - b.floor)
            .map((app) => (
              <button
                key={app.id}
                disabled={!!pending}
                onClick={() => call(app.floor, app.id)}
                title={app.name}
                className="pixel-font flex h-12 w-12 items-center justify-center rounded-full border-[3px] border-black bg-crt-panel2 text-crt-gold shadow-bevel transition hover:brightness-125 active:translate-y-0.5 disabled:opacity-40"
              >
                {app.floor}
              </button>
            ))}
          <button
            disabled={!!pending}
            onClick={() => call(0)}
            title="Lobby"
            className="pixel-font flex h-12 w-12 items-center justify-center rounded-full border-[3px] border-black bg-crt-gold text-crt-bg shadow-bevel transition hover:brightness-110 active:translate-y-0.5 disabled:opacity-40"
          >
            L
          </button>
        </div>

        <p className="term-font mt-1 max-w-[9rem] text-center text-sm text-crt-blue">
          press a number for an app floor, or <b>L</b> for the lobby
        </p>
      </div>
    </div>
  );
}
