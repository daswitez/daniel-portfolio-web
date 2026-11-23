"use client";

import type { ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import type { OpenTarget } from "@/types/windows";
import { useWindowActions } from "./WindowManager";

interface OpenWindowButtonProps {
  target: OpenTarget;
  children: ReactNode;
  variant?: "primary" | "ghost";
  /** Pass a className to render an unstyled button instead of <Button>. */
  className?: string;
}

/** Client island that lets server-rendered content open a desktop window. */
export function OpenWindowButton({
  target,
  children,
  variant,
  className,
}: OpenWindowButtonProps) {
  const { open } = useWindowActions();

  if (className) {
    return (
      <button type="button" className={className} onClick={() => open(target)}>
        {children}
      </button>
    );
  }

  return (
    <Button variant={variant} onClick={() => open(target)}>
      {children}
    </Button>
  );
}
