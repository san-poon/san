import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createAgent, registerTools } from "@ui-sdk/react/agent";
import { Preferences } from "@ui-sdk/react/preferences";
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastRegion,
  ToastTitle,
} from "@ui-sdk/react/toast";
import { describe, expect, test } from "vitest";
import { HomeExperience } from "@/components/home-experience";
import { CloseIcon } from "@/components/icons";
import { colorScheme } from "@/lib/preferences";
import {
  CONTROLS,
  HORIZONS,
  IDENTITY,
  LINKS,
  NOTES,
  RECALL,
} from "@/lib/site-content";

const agent = createAgent({ allow: () => true });

function TestShell({ children }: { children: React.ReactNode }) {
  return (
    <Preferences preferences={[colorScheme]}>
      {children}
      <ToastRegion
        align="center"
        data-agent-hidden
        maxVisible={1}
        side="bottom"
      >
        {() => (
          <Toast className="items-start justify-between gap-3">
            <div className="min-w-0 flex-1 space-y-0.5">
              <ToastTitle />
              <ToastDescription />
            </div>
            <ToastClose aria-label={CONTROLS.toastDismissLabel}>
              <CloseIcon className="size-3.5" />
            </ToastClose>
          </Toast>
        )}
      </ToastRegion>
    </Preferences>
  );
}

describe("HomeExperience", () => {
  test("agent bridge can inspect every control, step the journey, and register WebMCP tools", async () => {
    const tools = new Map<string, { execute: (input: object) => unknown }>();
    Object.assign(document, {
      modelContext: {
        registerTool: async (tool: {
          name: string;
          execute: (input: object) => unknown;
        }) => {
          tools.set(tool.name, tool);
        },
      },
    });
    const unregister = registerTools(agent, { allow: () => true });

    try {
      render(
        <TestShell>
          <HomeExperience />
        </TestShell>,
      );

      const snapshot = agent
        .snapshot()
        .filter((entry) => !entry.offPage && entry.component !== "more");

      for (const entry of snapshot) {
        expect(
          entry.label,
          `${entry.component} ${entry.ref} has no label`,
        ).toBeTruthy();
      }

      const labels = snapshot.map((entry) => entry.label);
      for (const expected of [
        CONTROLS.portraitButtonLabel,
        CONTROLS.themeGroupLabel,
        CONTROLS.horizonGroupLabel,
        "the craft of the experience",
        "lasting leverage",
        "Explore the tutor",
        `${CONTROLS.nextPrefix} ${HORIZONS.next.stepLabel}`,
        "Axinder",
        "GitHub",
        "X",
      ]) {
        expect(labels, `Missing control ${expected}`).toContain(expected);
      }

      const webMcpSnapshot = await tools.get("snapshot")?.execute({});
      expect(Array.isArray(webMcpSnapshot)).toBe(true);

      // Drive Color theme and Horizon via agent.act()
      const stepResult = await agent.act({
        steps: [
          {
            ref: CONTROLS.themeGroupLabel,
            action: "setValue",
            args: ["Dark"],
          },
          {
            ref: `${CONTROLS.nextPrefix} ${HORIZONS.next.stepLabel}`,
            action: "press",
          },
        ],
      });
      expect(stepResult.ok, stepResult.error?.message).toBe(true);
      expect(colorScheme.get().value).toBe("dark");
      expect(
        screen.getByRole("heading", { name: HORIZONS.next.title }),
      ).toBeTruthy();

      const thirdBeat = await agent.act({
        steps: [
          {
            ref: CONTROLS.horizonGroupLabel,
            action: "setValue",
            args: [HORIZONS["long-game"].tabLabel],
          },
        ],
      });
      expect(thirdBeat.ok, thirdBeat.error?.message).toBe(true);
      expect(
        screen.getByRole("heading", { name: HORIZONS["long-game"].title }),
      ).toBeTruthy();

      // Open recall modal and flip all three cards
      const openRecall = await agent.act({
        steps: [{ ref: RECALL.triggerLabel, action: "press" }],
      });
      expect(openRecall.ok, openRecall.error?.message).toBe(true);

      const flipAll = await agent.act({
        steps: [
          { ref: RECALL.cards[0].prompt, action: "press" },
          { ref: RECALL.cards[1].prompt, action: "press" },
          { ref: RECALL.cards[2].prompt, action: "press" },
        ],
      });
      expect(flipAll.ok, flipAll.error?.message).toBe(true);
      expect(screen.getByText(RECALL.rememberedNote)).toBeTruthy();

      const closeRecall = await agent.act({
        steps: [
          {
            ref: RECALL.title,
            action: "press",
            args: [RECALL.closeLabel],
          },
        ],
      });
      expect(closeRecall.ok, closeRecall.error?.message).toBe(true);
      expect(screen.getByText(RECALL.completedEcho)).toBeTruthy();
    } finally {
      unregister();
    }
  });

  test("user clicks portrait (single dismissable toast), opens margin notes, and checks minimal links", async () => {
    const user = userEvent.setup();
    render(
      <TestShell>
        <HomeExperience />
      </TestShell>,
    );

    // Only Axinder, GitHub, and X links exist — no email, no /blog.
    const anchors = screen.getAllByRole("link");
    const hrefs = anchors.map((anchor) => anchor.getAttribute("href"));
    expect(hrefs).toContain("https://www.axinder.com");
    expect(hrefs).toContain("https://github.com/san-poon");
    expect(hrefs).toContain("https://x.com/san__poon");
    expect(hrefs.some((href) => href?.startsWith("mailto:"))).toBe(false);
    expect(hrefs.some((href) => href?.includes("/blog"))).toBe(false);
    expect(LINKS).toHaveLength(3);

    // Portrait nudge triggers one toast at a time; tapping again replaces it cleanly
    const portraitBtn = screen.getByRole("button", {
      name: CONTROLS.portraitButtonLabel,
    });
    await user.click(portraitBtn);
    await waitFor(() => {
      expect(screen.getByText(IDENTITY.portraitQuips[0].title)).toBeTruthy();
    });

    await user.click(portraitBtn);
    await waitFor(() => {
      expect(screen.getByText(IDENTITY.portraitQuips[1].title)).toBeTruthy();
      expect(screen.queryByText(IDENTITY.portraitQuips[0].title)).toBeNull();
    });

    // Toast close button dismisses the toast explicitly
    await user.click(
      screen.getByRole("button", { name: CONTROLS.toastDismissLabel }),
    );
    await waitFor(() => {
      expect(screen.queryByText(IDENTITY.portraitQuips[1].title)).toBeNull();
    });

    // Inline note opens cleanly
    await user.click(
      screen.getByRole("button", { name: "the craft of the experience" }),
    );
    expect(screen.getByText(NOTES["bad-software"].title)).toBeTruthy();
  });
});
