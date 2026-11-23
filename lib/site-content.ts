import type { HorizonId, NoteId } from "./journey-machine";

export type CopySegment =
  | { readonly type: "text"; readonly value: string }
  | { readonly type: "note"; readonly id: NoteId; readonly label: string };

export interface HorizonEntry {
  readonly id: HorizonId;
  readonly indexLabel: string;
  readonly tabLabel: string;
  readonly stepLabel: string;
  readonly title: string;
  readonly lead: string;
  readonly paragraphs: ReadonlyArray<ReadonlyArray<CopySegment>>;
  readonly spotlight?: {
    readonly name: string;
    readonly tagline: string;
    readonly actionLabel: string;
    readonly href: string;
  };
}

export interface NoteEntry {
  readonly tag: string;
  readonly title: string;
  readonly body: string;
}

export interface RecallCard {
  readonly horizon: HorizonId;
  readonly badge: string;
  readonly prompt: string;
  readonly answer: string;
}

export interface SocialLink {
  readonly id: "axinder" | "github" | "x";
  readonly label: string;
  readonly href: string;
  readonly hint: string;
}

export const SITE_META = {
  title: "san poon",
  description:
    "building learning tools for deep intuition, credible proof of mastery, and human curiosity, starting with axinder.",
  url: "https://sanpoon.com",
} as const;

export const IDENTITY = {
  name: "san poon",
  shortName: "san",
  roleTag: "building axinder",
  avatarSrc: "/san-poon-global-profile.jpg",
  headline: "AI can answer almost anything. Understanding is still ours.",
  subheadline:
    "i build quiet, personal learning tools for real intuition and credible skill, so smarter machines make people sharper, not passive.",
  portraitQuips: [
    {
      title: "look closely",
      description: "the underlined phrases open small notes behind the idea.",
    },
    {
      title: "built for real understanding",
      description: "less noise, better craft, deeper intuition.",
    },
    {
      title: "easy on the eyes",
      description: "switch between light, auto, and dark in the top corner.",
    },
    {
      title: "still exploring",
      description: "good tools should reward curiosity.",
    },
  ],
} as const;

export const HORIZONS: Readonly<Record<HorizonId, HorizonEntry>> = {
  now: {
    id: "now",
    indexLabel: "01",
    tabLabel: "now",
    stepLabel: "build intuition",
    title: "Build real intuition.",
    lead: "even before modern ai, i wanted learning software that felt calm, personal, and genuinely good to use.",
    paragraphs: [
      [
        {
          type: "text",
          value:
            "today, ai already knows most core curricula better than any single textbook. that shifts the bottleneck to ",
        },
        {
          type: "note",
          id: "bad-software",
          label: "the craft of the experience",
        },
        {
          type: "text",
          value:
            ": how clearly an idea clicks, how well it adapts to you, and whether it actually stays.",
        },
      ],
      [
        {
          type: "text",
          value:
            "with axinder, i'm building a faster, more personal way to learn skills that matter in real work, turning genuine understanding into ",
        },
        {
          type: "note",
          id: "real-leverage",
          label: "lasting leverage",
        },
        {
          type: "text",
          value: ".",
        },
      ],
    ],
    spotlight: {
      name: "axinder",
      tagline:
        "a personal ai tutor shaped around how understanding actually sticks.",
      actionLabel: "explore the tutor",
      href: "https://www.axinder.com",
    },
  },
  next: {
    id: "next",
    indexLabel: "02",
    tabLabel: "next",
    stepLabel: "prove the work",
    title: "Prove the work, faster.",
    lead: "traditions endure until something unmistakably better earns trust.",
    paragraphs: [
      [
        {
          type: "text",
          value: "formal degrees served the world for centuries, yet ",
        },
        {
          type: "note",
          id: "credentials",
          label: "paper signals",
        },
        {
          type: "text",
          value:
            " still struggle to separate surface memorization from real capability.",
        },
      ],
      [
        {
          type: "text",
          value:
            "next, i want axinder to carry a motivated learner from their first question to work-ready mastery, offering clear, honest proof of what they can do in a fraction of the usual time.",
        },
      ],
    ],
  },
  "long-game": {
    id: "long-game",
    indexLabel: "03",
    tabLabel: "long game",
    stepLabel: "keep exploring",
    title: "Keep exploring.",
    lead: "basic literacy and genuine drive should be enough to grasp almost anything.",
    paragraphs: [
      [
        {
          type: "text",
          value:
            "i'm not a pessimist about ai. what i want to guard against is ",
        },
        {
          type: "note",
          id: "stagnation",
          label: "quiet stagnation",
        },
        {
          type: "text",
          value:
            ": outsourcing so much of our thinking that we stop building intuition about the world.",
        },
      ],
      [
        {
          type: "text",
          value:
            "a person paired with ai can reach remarkably far. whether someone is driven by a career, independence, or wonder, i want tools that help humanity keep pushing its understanding of reality.",
        },
      ],
    ],
  },
};

