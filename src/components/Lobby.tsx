import { motion } from 'framer-motion';
import { useStore } from '../state/store';
import { blip } from '../data/sfx';

export default function Lobby() {
  const { setScreen, sound } = useStore();

  const cards = [
    {
      icon: '➕',
      title: 'CREATE APP',
      desc: 'spin up a new project floor with 5 seeded department agents',
      action: () => setScreen('registration'),
      cls: 'btn-blue',
    },
    {
      icon: '🔌',
      title: 'REGISTRATION',
      desc: 'connect GitHub, App Store Connect, Instagram & Gmail (mocked)',
      action: () => setScreen('registration'),
      cls: 'btn-green',
    },
  ];

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-6 px-6 pt-16">
      <motion.div
        initial={{ y: -12, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center"
      >
        <div className="text-5xl">🛎️</div>
        <h2 className="pixel-font mt-2 text-lg text-crt-gold text-shadow-hard">
          LOBBY
        </h2>
        <p className="term-font text-xl text-crt-blue">
          ground floor — front desk
        </p>
      </motion.div>

      <div className="grid w-full max-w-2xl grid-cols-1 gap-4 sm:grid-cols-2">
        {cards.map((c) => (
          <motion.button
            key={c.title}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => {
              blip('door', sound);
              c.action();
            }}
            className="panel-raised flex flex-col items-center gap-3 p-6 text-center"
          >
            <span className="text-4xl">{c.icon}</span>
            <span className="pixel-font text-sm text-crt-gold">{c.title}</span>
            <span className="term-font text-lg leading-tight text-crt-ink">
              {c.desc}
            </span>
            <span className={`btn ${c.cls} mt-1`}>OPEN ▶</span>
          </motion.button>
        ))}
      </div>

      <button
        className="btn btn-ghost"
        onClick={() => {
          blip('click', sound);
          setScreen('elevator');
        }}
      >
        🛗 BACK TO ELEVATOR
      </button>
    </div>
  );
}
