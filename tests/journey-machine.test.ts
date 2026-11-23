import { describe, expect, test } from "vitest";
import {
  createInitialJourneyState,
  HORIZON_ORDER,
  reduceJourney,
  selectJourneyView,
} from "@/lib/journey-machine";

describe("journey-machine", () => {
  test("starts at now in exploring state with 1/3 visited", () => {
    const initial = createInitialJourneyState();
    const view = selectJourneyView(initial);

    expect(view.activeHorizon).toBe("now");
    expect(view.visitedHorizons).toEqual(["now"]);
    expect(view.visitedCount).toBe(1);
    expect(view.totalHorizons).toBe(HORIZON_ORDER.length);
    expect(view.nextUnvisitedHorizon).toBe("next");
    expect(view.recallKind).toBe("exploring");
    expect(view.isRecallOpen).toBe(false);
    expect(view.canOpenRecall).toBe(false);
  });

  test("unlocks recall only after all three horizons are visited in any order", () => {
    let state = createInitialJourneyState();

    state = reduceJourney(state, {
      type: "SELECT_HORIZON",
      horizon: "long-game",
    });
    expect(state.visitedHorizons).toEqual(["now", "long-game"]);
    expect(selectJourneyView(state).nextUnvisitedHorizon).toBe("next");
    expect(state.recall.kind).toBe("exploring");

    // Re-visiting an already visited horizon does not unlock early.
    state = reduceJourney(state, { type: "SELECT_HORIZON", horizon: "now" });
    expect(state.recall.kind).toBe("exploring");

    // Visiting the third unique horizon transitions exploring -> unlocked.
    state = reduceJourney(state, { type: "SELECT_HORIZON", horizon: "next" });
    const view = selectJourneyView(state);
    expect(view.visitedCount).toBe(3);
    expect(view.nextUnvisitedHorizon).toBeNull();
    expect(view.recallKind).toBe("unlocked");
    expect(view.canOpenRecall).toBe(true);
  });

  test("STEP_NEXT_UNVISITED advances through remaining horizons then opens recall", () => {
    let state = createInitialJourneyState();

    state = reduceJourney(state, { type: "STEP_NEXT_UNVISITED" });
    expect(state.activeHorizon).toBe("next");
    expect(state.recall.kind).toBe("exploring");

    state = reduceJourney(state, { type: "STEP_NEXT_UNVISITED" });
    expect(state.activeHorizon).toBe("long-game");
    expect(state.recall.kind).toBe("unlocked");

    state = reduceJourney(state, { type: "STEP_NEXT_UNVISITED" });
    expect(state.recall).toEqual({ kind: "recalling", revealed: [] });
  });

  test("ignores OPEN_RECALL while exploring and clears activeNote when switching horizon or opening recall", () => {
    let state = createInitialJourneyState();
    state = reduceJourney(state, {
      type: "SET_NOTE_OPEN",
      note: "bad-software",
      open: true,
    });
    expect(state.activeNote).toBe("bad-software");
    expect(state.openedNotes).toEqual(["bad-software"]);

    // Ignored while exploring.
    state = reduceJourney(state, { type: "OPEN_RECALL" });
    expect(state.recall.kind).toBe("exploring");

    // Closing a different note does not clear the open one.
    state = reduceJourney(state, {
      type: "SET_NOTE_OPEN",
      note: "real-leverage",
      open: false,
    });
    expect(state.activeNote).toBe("bad-software");

    // Switching horizon clears activeNote while preserving openedNotes history.
    state = reduceJourney(state, { type: "SELECT_HORIZON", horizon: "next" });
    expect(state.activeNote).toBeNull();
    expect(state.openedNotes).toEqual(["bad-software"]);

    state = reduceJourney(state, {
      type: "SELECT_HORIZON",
      horizon: "long-game",
    });
    state = reduceJourney(state, {
      type: "SET_NOTE_OPEN",
      note: "stagnation",
      open: true,
    });
    state = reduceJourney(state, { type: "OPEN_RECALL" });
    expect(state.activeNote).toBeNull();
    expect(state.recall).toEqual({ kind: "recalling", revealed: [] });
  });

  test("recall cards transition recalling -> remembered -> recalling -> completed -> replay", () => {
    let state = createInitialJourneyState();
    state = reduceJourney(state, { type: "STEP_NEXT_UNVISITED" });
    state = reduceJourney(state, { type: "STEP_NEXT_UNVISITED" });
    state = reduceJourney(state, { type: "OPEN_RECALL" });

    state = reduceJourney(state, {
      type: "TOGGLE_RECALL_CARD",
      horizon: "now",
    });
    state = reduceJourney(state, {
      type: "TOGGLE_RECALL_CARD",
      horizon: "next",
    });
    expect(state.recall).toEqual({
      kind: "recalling",
      revealed: ["now", "next"],
    });

    // Closing mid-recall returns to unlocked.
    const closedEarly = reduceJourney(state, { type: "CLOSE_RECALL" });
    expect(closedEarly.recall).toEqual({ kind: "unlocked" });

    // Flipping the third card reaches remembered.
    state = reduceJourney(state, {
      type: "TOGGLE_RECALL_CARD",
      horizon: "long-game",
    });
    expect(state.recall).toEqual({
      kind: "remembered",
      revealed: ["now", "next", "long-game"],
    });
    expect(selectJourneyView(state).isRemembered).toBe(true);

    // Unflipping one returns to recalling.
    state = reduceJourney(state, {
      type: "TOGGLE_RECALL_CARD",
      horizon: "next",
    });
    expect(state.recall).toEqual({
      kind: "recalling",
      revealed: ["now", "long-game"],
    });

    // Reset clears revealed cards inside open recall.
    state = reduceJourney(state, { type: "RESET_RECALL" });
    expect(state.recall).toEqual({ kind: "recalling", revealed: [] });

    // Re-reveal all three and close -> completed.
    for (const horizon of HORIZON_ORDER) {
      state = reduceJourney(state, { type: "TOGGLE_RECALL_CARD", horizon });
    }
    state = reduceJourney(state, { type: "CLOSE_RECALL" });
    expect(state.recall).toEqual({ kind: "completed" });
    expect(selectJourneyView(state).isCompleted).toBe(true);
    expect(selectJourneyView(state).canOpenRecall).toBe(true);

    // Reopening from completed resets revealed cards cleanly.
    state = reduceJourney(state, { type: "OPEN_RECALL" });
    expect(state.recall).toEqual({ kind: "recalling", revealed: [] });
  });

  test("NUDGE_PORTRAIT increments nudge count", () => {
    let state = createInitialJourneyState();
    state = reduceJourney(state, { type: "NUDGE_PORTRAIT" });
    state = reduceJourney(state, { type: "NUDGE_PORTRAIT" });
    expect(selectJourneyView(state).portraitNudges).toBe(2);
  });
});
