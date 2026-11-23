"use client";

import { useRef } from "react";
import { format } from "@/i18n/format";
import { useI18n } from "@/i18n/I18nProvider";
import {
  BUG_A,
  CLAWD_WALK_A,
  COFFEE,
  MOTH_A,
  type Sprite,
  TOKEN,
} from "./sprites";
import type { ClawdRunController } from "./useClawdRun";
import styles from "./ClawdRun.module.css";

/** A sprite drawn as a tiny CSS grid (for the side card's title and legend). */
function SpriteIcon({ sprite, px }: { sprite: Sprite; px: number }) {
  const width = sprite.rows[0].length;
  return (
    <span
      className={styles.sprite}
      style={{
        gridTemplateColumns: `repeat(${width}, ${px}px)`,
        gridAutoRows: `${px}px`,
      }}
      aria-hidden="true"
    >
      {sprite.rows.flatMap((row, y) =>
        [...row].map((cell, x) => (
          <i
            key={`${x}-${y}`}
            style={{ background: sprite.palette[cell] ?? "transparent" }}
          />
        )),
      )}
    </span>
  );
}

export function ClawdRun({ game }: { game: ClawdRunController }) {
  const { t } = useI18n();
  const copy = t.game;
  const area = useRef<HTMLDivElement>(null);
  const { canvasRef, hud, phase, result } = game;

  // Keys only reach the game while it has focus, so it never steals the page's space bar.
  const focusGame = () => area.current?.focus({ preventScroll: true });

  return (
    <div
      ref={area}
      className={styles.game}
      tabIndex={0}
      aria-label={copy.canvas}
      onKeyDown={game.onKeyDown}
      onKeyUp={game.onKeyUp}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null))
          game.onBlur();
      }}
    >
      <canvas
        ref={canvasRef}
        onPointerDown={(event) => {
          focusGame();
          game.onPointerDown(event);
        }}
        onPointerUp={game.onPointerUp}
        onPointerCancel={game.onPointerUp}
      />

      {phase !== "idle" && (
        <div className={styles.hud} aria-hidden="true">
          <span>
            {copy.score} <b>{hud.score}</b>
          </span>
          <span className={styles.tokens}>
            ✦ <b>{hud.tokens}</b>
            {hud.combo > 1 && <em>×{hud.combo}</em>}
          </span>
          {hud.shield && (
            <span className={styles.shield}>☕ {copy.shield}</span>
          )}
          <span>
            {copy.best} <b>{hud.best}</b>
          </span>
        </div>
      )}

      {phase === "playing" && (
        <button
          type="button"
          className={styles.duck}
          onPointerDown={(event) => {
            event.preventDefault();
            game.setDuck(true);
          }}
          onPointerUp={() => game.setDuck(false)}
          onPointerCancel={() => game.setDuck(false)}
          onPointerLeave={() => game.setDuck(false)}
          tabIndex={-1}
        >
          ↓ {copy.duck}
        </button>
      )}

      {/* Compact card on one side: the game stays visible behind it. */}
      {phase !== "playing" && (
        <div className={styles.overlay}>
          <div className={styles.card}>
            <div className={styles.cardTitle}>
              <span className={styles.hop}>
                <SpriteIcon sprite={CLAWD_WALK_A} px={2} />
              </span>
              <h3>
                {phase === "paused"
                  ? copy.paused
                  : phase === "ended" && result
                    ? result.newBest
                      ? copy.newBest
                      : copy.gameOver
                    : copy.title}
              </h3>
            </div>

            {phase === "ended" && result && (
              <p className={styles.result}>
                {format(copy.result, {
                  score: result.score,
                  tokens: result.tokens,
                  best: result.best,
                })}
              </p>
            )}

            {phase !== "ended" && (
              <>
                <ul className={styles.rows}>
                  <li>
                    <span className={styles.keys}>
                      <kbd>Space</kbd>
                      <kbd>↑</kbd>
                    </span>
                    {copy.controls.jump}
                  </li>
                  <li>
                    <span className={styles.keys}>
                      <kbd>↓</kbd>
                    </span>
                    {copy.controls.duck}
                  </li>
                  <li>
                    <span className={styles.keys}>
                      <kbd>P</kbd>
                    </span>
                    {copy.controls.pause}
                  </li>
                </ul>
                <ul className={`${styles.rows} ${styles.legend}`}>
                  <li>
                    <span className={styles.keys}>
                      <SpriteIcon sprite={BUG_A} px={1.6} />
                    </span>
                    {copy.legend.bug}
                  </li>
                  <li>
                    <span className={styles.keys}>
                      <SpriteIcon sprite={MOTH_A} px={1.6} />
                    </span>
                    {copy.legend.moth}
                  </li>
                  <li>
                    <span className={styles.keys}>
                      <SpriteIcon sprite={TOKEN} px={2} />
                    </span>
                    {copy.legend.token}
                  </li>
                  <li>
                    <span className={styles.keys}>
                      <SpriteIcon sprite={COFFEE} px={1.8} />
                    </span>
                    {copy.legend.coffee}
                  </li>
                </ul>
              </>
            )}

            <button
              type="button"
              className={styles.play}
              onClick={() => {
                if (phase === "paused") game.resume();
                else game.start();
                focusGame();
              }}
            >
              {phase === "paused"
                ? copy.resume
                : phase === "ended"
                  ? copy.playAgain
                  : copy.play}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
