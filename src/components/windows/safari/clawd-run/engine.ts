import {
  BUG_A,
  BUG_B,
  CLAWD_DUCK,
  CLAWD_JUMP,
  CLAWD_WALK_A,
  CLAWD_WALK_B,
  COFFEE,
  drawSprite,
  MOTH_A,
  MOTH_B,
  type Sprite,
  TOKEN,
} from "./sprites";

/*
 * Clawd Run: an endless side-scroller. Everything is simulated in "world pixels"
 * (one sprite pixel = 1 unit) and drawn scaled up, so the art stays crisp.
 */

export interface HudState {
  score: number;
  best: number;
  tokens: number;
  combo: number;
  shield: boolean;
}

export interface RunResult {
  score: number;
  best: number;
  tokens: number;
  newBest: boolean;
}

interface Callbacks {
  onHud: (hud: HudState) => void;
  onEnd: (result: RunResult) => void;
}

/** Short texts drawn on the canvas; set by the hook so they follow the language. */
export interface EngineLabels {
  shield: string;
  shieldLost: string;
}

type Kind = "bug" | "moth" | "block" | "token" | "coffee";

interface Entity {
  kind: Kind;
  x: number;
  y: number;
  w: number;
  h: number;
  /** Age in seconds (animation frames, bobbing). */
  t: number;
  dead?: boolean;
  /** Moths bob around this height. */
  baseY?: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  max: number;
  color: string;
  size: number;
}

interface FloatText {
  x: number;
  y: number;
  text: string;
  color: string;
  life: number;
}

interface CodeLine {
  x: number;
  y: number;
  w: number;
  color: string;
}

// Tuning (world pixels and seconds).
const GRAVITY = 620;
const FALL_GRAVITY = 900;
const JUMP_SPEED = 182;
const DOUBLE_JUMP_SPEED = 160;
const JUMP_BUFFER = 0.12;
const START_SPEED = 85;
const MAX_SPEED = 195;
const ACCELERATION = 2.6;
const SHIELD_TIME = 8;
const COMBO_WINDOW = 1.4;
const MAX_COMBO = 5;
const STAND_H = 9;
const DUCK_H = 6;
const PLAYER_X = 26;

const random = (min: number, max: number) => min + Math.random() * (max - min);
const CODE_COLORS = [
  "#7aa2ff",
  "#5fd38d",
  "#ff8a66",
  "#c9a7ff",
  "#e8e8ea",
  "#d97757",
];

export class ClawdRunEngine {
  private ctx: CanvasRenderingContext2D;
  private dpr = 1;
  /** Screen pixels per world pixel. */
  private scale = 4;
  private width = 200;
  private height = 110;
  private ground = 96;

  private running = false;
  private paused = false;
  private raf = 0;
  private last = 0;

  private speed = START_SPEED;
  private distance = 0;
  private bonus = 0;
  private tokens = 0;
  private combo = 0;
  private comboTimer = 0;
  private nextSpawn = 0;
  private shake = 0;
  private slowmo = 1;
  private dying = 0;
  private lastHud = "";

  private player = {
    y: 0,
    vy: 0,
    onGround: true,
    ducking: false,
    jumpsLeft: 2,
    buffer: 0,
    holding: false,
    cut: false,
    shield: 0,
    invulnerable: 0,
    walk: 0,
  };

  private entities: Entity[] = [];
  private particles: Particle[] = [];
  private floats: FloatText[] = [];
  private code: CodeLine[] = [];

  labels: EngineLabels = { shield: "Shield!", shieldLost: "Saved!" };

  constructor(
    private canvas: HTMLCanvasElement,
    private best: number,
    private callbacks: Callbacks,
  ) {
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas 2D context unavailable");
    this.ctx = ctx;
    this.reset();
  }

  get isRunning() {
    return this.running && !this.paused;
  }

