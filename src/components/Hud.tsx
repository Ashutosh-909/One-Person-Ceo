import { useStore } from '../state/store';
import { blip } from '../data/sfx';

export default function Hud() {
  const { crt, sound, toggleCrt, toggleSound, ceoName, logout, screen } =
    useStore();

  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-40 flex items-center justify-between p-3">
      <div className="pointer-events-auto panel px-3 py-2">
        <span className="pixel-font text-[10px] text-crt-gold">CEO</span>
        <span className="term-font ml-2 text-lg text-crt-ink">{ceoName}</span>
      </div>

      <div className="pointer-events-auto flex gap-2">
        <button
          className={`btn ${crt ? 'btn-green' : 'btn-ghost'}`}
          onClick={() => {
            blip('click', sound);
            toggleCrt();
          }}
          title="Toggle CRT scanlines"
        >
          CRT {crt ? 'ON' : 'OFF'}
        </button>
        <button
          className={`btn ${sound ? 'btn-green' : 'btn-ghost'}`}
          onClick={() => {
            toggleSound();
            blip('click', !sound);
          }}
          title="Toggle sound"
        >
          SFX {sound ? 'ON' : 'OFF'}
        </button>
        {screen !== 'login' && (
          <button
            className="btn btn-red"
            onClick={() => {
              blip('door', sound);
              logout();
            }}
          >
            EXIT
          </button>
        )}
      </div>
    </div>
  );
}
