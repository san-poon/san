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
import { COLOR_SCHEME_OPTIONS, colorScheme } from "@/lib/preferences";
import {
  AXINDER_SPOTLIGHT,
  CONTROLS,
  HORIZONS,
  IDENTITY,
  LINKS,
  NOTES,
  RECALL,
  SITE_META,
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
  test("agent bridge can inspect controls, step chapters prev/next, open quick recap, and register WebMCP tools", async () => {
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
        "the craft of the experience",
        "lasting leverage",
        CONTROLS.previousChapterLabel,
        CONTROLS.nextChapterLabel,
        RECALL.triggerLabel,
        AXINDER_SPOTLIGHT.actionLabel,
        "axinder",
        "github",
        "x",
      ]) {
        expect(labels, `Missing control ${expected}`).toContain(expected);
      }

      const webMcpSnapshot = await tools.get("snapshot")?.execute({});
      expect(Array.isArray(webMcpSnapshot)).toBe(true);

      // Drive color theme and step forward via next button twice
      const stepForward = await agent.act({
        steps: [
          {
            ref: CONTROLS.themeGroupLabel,
            action: "setValue",
            args: ["dark"],
          },
          {
            ref: CONTROLS.nextChapterLabel,
            action: "press",
          },
        ],
      });
      expect(stepForward.ok, stepForward.error?.message).toBe(true);
      expect(colorScheme.get().value).toBe("dark");
      expect(
        screen.getByRole("heading", { name: HORIZONS.next.title }),
      ).toBeTruthy();

      const thirdChapter = await agent.act({
        steps: [
          {
            ref: CONTROLS.nextChapterLabel,
            action: "press",
          },
        ],
      });
      expect(thirdChapter.ok, thirdChapter.error?.message).toBe(true);
      expect(
        screen.getByRole("heading", { name: HORIZONS["long-game"].title }),
      ).toBeTruthy();

      // Step back via previous button
      const stepBack = await agent.act({
        steps: [
          {
            ref: CONTROLS.previousChapterLabel,
            action: "press",
          },
        ],
      });
      expect(stepBack.ok, stepBack.error?.message).toBe(true);
      expect(
        screen.getByRole("heading", { name: HORIZONS.next.title }),
      ).toBeTruthy();

      // Open quick recap directly without needing to visit every chapter first
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

    // Only axinder, github, and x links exist; no email, no /blog.
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

  test("copy contains zero em dashes and keeps non-heading strings lowercase", () => {
    const headingStrings = new Set<string>([
      IDENTITY.headline,
      ...Object.values(HORIZONS).map((entry) => entry.title),
      ...Object.values(NOTES).map((entry) => entry.title),
      RECALL.title,
    ]);

    const nonHeadingStrings: string[] = [
      SITE_META.title,
      SITE_META.description,
      IDENTITY.name,
      IDENTITY.shortName,
      IDENTITY.roleTag,
      IDENTITY.subheadline,
      ...IDENTITY.portraitQuips.flatMap((q) => [q.title, q.description]),
      AXINDER_SPOTLIGHT.name,
      AXINDER_SPOTLIGHT.tagline,
      AXINDER_SPOTLIGHT.actionLabel,
      ...Object.values(HORIZONS).flatMap((entry) => [
        entry.tabLabel,
        entry.lead,
        ...entry.paragraphs.flatMap((p) =>
          p.map((seg) => (seg.type === "text" ? seg.value : seg.label)),
        ),
      ]),
      ...Object.values(NOTES).flatMap((note) => [note.tag, note.body]),
      RECALL.triggerLabel,
      RECALL.description,
      ...RECALL.cards.flatMap((card) => [card.badge, card.prompt, card.answer]),
      RECALL.rememberedNote,
      RECALL.completedEcho,
      RECALL.resetLabel,
      RECALL.closeLabel,
      ...LINKS.flatMap((link) => [link.label, link.hint]),
      ...Object.values(CONTROLS),
      ...COLOR_SCHEME_OPTIONS.map((opt) => opt.label),
    ];

    for (const heading of headingStrings) {
      expect(heading.includes("\u2014")).toBe(false);
    }

    for (const text of nonHeadingStrings) {
      expect(text.includes("\u2014"), `Found em dash in: ${text}`).toBe(false);
      expect(text, `Expected lowercase: ${text}`).toBe(text.toLowerCase());
    }
  });
});