  resize(cssWidth: number, cssHeight: number) {
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.canvas.width = Math.round(cssWidth * this.dpr);
    this.canvas.height = Math.round(cssHeight * this.dpr);
    this.scale = Math.max(2, Math.min(6, Math.floor(cssHeight / 105)));
    this.width = cssWidth / this.scale;
    this.height = cssHeight / this.scale;
    this.ground = Math.round(this.height - 14);
    this.seedCode();
    if (this.player.onGround) this.player.y = this.ground - this.playerHeight();
    this.render();
  }

  start() {
    this.reset();
    this.running = true;
    this.paused = false;
    this.loop();
  }

  pause() {
    if (!this.running || this.paused) return;
    this.paused = true;
    cancelAnimationFrame(this.raf);
    this.render();
  }

  resume() {
    if (!this.running || !this.paused) return;
    this.paused = false;
    this.loop();
  }

  stop() {
    this.running = false;
    cancelAnimationFrame(this.raf);
  }

  destroy() {
    this.stop();
  }

  // ---------- input ----------

  jumpPress() {
    this.player.buffer = JUMP_BUFFER;
    this.player.holding = true;
  }

  jumpRelease() {
    this.player.holding = false;
  }

  setDuck(on: boolean) {
    const p = this.player;
    if (on && !p.onGround) p.vy = Math.max(p.vy, 140); // fast-fall in the air
    p.ducking = on;
  }

  // ---------- simulation ----------

  private reset() {
    this.speed = START_SPEED;
    this.distance = 0;
    this.bonus = 0;
    this.tokens = 0;
    this.combo = 0;
    this.comboTimer = 0;
    this.nextSpawn = 40;
    this.shake = 0;
    this.slowmo = 1;
    this.dying = 0;
    this.entities = [];
    this.particles = [];
    this.floats = [];
    Object.assign(this.player, {
      vy: 0,
      onGround: true,
      ducking: false,
      jumpsLeft: 2,
      buffer: 0,
      holding: false,
      cut: false,
      shield: 0,
      invulnerable: 0,
      walk: 0,
    });
    this.player.y = this.ground - STAND_H;
    this.emitHud(true);
  }

  private get score() {
    return Math.floor(this.distance / 8) + this.bonus;
  }

  private playerHeight() {
    return this.player.ducking && this.player.onGround ? DUCK_H : STAND_H;
  }

  private loop = () => {
    this.last = performance.now();
    const tick = (now: number) => {
      if (!this.running || this.paused) return;
      const dt = Math.min(0.033, (now - this.last) / 1000);
      this.last = now;
      this.update(dt * this.slowmo);
      this.render();
      this.raf = requestAnimationFrame(tick);
    };
    this.raf = requestAnimationFrame(tick);
  };

  private update(dt: number) {
    const p = this.player;

    if (this.dying > 0) {
      this.dying -= dt / Math.max(this.slowmo, 0.05);
      this.slowmo = Math.max(0.15, this.slowmo - dt * 4);
      this.updateEffects(dt);
      if (this.dying <= 0) this.finish();
      return;
    }

    this.speed = Math.min(MAX_SPEED, this.speed + ACCELERATION * dt);
    this.distance += this.speed * dt;
    p.walk += this.speed * dt;

    // Jump (buffered so a press just before landing still counts), then double jump.
    if (p.buffer > 0) {
      p.buffer -= dt;
      if (p.onGround) {
        p.vy = -JUMP_SPEED;
        p.onGround = false;
        p.jumpsLeft = 1;
        p.buffer = 0;
        p.cut = false;
        this.dust(PLAYER_X + 7, this.ground, 6);
      } else if (p.jumpsLeft > 0) {
        p.vy = -DOUBLE_JUMP_SPEED;
        p.jumpsLeft = 0;
        p.buffer = 0;
        p.cut = false;
        this.burst(PLAYER_X + 7, p.y + 8, "#ffc49a", 10, 60);
      }
    }
    // Let go early for a short hop.
    if (!p.holding && p.vy < -60 && !p.cut) {
      p.vy *= 0.55;
      p.cut = true;
    }

    if (!p.onGround) {
      p.vy += (p.vy > 0 ? FALL_GRAVITY : GRAVITY) * dt;
      p.y += p.vy * dt;
      if (p.y >= this.ground - STAND_H) {
        p.y = this.ground - STAND_H;
        p.vy = 0;
        p.onGround = true;
        p.jumpsLeft = 2;
        this.dust(PLAYER_X + 7, this.ground, 8);
      }
    } else {
      p.y = this.ground - this.playerHeight();
    }

    if (p.shield > 0) p.shield = Math.max(0, p.shield - dt);
    if (p.invulnerable > 0) p.invulnerable -= dt;
    if (this.comboTimer > 0) {
      this.comboTimer -= dt;
      if (this.comboTimer <= 0) this.combo = 0;
    }

    this.spawn(dt);
    this.updateEntities(dt);
    this.updateEffects(dt);
    this.emitHud();
  }

