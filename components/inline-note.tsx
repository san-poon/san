"use client";

import {
  Popover,
  PopoverArrow,
  PopoverClose,
  PopoverContent,
  PopoverDescription,
  PopoverTitle,
  PopoverTrigger,
} from "@ui-sdk/react/popover";
import type { NoteId } from "@/lib/journey-machine";
import { CONTROLS, NOTES } from "@/lib/site-content";

interface InlineNoteProps {
  noteId: NoteId;
  label: string;
  open: boolean;
  visited: boolean;
  onOpenChange: (open: boolean) => void;
}

export function InlineNote({
  noteId,
  label,
  open,
  visited,
  onOpenChange,
}: InlineNoteProps) {
  const note = NOTES[noteId];

  return (
    <Popover
      closeDelay={140}
      delay={180}
      onOpenChange={(next) => onOpenChange(next)}
      open={open}
      openOnHover
      presentation="auto"
    >
      <PopoverTrigger
        className="san-note-trigger"
        data-visited={visited ? "" : undefined}
      >
        {label}
      </PopoverTrigger>
      <PopoverContent align="start" side="bottom" sideOffset={8}>
        <PopoverArrow />
        <div
          aria-hidden="true"
          className="mx-auto mb-1 hidden h-1 w-9 rounded-full bg-[var(--rule-strong)]/50 in-data-[presentation=sheet]:block"
        />
        <span className="font-mono text-[0.7rem] font-medium uppercase tracking-[0.12em] text-[var(--primary)]">
          {note.tag}
        </span>
        <PopoverTitle className="text-[0.95rem] font-semibold tracking-[-0.01em] text-[var(--ink)]">
          {note.title}
        </PopoverTitle>
        <PopoverDescription className="text-[0.875rem] leading-relaxed text-[var(--ink-muted)]">
          {note.body}
        </PopoverDescription>
        <div className="mt-1 flex justify-end">
          <PopoverClose className="san-pill-btn san-pill-ghost text-xs">
            {CONTROLS.noteCloseLabel}
          </PopoverClose>
        </div>
      </PopoverContent>
    </Popover>
  );
}
