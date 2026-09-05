import { useEffect, useRef, useState } from 'react';
import type { Agent, ChatMessage, DeptId, MessageAuthor } from '../types';
import { useStore } from '../state/store';
import { CEO_LOOK, deptMeta } from '../data/departments';
import { PixelChatAvatar, TypingDots } from './pixel/PixelSprites';

interface Props {
  appId: string;
  agents: Agent[];
  typing: DeptId[];
  onSendText: (text: string) => void;
  onSendFile: (name: string, isImage: boolean) => void;
}

interface AuthorLook {
  name: string;
  color: string;
  hair: string;
  skin: string;
  shirt: string;
}

function authorLook(author: MessageAuthor): AuthorLook {
  if (author === 'ceo') return CEO_LOOK;
  const d = deptMeta(author);
  return { name: d.name, color: d.color, hair: d.hair, skin: d.skin, shirt: d.color };
}

const clock = (ts: number) =>
  new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

function ArtifactChip({ artifact }: { artifact: NonNullable<ChatMessage['artifact']> }) {
  if (artifact.kind === 'image') {
    return (
      <div className="mt-2 flex items-center gap-2 border-[3px] border-black bg-crt-bg p-2">
        <span className="grid h-9 w-9 place-items-center bg-crt-panel2 text-xl">
          {artifact.value}
        </span>
        <span className="term-font text-[18px] text-crt-blue">{artifact.label}</span>
      </div>
    );
  }
  if (artifact.kind === 'code') {
    return (
      <div className="mt-2 border-[3px] border-black bg-crt-bg p-2">
        <div className="term-font text-[16px] text-crt-blue">{artifact.label}</div>
        <div className="term-font text-[18px] text-crt-green">{artifact.value}</div>
      </div>
    );
  }
  return (
    <div className="mt-2 inline-flex items-baseline gap-2 border-[3px] border-black bg-crt-bg p-2">
      <span className="term-font text-[16px] text-crt-blue">{artifact.label}</span>
      <span className="pixel-font text-[11px] text-crt-gold">{artifact.value}</span>
    </div>
  );
}

function Bubble({ msg, isCeo }: { msg: ChatMessage; isCeo: boolean }) {
  return (
    <div
      className="term-font border-[3px] border-black px-[14px] py-[10px] text-[20px] leading-[1.15]"
      style={{
        background: isCeo ? '#e8e6d0' : '#252540',
        color: isCeo ? '#0f0f1b' : '#e8e6d0',
        boxShadow: isCeo
          ? 'inset 3px 3px 0 #ffffff, inset -3px -3px 0 #b8b6a8'
          : 'inset 3px 3px 0 #3b3b5e, inset -3px -3px 0 #111120',
        textWrap: 'pretty',
      }}
    >
      {msg.kind === 'image' ? (
        <span className="flex items-center gap-2">
          <span className="grid h-10 w-10 place-items-center bg-crt-panel2 text-xl">🖼️</span>
          {msg.fileName}
        </span>
      ) : msg.kind === 'file' ? (
        <span className="flex items-center gap-2">
          <span className="text-xl">📄</span>
          {msg.fileName}
        </span>
      ) : (
        msg.content
      )}
      {msg.artifact && <ArtifactChip artifact={msg.artifact} />}
    </div>
  );
}

/** Pixel paperclip. */
function ClipIcon() {
  return (
    <span className="relative flex items-center justify-center">
      <span className="block h-[22px] w-[14px] border-[3px] border-t-0 border-[#b8b6a8]" />
      <span className="absolute top-[2px] h-[14px] w-[6px] bg-[#b8b6a8]" />
    </span>
  );
}

/** Pixel photo frame with sun and hill. */
function ImageIcon() {
  return (
    <span className="relative block h-[20px] w-[26px] overflow-hidden border-[3px] border-[#b8b6a8]">
      <span className="absolute left-[3px] top-[3px] h-[5px] w-[5px] bg-crt-gold" />
      <span className="absolute -bottom-[4px] left-[2px] h-[10px] w-[18px] bg-crt-green" />
    </span>
  );
}

