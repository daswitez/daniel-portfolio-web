"use client";

import type { HTMLAttributes } from "react";
import { useWindowActions } from "@/components/windows/WindowManager";
import { useDesktopDrag } from "@/hooks/useDesktopDrag";
import { cn } from "@/lib/text";
import styles from "./widgets.module.css";

interface WidgetProps extends HTMLAttributes<HTMLDivElement> {
  /** Spans both columns of the widget grid. */
  wide?: boolean;
}

/** Glass tile that every desktop widget sits in. It can be dragged around the desk. */
export function Widget({ wide = false, className, ...props }: WidgetProps) {
  const { deskRef } = useWindowActions();
  const onDragStart = useDesktopDrag<HTMLDivElement>(deskRef);

  return (
    <div
      onPointerDown={onDragStart}
      className={cn(
        "glass desk-item",
        styles.widget,
        wide && styles.wide,
        className,
      )}
      {...props}
    />
  );
}
