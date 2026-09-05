let ctx: AudioContext | null = null;

function audio(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!ctx) {
    const AC =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    if (AC) ctx = new AC();
  }
  return ctx;
}

type Blip = 'click' | 'door' | 'chat' | 'select' | 'error';

const FREQ: Record<Blip, number> = {
  click: 440,
  door: 220,
  chat: 660,
  select: 550,
  error: 160,
};

/** Play a short square-wave chiptune blip. No-op when muted. */
export function blip(kind: Blip, enabled: boolean) {
  if (!enabled) return;
  const ac = audio();
  if (!ac) return;
  if (ac.state === 'suspended') void ac.resume();

  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.type = 'square';
  osc.frequency.value = FREQ[kind];
  gain.gain.setValueAtTime(0.06, ac.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + 0.12);
  osc.connect(gain).connect(ac.destination);
  osc.start();
  osc.stop(ac.currentTime + 0.12);
}
