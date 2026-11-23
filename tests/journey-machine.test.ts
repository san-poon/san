import { describe, expect, test } from "vitest";
import {
  createInitialJourneyState,
  HORIZON_ORDER,
  reduceJourney,
  selectJourneyView,
} from "@/lib/journey-machine";

describe("journey-machine", () => {
  test("starts at chapter 1 (now) in idle state with previous disabled and next enabled", () => {
    const initial = createInitialJourneyState();
    const view = selectJourneyView(initial);

    expect(view.activeHorizon).toBe("now");
    expect(view.activeIndex).toBe(0);
    expect(view.stepNumber).toBe(1);
    expect(view.totalHorizons).toBe(HORIZON_ORDER.length);
    expect(view.canGoPrevious).toBe(false);
    expect(view.canGoNext).toBe(true);
    expect(view.isLastHorizon).toBe(false);
    expect(view.recallKind).toBe("idle");
    expect(view.isRecallOpen).toBe(false);
  });

  test("NEXT_HORIZON and PREVIOUS_HORIZON step between chapters and clamp cleanly at bounds", () => {
    let state = createInitialJourneyState();

    // Clamped at start
    state = reduceJourney(state, { type: "PREVIOUS_HORIZON" });
    expect(state.activeHorizon).toBe("now");

    state = reduceJourney(state, { type: "NEXT_HORIZON" });
    expect(state.activeHorizon).toBe("next");
    expect(selectJourneyView(state).stepNumber).toBe(2);
    expect(selectJourneyView(state).canGoPrevious).toBe(true);
    expect(selectJourneyView(state).canGoNext).toBe(true);

    state = reduceJourney(state, { type: "NEXT_HORIZON" });
    expect(state.activeHorizon).toBe("long-game");
    expect(selectJourneyView(state).stepNumber).toBe(3);
    expect(selectJourneyView(state).canGoNext).toBe(false);
    expect(selectJourneyView(state).isLastHorizon).toBe(true);

    // Clamped at end
    state = reduceJourney(state, { type: "NEXT_HORIZON" });
    expect(state.activeHorizon).toBe("long-game");

    state = reduceJourney(state, { type: "PREVIOUS_HORIZON" });
    expect(state.activeHorizon).toBe("next");
  });

  test("switching chapter or opening recall clears activeNote while preserving openedNotes history", () => {
    let state = createInitialJourneyState();
    state = reduceJourney(state, {
      type: "SET_NOTE_OPEN",
      note: "bad-software",
      open: true,
    });
    expect(state.activeNote).toBe("bad-software");
    expect(state.openedNotes).toEqual(["bad-software"]);

    // Closing a different note does not clear the open one.
    state = reduceJourney(state, {
      type: "SET_NOTE_OPEN",
      note: "real-leverage",
      open: false,
    });
    expect(state.activeNote).toBe("bad-software");

    // NEXT_HORIZON clears activeNote while keeping openedNotes.
    state = reduceJourney(state, { type: "NEXT_HORIZON" });
    expect(state.activeNote).toBeNull();
    expect(state.openedNotes).toEqual(["bad-software"]);

    state = reduceJourney(state, { type: "PREVIOUS_HORIZON" });
    state = reduceJourney(state, {
      type: "SET_NOTE_OPEN",
      note: "bad-software",
      open: true,
    });
    state = reduceJourney(state, { type: "OPEN_RECALL" });
    expect(state.activeNote).toBeNull();
    expect(state.recall).toEqual({
      kind: "recalling",
      returnTo: "idle",
      revealed: [],
    });
  });

  test("recall works immediately from idle and preserves completed status on early close during replay", () => {
    let state = createInitialJourneyState();
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
      returnTo: "idle",
      revealed: ["now", "next"],
    });

    // Closing mid-recall returns to idle.
    const closedEarly = reduceJourney(state, { type: "CLOSE_RECALL" });
    expect(closedEarly.recall).toEqual({ kind: "idle" });

    // Flipping the third card reaches remembered.
    state = reduceJourney(state, {
      type: "TOGGLE_RECALL_CARD",
      horizon: "long-game",
    });
    expect(state.recall).toEqual({
      kind: "remembered",
      returnTo: "idle",
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
      returnTo: "idle",
      revealed: ["now", "long-game"],
    });

    // Reset clears revealed cards inside open recall.
    state = reduceJourney(state, { type: "RESET_RECALL" });
    expect(state.recall).toEqual({
      kind: "recalling",
      returnTo: "idle",
      revealed: [],
    });

    // Re-reveal all three and close -> completed.
    for (const horizon of HORIZON_ORDER) {
      state = reduceJourney(state, { type: "TOGGLE_RECALL_CARD", horizon });
    }
    state = reduceJourney(state, { type: "CLOSE_RECALL" });
    expect(state.recall).toEqual({ kind: "completed" });
    expect(selectJourneyView(state).isCompleted).toBe(true);

    // Reopening from completed and closing early keeps completed state.
    state = reduceJourney(state, { type: "OPEN_RECALL" });
    expect(state.recall).toEqual({
      kind: "recalling",
      returnTo: "completed",
      revealed: [],
    });
    state = reduceJourney(state, { type: "CLOSE_RECALL" });
    expect(state.recall).toEqual({ kind: "completed" });
  });

  test("NUDGE_PORTRAIT increments nudge count", () => {
    let state = createInitialJourneyState();
    state = reduceJourney(state, { type: "NUDGE_PORTRAIT" });
    state = reduceJourney(state, { type: "NUDGE_PORTRAIT" });
    expect(selectJourneyView(state).portraitNudges).toBe(2);
  });
});