  private spawn(dt: number) {
    this.nextSpawn -= this.speed * dt;
    if (this.nextSpawn > 0) return;
    const x = this.width + 8;
    const progress = (this.speed - START_SPEED) / (MAX_SPEED - START_SPEED);
    const r = Math.random();

    if (r < 0.4) {
      this.entities.push({
        kind: "bug",
        x,
        y: this.ground - 6,
        w: 10,
        h: 6,
        t: 0,
      });
    } else if (r < 0.62) {
      const h = Math.round(random(12, 16 + progress * 6));
      const w = Math.round(random(9, 13));
      this.entities.push({ kind: "block", x, y: this.ground - h, w, h, t: 0 });
      // A token above the block rewards clearing it.
      if (Math.random() < 0.5)
        this.addToken(x + w / 2 - 3, this.ground - h - 16);
    } else if (r < 0.8 && this.distance > 900) {
      // Moths fly at head height: duck under them (or jump early).
      const baseY = this.ground - 15;
      this.entities.push({
        kind: "moth",
        x,
        y: baseY,
        baseY,
        w: 11,
        h: 7,
        t: Math.random() * 6,
      });
    } else if (r < 0.86 && this.player.shield === 0) {
      this.entities.push({
        kind: "coffee",
        x,
        y: this.ground - 24,
        w: 8,
        h: 8,
        t: 0,
      });
    } else {
      // An arc of tokens.
      const count = 3 + Math.floor(Math.random() * 3);
      for (let i = 0; i < count; i++) {
        const arc = Math.sin((i / (count - 1)) * Math.PI);
        this.addToken(x + i * 11, this.ground - 14 - arc * 16);
      }
    }

    // Gaps shrink as the run speeds up, but always leave time to react.
    const gapTime = random(0.8 - progress * 0.25, 1.35 - progress * 0.4);
    this.nextSpawn = this.speed * gapTime;
  }

  private addToken(x: number, y: number) {
    this.entities.push({
      kind: "token",
      x,
      y,
      w: 7,
      h: 7,
      t: Math.random() * 6,
    });
  }

