export const HORIZON_ORDER = ["now", "next", "long-game"] as const;

export type HorizonId = (typeof HORIZON_ORDER)[number];

export type NoteId =
  | "bad-software"
  | "real-leverage"
  | "credentials"
  | "stagnation";

export type RecallState =
  | { readonly kind: "exploring" }
  | { readonly kind: "unlocked" }
  | { readonly kind: "recalling"; readonly revealed: readonly HorizonId[] }
  | { readonly kind: "remembered"; readonly revealed: readonly HorizonId[] }
  | { readonly kind: "completed" };

export interface JourneyState {
  readonly activeHorizon: HorizonId;
  readonly visitedHorizons: readonly HorizonId[];
  readonly openedNotes: readonly NoteId[];
  readonly activeNote: NoteId | null;
  readonly recall: RecallState;
  readonly portraitNudges: number;
}

export type JourneyEvent =
  | { readonly type: "SELECT_HORIZON"; readonly horizon: HorizonId }
  | { readonly type: "STEP_NEXT_UNVISITED" }
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
  readonly visitedHorizons: readonly HorizonId[];
  readonly visitedCount: number;
  readonly totalHorizons: number;
  readonly isHorizonVisited: (horizon: HorizonId) => boolean;
  readonly nextUnvisitedHorizon: HorizonId | null;
  readonly activeNote: NoteId | null;
  readonly openedNotes: readonly NoteId[];
  readonly openedNoteCount: number;
  readonly recallKind: RecallState["kind"];
  readonly isRecallOpen: boolean;
  readonly canOpenRecall: boolean;
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
    visitedHorizons: ["now"],
    openedNotes: [],
    activeNote: null,
    recall: { kind: "exploring" },
    portraitNudges: 0,
  };
}

export function reduceJourney(
  state: JourneyState,
  event: JourneyEvent,
): JourneyState {
  switch (event.type) {
    case "SELECT_HORIZON": {
      const visitedHorizons = appendUnique(
        state.visitedHorizons,
        event.horizon,
      );
      const recall: RecallState =
        state.recall.kind === "exploring" &&
        allHorizonsIncluded(visitedHorizons)
          ? { kind: "unlocked" }
          : state.recall;
      return {
        ...state,
        activeHorizon: event.horizon,
        activeNote: null,
        visitedHorizons,
        recall,
      };
    }

    case "STEP_NEXT_UNVISITED": {
      const next = HORIZON_ORDER.find(
        (id) => !state.visitedHorizons.includes(id),
      );
      if (next) {
        return reduceJourney(state, { type: "SELECT_HORIZON", horizon: next });
      }
      return reduceJourney(state, { type: "OPEN_RECALL" });
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
      if (
        state.recall.kind !== "unlocked" &&
        state.recall.kind !== "completed"
      ) {
        return state;
      }
      return {
        ...state,
        activeNote: null,
        recall: { kind: "recalling", revealed: [] },
      };
    }

    case "CLOSE_RECALL": {
      if (state.recall.kind === "remembered") {
        return { ...state, recall: { kind: "completed" } };
      }
      if (state.recall.kind === "recalling") {
        return { ...state, recall: { kind: "unlocked" } };
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
        ? { kind: "remembered", revealed }
        : { kind: "recalling", revealed };
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
        recall: { kind: "recalling", revealed: [] },
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
  const nextUnvisitedHorizon =
    HORIZON_ORDER.find((id) => !state.visitedHorizons.includes(id)) ?? null;
  const isRecallOpen =
    state.recall.kind === "recalling" || state.recall.kind === "remembered";
  const revealedCards =
    state.recall.kind === "recalling" || state.recall.kind === "remembered"
      ? state.recall.revealed
      : EMPTY_HORIZONS;

  return {
    activeHorizon: state.activeHorizon,
    visitedHorizons: state.visitedHorizons,
    visitedCount: state.visitedHorizons.length,
    totalHorizons: HORIZON_ORDER.length,
    isHorizonVisited: (horizon) => state.visitedHorizons.includes(horizon),
    nextUnvisitedHorizon,
    activeNote: state.activeNote,
    openedNotes: state.openedNotes,
    openedNoteCount: state.openedNotes.length,
    recallKind: state.recall.kind,
    isRecallOpen,
    canOpenRecall:
      state.recall.kind === "unlocked" || state.recall.kind === "completed",
    isRemembered: state.recall.kind === "remembered",
    isCompleted: state.recall.kind === "completed",
    revealedCards,
    revealedCount: revealedCards.length,
    portraitNudges: state.portraitNudges,
  };
}
