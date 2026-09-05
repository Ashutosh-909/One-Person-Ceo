import { useEffect, useRef, useState } from 'react';
import type { Agent, DeptId } from '../types';
import { deptMeta } from '../data/departments';
import { PixelAgentSprite, PixelCeoSprite, TypingBubble } from './pixel/PixelSprites';

/**
 * The room is authored at a fixed design size and scaled to fit whatever box
 * it is given, so the pixel art never reflows mid-sprite.
 */
const ROOM_W = 1312;
const ROOM_H = 940;

/** Below these scales the room sheds detail: window art first, then the chart. */
const WINDOWS_MIN_SCALE = 0.5;
const CHART_MIN_SCALE = 0.38;

const STATUS_COLOR: Record<Agent['status'], string> = {
  idle: '#8a88a8',
  working: '#5bd67a',
  blocked: '#e05a5a',
};

/** [width, height, [[top, left, colour], ...]] */
type Building = [number, number, [number, number, string][]];

const LEFT_BUILDINGS: Building[] = [
  [26, 70, [[10, 6, '#f5c542'], [30, 14, '#f5c542']]],
  [34, 110, [[14, 8, '#f5c542'], [44, 20, '#5aa9e0'], [74, 8, '#f5c542']]],
  [22, 56, [[18, 8, '#f5c542']]],
  [40, 130, [[12, 8, '#f5c542'], [12, 26, '#f5c542'], [60, 16, '#e05a5a'], [96, 26, '#f5c542']]],
  [28, 84, [[24, 10, '#f5c542'], [54, 10, '#f5c542']]],
];

const RIGHT_BUILDINGS: Building[] = [
  [30, 90, [[16, 8, '#f5c542'], [50, 16, '#f5c542']]],
  [44, 140, [[12, 10, '#f5c542'], [40, 28, '#5bd67a'], [80, 10, '#f5c542'], [110, 28, '#f5c542']]],
  [24, 60, [[20, 8, '#f5c542']]],
  [36, 104, [[14, 8, '#f5c542'], [50, 22, '#f5c542']]],
  [26, 74, [[30, 10, '#f5c542']]],
];

const CHART_BARS: [number, string][] = [
  [30, '#5aa9e0'],
  [44, '#5aa9e0'],
  [40, '#5aa9e0'],
  [62, '#5bd67a'],
  [78, '#5bd67a'],
  [96, '#f5c542'],
];

function Window({
  side,
  buildings,
  moon,
}: {
  side: 'left' | 'right';
  buildings: Building[];
  moon?: boolean;
}) {
  return (
    <div
      style={{
        position: 'absolute',
        top: 36,
        ...(side === 'left' ? { left: 96 } : { right: 96 }),
        width: 220,
        height: 170,
        background: '#141a36',
        border: '6px solid #000',
        boxShadow: '0 0 0 6px #4a4670',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        gap: 4,
        padding: '0 10px',
        overflow: 'hidden',
      }}
    >
      {moon && (
        <div
          style={{
            position: 'absolute',
            top: 22,
            right: 26,
            width: 22,
            height: 22,
            background: '#e8e6d0',
          }}
        />
      )}
      {buildings.map(([w, h, lights], i) => (
        <div key={i} style={{ width: w, height: h, background: '#0f0f1b', position: 'relative' }}>
          {lights.map(([t, l, c], j) => (
            <div
              key={j}
              style={{ position: 'absolute', top: t, left: l, width: 5, height: 5, background: c }}
            />
          ))}
        </div>
      ))}
      {/* Mullions */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: 0,
          bottom: 0,
          width: 6,
          marginLeft: -3,
          background: '#000',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: '50%',
          height: 6,
          marginTop: -3,
          background: '#000',
        }}
      />
    </div>
  );
}

