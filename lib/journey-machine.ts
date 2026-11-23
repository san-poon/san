export const HORIZON_ORDER = ["now", "next", "long-game"] as const;

export type HorizonId = (typeof HORIZON_ORDER)[number];

export type NoteId =
  | "bad-software"
  | "real-leverage"
  | "credentials"
  | "stagnation";

export type RecallState =
  | { readonly kind: "idle" }
  | {
      readonly kind: "recalling";
      readonly returnTo: "idle" | "completed";
      readonly revealed: readonly HorizonId[];
    }
  | {
      readonly kind: "remembered";
      readonly returnTo: "idle" | "completed";
      readonly revealed: readonly HorizonId[];
    }
  | { readonly kind: "completed" };

export interface JourneyState {
  readonly activeHorizon: HorizonId;
  readonly openedNotes: readonly NoteId[];
  readonly activeNote: NoteId | null;
  readonly recall: RecallState;
  readonly portraitNudges: number;
}

export type JourneyEvent =
  | { readonly type: "SELECT_HORIZON"; readonly horizon: HorizonId }
  | { readonly type: "PREVIOUS_HORIZON" }
  | { readonly type: "NEXT_HORIZON" }
  | {
      readonly type: "SET_NOTE_OPEN";
      readonly note: NoteId;
      readonly open: boolean;
    }
  | { readonly type: "OPEN_RECALL" }
  | { readonly type: "CLOSE_RECALL" }
  | { readonly type: "TOGGLE_RECALL_CARD"; readonly horizon: HorizonId }
  | { readonly type: "RESET_RECALL" }
  | { readonly type: "NUDGE_PORTRAIT" };

export interface JourneyView {
  readonly activeHorizon: HorizonId;
  readonly activeIndex: number;
  readonly stepNumber: number;
  readonly totalHorizons: number;
  readonly canGoPrevious: boolean;
  readonly canGoNext: boolean;
  readonly isLastHorizon: boolean;
  readonly activeNote: NoteId | null;
  readonly openedNotes: readonly NoteId[];
  readonly openedNoteCount: number;
  readonly recallKind: RecallState["kind"];
  readonly isRecallOpen: boolean;
  readonly isRemembered: boolean;
  readonly isCompleted: boolean;
  readonly revealedCards: readonly HorizonId[];
  readonly revealedCount: number;
  readonly portraitNudges: number;
}

const EMPTY_HORIZONS: readonly HorizonId[] = [];

function appendUnique<T>(list: readonly T[], item: T): readonly T[] {
  return list.includes(item) ? list : [...list, item];
}

function toggleItem<T>(list: readonly T[], item: T): readonly T[] {
  return list.includes(item)
    ? list.filter((entry) => entry !== item)
    : [...list, item];
}

function allHorizonsIncluded(list: readonly HorizonId[]): boolean {
  return HORIZON_ORDER.every((id) => list.includes(id));
}

export function createInitialJourneyState(): JourneyState {
  return {
    activeHorizon: "now",
    openedNotes: [],
    activeNote: null,
    recall: { kind: "idle" },
    portraitNudges: 0,
  };
}

export function reduceJourney(
  state: JourneyState,
  event: JourneyEvent,
): JourneyState {
  switch (event.type) {
    case "SELECT_HORIZON": {
      return {
        ...state,
        activeHorizon: event.horizon,
        activeNote: null,
      };
    }

    case "PREVIOUS_HORIZON": {
      const currentIndex = HORIZON_ORDER.indexOf(state.activeHorizon);
      const nextIndex = Math.max(0, currentIndex - 1);
      return {
        ...state,
        activeHorizon: HORIZON_ORDER[nextIndex],
        activeNote: null,
      };
    }

    case "NEXT_HORIZON": {
      const currentIndex = HORIZON_ORDER.indexOf(state.activeHorizon);
      const nextIndex = Math.min(HORIZON_ORDER.length - 1, currentIndex + 1);
      return {
        ...state,
        activeHorizon: HORIZON_ORDER[nextIndex],
        activeNote: null,
      };
    }

    case "SET_NOTE_OPEN": {
      if (event.open) {
        return {
          ...state,
          activeNote: event.note,
          openedNotes: appendUnique(state.openedNotes, event.note),
        };
      }
      if (state.activeNote !== event.note) {
        return state;
      }
      return {
        ...state,
        activeNote: null,
      };
    }

    case "OPEN_RECALL": {
      if (state.recall.kind !== "idle" && state.recall.kind !== "completed") {
        return state;
      }
      return {
        ...state,
        activeNote: null,
        recall: {
          kind: "recalling",
          returnTo: state.recall.kind,
          revealed: [],
        },
      };
    }

    case "CLOSE_RECALL": {
      if (state.recall.kind === "remembered") {
        return { ...state, recall: { kind: "completed" } };
      }
      if (state.recall.kind === "recalling") {
        return { ...state, recall: { kind: state.recall.returnTo } };
      }
      return state;
    }

    case "TOGGLE_RECALL_CARD": {
      if (
        state.recall.kind !== "recalling" &&
        state.recall.kind !== "remembered"
      ) {
        return state;
      }
      const revealed = toggleItem(state.recall.revealed, event.horizon);
      const recall: RecallState = allHorizonsIncluded(revealed)
        ? {
            kind: "remembered",
            returnTo: state.recall.returnTo,
            revealed,
          }
        : {
            kind: "recalling",
            returnTo: state.recall.returnTo,
            revealed,
          };
      return { ...state, recall };
    }

    case "RESET_RECALL": {
      if (
        state.recall.kind !== "recalling" &&
        state.recall.kind !== "remembered"
      ) {
        return state;
      }
      return {
        ...state,
        recall: {
          kind: "recalling",
          returnTo: state.recall.returnTo,
          revealed: [],
        },
      };
    }

    case "NUDGE_PORTRAIT": {
      return {
        ...state,
        portraitNudges: state.portraitNudges + 1,
      };
    }

    default: {
      const _exhaustive: never = event;
      return _exhaustive;
    }
  }
}

export function selectJourneyView(state: JourneyState): JourneyView {
  const activeIndex = HORIZON_ORDER.indexOf(state.activeHorizon);
  const isRecallOpen =
    state.recall.kind === "recalling" || state.recall.kind === "remembered";
  const revealedCards =
    state.recall.kind === "recalling" || state.recall.kind === "remembered"
      ? state.recall.revealed
      : EMPTY_HORIZONS;

  return {
    activeHorizon: state.activeHorizon,
    activeIndex,
    stepNumber: activeIndex + 1,
    totalHorizons: HORIZON_ORDER.length,
    canGoPrevious: activeIndex > 0,
    canGoNext: activeIndex < HORIZON_ORDER.length - 1,
    isLastHorizon: activeIndex === HORIZON_ORDER.length - 1,
    activeNote: state.activeNote,
    openedNotes: state.openedNotes,
    openedNoteCount: state.openedNotes.length,
    recallKind: state.recall.kind,
    isRecallOpen,
    isRemembered: state.recall.kind === "remembered",
    isCompleted: state.recall.kind === "completed",
    revealedCards,
    revealedCount: revealedCards.length,
    portraitNudges: state.portraitNudges,
  };
}
