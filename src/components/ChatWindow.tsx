import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Agent, ChatMessage, MessageAuthor } from '../types';
import { useStore } from '../state/store';

interface Props {
  appId: string;
  agents: Agent[];
  typing: string[];
  onSendText: (text: string) => void;
  onSendFile: (name: string, isImage: boolean) => void;
}

function authorMeta(author: MessageAuthor, agents: Agent[]) {
  if (author === 'ceo') {
    return { name: 'CEO', sprite: '🧑‍💼', color: '#f5c542' };
  }
  const a = agents.find((x) => x.dept === author);
  return a
    ? { name: a.name, sprite: a.sprite, color: a.color }
    : { name: author, sprite: '🤖', color: '#8a86a8' };
}

function ArtifactChip({ msg }: { msg: ChatMessage }) {
  const art = msg.artifact!;
  if (art.kind === 'image') {
    return (
      <div className="panel mt-1 flex items-center gap-2 bg-crt-bg p-2">
        <span className="grid h-10 w-10 place-items-center bg-crt-panel2 text-2xl">
          {art.value}
        </span>
        <span className="term-font text-base text-crt-blue">{art.label}</span>
      </div>
    );
  }
  if (art.kind === 'code') {
    return (
      <div className="panel mt-1 bg-crt-bg p-2">
        <div className="term-font text-sm text-crt-blue">{art.label}</div>
        <div className="term-font text-base text-crt-green">{art.value}</div>
      </div>
    );
  }
  return (
    <div className="panel mt-1 inline-flex items-baseline gap-2 bg-crt-bg p-2">
      <span className="term-font text-sm text-crt-blue">{art.label}</span>
      <span className="pixel-font text-sm text-crt-gold">{art.value}</span>
    </div>
  );
}

export default function ChatWindow({
  appId,
  agents,
  typing,
  onSendText,
  onSendFile,
}: Props) {
  const messages = useStore((s) => s.chats[appId]) ?? [];
  const [text, setText] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages.length, typing.length]);

  const send = () => {
    if (!text.trim()) return;
    onSendText(text.trim());
    setText('');
  };

  return (
    <div className="panel flex h-full flex-col overflow-hidden">
      <div className="border-b-2 border-black bg-crt-panel2 px-3 py-2">
        <span className="pixel-font text-[10px] text-crt-gold">
          ROUND TABLE CHAT
        </span>
      </div>

      <div ref={scrollRef} className="flex-1 space-y-2 overflow-y-auto p-3">
        <AnimatePresence initial={false}>
          {messages.map((m) => {
            const meta = authorMeta(m.author, agents);
            const isCeo = m.author === 'ceo';
            return (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={`flex gap-2 ${isCeo ? 'flex-row-reverse' : ''}`}
              >
                <span className="mt-1 text-2xl">{meta.sprite}</span>
                <div className={`max-w-[75%] ${isCeo ? 'text-right' : ''}`}>
                  <div
                    className={`flex items-baseline gap-2 ${isCeo ? 'flex-row-reverse' : ''}`}
                  >
                    <span
                      className="term-font text-base leading-none"
                      style={{ color: meta.color }}
                    >
                      {meta.name}
                    </span>
                    <span className="term-font text-xs text-crt-panel2">
                      {new Date(m.ts).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                  <div
                    className="panel mt-1 inline-block bg-crt-bg px-3 py-2 text-left"
                    style={{ borderColor: isCeo ? meta.color : '#000' }}
                  >
                    {m.kind === 'image' ? (
                      <div className="flex items-center gap-2">
                        <span className="grid h-12 w-12 place-items-center bg-crt-panel2 text-2xl">
                          🖼️
                        </span>
                        <span className="term-font text-base text-crt-ink">
                          {m.fileName}
                        </span>
                      </div>
                    ) : m.kind === 'file' ? (
                      <div className="flex items-center gap-2">
                        <span className="text-xl">📄</span>
                        <span className="term-font text-base text-crt-ink">
                          {m.fileName}
                        </span>
                      </div>
                    ) : (
                      <span className="term-font text-lg leading-tight text-crt-ink">
                        {m.content}
                      </span>
                    )}
                    {m.artifact && <ArtifactChip msg={m} />}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {typing.map((dept) => {
          const meta = authorMeta(dept as MessageAuthor, agents);
          return (
            <div key={dept} className="flex items-center gap-2">
              <span className="text-2xl">{meta.sprite}</span>
              <div className="panel bg-crt-bg px-3 py-2">
                <span className="term-font text-lg text-crt-blue">
                  {meta.name} is typing
                  <span className="animate-blink">_</span>
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Composer */}
      <div className="flex items-center gap-2 border-t-2 border-black bg-crt-panel2 p-2">
        <button
          className="btn btn-ghost !px-2 !py-2"
          title="Attach file (mocked)"
          onClick={() => onSendFile(`spec_v${Math.ceil(Math.random() * 9)}.pdf`, false)}
        >
          📎
        </button>
        <button
          className="btn btn-ghost !px-2 !py-2"
          title="Attach image (mocked)"
          onClick={() => onSendFile(`mockup_${Math.ceil(Math.random() * 9)}.png`, true)}
        >
          🖼️
        </button>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && send()}
          placeholder="message the room..."
          className="term-font flex-1 bg-crt-bg px-3 py-2 text-lg text-crt-green shadow-bevelIn"
        />
        <button className="btn btn-green" onClick={send}>
          SEND
        </button>
      </div>
    </div>
  );
}
