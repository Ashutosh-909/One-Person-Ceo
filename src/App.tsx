import { AnimatePresence, motion } from 'framer-motion';
import { useStore } from './state/store';
import Login from './components/Login';
import Elevator from './components/Elevator';
import Lobby from './components/Lobby';
import Floor from './components/Floor';
import RoundTable from './components/RoundTable';
import Registration from './components/Registration';
import Hud from './components/Hud';

export default function App() {
  const screen = useStore((s) => s.screen);
  const crt = useStore((s) => s.crt);

  return (
    <div className="relative h-full w-full bg-crt-bg text-crt-ink">
      {crt && <div className="crt-overlay" />}
      {screen !== 'login' && <Hud />}

      <AnimatePresence mode="wait">
        <motion.div
          key={screen}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="h-full w-full"
        >
          {screen === 'login' && <Login />}
          {screen === 'elevator' && <Elevator />}
          {screen === 'lobby' && <Lobby />}
          {screen === 'floor' && <Floor />}
          {screen === 'roundtable' && <RoundTable />}
          {screen === 'registration' && <Registration />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
