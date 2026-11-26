"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import {
  NextIcon,
  PauseIcon,
  PlayIcon,
  PreviousIcon,
} from "@/components/icons/SystemIcons";
import { useI18n } from "@/i18n/I18nProvider";
import { cn } from "@/lib/text";
import { Widget } from "../Widget";
import { formatTime, useAudioPlayer } from "./useLofiPlayer";
import styles from "./NowPlayingWidget.module.css";

const EQ_BARS = [0, 1, 2, 3];

export function NowPlayingWidget() {
  const {
    isPlaying,
    displayTime,
    duration,
    fillRef,
    thumbWrapRef,
    toggle,
    track,
    previous,
    next,
    previewScrub,
    commitScrub,
    seekBy,
  } = useAudioPlayer();
  const { t } = useI18n();
  const [scrubbing, setScrubbing] = useState(false);
  const scrubberRef = useRef<HTMLDivElement>(null);

  const remaining = Math.max(0, Math.ceil(duration) - displayTime);

  function ratioFromClientX(clientX: number): number {
    const rect = scrubberRef.current?.getBoundingClientRect();
    if (!rect || rect.width <= 0) return 0;
    return Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
  }

  function stopWidgetDrag(event: React.PointerEvent) {
    event.stopPropagation();
  }

  function onScrubPointerDown(event: React.PointerEvent<HTMLDivElement>) {
    if (event.button !== 0) return;
    event.stopPropagation();
    event.currentTarget.setPointerCapture(event.pointerId);
    setScrubbing(true);
    previewScrub(ratioFromClientX(event.clientX));
  }

  function onScrubPointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (!scrubbing) return;
    previewScrub(ratioFromClientX(event.clientX));
  }

  function onScrubPointerEnd(event: React.PointerEvent<HTMLDivElement>) {
    if (!scrubbing) return;
    setScrubbing(false);
    commitScrub(ratioFromClientX(event.clientX));
  }

  function onScrubKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      seekBy(5);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      seekBy(-5);
    } else if (event.key === "Home") {
      event.preventDefault();
      commitScrub(0);
    } else if (event.key === "End") {
      event.preventDefault();
      commitScrub(1);
    }
  }

  return (
    <Widget
      wide
      className={styles.widget}
      aria-label={t.widgets.nowPlaying}
      data-playing={isPlaying ? "true" : "false"}
    >
      {/* Like Apple Music: the widget takes its colour from a blurred copy of the artwork. */}
      <div className={styles.backdrop} aria-hidden="true">
        <Image
          src={track.coverSrc}
          alt=""
          fill
          sizes="200px"
          // Visible on first load (on phones it's the largest image on screen): no lazy wait.
          loading="eager"
          className={styles.backdropImage}
        />
      </div>
      <div className={styles.top}>
        <div
          className={styles.artworkFrame}
          data-playing={isPlaying ? "true" : "false"}
        >
          <Image
            src={track.coverSrc}
            alt={`${track.title} — ${track.artist}`}
            fill
            sizes="64px"
            loading="eager"
            className={styles.artworkImage}
          />
        </div>

        <div className={styles.meta}>
          <div className={styles.titleRow}>
            <h4>{track.title}</h4>
            <span
              className={styles.eq}
              data-playing={isPlaying ? "true" : "false"}
              aria-hidden="true"
            >
              {EQ_BARS.map((bar) => (
                <i key={bar} />
              ))}
            </span>
          </div>
          <p className={styles.artist}>{track.artist}</p>

          <div className={styles.controls}>
            <button
              type="button"
              className={styles.controlBtn}
              aria-label={t.widgets.previous}
              onPointerDown={stopWidgetDrag}
              onClick={previous}
            >
              <PreviousIcon />
            </button>
            <button
              type="button"
              className={cn(styles.controlBtn, styles.playBtn)}
              aria-label={isPlaying ? t.widgets.pause : t.widgets.play}
              aria-pressed={isPlaying}
              onPointerDown={stopWidgetDrag}
              onClick={toggle}
            >
              <span className={styles.glyphWrap} aria-hidden="true">
                <span
                  className={styles.glyph}
                  data-visible={!isPlaying ? "true" : "false"}
                >
                  <PlayIcon />
                </span>
                <span
                  className={styles.glyph}
                  data-visible={isPlaying ? "true" : "false"}
                >
                  <PauseIcon />
                </span>
              </span>
            </button>
            <button
              type="button"
              className={styles.controlBtn}
              aria-label={t.widgets.next}
              onPointerDown={stopWidgetDrag}
              onClick={next}
            >
              <NextIcon />
            </button>
          </div>
        </div>
      </div>

      <div className={styles.scrubberRow}>
        <span className={styles.time}>{formatTime(displayTime)}</span>
        <div
          ref={scrubberRef}
          role="slider"
          tabIndex={0}
          aria-label={t.widgets.seek}
          aria-valuemin={0}
          aria-valuemax={Math.round(duration)}
          aria-valuenow={displayTime}
          aria-valuetext={`${formatTime(displayTime)} / ${formatTime(duration)}`}
          className={styles.scrubber}
          data-scrubbing={scrubbing ? "true" : "false"}
          onPointerDown={onScrubPointerDown}
          onPointerMove={onScrubPointerMove}
          onPointerUp={onScrubPointerEnd}
          onPointerCancel={onScrubPointerEnd}
          onKeyDown={onScrubKeyDown}
        >
          <div className={styles.track}>
            <div ref={fillRef} className={styles.fill} />
          </div>
          <div ref={thumbWrapRef} className={styles.thumbWrap}>
            <span className={styles.thumb} />
          </div>
        </div>
        <span className={cn(styles.time, styles.timeEnd)}>
          -{formatTime(remaining)}
        </span>
      </div>
    </Widget>
  );
}
