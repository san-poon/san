"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@ui-sdk/react/avatar";
import { Button } from "@ui-sdk/react/button";
import {
  Dialog,
  DialogBackdrop,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@ui-sdk/react/dialog";
import { usePreference } from "@ui-sdk/react/preferences";
import {
  SegmentedControl,
  SegmentedControlIndicator,
  SegmentedControlItem,
} from "@ui-sdk/react/segmented-control";
import { toast } from "@ui-sdk/react/toast";
import { useReducer } from "react";
import {
  ArrowRightIcon,
  ArrowUpRightIcon,
  AxinderLogo,
  CheckIcon,
  CloseIcon,
  GitHubIcon,
  MoonIcon,
  SparkIcon,
  SunIcon,
  SystemIcon,
  XIcon,
} from "@/components/icons";
import { InlineNote } from "@/components/inline-note";
import {
  createInitialJourneyState,
  HORIZON_ORDER,
  type HorizonId,
  reduceJourney,
  selectJourneyView,
} from "@/lib/journey-machine";
import { COLOR_SCHEME_OPTIONS, colorScheme } from "@/lib/preferences";
import {
  CONTROLS,
  HORIZONS,
  IDENTITY,
  LINKS,
  RECALL,
} from "@/lib/site-content";

function ThemeGlyph({ value }: { value: "light" | "system" | "dark" }) {
  if (value === "light") return <SunIcon className="size-3.5" />;
  if (value === "dark") return <MoonIcon className="size-3.5" />;
  return <SystemIcon className="size-3.5" />;
}

function LinkGlyph({ id }: { id: "axinder" | "github" | "x" }) {
  if (id === "axinder") return <AxinderLogo className="size-4" />;
  if (id === "github") return <GitHubIcon className="size-4" />;
  return <XIcon className="size-3.5" />;
}

function isHorizonId(value: string | null): value is HorizonId {
  return value === "now" || value === "next" || value === "long-game";
}

export function HomeExperience() {
  const [state, dispatch] = useReducer(
    reduceJourney,
    undefined,
    createInitialJourneyState,
  );
  const view = selectJourneyView(state);
  const scheme = usePreference(colorScheme);
  const activeEntry = HORIZONS[view.activeHorizon];
  const nextHorizonEntry = view.nextUnvisitedHorizon
    ? HORIZONS[view.nextUnvisitedHorizon]
    : null;

  function handlePortraitNudge() {
    const quip =
      IDENTITY.portraitQuips[
        view.portraitNudges % IDENTITY.portraitQuips.length
      ];
    dispatch({ type: "NUDGE_PORTRAIT" });
    toast(quip.title, { description: quip.description });
  }

  return (
    <div className="san-backdrop-glow min-h-dvh">
      <div className="mx-auto flex min-h-dvh w-full max-w-[40rem] flex-col justify-between px-5 pb-10 pt-6 sm:px-8 sm:pb-14 sm:pt-10">
        <div>
          {/* Top identity + pure ui-sdk theme switcher */}
          <header className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <Button
                aria-label={CONTROLS.portraitButtonLabel}
                className="san-unstyled-btn group relative shrink-0 cursor-pointer rounded-full focus-visible:outline-4 focus-visible:outline-[var(--ui-ring)]"
                onClick={handlePortraitNudge}
              >
                <span
                  key={view.portraitNudges}
                  className={
                    view.portraitNudges > 0
                      ? "san-portrait-pop block rounded-full"
                      : "block rounded-full"
                  }
                >
                  <Avatar
                    aria-hidden="true"
                    className="size-11 overflow-hidden rounded-full ring-2 ring-[var(--spruce)]/30 transition-transform duration-200 group-hover:scale-105 group-hover:ring-[var(--spruce)] sm:size-12"
                  >
                    <AvatarImage
                      alt=""
                      className="size-full object-cover object-center"
                      src={IDENTITY.avatarSrc}
                    />
                    <AvatarFallback
                      className="flex size-full items-center justify-center bg-[var(--spruce-soft)] text-xs font-semibold text-[var(--spruce)]"
                      delay={250}
                    >
                      SP
                    </AvatarFallback>
                  </Avatar>
                </span>
              </Button>
              <div className="min-w-0">
                <p className="truncate text-[1.05rem] font-semibold tracking-[-0.015em] text-[var(--ink)]">
                  {IDENTITY.name}
                </p>
                <p className="truncate font-mono text-[0.72rem] tracking-[0.02em] text-[var(--ink-muted)]">
                  {IDENTITY.roleTag}
                </p>
              </div>
            </div>

            <SegmentedControl
              aria-label={CONTROLS.themeGroupLabel}
              className="shrink-0"
              onValueChange={(next) => {
                if (next === "light" || next === "system" || next === "dark") {
                  colorScheme.set(next);
                }
              }}
              value={scheme.value}
            >
              <SegmentedControlIndicator />
              {COLOR_SCHEME_OPTIONS.map((option) => (
                <SegmentedControlItem
                  key={option.value}
                  className="h-7 gap-1.5 px-2.5 text-xs"
                  value={option.value}
                >
                  <ThemeGlyph value={option.value} />
                  <span className="sr-only sm:not-sr-only">{option.label}</span>
                </SegmentedControlItem>
              ))}
            </SegmentedControl>
          </header>

          {/* Opening editorial thesis */}
          <section className="mt-10 sm:mt-14">
            <h1 className="text-[1.85rem] font-semibold leading-[1.15] tracking-[-0.03em] text-[var(--ink)] sm:text-[2.35rem]">
              {IDENTITY.headline}
            </h1>
            <p className="mt-4 max-w-[34rem] text-[1.05rem] leading-[1.65] text-[var(--ink-muted)] sm:text-[1.1rem]">
              {IDENTITY.subheadline}
            </p>
          </section>

          {/* Horizon centerpiece */}
          <main className="mt-10 sm:mt-12">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <SegmentedControl
                aria-label={CONTROLS.horizonGroupLabel}
                onValueChange={(next) => {
                  if (isHorizonId(next)) {
                    dispatch({ type: "SELECT_HORIZON", horizon: next });
                  }
                }}
                value={view.activeHorizon}
              >
                <SegmentedControlIndicator />
                {HORIZON_ORDER.map((id) => {
                  const entry = HORIZONS[id];
                  const visited = view.isHorizonVisited(id);
                  const active = view.activeHorizon === id;
                  return (
                    <SegmentedControlItem
                      key={id}
                      className="h-8 gap-2 px-3.5 text-[0.84rem]"
                      value={id}
                    >
                      <span>{entry.tabLabel}</span>
                      <span
                        aria-hidden="true"
                        className={
                          active
                            ? "size-1.5 rounded-full bg-[var(--amber)]"
                            : visited
                              ? "size-1.5 rounded-full bg-[var(--spruce)]"
                              : "size-1.5 rounded-full bg-[var(--rule-strong)]/45"
                        }
                      />
                    </SegmentedControlItem>
                  );
                })}
              </SegmentedControl>

              <span className="font-mono text-xs text-[var(--ink-muted)]">
                {view.visitedCount} / {view.totalHorizons}{" "}
                {CONTROLS.progressSuffix}
                {view.openedNoteCount > 0
                  ? ` · ${view.openedNoteCount} ${
                      view.openedNoteCount === 1
                        ? CONTROLS.notesExploredSingular
                        : CONTROLS.notesExploredPlural
                    }`
                  : ""}
              </span>
            </div>

            <article
              key={activeEntry.id}
              className="san-beat-panel mt-6 rounded-2xl border border-[var(--rule)] bg-[var(--paper-surface)] p-5 shadow-[0_1px_2px_oklch(0_0_0/0.04)] sm:p-7"
            >
              <div className="flex items-center gap-2.5">
                <span className="font-mono text-xs font-medium uppercase tracking-[0.12em] text-[var(--spruce)]">
                  {activeEntry.indexLabel} · {activeEntry.tabLabel}
                </span>
              </div>

              <h2 className="mt-2.5 text-[1.35rem] font-semibold leading-[1.25] tracking-[-0.02em] text-[var(--ink)] sm:text-[1.5rem]">
                {activeEntry.title}
              </h2>
              <p className="mt-2 text-[0.98rem] font-medium leading-[1.55] text-[var(--ink)]/90">
                {activeEntry.lead}
              </p>

              <div className="mt-5 space-y-4 text-[1rem] leading-[1.7] text-[var(--ink-muted)]">
                {activeEntry.paragraphs.map((paragraph, index) => (
                  <div key={`${activeEntry.id}-${index}`}>
                    {paragraph.map((segment, segIndex) =>
                      segment.type === "text" ? (
                        <span key={`${activeEntry.id}-${index}-${segIndex}`}>
                          {segment.value}
                        </span>
                      ) : (
                        <InlineNote
                          key={segment.id}
                          label={segment.label}
                          noteId={segment.id}
                          onOpenChange={(open) =>
                            dispatch({
                              type: "SET_NOTE_OPEN",
                              note: segment.id,
                              open,
                            })
                          }
                          open={view.activeNote === segment.id}
                          visited={view.openedNotes.includes(segment.id)}
                        />
                      ),
                    )}
                  </div>
                ))}
              </div>

              {activeEntry.spotlight ? (
                <div className="mt-6 flex flex-col gap-4 rounded-xl border border-[var(--rule)] bg-[var(--paper)] p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3.5">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-[var(--rule)] bg-[var(--paper-surface)]">
                      <AxinderLogo className="size-6" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[var(--ink)]">
                        {activeEntry.spotlight.name}
                      </p>
                      <p className="text-[0.84rem] leading-snug text-[var(--ink-muted)]">
                        {activeEntry.spotlight.tagline}
                      </p>
                    </div>
                  </div>
                  <Button
                    className="san-pill-btn san-pill-primary inline-flex shrink-0 items-center justify-center gap-1.5"
                    render={(props) => (
                      <a
                        {...props}
                        href={activeEntry.spotlight?.href}
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        {props.children}
                      </a>
                    )}
                  >
                    <span>{activeEntry.spotlight.actionLabel}</span>
                    <ArrowUpRightIcon className="size-3.5" />
                  </Button>
                </div>
              ) : null}

              {/* Beat progression + unlockable recall trigger */}
              <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--rule)] pt-4">
                <div aria-hidden="true" className="flex items-center gap-1.5">
                  {HORIZON_ORDER.map((id) => {
                    const visited = view.isHorizonVisited(id);
                    const active = view.activeHorizon === id;
                    return (
                      <span
                        key={id}
                        className={
                          active
                            ? "h-1.5 w-6 rounded-full bg-[var(--amber)] transition-all duration-200"
                            : visited
                              ? "h-1.5 w-3.5 rounded-full bg-[var(--spruce)] transition-all duration-200"
                              : "h-1.5 w-2 rounded-full bg-[var(--rule-strong)]/40 transition-all duration-200"
                        }
                      />
                    );
                  })}
                </div>

                {nextHorizonEntry ? (
                  <Button
                    className="san-pill-btn san-pill-ghost inline-flex items-center gap-1.5"
                    onClick={() => dispatch({ type: "STEP_NEXT_UNVISITED" })}
                  >
                    <span>
                      {CONTROLS.continuePrefix} {nextHorizonEntry.tabLabel}
                    </span>
                    <ArrowRightIcon className="size-3.5" />
                  </Button>
                ) : (
                  <Dialog
                    onOpenChange={(open) => {
                      if (open) {
                        toast.dismiss();
                      }
                      dispatch({ type: open ? "OPEN_RECALL" : "CLOSE_RECALL" });
                    }}
                    open={view.isRecallOpen}
                    presentation="auto"
                  >
                    <DialogTrigger
                      className={
                        view.isCompleted
                          ? "san-pill-btn san-pill-ghost inline-flex items-center gap-1.5"
                          : "san-pill-btn san-pill-amber inline-flex items-center gap-1.5"
                      }
                    >
                      <SparkIcon className="size-3.5" />
                      <span>
                        {view.isCompleted
                          ? RECALL.replayLabel
                          : RECALL.triggerLabel}
                      </span>
                    </DialogTrigger>

                    <DialogBackdrop />
                    <DialogContent>
                      <div
                        aria-hidden="true"
                        className="mx-auto mb-1 hidden h-1 w-10 rounded-full bg-[var(--rule-strong)]/50 in-data-[presentation=sheet]:block"
                      />
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <span className="font-mono text-[0.7rem] font-medium uppercase tracking-[0.12em] text-[var(--amber)]">
                            {view.revealedCount} / {RECALL.cards.length}
                          </span>
                          <DialogTitle className="mt-1 text-xl font-semibold tracking-[-0.02em] text-[var(--ink)]">
                            {RECALL.title}
                          </DialogTitle>
                          <DialogDescription className="mt-1 text-sm leading-relaxed text-[var(--ink-muted)]">
                            {RECALL.description}
                          </DialogDescription>
                        </div>
                        <DialogClose
                          aria-label="Close recall"
                          className="san-unstyled-btn inline-flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-full border border-[var(--rule)] text-[var(--ink-muted)] hover:bg-[var(--paper-muted)] hover:text-[var(--ink)]"
                        >
                          <CloseIcon className="size-4" />
                        </DialogClose>
                      </div>

                      <div className="mt-1 flex flex-col gap-2.5">
                        {RECALL.cards.map((card) => {
                          const revealed = view.revealedCards.includes(
                            card.horizon,
                          );
                          return (
                            <Button
                              key={card.horizon}
                              aria-pressed={revealed}
                              className="san-recall-card"
                              data-revealed={revealed ? "" : undefined}
                              onClick={() =>
                                dispatch({
                                  type: "TOGGLE_RECALL_CARD",
                                  horizon: card.horizon,
                                })
                              }
                            >
                              <span
                                aria-hidden="true"
                                className="flex w-full items-center justify-between gap-2 text-xs font-medium text-[var(--spruce)]"
                              >
                                <span className="font-mono uppercase tracking-[0.1em]">
                                  {card.badge}
                                </span>
                                {revealed ? (
                                  <CheckIcon className="size-3.5 text-[var(--spruce)]" />
                                ) : null}
                              </span>
                              <span className="text-[0.95rem] font-semibold text-[var(--ink)]">
                                {card.prompt}
                              </span>
                              {revealed ? (
                                <span className="text-[0.875rem] leading-relaxed text-[var(--ink-muted)]">
                                  <span className="sr-only"> — </span>
                                  {card.answer}
                                </span>
                              ) : null}
                            </Button>
                          );
                        })}
                      </div>

                      {view.isRemembered ? (
                        <p className="rounded-xl border border-[var(--spruce)]/30 bg-[var(--spruce-soft)] px-3.5 py-2.5 text-sm font-medium text-[var(--ink)]">
                          {RECALL.rememberedNote}
                        </p>
                      ) : null}

                      <div className="mt-1 flex items-center justify-between gap-3">
                        <Button
                          className="san-pill-btn san-pill-ghost"
                          disabled={view.revealedCount === 0}
                          onClick={() => dispatch({ type: "RESET_RECALL" })}
                        >
                          {RECALL.resetLabel}
                        </Button>
                        <DialogClose className="san-pill-btn san-pill-primary">
                          {RECALL.closeLabel}
                        </DialogClose>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            </article>

            {view.isCompleted ? (
              <p className="mt-4 text-center font-mono text-xs tracking-[0.04em] text-[var(--spruce)]">
                {RECALL.completedEcho}
              </p>
            ) : null}
          </main>
        </div>

        {/* Minimal footer: Axinder, GitHub, X only */}
        <footer className="mt-14 border-t border-[var(--rule)] pt-6">
          <nav
            aria-label="External links"
            className="flex flex-wrap items-center justify-between gap-3"
          >
            <div className="flex flex-wrap items-center gap-2.5">
              {LINKS.map((link) => (
                <Button
                  key={link.id}
                  className="san-pill-btn san-pill-ghost inline-flex items-center gap-2"
                  render={(props) => (
                    <a
                      {...props}
                      href={link.href}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      {props.children}
                    </a>
                  )}
                >
                  <LinkGlyph id={link.id} />
                  <span>{link.label}</span>
                </Button>
              ))}
            </div>
            <span className="font-mono text-xs text-[var(--ink-muted)]">
              sanpoon.com
            </span>
          </nav>
        </footer>
      </div>
    </div>
  );
}
