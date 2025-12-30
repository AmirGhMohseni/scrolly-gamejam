// Next, React
import { FC, useState } from 'react';
import pkg from '../../../package.json';


// ❌ DO NOT EDIT ANYTHING ABOVE THIS LINE

export const HomeView: FC = () => {
  return (
    <div className="flex min-h-screen flex-col bg-black text-white">
      {/* HEADER – fake Scrolly feed tabs */}
      <header className="flex items-center justify-center border-b border-white/10 py-3">
        <div className="flex items-center gap-2 rounded-full bg-white/5 px-2 py-1 text-[11px]">
          <button className="rounded-full bg-slate-900 px-3 py-1 font-semibold text-white">
            Feed
          </button>
          <button className="rounded-full px-3 py-1 text-slate-400">
            Casino
          </button>
          <button className="rounded-full px-3 py-1 text-slate-400">
            Kids
          </button>
        </div>
      </header>

      {/* MAIN – central game area (phone frame) */}
      <main className="flex flex-1 items-center justify-center px-4 py-3">
        <div className="relative aspect-[9/16] w-full max-w-sm overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 shadow-[0_0_40px_rgba(56,189,248,0.35)]">
          {/* Fake “feed card” top bar inside the phone */}
          <div className="flex items-center justify-between px-3 py-2 text-[10px] text-slate-400">
            <span className="rounded-full bg-white/5 px-2 py-1 text-[9px] uppercase tracking-wide">
              Scrolly Game
            </span>
            <span className="text-[9px] opacity-70">#NoCodeJam</span>
          </div>

          {/* The game lives INSIDE this phone frame */}
          <div className="flex h-[calc(100%-26px)] flex-col items-center justify-start px-3 pb-3 pt-1">
            <GameSandbox />
          </div>
        </div>
      </main>

      {/* FOOTER – tiny version text */}
      <footer className="flex h-5 items-center justify-center border-t border-white/10 px-2 text-[9px] text-slate-500">
        <span>Scrolly · v{pkg.version}</span>
      </footer>
    </div>
  );
};

// ✅ THIS IS THE ONLY PART YOU EDIT FOR THE JAM
// Replace this entire GameSandbox component with the one AI generates.
// Keep the name `GameSandbox` and the `FC` type.


const getAudioSettings = () => {
  if (typeof window === 'undefined') return null;
  const g = window as any;

  if (g.__STONE_AUDIO_SETTINGS__) return g.__STONE_AUDIO_SETTINGS__;

  g.__STONE_AUDIO_SETTINGS__ = {
    musicOn: true,
    sfxOn: true,
  };

  return g.__STONE_AUDIO_SETTINGS__;
};

const softShadow = (
  ctx: CanvasRenderingContext2D,
  blur = 8,
  alpha = 0.35,
  y = 2
) => {
  ctx.shadowColor = `rgba(0,0,0,${alpha})`;
  ctx.shadowBlur = blur;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = y;
};

const whiteShadow = (
  ctx: CanvasRenderingContext2D,
  blur = 8,
  alpha = 0.35,
  y = 2
) => {
  ctx.shadowColor = `rgba(255,255,255,${alpha})`;
  ctx.shadowBlur = blur;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = y;
};

const clearShadow = (ctx: CanvasRenderingContext2D) => {
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
};

const getGameFont = () => {
  if (typeof window === 'undefined') return null;
  const g = window as any;

  if (g.__STONE_FONT__) return g.__STONE_FONT__;

  const font = new FontFace(
    'StoneFont',
    'url(/fonts/ComicNeue-Bold.ttf)',
    {
      weight: '700',
      style: 'normal',
    }
  );

  g.__STONE_FONT__ = font;

  font.load().then(loaded => {
    document.fonts.add(loaded);
  });

  return font;
};

const getBackgrounds = () => {
  if (typeof window === 'undefined') return null;
  const g = window as any;

  if (g.__STONE_BACKGROUNDS__) return g.__STONE_BACKGROUNDS__;

  const imgs = [
    '/images/bg1.png',
    '/images/bg2.png',
    '/images/bg3.png',
    '/images/bg4.png',
    '/images/bg5.png',
  ].map(src => {
    const img = new Image();
    img.src = src;
    return img;
  });

  g.__STONE_BACKGROUNDS__ = imgs;
  return imgs;
};

