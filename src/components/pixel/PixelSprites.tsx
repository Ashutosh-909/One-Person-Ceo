/**
 * Pixel-art sprites for the round-table meeting room.
 *
 * Every sprite is a stack of absolutely-positioned blocks measured in design
 * pixels; the black keyline comes from `.sprite-outline-*` (four stacked
 * drop-shadows) so it stays hard-edged at any scale.
 */

interface Look {
  hair: string;
  skin: string;
  color: string;
}

/** One absolutely-positioned block of colour. */
function Px({
  l,
  t,
  w,
  h,
  bg,
}: {
  l: number;
  t: number;
  w: number;
  h: number;
  bg: string;
}) {
  return (
    <div
      style={{ position: 'absolute', left: l, top: t, width: w, height: h, background: bg }}
    />
  );
}

/** Three squares blinking in sequence — stepped, never faded. */
export function TypingDots({ size, gap }: { size: number; gap: number }) {
  return (
    <div style={{ display: 'flex', gap }}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          style={{
            width: size,
            height: size,
            background: '#0f0f1b',
            animation: `dc-blink 1s steps(1) ${i * 0.25}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

/**
 * Speech bubble with a two-bar stepped tail, popping in over 3 frames from the
 * tail. Caller positions it; `scale` is a whole-number-ish multiplier used by
 * the 3x spec callout.
 */
export function TypingBubble({ scale = 1 }: { scale?: number }) {
  const s = (n: number) => n * scale;
  return (
    <div
      className={scale >= 2 ? 'sprite-outline-5' : 'sprite-outline-4'}
      style={{
        animation: 'dc-pop .35s steps(3) both',
        transformOrigin: '50% 100%',
      }}
    >
      <div
        style={{
          width: s(88),
          height: s(52),
          background: '#e8e6d0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <TypingDots size={s(8)} gap={s(6)} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ width: s(20), height: s(8), background: '#e8e6d0' }} />
        <div style={{ width: s(10), height: s(8), background: '#e8e6d0' }} />
      </div>
    </div>
  );
}

/** Seated agent, 72x74 — chair back plus head and torso. */
export function PixelAgentSprite({ hair, skin, color }: Look) {
  return (
    <div style={{ position: 'relative', width: 72, height: 74 }}>
      <div
        style={{
          position: 'absolute',
          left: 6,
          top: 0,
          width: 60,
          height: 22,
          background: '#3b3b5e',
          border: '4px solid #000',
          borderBottom: 0,
        }}
      />
      <div
        className="sprite-outline-3"
        style={{ position: 'absolute', left: 12, top: 12, width: 48, height: 58 }}
      >
        <Px l={8} t={0} w={32} h={10} bg={hair} />
        <Px l={8} t={8} w={32} h={24} bg={skin} />
        <Px l={8} t={8} w={4} h={12} bg={hair} />
        <Px l={36} t={8} w={4} h={12} bg={hair} />
        <Px l={16} t={18} w={5} h={5} bg="#0f0f1b" />
        <Px l={28} t={18} w={5} h={5} bg="#0f0f1b" />
        <Px l={4} t={32} w={40} h={26} bg={color} />
        <Px l={19} t={32} w={10} h={7} bg="#e8e6d0" />
      </div>
    </div>
  );
}

/** CEO at the head of the table, 96x96 — bigger chair, suit and gold tie. */
export function PixelCeoSprite() {
  return (
    <div style={{ position: 'relative', width: 96, height: 96 }}>
      <div
        style={{
          position: 'absolute',
          left: 8,
          top: 0,
          width: 80,
          height: 26,
          background: '#3b3b5e',
          border: '4px solid #000',
          borderBottom: 0,
        }}
      />
      <div
        className="sprite-outline-3"
        style={{ position: 'absolute', left: 16, top: 14, width: 64, height: 78 }}
      >
        <Px l={10} t={0} w={44} h={13} bg="#2b1d14" />
        <Px l={10} t={10} w={44} h={32} bg="#e8b88a" />
        <Px l={10} t={10} w={6} h={16} bg="#2b1d14" />
        <Px l={48} t={10} w={6} h={16} bg="#2b1d14" />
        <Px l={20} t={24} w={7} h={7} bg="#0f0f1b" />
        <Px l={37} t={24} w={7} h={7} bg="#0f0f1b" />
        <Px l={4} t={42} w={56} h={36} bg="#2b2b4a" />
        <Px l={22} t={42} w={20} h={10} bg="#e8e6d0" />
        <Px l={28} t={46} w={8} h={24} bg="#f5c542" />
      </div>
    </div>
  );
}

/** Chat-line avatar, 36x42 — head and shoulders only. */
export function PixelChatAvatar({
  hair,
  skin,
  shirt,
}: {
  hair: string;
  skin: string;
  shirt: string;
}) {
  return (
    <div
      className="sprite-outline-2"
      style={{ position: 'relative', width: 36, height: 42, flex: 'none' }}
    >
      <Px l={6} t={0} w={24} h={8} bg={hair} />
      <Px l={6} t={6} w={24} h={18} bg={skin} />
      <Px l={11} t={13} w={4} h={4} bg="#0f0f1b" />
      <Px l={21} t={13} w={4} h={4} bg="#0f0f1b" />
      <Px l={2} t={24} w={32} h={18} bg={shirt} />
    </div>
  );
}
