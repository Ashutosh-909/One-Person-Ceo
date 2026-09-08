import { useEffect, useRef, useState } from 'react';
import { useStore, useCurrentApp } from '../state/store';
import { getAgentReply, routeDepartments, CEO_KICKOFF, BANTER } from '../data/agentEngine';
import { blip } from '../data/sfx';
import type { DeptId } from '../types';
import MeetingRoom from './MeetingRoom';
import ChatWindow from './ChatWindow';
import Whiteboard from './Whiteboard';
import AgentTodoPanel from './AgentTodoPanel';

// Tracks which meeting instances have already been seeded (survives StrictMode).
const seededMeetings = new Set<string>();

type Tab = 'chat' | 'board' | 'todos';

const TABS: { id: Tab; label: string }[] = [
  { id: 'chat', label: 'CHAT' },
  { id: 'board', label: 'WHITEBOARD' },
  { id: 'todos', label: 'TO-DOS' },
];

/** Beveled top-bar button in the meeting-room chrome. */
function BarButton({
  label,
  tone,
  onClick,
}: {
  label: React.ReactNode;
  tone: 'active' | 'idle' | 'danger';
  onClick: () => void;
}) {
  const skin = {
    active: {
      background: '#5bd67a',
      color: '#0f0f1b',
      boxShadow: 'inset 4px 4px 0 #8fe8a5, inset -4px -4px 0 #2e8a48',
    },
    idle: {
      background: '#252540',
      color: '#e8e6d0',
      boxShadow: 'inset 4px 4px 0 #3b3b5e, inset -4px -4px 0 #111120',
    },
    danger: {
      background: '#e05a5a',
      color: '#0f0f1b',
      boxShadow: 'inset 4px 4px 0 #f08a8a, inset -4px -4px 0 #8f2f2f',
    },
  }[tone];

  return (
    <button
      type="button"
      onClick={onClick}
      className="pixel-font flex h-12 flex-none items-center gap-3 border-4 border-black px-4 text-[12px] active:translate-x-[2px] active:translate-y-[2px] sm:px-5"
      style={skin}
    >
      {label}
    </button>
  );
}