const getSounds = () => {
  if (typeof window === 'undefined') return null;
  const g = window as any;

  if (g.__STONE_SOUNDS__) return g.__STONE_SOUNDS__;

  const sounds = {
    shoot: new Audio('/sounds/shoot.mp3'),
    gate: new Audio('/sounds/gate.mp3'),
    combo: new Audio('/sounds/combo.mp3'),
    fail: new Audio('/sounds/fail.mp3'),
    win: new Audio('/sounds/win.mp3'),
    bg: new Audio('/sounds/bg.mp3'),
  };

  sounds.bg.loop = true;
  sounds.bg.volume = 0.35;

  g.__STONE_SOUNDS__ = sounds;
  return sounds;
};

const GameSandbox: FC = () => {
  const W = 360;
  const H = 640;
  const R = 9;
  const MIN_SPEED = 0.15;

  getGameFont();

  const [_, force] = useState(0);
  const rerender = () => force(v => v + 1);

  const state = (window as any).__STONE_GAME__ ?? (() => {
    const baseY = H - 120;
    const cx = W / 2;
    const spread = 40;
    const audioSettings = getAudioSettings();

    return ((window as any).__STONE_GAME__ = {
      level: 1,
      shots: 0,
      score: 0,
      testMode: false,
      soundOn: true,
      bgStarted: false,
      settingsOpen: false,
      musicOn: audioSettings?.musicOn ?? true,
      sfxOn: audioSettings?.sfxOn ?? true,
      helpOpen: false,

      stones: [
        { x: cx - spread, y: baseY, vx: 0, vy: 0 },
        { x: cx + spread, y: baseY, vx: 0, vy: 0 },
        { x: cx, y: baseY - 50, vx: 0, vy: 0 },
      ],

      obstacles: [] as any[],
      moving: null as null | number,
      passedBetween: false,
      gameOver: false,
      win: false,
      hover: null as null | number,
      hoverDist: 0,
    });
  })();

  /* ---------- helpers ---------- */
  const dist = (a: any, b: any) => Math.hypot(a.x - b.x, a.y - b.y);

  const playSound = (key: string, vol = 1) => {
    if (!state.sfxOn) return;
    const s = getSounds();
    if (!s) return;
    const snd = (s as any)[key];
    if (!snd) return;
    snd.currentTime = 0;
    snd.volume = Math.min(1, Math.max(0, vol));
    snd.play();
  };

  const getGateWidth = () =>
    state.level === 1 ? 120 :
    state.level === 2 ? 80 :
    70;

  const getFriction = () =>
    state.level === 3 ? 0.985 :
    state.level === 4 ? 0.93 :
    0.97;

  const getRingColor = (d: number) => {
    // آبی تیره‌تر (deep cyan)
    if (d < R * 1.8) return 'rgba(30, 90, 180, 0.95)';
    // سبز تیره‌تر (emerald deep)
    if (d < R * 2.4) return 'rgba(20, 140, 90, 0.95)';
    return 'rgba(239,68,68,0.95)';                   // Red alert
  };

  const spawnObstacles = () => {
    state.obstacles = [];
    for (let i = 0; i < 5; i++) {
      state.obstacles.push({
        x: 40 + Math.random() * (W - 80),
        y: 120 + Math.random() * 300,
        r: 10,
      });
    }
  };

  const startLevel = () => {
    const baseY = H - 120;
    const cx = W / 2;
    const spread = 40;

    state.stones.forEach((s: any, i: number) => {
      s.vx = s.vy = 0;
      s.x = i === 0 ? cx - spread : i === 1 ? cx + spread : cx;
      s.y = i === 2 ? baseY - 50 : baseY;
    });

    state.moving = null;
    state.passedBetween = false;
    state.gameOver = false;

    if (state.level === 5) spawnObstacles();
    else state.obstacles = [];
  };

  /* ---------- physics ---------- */
  const update = () => {
  if (state.gameOver || state.win || state.moving === null) return;

  const s = state.stones[state.moving];
  const F = getFriction();

  s.x += s.vx;
  s.y += s.vy;
  s.vx *= F;
  s.vy *= F;

  /* ===== Public rules (All levels) ===== */
  if (!state.testMode) {
    // Move to out of board
    if (s.x < R || s.x > W - R || s.y < R || s.y > H - R) {
      if (state.sfxOn) playSound('fail');
      state.gameOver = true;
    }

    // Collision with other stones
    state.stones.forEach((o: any, i: number) => {
      if (i !== state.moving && dist(s, o) < R * 2) {
        if (state.sfxOn) playSound('fail');
        state.gameOver = true;
      }
    });

    // Collision with other things (just level 5)
    if (state.level === 5) {
      state.obstacles.forEach((o: any) => {
        if (dist(s, o) < R + o.r) {
          if (state.sfxOn) playSound('fail');
          state.gameOver = true;
        }
      });
    }
  }

  /* ===== Mpve from between 2 stones (All elevels) ===== */
  const others = state.stones.filter((_: any, i: number) => i !== state.moving);
  if (others.length === 2) {
    const [b, c] = others;
    const lineDist =
      Math.abs(
        (c.y - b.y) * s.x -
        (c.x - b.x) * s.y +
        c.x * b.y -
        c.y * b.x
      ) / Math.hypot(c.y - b.y, c.x - b.x);

    if (lineDist < R && dist(s, b) > R * 2 && dist(s, c) > R * 2) {
      state.passedBetween = true;
    }
  }

  /* ===== Touch gate ===== */
  const gw = getGateWidth();
    if (
    s.y < 64 &&
    s.x > W / 2 - gw / 2 &&
    s.x < W / 2 + gw / 2 &&
    (state.passedBetween || state.testMode)
  )
 {
    if (state.sfxOn) playSound('gate');
    state.score += Math.max(0, 100 - state.shots * 5);
    state.level++;

    if (state.level > 5) {
      if (state.sfxOn) playSound('win');
      state.win = true;
    } else {
      startLevel();
    }
    return;
  }

  /* ===== Stop ===== */
  if (Math.abs(s.vx) < MIN_SPEED && Math.abs(s.vy) < MIN_SPEED) {
    s.vx = s.vy = 0;

    if (!state.passedBetween && !state.testMode) {
      if (state.sfxOn) playSound('fail');
      state.gameOver = true;
    }

    state.moving = null;
  }

  rerender();
  requestAnimationFrame(update);
};

  /* ---------- input ---------- */
  const onMouseMove = (e: React.MouseEvent) => {
    const r = (e.target as HTMLCanvasElement).getBoundingClientRect();
    const px = e.clientX - r.left;
    const py = e.clientY - r.top;

    let h = null, hd = 0;
    state.stones.forEach((s: any, i: number) => {
      const d = Math.hypot(px - s.x, py - s.y);
      if (d > R * 1.2 && d < R * 3) {
        h = i;
        hd = d;
      }
    });

    state.hover = h;
    state.hoverDist = hd;
    rerender();
  };

  const onClick = (e: React.MouseEvent) => {
    const r = (e.target as HTMLCanvasElement).getBoundingClientRect();
    const px = e.clientX - r.left;
    const py = e.clientY - r.top;

    // settings button
    const dx1 = px - (W - 34);
    const dy1 = py - (H - 34);
    if (Math.hypot(dx1, dy1) < 22) {
      state.settingsOpen = !state.settingsOpen;
      rerender();
      return;
    }

    // help button click
    const dx2 = px - 26;
    const dy2 = py - (H - 26);
    if (Math.hypot(dx2, dy2) < 20) {
      state.helpOpen = !state.helpOpen;
      rerender();
      return;
    }
  
    if (state.settingsOpen) {
      const px0 = W - 176;
      const py0 = H - 150;

      // music toggle
      if (px > px0 && px < px0 + 160 && py > py0 + 18 && py < py0 + 42) {
        state.musicOn = !state.musicOn;
        const audioSettings = getAudioSettings();
        if (audioSettings) audioSettings.musicOn = state.musicOn;
        const bg = getSounds()?.bg;
        state.musicOn ? bg?.play() : bg?.pause();
        rerender();
        return;
      }

      // sfx toggle
      if (px > px0 && px < px0 + 160 && py > py0 + 48 && py < py0 + 72) {
        state.sfxOn = !state.sfxOn;
        const audioSettings = getAudioSettings();
        if (audioSettings) audioSettings.sfxOn = state.sfxOn;
        rerender();
        return;
      }
    }

    if (px < 60 && py < 30) {
      state.testMode = !state.testMode;
      rerender();
      return;
    }

    if (px > W - 80 && py < 30) {
      state.soundOn = !state.soundOn;
      const s = getSounds();
      state.soundOn ? s?.bg.play() : s?.bg.pause();
      rerender();
      return;
    }

    if (state.gameOver || state.win || state.moving !== null) return;

    if (!state.bgStarted) {
      getSounds()?.bg.play();
      state.bgStarted = true;
    }

    let idx = -1, minD = 9999;
    state.stones.forEach((s: any, i: number) => {
      const d = Math.hypot(px - s.x, py - s.y);
      if (d < minD) { minD = d; idx = i; }
    });

    if (minD < R * 1.2 || minD > R * 3) return;

    const s = state.stones[idx];
    const dx = s.x - px;
    const dy = s.y - py;
    const len = Math.hypot(dx, dy) || 1;

    const n = Math.min(1, (minD - R * 1.2) / (R * 1.8));
    const power = Math.pow(n, 0.75) * 6;

    s.vx = (dx / len) * power;
    s.vy = (dy / len) * power;

    if (state.sfxOn) playSound('shoot', n);
    state.shots++;
    state.moving = idx;
    state.passedBetween = false;
    state.hover = null;
    state.hoverDist = 0;
    requestAnimationFrame(update);

  };

  const reset = () => {
    delete (window as any).__STONE_GAME__;
    rerender();
  };

  /* ---------- render ---------- */
  return (
    <div className="relative">
      <canvas
        className="pointer-events-auto"
        width={W}
        height={H}
        onClick={state.helpOpen ? undefined : onClick}
        onMouseMove={state.helpOpen ? undefined : onMouseMove}
        ref={c => {
          if (!c) return;
          const ctx = c.getContext('2d')!;
          ctx.clearRect(0, 0, W, H);

          const bgs = getBackgrounds();
          const bg = bgs?.[state.level - 1];

          if (bg && bg.complete) {
            ctx.drawImage(bg, 0, 0, W, H);
            if (state.level >= 4) {
              ctx.fillStyle = 'rgba(0,0,0,0.15)';
              ctx.fillRect(0, 0, W, H);
            }
          } else {
            // fallback
            ctx.fillStyle = '#0f172a';
            ctx.fillRect(0, 0, W, H);
          }

          /* ===== HUD - top page ===== */
          ctx.fillStyle = 'rgba(110, 110, 110, 0.78)';
          ctx.strokeStyle = 'rgba(255,255,255,0.18)';
          ctx.lineWidth = 2;
          ctx.font = '700 14px StoneFont';

          ctx.beginPath();
          ctx.roundRect(8, 6, W - 16, 32, 14);
          ctx.fill();
          ctx.stroke();

          const gw = getGateWidth();
          ctx.strokeStyle = '#ee8f22ff';
          ctx.lineWidth = 4;
          const gx = W / 2 - gw / 2;
          const gy = 48;
          const gh = 16;

          /* --- Light shadow --- */
          ctx.save();
          ctx.beginPath();
          ctx.roundRect(gx - 4, gy - 4, gw + 8, gh + 8, 10);
          ctx.strokeStyle = 'rgba(236, 233, 20, 0.35)';
          ctx.lineWidth = 8;
          ctx.stroke();
          ctx.restore();

          /* --- Gate body --- */
          const gateGrad = ctx.createLinearGradient(0, gy, 0, gy + gh);
          gateGrad.addColorStop(0, '#ff9f79ff');  // light
          gateGrad.addColorStop(1, '#ff6600ff');  // dark

          ctx.beginPath();
          ctx.roundRect(gx, gy, gw, gh, 8);
          ctx.fillStyle = gateGrad;
          ctx.fill();

          /* --- Inbound light --- */
          ctx.beginPath();
          ctx.roundRect(gx + 3, gy + 3, gw - 6, gh - 6, 6);
          ctx.strokeStyle = 'rgba(243, 210, 25, 0.45)';
          ctx.lineWidth = 2;
          ctx.stroke();

          /* --- Sparkles --- */
          for (let i = 0; i < Math.floor(gw / 20); i++) {
            const px = gx + 10 + Math.random() * (gw - 20);
            const py = gy + 4 + Math.random() * (gh - 8);
            ctx.beginPath();
            ctx.arc(px, py, 1.2, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255,255,255,0.7)';
            ctx.fill();
          }

          state.obstacles.forEach((o: any) => {
            /* --- Under shadow --- */
            ctx.beginPath();
            ctx.ellipse(
              o.x,
              o.y + o.r * 0.9,
              o.r * 1.4,
              o.r * 0.7,
              0,
              0,
              Math.PI * 2
            );
            ctx.fillStyle = 'rgba(0,0,0,0.45)';
            ctx.fill();

            /* --- Firely body --- */
            const g = ctx.createRadialGradient(
              o.x - o.r * 0.35,
              o.y - o.r * 0.35,
              o.r * 0.2,
              o.x,
              o.y,
              o.r
            );

            g.addColorStop(0, '#fde047');
            g.addColorStop(0.35, '#fb923c');
            g.addColorStop(0.7, '#dc2626');
            g.addColorStop(1, '#1f0606');

            ctx.beginPath();
            ctx.arc(o.x, o.y, o.r, 0, Math.PI * 2);
            ctx.fillStyle = g;
            ctx.fill();

            /* --- Tracks --- */
            ctx.strokeStyle = 'rgba(255,255,255,0.25)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(o.x - o.r * 0.4, o.y + o.r * 0.1);
            ctx.lineTo(o.x + o.r * 0.3, o.y - o.r * 0.2);
            ctx.moveTo(o.x - o.r * 0.1, o.y - o.r * 0.4);
            ctx.lineTo(o.x + o.r * 0.2, o.y + o.r * 0.4);
            ctx.stroke();

            /* --- Warm --- */
            ctx.beginPath();
            ctx.arc(o.x, o.y, o.r * 1.25, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(251,146,60,0.25)';
            ctx.lineWidth = 2;
            ctx.stroke();
          });

          if (state.hover !== null) {
            const s = state.stones[state.hover];
            const color = getRingColor(state.hoverDist);

            /* --- glow --- */
            ctx.beginPath();
            ctx.arc(s.x, s.y, R * 3.2, 0, Math.PI * 2);
            ctx.strokeStyle = color;
            ctx.lineWidth = 6;
            ctx.globalAlpha = 0.25;
            ctx.stroke();

            /* --- Main ring --- */
            ctx.beginPath();
            ctx.arc(s.x, s.y, R * 3, 0, Math.PI * 2);
            ctx.strokeStyle = color;
            ctx.lineWidth = 3;
            ctx.globalAlpha = 1;
            ctx.stroke();
          }

          state.stones.forEach((s: any) => {
            // Shadow
            ctx.beginPath();
            ctx.ellipse(
              s.x,
              s.y + R * 0.9,
              R * 1.1,
              R * 0.6,
              0,
              0,
              Math.PI * 2
            );
            ctx.fillStyle = 'rgba(0,0,0,0.35)';
            ctx.fill();

            // Stone body
            const g = ctx.createRadialGradient(
              s.x - R * 0.4,
              s.y - R * 0.4,
              R * 0.3,
              s.x,
              s.y,
              R
            );

            g.addColorStop(0, '#64748b');   // light
            g.addColorStop(0.6, '#1e293b'); // body
            g.addColorStop(1, '#020617');   // dark edge

            ctx.beginPath();
            ctx.arc(s.x, s.y, R, 0, Math.PI * 2);
            ctx.fillStyle = g;
            ctx.fill();

            // Small light
            ctx.beginPath();
            ctx.arc(
              s.x - R * 0.35,
              s.y - R * 0.35,
              R * 0.18,
              0,
              Math.PI * 2
            );
            ctx.fillStyle = 'rgba(255,255,255,0.35)';
            ctx.fill();
          });

          ctx.fillStyle = '#e5e7eb';
          ctx.font = 'bold 14px StoneFont';
          ctx.textAlign = 'left';
          ctx.fillText(`🏁 Level ${state.level}/5`, 20, 26);
          ctx.textAlign = 'right';
          ctx.fillText(`⭐ Score ${state.score}`, W - 20, 26);
          ctx.textAlign = 'left';

          /* ================= STAGE TITLE PANEL (BOTTOM) ================= */

          const stageTitles = [
            'Warm Up',
            'Narrow Pass',
            'Friction',
            'Precision',
            'Inferno'
          ];

          const panelW = 340;
          const panelH = 42;
          const px = W / 2 - panelW / 2;
          const py = H - panelH - 10;
          const radius = 18;

          ctx.save();

          // Panel shadow
          ctx.beginPath();
          ctx.roundRect(px + 2, py + 4, panelW, panelH, radius);
          ctx.fillStyle = 'rgba(0,0,0,0.45)';
          ctx.fill();

          // Panel body
          ctx.beginPath();
          ctx.roundRect(px, py, panelW, panelH, radius);
          ctx.fillStyle = 'rgba(15,23,42,0.75)';
          ctx.fill();


          // Level title
          softShadow(ctx, 6, 0.4, 2);
          ctx.font = 'bold 15px StoneFont';
          ctx.fillStyle = '#ffffffff';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(stageTitles[state.level - 1], W / 2, panelH / 2 + 3);
          clearShadow(ctx);

          // ===== GAME TITLE : Stone Pass =====
          whiteShadow(ctx, 10, 0.35, 0);
          ctx.font = 'bold 20px StoneFont';

          const titleGrad = ctx.createLinearGradient(0, py, 0, py + panelH);
          titleGrad.addColorStop(0, '#fff3a3'); // روشن
          titleGrad.addColorStop(0.5, '#facc15'); // طلایی
          titleGrad.addColorStop(1, '#ca8a04'); // تیره

          ctx.fillStyle = titleGrad;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('Stone Pass', W / 2, py + panelH / 2 + 1);

          ctx.shadowColor = 'rgba(250,204,21,0.45)';
          ctx.shadowBlur = 6;
          ctx.shadowOffsetY = 0;
          ctx.fillText('Stone Pass', W / 2, py + panelH / 2 + 1);

          clearShadow(ctx);

          /* ===== HELP BUTTON ===== */
          const helpR = 20;
          const helpX = helpR + 12;
          const helpY = H - helpR - 12;

          // shadow
          ctx.beginPath();
          ctx.arc(helpX, helpY + 3, helpR, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(0,0,0,0.4)';
          ctx.fill();

          // button
          ctx.beginPath();
          ctx.arc(helpX, helpY, helpR, 0, Math.PI * 2);
          ctx.fillStyle = '#1f2937';
          ctx.fill();

          // icon
          ctx.fillStyle = '#e5e7eb';
          ctx.font = '18px StoneFont';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('❔', helpX, helpY + 1);

          /* ===== SETTINGS BUTTON ===== */
          const btnR = 20;
          const btnX = W - btnR - 12;
          const btnY = H - btnR - 12;

          // shadow
          ctx.beginPath();
          ctx.arc(btnX, btnY + 3, btnR, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(0,0,0,0.4)';
          ctx.fill();

          // button
          ctx.beginPath();
          ctx.arc(btnX, btnY, btnR, 0, Math.PI * 2);
          ctx.fillStyle = '#1f2937';
          ctx.fill();

          // gear icon
          ctx.fillStyle = '#e5e7eb';
          ctx.font = '18px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('⚙️', btnX, btnY + 1);
          
          if (state.settingsOpen) {
            const pw = 110;
            const ph = 80;
            const px = W - pw - 16;
            const py = H - ph - 60;

            // panel shadow
            ctx.beginPath();
            ctx.roundRect(px + 2, py + 4, pw, ph, 14);
            ctx.fillStyle = 'rgba(0,0,0,0.45)';
            ctx.fill();

            // panel body
            ctx.beginPath();
            ctx.roundRect(px, py, pw, ph, 14);
            ctx.fillStyle = 'rgba(15,23,42,0.85)';
            ctx.fill();

            ctx.font = '14px StoneFont';
            ctx.fillStyle = '#f8fafc';
            ctx.textAlign = 'left';

            ctx.fillText(
              `${state.musicOn ? '☑' : '☐'} Music`,
              px + 14,
              py + 26
            );

            ctx.fillText(
              `${state.sfxOn ? '☑' : '☐'} Sounds`,
              px + 14,
              py + 56
            );
          }


          ctx.restore();

        }}
      />

      {(state.gameOver || state.win) && (
        <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center text-white">
          <div className="text-2xl mb-2 font-[StoneFont]">
            {state.win ? 'YOU WIN 🎉' : 'Game Over'}
          </div>
          <div className="mb-4 font-[StoneFont]">
            Rank: {state.score > 400 ? 'S' : state.score > 300 ? 'A' : state.score > 200 ? 'B' : 'C'}
          </div>
          <button onClick={reset} className="px-5 py-2 bg-white text-black rounded font-[StoneFont]">
            Play Again
          </button>
        </div>
      )}
      {state.helpOpen && (
        <div className="absolute inset-0 bg-black/75 flex items-center justify-center px-6 z-[999] pointer-events-auto">
          <div className="w-full max-w-sm bg-slate-900/60 rounded-2xl p-5 shadow-2xl text-white font-[StoneFont]">

            <h2 className="text-center text-xl font-bold mb-3 text-yellow-300">
              How to Play
            </h2>

            <p className="text-sm text-slate-200 mb-4 leading-relaxed">
              Strike one stone so it slides through the gap between the other two stones
              and reaches the gate at the top.
            </p>

            <div className="mb-3">
              <h3 className="text-sm font-bold text-cyan-300 mb-1">🖱️ Striking</h3>
              <ul className="text-xs text-slate-200 list-disc pl-4 space-y-1">
                <li>Click near a stone to <b>strike</b> it</li>
                <li>The stone moves opposite to your click</li>
                <li>Farther clicks apply more force</li>
              </ul>
            </div>

            <div className="mb-3">
              <h3 className="text-sm font-bold text-emerald-300 mb-1">🔵 Power Ring</h3>
              <ul className="text-xs text-slate-200 list-disc pl-4 space-y-1">
                <li><span className="text-blue-400 font-bold">Blue</span> — Low force</li>
                <li><span className="text-green-400 font-bold">Green</span> — Medium force</li>
                <li><span className="text-red-400 font-bold">Red</span> — High force</li>
              </ul>
            </div>

            <div className="mb-3">
              <h3 className="text-sm font-bold text-red-300 mb-1">⚠️ Rules</h3>
              <ul className="text-xs text-slate-200 list-disc pl-4 space-y-1">
                <li>Hitting another stone ends the game</li>
                <li>Leaving the screen ends the game</li>
                <li>Missing the gap ends the game</li>
                <li>Level 5 has fiery obstacles</li>
              </ul>
            </div>

            <p className="text-center text-xs font-bold text-yellow-200 mt-4">
              Precision beats power.
            </p>

            <button
              onClick={() => {
                state.helpOpen = false;
                rerender();
              }}
              className="mt-4 w-full bg-yellow-400 hover:bg-yellow-300 text-black py-2 rounded-lg font-bold shadow-lg active:scale-95 transition"
            >
              Got it!
            </button>

          </div>
        </div>
      )}
    </div>
  );
};

