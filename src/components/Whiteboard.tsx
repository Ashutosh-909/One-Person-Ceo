import { useEffect, useRef, useState } from 'react';

const COLORS = ['#0f0f1b', '#e05a5a', '#5aa9e0', '#5bd67a', '#f5c542', '#c46be0'];

export default function Whiteboard() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const [color, setColor] = useState(COLORS[0]);
  const [size, setSize] = useState(4);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement!;
    canvas.width = parent.clientWidth;
    canvas.height = parent.clientHeight;
  }, []);

  const pos = (e: React.PointerEvent) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const start = (e: React.PointerEvent) => {
    drawing.current = true;
    const ctx = canvasRef.current!.getContext('2d')!;
    const { x, y } = pos(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const move = (e: React.PointerEvent) => {
    if (!drawing.current) return;
    const ctx = canvasRef.current!.getContext('2d')!;
    const { x, y } = pos(e);
    ctx.lineTo(x, y);
    ctx.strokeStyle = color;
    ctx.lineWidth = size;
    ctx.lineCap = 'round';
    ctx.stroke();
  };

  const end = () => {
    drawing.current = false;
  };

  const clear = () => {
    const canvas = canvasRef.current!;
    canvas.getContext('2d')!.clearRect(0, 0, canvas.width, canvas.height);
  };

  return (
    <div className="panel flex h-full flex-col overflow-hidden">
      <div className="flex items-center gap-2 border-b-2 border-black bg-crt-panel2 px-3 py-2">
        <span className="pixel-font text-[10px] text-crt-gold">WHITEBOARD</span>
        <div className="ml-auto flex items-center gap-1">
          {COLORS.map((c) => (
            <button
              key={c}
              onClick={() => setColor(c)}
              className="h-5 w-5 border-2 border-black"
              style={{
                background: c,
                outline: color === c ? '2px solid #fff' : 'none',
              }}
            />
          ))}
          <input
            type="range"
            min={2}
            max={16}
            value={size}
            onChange={(e) => setSize(Number(e.target.value))}
            className="ml-2 w-16"
            title="Pen size"
          />
          <button className="btn btn-red ml-1 !px-2 !py-1" onClick={clear}>
            CLEAR
          </button>
        </div>
      </div>
      <div className="grid-bg relative flex-1">
        <canvas
          ref={canvasRef}
          onPointerDown={start}
          onPointerMove={move}
          onPointerUp={end}
          onPointerLeave={end}
          className="absolute inset-0 h-full w-full touch-none"
        />
      </div>
    </div>
  );
}
