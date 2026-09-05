import { useState } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../state/store';
import { blip } from '../data/sfx';

export default function Login() {
  const login = useStore((s) => s.login);
  const sound = useStore((s) => s.sound);
  const [name, setName] = useState('');
  const [pressed, setPressed] = useState(false);

  const start = () => {
    blip('door', sound);
    setPressed(true);
    setTimeout(() => login(name), 350);
  };

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-8 px-6">
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 120, damping: 12 }}
        className="text-center"
      >
        <div className="mb-2 text-6xl">🏢</div>
        <h1 className="pixel-font text-2xl leading-relaxed text-crt-gold text-shadow-hard sm:text-4xl">
          ONE PERSON
        </h1>
        <h1 className="pixel-font text-2xl leading-relaxed text-crt-green text-shadow-hard sm:text-4xl">
          C E O
        </h1>
        <p className="term-font mt-3 text-xl text-crt-blue">
          run your whole company. solo.
        </p>
      </motion.div>

      <div className="panel w-full max-w-sm p-5">
        <label className="pixel-font mb-2 block text-[10px] text-crt-ink">
          CEO NAME
        </label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && start()}
          placeholder="type anything..."
          className="term-font mb-4 w-full bg-crt-bg px-3 py-2 text-xl text-crt-green shadow-bevelIn"
          autoFocus
        />
        <button
          className={`btn btn-green w-full ${pressed ? 'animate-pulse' : ''}`}
          onClick={start}
        >
          {pressed ? 'LOADING...' : 'PRESS START / LOGIN'}
          {!pressed && <span className="animate-blink">_</span>}
        </button>
      </div>

      <p className="term-font text-lg text-crt-panel2">
        insert coin — any input works
      </p>
    </div>
  );
}
