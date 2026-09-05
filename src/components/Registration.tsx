import { useState } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../state/store';
import { blip } from '../data/sfx';
import type { Integrations } from '../types';

interface Toggle {
  key: keyof Integrations;
  label: string;
  icon: string;
  hint: string;
}

const TOGGLES: Toggle[] = [
  { key: 'apple', label: 'App Store Connect', icon: '🍎', hint: 'key id / issuer id (mocked)' },
  { key: 'instagram', label: 'Instagram', icon: '📸', hint: 'connect Instagram (mocked)' },
  { key: 'gmail', label: 'Gmail', icon: '✉️', hint: 'connect Google (mocked)' },
];

export default function Registration() {
  const { createApp, enterFloor, setScreen, sound } = useStore();
  const [name, setName] = useState('');
  const [github, setGithub] = useState('');
  const [flags, setFlags] = useState<Integrations>({});
  const [done, setDone] = useState(false);

  const toggle = (key: keyof Integrations) => {
    blip('select', sound);
    setFlags((f) => ({ ...f, [key]: !f[key] }));
  };

  const submit = () => {
    blip('door', sound);
    const integrations: Integrations = {
      ...flags,
      ...(github ? { github } : {}),
    };
    const id = createApp(name, integrations);
    setDone(true);
    setTimeout(() => enterFloor(id), 700);
  };

  return (
    <div className="flex h-full w-full items-center justify-center px-6 pt-16">
      <motion.div
        initial={{ y: 16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="panel-raised w-full max-w-lg p-6"
      >
        <h2 className="pixel-font mb-1 text-sm text-crt-gold">REGISTRATION</h2>
        <p className="term-font mb-5 text-lg text-crt-blue">
          create a project &amp; connect integrations (all mocked)
        </p>

        <label className="pixel-font mb-1 block text-[9px] text-crt-ink">
          APP NAME
        </label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. RocketDeck"
          className="term-font mb-4 w-full bg-crt-bg px-3 py-2 text-xl text-crt-green shadow-bevelIn"
          autoFocus
        />

        <label className="pixel-font mb-1 block text-[9px] text-crt-ink">
          GITHUB REPO
        </label>
        <div className="mb-4 flex gap-2">
          <input
            value={github}
            onChange={(e) => setGithub(e.target.value)}
            placeholder="github.com/you/repo"
            className="term-font flex-1 bg-crt-bg px-3 py-2 text-lg text-crt-green shadow-bevelIn"
          />
          <button
            className={`btn ${github ? 'btn-green' : 'btn-ghost'}`}
            onClick={() => {
              blip('select', sound);
              setGithub(github || 'github.com/solo/new-app');
            }}
          >
            🐙 CONNECT
          </button>
        </div>

        <label className="pixel-font mb-2 block text-[9px] text-crt-ink">
          INTEGRATIONS
        </label>
        <div className="mb-6 grid grid-cols-1 gap-2 sm:grid-cols-3">
          {TOGGLES.map((t) => {
            const on = !!flags[t.key];
            return (
              <button
                key={t.key}
                onClick={() => toggle(t.key)}
                className={`panel flex flex-col items-center gap-1 p-3 ${
                  on ? 'ring-2 ring-crt-green' : ''
                }`}
                style={{ background: '#12121f' }}
              >
                <span className="text-2xl">{t.icon}</span>
                <span className="term-font text-base text-crt-ink">
                  {t.label}
                </span>
                <span
                  className={`pixel-font text-[8px] ${on ? 'text-crt-green' : 'text-crt-panel2'}`}
                >
                  {on ? 'CONNECTED' : 'OFF'}
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex justify-between gap-3">
          <button
            className="btn btn-ghost"
            onClick={() => {
              blip('click', sound);
              setScreen('lobby');
            }}
          >
            ◀ BACK
          </button>
          <button className="btn btn-green" disabled={done} onClick={submit}>
            {done ? 'BUILDING FLOOR...' : 'CREATE FLOOR ▶'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