export const NOTES: Readonly<Record<NoteId, NoteEntry>> = {
  "bad-software": {
    tag: "origin",
    title: "Craft before hype",
    body: "cluttered interfaces and rigid drills quietly drain curiosity. good learning software should feel as considered as the best tools people use to create.",
  },
  "real-leverage": {
    tag: "grounded",
    title: "Skills that change a life",
    body: "real understanding compounds into meaningful work, financial independence, and freedom of choice. it's a quiet kind of wealth built on capability.",
  },
  credentials: {
    tag: "standard",
    title: "Earn the alternative",
    body: "critiquing old credentials is easy. the only fair way forward is building a system that genuinely proves real understanding without shortcuts.",
  },
  stagnation: {
    tag: "horizon",
    title: "Sharper, not passive",
    body: "ai is the strongest lever for thought we've ever had. its highest use isn't thinking instead of us, but helping more people understand deeper than before.",
  },
};

export const RECALL = {
  triggerLabel: "see what stuck",
  replayLabel: "revisit the arc",
  title: "Three ideas, in brief",
  description: "tap each card to reveal the thread behind what i'm building.",
  cards: [
    {
      horizon: "now",
      badge: "01 · now",
      prompt: "where the bottleneck moved",
      answer:
        "ai handles the curriculum; craft and personal intuition are what make learning actually stick.",
    },
    {
      horizon: "next",
      badge: "02 · next",
      prompt: "what earns real trust",
      answer:
        "honest proof of capability, taking drive from first question to real work much faster.",
    },
    {
      horizon: "long-game",
      badge: "03 · long game",
      prompt: "why we still learn",
      answer:
        "so smarter tools make humans more curious and capable, never passive spectators.",
    },
  ] satisfies ReadonlyArray<RecallCard>,
  rememberedNote: "build intuition, prove the work, keep exploring.",
  completedEcho: "build intuition · prove the work · keep exploring",
  resetLabel: "reset cards",
  closeLabel: "done",
} as const;

export const LINKS: ReadonlyArray<SocialLink> = [
  {
    id: "axinder",
    label: "axinder",
    href: "https://www.axinder.com",
    hint: "axinder.com",
  },
  {
    id: "github",
    label: "github",
    href: "https://github.com/san-poon",
    hint: "san-poon",
  },
  {
    id: "x",
    label: "x",
    href: "https://x.com/san__poon",
    hint: "@san__poon",
  },
];

export const CONTROLS = {
  portraitButtonLabel: "nudge san's portrait",
  themeGroupLabel: "color theme",
  horizonGroupLabel: "horizon",
  nextPrefix: "next:",
  noteCloseLabel: "got it",
  toastDismissLabel: "dismiss notification",
  progressSuffix: "read",
  notesExploredSingular: "margin note",
  notesExploredPlural: "margin notes",
} as const;