export default function RoundTable() {
  const app = useCurrentApp();
  const { meetingDepts, meetingId, leaveMeeting, addMessage, applyAction, sound } = useStore();
  const [typing, setTyping] = useState<DeptId[]>([]);
  const [tab, setTab] = useState<Tab>('chat');
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const present = app ? app.agents.filter((a) => meetingDepts.includes(a.dept)) : [];

  // Auto-seed a staggered standup when the meeting opens.
  useEffect(() => {
    if (!app || !meetingId || present.length === 0) return;
    if (seededMeetings.has(meetingId)) return;
    seededMeetings.add(meetingId);

    const appId = app.id;
    let delay = 300;
    const schedule = (fn: () => void, gap: number) => {
      delay += gap;
      timers.current.push(setTimeout(fn, delay));
    };

    // CEO kickoff line
    const kickoff = CEO_KICKOFF[Math.floor(Math.random() * CEO_KICKOFF.length)];
    schedule(() => {
      addMessage(appId, { author: 'ceo', kind: 'text', content: kickoff });
      blip('chat', sound);
    }, 200);

    // Each present department drops a standup line
    present.forEach((agent) => {
      schedule(() => setTyping((t) => [...t, agent.dept]), 250);
      schedule(() => {
        setTyping((t) => t.filter((d) => d !== agent.dept));
        const reply = getAgentReply(agent.dept, kickoff);
        addMessage(appId, { author: agent.dept, kind: 'text', content: reply.text });
        if (reply.action) applyAction(appId, reply.action);
        blip('chat', sound);
      }, 350);
    });

    // Optional banter (0-2 lines) from present departments
    const banter = BANTER.filter((b) => meetingDepts.includes(b.from));
    banter.slice(0, Math.floor(Math.random() * 3)).forEach((b) => {
      schedule(() => {
        addMessage(appId, { author: b.from, kind: 'text', content: b.text });
        blip('chat', sound);
      }, 300);
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meetingId]);

  // Cleanup pending timers on unmount.
  useEffect(() => {
    const t = timers.current;
    return () => t.forEach(clearTimeout);
  }, []);

  if (!app) {
    return (
      <div className="flex h-full items-center justify-center">
        <button className="btn" onClick={leaveMeeting}>
          BACK
        </button>
      </div>
    );
  }

  const respond = (depts: DeptId[], ceoMessage: string) => {
    depts.forEach((dept, i) => {
      const base = 500 + i * 700;
      timers.current.push(setTimeout(() => setTyping((t) => [...t, dept]), base - 300));
      timers.current.push(
        setTimeout(() => {
          setTyping((t) => t.filter((d) => d !== dept));
          const reply = getAgentReply(dept, ceoMessage);
          addMessage(app.id, { author: dept, kind: 'text', content: reply.text });
          if (reply.action) applyAction(app.id, reply.action);
          blip('chat', sound);
        }, base),
      );
    });
  };

  const onSendText = (text: string) => {
    addMessage(app.id, { author: 'ceo', kind: 'text', content: text });
    blip('chat', sound);
    respond(routeDepartments(text, meetingDepts), text);
  };

  const onSendFile = (name: string, isImage: boolean) => {
    addMessage(app.id, {
      author: 'ceo',
      kind: isImage ? 'image' : 'file',
      content: name,
      fileName: name,
    });
    blip('chat', sound);
    respond(routeDepartments(name, meetingDepts), name);
  };

  return (
    <div className="flex h-full w-full flex-col gap-5 px-6 pb-6 pt-16">
      {/* ---- top bar ---- */}
      <div className="flex flex-none items-start justify-between gap-3">
        <div className="flex min-w-0 flex-col gap-2 lg:flex-row lg:items-center lg:gap-4">
          <div
            className="pixel-font flex h-12 flex-none items-center border-4 border-black bg-crt-panel2 px-5 text-[14px] text-crt-gold"
            style={{ boxShadow: 'inset 4px 4px 0 #3b3b5e, inset -4px -4px 0 #111120' }}
          >
            MEETING <span className="mx-3 text-crt-ink">—</span>
            <span className="truncate">{app.name}</span>
          </div>
          {/* Segmented toggle: inline on wide screens, under the plate when narrow. */}
          <div className="flex gap-2">
            {TABS.map((t) => (
              <BarButton
                key={t.id}
                label={t.label}
                tone={tab === t.id ? 'active' : 'idle'}
                onClick={() => setTab(t.id)}
              />
            ))}
          </div>
        </div>

        <BarButton
          label={
            <>
              LEAVE <span className="text-[9px]">◀</span>
            </>
          }
          tone="danger"
          onClick={() => {
            blip('door', sound);
            leaveMeeting();
          }}
        />
      </div>

      {/* ---- body: room + side panel ---- */}
      <div className="flex min-h-0 flex-1 flex-col gap-5 lg:flex-row">
        <MeetingRoom
          roomNumber={app.floor}
          agents={present}
          typing={typing}
          className="h-[45vh] min-h-[220px] shrink-0 lg:h-auto lg:min-h-0 lg:flex-1"
        />

        <aside className="flex min-h-0 flex-1 flex-col lg:w-[420px] lg:flex-none 2xl:w-[500px]">
          {tab === 'chat' ? (
            <ChatWindow
              appId={app.id}
              agents={present}
              typing={typing}
              onSendText={onSendText}
              onSendFile={onSendFile}
            />
          ) : tab === 'board' ? (
            <Whiteboard />
          ) : (
            <AgentTodoPanel appId={app.id} agents={present} />
          )}
        </aside>
      </div>
    </div>
  );
}