export default function ChatWindow({ appId, agents, typing, onSendText, onSendFile }: Props) {
  const messages = useStore((s) => s.chats[appId]) ?? [];
  const [text, setText] = useState('');
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages.length, typing.length]);

  const send = () => {
    if (!text.trim()) return;
    onSendText(text.trim());
    setText('');
  };

  const present = new Set(agents.map((a) => a.dept));

  return (
    <div className="dc-bevel-deep flex h-full min-h-0 flex-col border-4 border-black bg-crt-panel">
      {/* header */}
      <div className="flex h-12 flex-none items-center justify-between border-b-4 border-black bg-crt-panel2 px-[18px]">
        <span className="pixel-font text-[13px] text-crt-gold">ROUND TABLE CHAT</span>
        <span className="pixel-font flex items-center gap-2 text-[9px] text-crt-green">
          <span className="inline-block h-[10px] w-[10px] border-2 border-black bg-crt-green" />
          LIVE
        </span>
      </div>

      {/* messages */}
      <div
        ref={listRef}
        className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-[18px] pb-2 pt-[18px]"
      >
        {messages.map((m) => {
          const look = authorLook(m.author);
          const isCeo = m.author === 'ceo';
          return (
            <div
              key={m.id}
              className={`flex items-start gap-3 ${isCeo ? 'flex-row-reverse' : ''}`}
              style={{ animation: 'dc-slidein .25s steps(3) both' }}
            >
              <PixelChatAvatar hair={look.hair} skin={look.skin} shirt={look.shirt} />
              <div
                className={`flex max-w-[380px] flex-col gap-[6px] ${
                  isCeo ? 'items-end' : 'items-start'
                }`}
              >
                <div className="flex items-baseline gap-[10px]">
                  <span className="pixel-font text-[10px]" style={{ color: look.color }}>
                    {look.name}
                  </span>
                  <span className="term-font text-[15px] text-[#6f6f8c]">{clock(m.ts)}</span>
                </div>
                <Bubble msg={m} isCeo={isCeo} />
              </div>
            </div>
          );
        })}

        {typing
          .filter((d) => present.has(d))
          .map((dept) => {
            const look = authorLook(dept);
            return (
              <div
                key={dept}
                className="term-font flex items-center gap-[10px] pl-1 pt-1 text-[17px] text-[#8a88a8]"
              >
                <div
                  className="h-[14px] w-[14px] border-2 border-black"
                  style={{ background: look.color }}
                />
                <span style={{ color: look.color }}>{look.name}</span> is typing
                <span className="ml-1">
                  <TypingDots size={6} gap={4} />
                </span>
              </div>
            );
          })}
      </div>

      {/* composer */}
      <div className="flex flex-none items-stretch gap-[10px] border-t-4 border-black bg-crt-panel2 p-3">
        <button
          type="button"
          title="Attach file (mocked)"
          onClick={() => onSendFile(`spec_v${Math.ceil(Math.random() * 9)}.pdf`, false)}
          className="dc-bevel-in flex h-[46px] w-[44px] flex-none items-center justify-center border-[3px] border-black bg-crt-panel"
        >
          <ClipIcon />
        </button>
        <button
          type="button"
          title="Attach image (mocked)"
          onClick={() => onSendFile(`mockup_${Math.ceil(Math.random() * 9)}.png`, true)}
          className="dc-bevel-in flex h-[46px] w-[44px] flex-none items-center justify-center border-[3px] border-black bg-crt-panel"
        >
          <ImageIcon />
        </button>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && send()}
          placeholder="message the room..."
          className="dc-bevel-in term-font h-[46px] min-w-0 flex-1 border-[3px] border-black bg-crt-bg px-[14px] text-[20px] text-crt-ink placeholder:text-[#6f6f8c]"
        />
        <button
          type="button"
          onClick={send}
          className="pixel-font h-[46px] flex-none border-[3px] border-black bg-crt-green px-5 text-[12px] text-crt-bg"
          style={{ boxShadow: 'inset 3px 3px 0 #8fe8a5, inset -3px -3px 0 #2e8a48' }}
        >
          SEND
        </button>
      </div>
    </div>
  );
}