  private updateEntities(dt: number) {
    const p = this.player;
    const ph = this.playerHeight();
    // Forgiving hitbox: a little smaller than the sprite.
    const box = { x: PLAYER_X + 2, y: p.y + 1, w: 10, h: ph - 1 };

    for (const e of this.entities) {
      e.t += dt;
      e.x -= (e.kind === "moth" ? this.speed + 22 : this.speed) * dt;
      if (e.kind === "moth" && e.baseY !== undefined)
        e.y = e.baseY + Math.sin(e.t * 5) * 2;
      if (e.kind === "token" || e.kind === "coffee")
        e.y += Math.sin(e.t * 4) * 0.08;
      if (e.dead) continue;

      const hit =
        box.x < e.x + e.w &&
        box.x + box.w > e.x &&
        box.y < e.y + e.h &&
        box.y + box.h > e.y;
      if (!hit) continue;

      if (e.kind === "token") {
        e.dead = true;
        this.combo =
          this.comboTimer > 0 ? Math.min(MAX_COMBO, this.combo + 1) : 1;
        this.comboTimer = COMBO_WINDOW;
        this.tokens += 1;
        const points = 10 * this.combo;
        this.bonus += points;
        this.burst(e.x + 3, e.y + 3, "#ffc49a", 8, 50);
        this.float(
          e.x,
          e.y - 4,
          this.combo > 1 ? `+${points} ×${this.combo}` : `+${points}`,
          "#ffc49a",
        );
      } else if (e.kind === "coffee") {
        e.dead = true;
        p.shield = SHIELD_TIME;
        this.burst(e.x + 4, e.y + 4, "#7aa2ff", 14, 70);
        this.float(e.x - 4, e.y - 6, this.labels.shield, "#7aa2ff");
      } else if (e.kind === "bug" && p.vy > 0 && p.y + ph - e.y < 5) {
        // Landing on a bug squashes it and bounces Clawd up.
        e.dead = true;
        p.vy = -JUMP_SPEED * 0.72;
        p.jumpsLeft = 1;
        p.cut = false;
        this.bonus += 25;
        this.burst(e.x + 5, e.y + 3, "#4ade80", 14, 80);
        this.float(e.x, e.y - 6, "+25", "#4ade80");
        this.shake = 0.12;
      } else {
        this.collide(e);
      }
    }

    // Off-screen things go; collected ones vanish; squashed bugs stay as a splat until off-screen.
    this.entities = this.entities.filter(
      (e) => e.x + e.w > -12 && !(e.dead && e.kind !== "bug"),
    );
  }

  private collide(e: Entity) {
    const p = this.player;
    if (p.invulnerable > 0) return;
    if (p.shield > 0) {
      p.shield = 0;
      p.invulnerable = 1;
      e.dead = true;
      this.shake = 0.25;
      this.burst(e.x + e.w / 2, e.y + e.h / 2, "#7aa2ff", 18, 90);
      this.float(PLAYER_X, p.y - 8, this.labels.shieldLost, "#7aa2ff");
      return;
    }
    this.dying = 0.9;
    this.shake = 0.4;
    this.burst(PLAYER_X + 7, p.y + 4, "#d97757", 26, 110);
    this.burst(PLAYER_X + 7, p.y + 4, "#ffc49a", 12, 70);
  }

  private finish() {
    this.running = false;
    const score = this.score;
    const newBest = score > this.best;
    this.best = Math.max(this.best, score);
    this.emitHud(true);
    this.render();
    this.callbacks.onEnd({
      score,
      best: this.best,
      tokens: this.tokens,
      newBest,
    });
  }

  // ---------- effects ----------

  private updateEffects(dt: number) {
    for (const s of this.particles) {
      s.life -= dt;
      s.vy += 220 * dt;
      s.x += s.vx * dt;
      s.y += s.vy * dt;
    }
    this.particles = this.particles.filter((s) => s.life > 0);
    for (const f of this.floats) {
      f.life -= dt;
      f.y -= 18 * dt;
    }
    this.floats = this.floats.filter((f) => f.life > 0);
    if (this.shake > 0) this.shake = Math.max(0, this.shake - dt);
  }