function Seat({ agent, typing }: { agent: Agent; typing: boolean }) {
  const look = deptMeta(agent.dept);
  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: 150,
      }}
    >
      {typing && (
        <div style={{ position: 'absolute', top: -78, left: '50%', marginLeft: -44 }}>
          <TypingBubble />
        </div>
      )}
      <PixelAgentSprite hair={look.hair} skin={look.skin} color={agent.color} />
      <div
        className="pixel-font"
        style={{
          marginTop: 4,
          padding: '5px 8px',
          background: agent.color,
          color: '#0f0f1b',
          border: '3px solid #000',
          fontSize: 10,
        }}
      >
        {agent.name}
      </div>
      <div
        className="term-font"
        style={{
          marginTop: 5,
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          fontSize: 18,
          color: '#b8b6a8',
          lineHeight: 1,
        }}
      >
        <div
          style={{
            width: 10,
            height: 10,
            background: STATUS_COLOR[agent.status],
            border: '2px solid #000',
          }}
        />
        {agent.status}
      </div>
    </div>
  );
}

function Table() {
  return (
    <div
      className="sprite-outline-5"
      style={{
        position: 'relative',
        width: 520,
        height: 270,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      {/* Stacked slabs read as a round table in perspective. */}
      <div style={{ width: '60%', height: 54, background: '#a86d38' }} />
      <div style={{ width: '84%', height: 54, background: '#8a5a2b' }} />
      <div style={{ width: '100%', height: 54, background: '#8a5a2b' }} />
      <div style={{ width: '84%', height: 54, background: '#7a4d22' }} />
      <div style={{ width: '60%', height: 54, background: '#6a4019' }} />
      <div
        style={{
          position: 'absolute',
          top: 44,
          left: '50%',
          width: 300,
          marginLeft: -150,
          height: 180,
          background: '#95602e',
        }}
      />
      {/* CEO laptop */}
      <div
        style={{
          position: 'absolute',
          top: 12,
          left: '50%',
          width: 64,
          marginLeft: -32,
          height: 40,
          background: '#3b3b5e',
          border: '4px solid #000',
        }}
      >
        <div style={{ margin: 6, height: 16, background: '#5aa9e0' }} />
      </div>
      {/* Cups */}
      <div
        style={{
          position: 'absolute',
          top: 120,
          left: 60,
          width: 18,
          height: 18,
          background: '#e8e6d0',
          border: '3px solid #000',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: 150,
          right: 70,
          width: 18,
          height: 18,
          background: '#e05a5a',
          border: '3px solid #000',
        }}
      />
      {/* Agenda sheet */}
      <div
        style={{
          position: 'absolute',
          top: 100,
          left: '50%',
          width: 120,
          marginLeft: -60,
          height: 80,
          background: '#e8e6d0',
          border: '3px solid #000',
          padding: 8,
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
        }}
      >
        <div style={{ height: 5, background: '#0f0f1b', width: '70%' }} />
        <div style={{ height: 5, background: '#0f0f1b', width: '90%' }} />
        <div style={{ height: 5, background: '#0f0f1b', width: '55%' }} />
        <div style={{ height: 5, background: '#e05a5a', width: '80%' }} />
      </div>
    </div>
  );
}

interface Props {
  roomNumber: number;
  agents: Agent[];
  typing: DeptId[];
  className?: string;
}

export default function MeetingRoom({ roomNumber, agents, typing, className = '' }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      if (!width || !height) return;
      setScale(Math.min(width / ROOM_W, height / ROOM_H, 1));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Seats alternate left/right; an odd agent out takes the far end of the
  // table, opposite the CEO, rather than lopsiding one column.
  const useFarEnd = agents.length >= 3 && agents.length % 2 === 1;
  const seated = useFarEnd ? agents.slice(0, -1) : agents;
  const farEnd = useFarEnd ? agents[agents.length - 1] : null;
  const leftAgents = seated.filter((_, i) => i % 2 === 0);
  const rightAgents = seated.filter((_, i) => i % 2 === 1);

  const isTyping = (a: Agent) => typing.includes(a.dept);
  const showWindows = scale >= WINDOWS_MIN_SCALE;
  const showChart = scale >= CHART_MIN_SCALE;

  return (
    <div ref={wrapRef} className={`relative overflow-hidden ${className}`}>
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          width: ROOM_W,
          height: ROOM_H,
          transform: `translate(-50%, -50%) scale(${scale})`,
          border: '4px solid #000',
          background: '#2a2440',
          boxShadow: 'inset 4px 4px 0 #3b3b5e, inset -4px -4px 0 #050510',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* ---- back wall ---- */}
        <div
          style={{
            height: 280,
            flex: 'none',
            background: '#3a3658',
            position: 'relative',
            borderBottom: '12px solid #1b1b2e',
          }}
        >
          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: 12,
              height: 10,
              background: '#4a4670',
            }}
          />

          {showWindows && (
            <>
              <Window side="left" buildings={LEFT_BUILDINGS} moon />
              <Window side="right" buildings={RIGHT_BUILDINGS} />
            </>
          )}

          {/* projector screen */}
          <div
            style={{
              position: 'absolute',
              top: 28,
              left: '50%',
              width: 400,
              marginLeft: -200,
              height: 210,
              background: '#e8e6d0',
              border: '6px solid #000',
              boxShadow: '0 0 0 6px #1b1b2e',
              padding: '18px 24px',
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
            }}
          >
            <div
              className="pixel-font"
              style={{
                fontSize: 11,
                color: '#0f0f1b',
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <span>Q3 REVENUE</span>
              <span style={{ color: '#5bd67a', background: '#0f0f1b', padding: '2px 4px' }}>
                +38%
              </span>
            </div>
            {showChart && (
              <div
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'flex-end',
                  gap: 14,
                  borderLeft: '4px solid #0f0f1b',
                  borderBottom: '4px solid #0f0f1b',
                  padding: '0 10px',
                }}
              >
                {CHART_BARS.map(([h, c], i) => (
                  <div
                    key={i}
                    style={{
                      flex: 1,
                      height: `${h}%`,
                      background: c,
                      border: '3px solid #0f0f1b',
                      borderBottom: 0,
                    }}
                  />
                ))}
              </div>
            )}
          </div>
          {/* projector mount */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: '50%',
              width: 120,
              marginLeft: -60,
              height: 18,
              background: '#1b1b2e',
              border: '4px solid #000',
              borderTop: 0,
            }}
          />
        </div>

        {/* ---- floor ---- */}
        <div
          className="room-floor"
          style={{
            flex: 1,
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            paddingTop: 8,
          }}
        >
          {/* rug */}
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              width: 1000,
              height: 480,
              margin: '-232px 0 0 -500px',
              background: '#3a2f55',
              border: '6px solid #1b1b2e',
              boxShadow: 'inset 0 0 0 10px #2f2648',
            }}
          />

          {/* CEO at the head of the table */}
          <div
            style={{
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              marginBottom: -18,
              zIndex: 3,
            }}
          >
            <PixelCeoSprite />
            <div
              className="pixel-font"
              style={{
                marginTop: 6,
                padding: '6px 12px',
                background: '#f5c542',
                color: '#0f0f1b',
                border: '4px solid #000',
                fontSize: 13,
                boxShadow: 'inset 0 -4px 0 #b8902a',
              }}
            >
              CEO
            </div>
          </div>

          {/* seats + table */}
          <div
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              gap: 36,
              zIndex: 2,
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 56,
                alignItems: 'flex-end',
                width: 170,
              }}
            >
              {leftAgents.map((a) => (
                <Seat key={a.id} agent={a} typing={isTyping(a)} />
              ))}
            </div>

            <Table />

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 56,
                alignItems: 'flex-start',
                width: 170,
              }}
            >
              {rightAgents.map((a) => (
                <Seat key={a.id} agent={a} typing={isTyping(a)} />
              ))}
            </div>
          </div>

          {farEnd && (
            <div style={{ position: 'relative', marginTop: -18, zIndex: 3 }}>
              <Seat agent={farEnd} typing={isTyping(farEnd)} />
            </div>
          )}

          <div
            className="pixel-font"
            style={{
              position: 'absolute',
              left: 20,
              bottom: 16,
              fontSize: 11,
              color: '#8a88a8',
            }}
          >
            ROOM {roomNumber} · {agents.length} AGENT{agents.length === 1 ? '' : 'S'} PRESENT
          </div>
        </div>
      </div>
    </div>
  );
}
