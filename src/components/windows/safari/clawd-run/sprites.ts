/*
 * Pixel-art sprites for Clawd Run. Each sprite is rows of characters; every
 * character is one "world pixel" and maps to a colour in its palette ("." = empty).
 */

export interface Sprite {
  rows: readonly string[];
  palette: Readonly<Record<string, string>>;
}

const CLAWD = { O: "#d97757", D: "#b4593c", K: "#1d1d1f" };

/** Clawd, the Claude Code mascot: a blocky orange critter with slit eyes and little legs. */
export const CLAWD_WALK_A: Sprite = {
  palette: CLAWD,
  rows: [
    "..OOOOOOOOOO..",
    "..OOOOOOOOOO..",
    "..OOKOOOOKOO..",
    "OOOOKOOOOKOOOO",
    "OOOOOOOOOOOOOO",
    "..OOOOOOOOOO..",
    "..DDDDDDDDDD..",
    "..O.O....O.O..",
    "..O.O....O.O..",
  ],
};

export const CLAWD_WALK_B: Sprite = {
  palette: CLAWD,
  rows: [
    "..OOOOOOOOOO..",
    "..OOOOOOOOOO..",
    "..OOKOOOOKOO..",
    "OOOOKOOOOKOOOO",
    "OOOOOOOOOOOOOO",
    "..OOOOOOOOOO..",
    "..DDDDDDDDDD..",
    "...O.O..O.O...",
    "...O.O..O.O...",
  ],
};

/** In the air: legs tucked, arms up. */
export const CLAWD_JUMP: Sprite = {
  palette: CLAWD,
  rows: [
    "OO..........OO",
    "OOOOOOOOOOOOOO",
    "..OOKOOOOKOO..",
    "..OOKOOOOKOO..",
    "..OOOOOOOOOO..",
    "..OOOOOOOOOO..",
    "..DDDDDDDDDD..",
    "...OO....OO...",
    "..............",
  ],
};

/** Ducking: squashed flat, eyes squinting. */
export const CLAWD_DUCK: Sprite = {
  palette: CLAWD,
  rows: [
    "..OOOOOOOOOO..",
    "OOOOKKOOKKOOOO",
    "OOOOOOOOOOOOOO",
    "..DDDDDDDDDD..",
    "..O.O....O.O..",
    "..O.O....O.O..",
  ],
};

const BUG = { B: "#4ade80", b: "#15803d", K: "#0b0d12", L: "#a7f3d0" };

export const BUG_A: Sprite = {
  palette: BUG,
  rows: [
    "...KKKK...",
    "..BBBBBB..",
    ".BBbBBbBB.",
    "BBBBBBBBBB",
    ".BbBBBBbB.",
    "L.L....L.L",
  ],
};

export const BUG_B: Sprite = {
  palette: BUG,
  rows: [
    "...KKKK...",
    "..BBBBBB..",
    ".BBbBBbBB.",
    "BBBBBBBBBB",
    ".BbBBBBbB.",
    ".L.L..L.L.",
  ],
};

const MOTH = { W: "#c4b5fd", M: "#7c3aed", K: "#f5f3ff" };

export const MOTH_A: Sprite = {
  palette: MOTH,
  rows: [
    "WW.......WW",
    "WWW.....WWW",
    ".WWWMMMWWW.",
    "...MMKMM...",
    ".WWWMMMWWW.",
    "WWW.....WWW",
    "WW.......WW",
  ],
};

export const MOTH_B: Sprite = {
  palette: MOTH,
  rows: [
    "...........",
    "...........",
    "WWWWMMMWWWW",
    "...MMKMM...",
    "WWWWMMMWWWW",
    "...........",
    "...........",
  ],
};

/** A token: Claude's four-point spark. */
export const TOKEN: Sprite = {
  palette: { T: "#ffc49a", t: "#d97757" },
  rows: [
    "...T...",
    "...T...",
    "..TtT..",
    "TTtttTT",
    "..TtT..",
    "...T...",
    "...T...",
  ],
};

/** Coffee: grants a shield. */
export const COFFEE: Sprite = {
  palette: { S: "#9ca3af", C: "#f5f5f7", c: "#a16207" },
  rows: [
    ".S..S...",
    "..S..S..",
    "CCCCCC..",
    "CccccCCC",
    "CccccC.C",
    "CccccCCC",
    "CCCCCC..",
    ".CCCC...",
  ],
};

export function spriteSize(sprite: Sprite) {
  return { w: sprite.rows[0].length, h: sprite.rows.length };
}

/** Draws a sprite with its top-left at (x, y), in world pixels. */
export function drawSprite(
  ctx: CanvasRenderingContext2D,
  sprite: Sprite,
  x: number,
  y: number,
) {
  const px = Math.round(x);
  const py = Math.round(y);
  sprite.rows.forEach((row, ry) => {
    for (let rx = 0; rx < row.length; rx++) {
      const color = sprite.palette[row[rx]];
      if (!color) continue;
      ctx.fillStyle = color;
      ctx.fillRect(px + rx, py + ry, 1, 1);
    }
  });
}