  private burst(
    x: number,
    y: number,
    color: string,
    count: number,
    power: number,
  ) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = power * (0.4 + Math.random() * 0.6);
      const life = 0.4 + Math.random() * 0.4;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 40,
        life,
        max: life,
        color,
        size: Math.random() < 0.3 ? 2 : 1,
      });
    }
  }

  private dust(x: number, y: number, count: number) {
    for (let i = 0; i < count; i++) {
      const life = 0.25 + Math.random() * 0.2;
      this.particles.push({
        x: x + random(-6, 6),
        y: y - 1,
        vx: random(-40, 10),
        vy: random(-30, -8),
        life,
        max: life,
        color: "#4b5563",
        size: 1,
      });
    }
  }

  private float(x: number, y: number, text: string, color: string) {
    this.floats.push({ x, y, text, color, life: 0.9 });
  }

  private emitHud(force = false) {
    const hud: HudState = {
      score: this.score,
      best: Math.max(this.best, this.score),
      tokens: this.tokens,
      combo: this.combo,
      shield: this.player.shield > 0,
    };
    const key = `${hud.score}|${hud.best}|${hud.tokens}|${hud.combo}|${hud.shield}`;
    if (!force && key === this.lastHud) return;
    this.lastHud = key;
    this.callbacks.onHud(hud);
  }

  // ---------- drawing ----------

  private seedCode() {
    this.code = Array.from({ length: Math.ceil(this.height / 5) * 3 }, () => ({
      x: random(0, this.width * 1.5),
      y: Math.floor(random(4, this.ground - 4) / 4) * 4,
      w: Math.round(random(6, 28)),
      color: CODE_COLORS[Math.floor(Math.random() * CODE_COLORS.length)],
    }));
  }

  render() {
    const { ctx } = this;
    const shakeX = this.shake > 0 ? random(-1, 1) * this.shake * 8 : 0;
    const shakeY = this.shake > 0 ? random(-1, 1) * this.shake * 8 : 0;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.imageSmoothingEnabled = false;

    // Sky: deep terminal night.
    const sky = ctx.createLinearGradient(0, 0, 0, this.canvas.height);
    sky.addColorStop(0, "#0b0d12");
    sky.addColorStop(1, "#171b26");
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    const s = this.scale * this.dpr;
    ctx.setTransform(s, 0, 0, s, shakeX * this.dpr, shakeY * this.dpr);

    // Far layer: lines of "code" drifting by slowly (parallax).
    const span = this.width * 1.5;
    ctx.globalAlpha = 0.18;
    for (const line of this.code) {
      const x = ((((line.x - this.distance * 0.18) % span) + span) % span) - 20;
      ctx.fillStyle = line.color;
      ctx.fillRect(Math.round(x), line.y, line.w, 1);
    }
    ctx.globalAlpha = 1;

    // Speed streaks once the run gets fast.
    const fast = (this.speed - 130) / (MAX_SPEED - 130);
    if (fast > 0 && this.running) {
      ctx.globalAlpha = Math.min(0.35, fast * 0.35);
      ctx.fillStyle = "#e8e8ea";
      for (let i = 0; i < 6; i++) {
        const y =
          ((i * 37 + Math.floor(this.distance / 3)) % (this.ground - 10)) + 4;
        const x =
          this.width -
          (((this.distance * 2.2 + i * 53) % (this.width + 40)) - 20);
        ctx.fillRect(Math.round(x), y, 12, 1);
      }
      ctx.globalAlpha = 1;
    }

    // Ground.
    ctx.fillStyle = "#1c2130";
    ctx.fillRect(
      -10,
      this.ground,
      this.width + 20,
      this.height - this.ground + 10,
    );
    ctx.fillStyle = "#3b4357";
    ctx.fillRect(-10, this.ground, this.width + 20, 1);
    ctx.fillStyle = "#262c3d";
    const offset = this.distance % 12;
    for (let x = -offset; x < this.width + 12; x += 12)
      ctx.fillRect(Math.round(x), this.ground + 4, 5, 1);
    for (let x = -((this.distance * 0.6) % 20); x < this.width + 20; x += 20)
      ctx.fillRect(Math.round(x) + 8, this.ground + 8, 3, 1);

    // Entities.
    for (const e of this.entities) {
      const frame = Math.floor(e.t * 8) % 2 === 0;
      if (e.kind === "bug") {
        if (e.dead) {
          ctx.fillStyle = "#15803d";
          ctx.fillRect(Math.round(e.x - 1), this.ground - 1, 12, 1);
        } else drawSprite(ctx, frame ? BUG_A : BUG_B, e.x, e.y);
      } else if (e.kind === "moth")
        drawSprite(ctx, frame ? MOTH_A : MOTH_B, e.x, e.y);
      else if (e.kind === "token") drawSprite(ctx, TOKEN, e.x, e.y);
      else if (e.kind === "coffee") drawSprite(ctx, COFFEE, e.x, e.y);
      else if (e.kind === "block") this.drawConflict(e);
    }

    this.drawPlayer();

    // Particles and floating texts.
    for (const p of this.particles) {
      ctx.globalAlpha = Math.max(0, p.life / p.max);
      ctx.fillStyle = p.color;
      ctx.fillRect(Math.round(p.x), Math.round(p.y), p.size, p.size);
    }
    ctx.globalAlpha = 1;
    ctx.font = "bold 6px ui-monospace, Menlo, monospace";
    ctx.textBaseline = "top";
    for (const f of this.floats) {
      ctx.globalAlpha = Math.min(1, f.life * 2);
      ctx.fillStyle = f.color;
      ctx.fillText(f.text, Math.round(f.x), Math.round(f.y));
    }
    ctx.globalAlpha = 1;
  }

  /** A merge-conflict block: red "ours" over green "theirs", with conflict markers. */
  private drawConflict(e: Entity) {
    const { ctx } = this;
    const x = Math.round(e.x);
    const y = Math.round(e.y);
    const half = Math.floor(e.h / 2);
    ctx.fillStyle = "#0b0d12";
    ctx.fillRect(x - 1, y - 1, e.w + 2, e.h + 1);
    ctx.fillStyle = "#7f1d1d";
    ctx.fillRect(x, y, e.w, half);
    ctx.fillStyle = "#14532d";
    ctx.fillRect(x, y + half, e.w, e.h - half);
    ctx.fillStyle = "#fca5a5";
    for (let i = 2; i < half - 1; i += 3)
      ctx.fillRect(x + 2, y + i, Math.max(2, e.w - 4 - (i % 4)), 1);
    ctx.fillStyle = "#86efac";
    for (let i = half + 2; i < e.h - 1; i += 3)
      ctx.fillRect(x + 2, y + i, Math.max(2, e.w - 5 + (i % 3)), 1);
    ctx.fillStyle = "#e8e8ea";
    ctx.fillRect(x, y + half, e.w, 1);
  }

  private drawPlayer() {
    const { ctx } = this;
    const p = this.player;
    // Blink while invulnerable after the shield breaks.
    if (p.invulnerable > 0 && Math.floor(p.invulnerable * 12) % 2 === 0) return;

    let sprite: Sprite;
    if (this.dying > 0) sprite = CLAWD_JUMP;
    else if (!p.onGround) sprite = CLAWD_JUMP;
    else if (p.ducking) sprite = CLAWD_DUCK;
    else
      sprite = Math.floor(p.walk / 6) % 2 === 0 ? CLAWD_WALK_A : CLAWD_WALK_B;

    drawSprite(ctx, sprite, PLAYER_X, p.y);

    if (p.shield > 0) {
      const pulse = 0.45 + Math.sin(performance.now() / 120) * 0.2;
      const ending = p.shield < 2 && Math.floor(p.shield * 8) % 2 === 0;
      if (!ending) {
        ctx.globalAlpha = pulse;
        ctx.strokeStyle = "#7aa2ff";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(
          PLAYER_X + 7,
          p.y + this.playerHeight() / 2,
          11,
          0,
          Math.PI * 2,
        );
        ctx.stroke();
        ctx.globalAlpha = 1;
      }
    }
  }
}
