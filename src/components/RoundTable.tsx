import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useStore, useCurrentApp } from '../state/store';
import {
  getAgentReply,
  routeDepartments,
  CEO_KICKOFF,
  BANTER,
} from '../data/agentEngine';
import { blip } from '../data/sfx';
import type { DeptId } from '../types';
import ChatWindow from './ChatWindow';
import Whiteboard from './Whiteboard';
import AgentTodoPanel from './AgentTodoPanel';

// Tracks which meeting instances have already been seeded (survives StrictMode).
const seededMeetings = new Set<string>();

type Tab = 'chat' | 'board';

export default function RoundTable() {
  const app = useCurrentApp();
  const { meetingDepts, meetingId, leaveMeeting, addMessage, applyAction, sound } =
    useStore();
  const [typing, setTyping] = useState<string[]>([]);
  const [tab, setTab] = useState<Tab>('chat');
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const present = app
    ? app.agents.filter((a) => meetingDepts.includes(a.dept))
    : [];

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
        addMessage(appId, {
          author: agent.dept,
          kind: 'text',
          content: reply.text,
        });
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
      timers.current.push(
        setTimeout(() => setTyping((t) => [...t, dept]), base - 300),
      );
      timers.current.push(
        setTimeout(() => {
          setTyping((t) => t.filter((d) => d !== dept));
          const reply = getAgentReply(dept, ceoMessage);
          addMessage(app.id, {
            author: dept,
            kind: 'text',
            content: reply.text,
          });
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

  const seatAngle = (i: number, n: number) => (360 / n) * i - 90;

  return (
    <div className="flex h-full w-full flex-col gap-3 px-4 pb-4 pt-16">
      <div className="flex items-center justify-between">
        <div className="panel px-3 py-2">
          <span className="pixel-font text-[10px] text-crt-gold">MEETING</span>
          <span className="term-font ml-2 text-xl text-crt-ink">{app.name}</span>
        </div>
        <div className="flex gap-2">
          <button
            className={`btn ${tab === 'chat' ? 'btn-green' : 'btn-ghost'}`}
            onClick={() => setTab('chat')}
          >
            CHAT
          </button>
          <button
            className={`btn ${tab === 'board' ? 'btn-green' : 'btn-ghost'}`}
            onClick={() => setTab('board')}
          >
            WHITEBOARD
          </button>
          <button
            className="btn btn-red"
            onClick={() => {
              blip('door', sound);
              leaveMeeting();
            }}
          >
            LEAVE ◀
          </button>
        </div>
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-1 gap-3 lg:grid-cols-[1fr_300px]">
        {/* Left: table + chat/board */}
        <div className="flex min-h-0 flex-col gap-3">
          {/* Round table seating */}
          <div className="panel-raised relative h-40 shrink-0 overflow-hidden">
            <div className="absolute left-1/2 top-1/2 h-24 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-black bg-crt-panel2 shadow-bevelIn" />
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
              <div className="text-3xl">🧑‍💼</div>
              <div className="pixel-font text-[8px] text-crt-gold">CEO</div>
            </div>
            {present.map((a, i) => {
              const ang = (seatAngle(i, present.length) * Math.PI) / 180;
              const x = 50 + Math.cos(ang) * 34;
              const y = 50 + Math.sin(ang) * 34;
              return (
                <motion.div
                  key={a.id}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.1 * i, type: 'spring' }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 text-center"
                  style={{ left: `${x}%`, top: `${y}%` }}
                >
                  <div className="text-3xl">{a.sprite}</div>
                  <div
                    className="pixel-font text-[8px]"
                    style={{ color: a.color }}
                  >
                    {a.name}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Chat or whiteboard */}
          <div className="min-h-0 flex-1">
            {tab === 'chat' ? (
              <ChatWindow
                appId={app.id}
                agents={present}
                typing={typing}
                onSendText={onSendText}
                onSendFile={onSendFile}
              />
            ) : (
              <Whiteboard />
            )}
          </div>
        </div>

        {/* Right: agents & todos */}
        <div className="min-h-0">
          <AgentTodoPanel appId={app.id} agents={present} />
        </div>
      </div>
    </div>
  );
}
