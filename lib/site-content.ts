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
  title: "San Poon",
  description:
    "Building learning tools for deep intuition, credible proof of mastery, and human curiosity — starting with Axinder.",
  url: "https://sanpoon.com",
} as const;

export const IDENTITY = {
  name: "San Poon",
  shortName: "San",
  roleTag: "Building Axinder",
  avatarSrc: "/san-poon-global-profile.jpg",
  headline: "AI can answer almost anything. Understanding is still ours.",
  subheadline:
    "I build quiet, personal learning tools for real intuition and credible skill — so smarter machines make people sharper, not passive.",
  portraitQuips: [
    {
      title: "Look closely",
      description: "The underlined phrases open small notes behind the idea.",
    },
    {
      title: "Built for real understanding",
      description: "Less noise, better craft, deeper intuition.",
    },
    {
      title: "Easy on the eyes",
      description: "Switch between Light, Auto, and Dark in the top corner.",
    },
    {
      title: "Still exploring",
      description: "Good tools should reward curiosity.",
    },
  ],
} as const;

export const HORIZONS: Readonly<Record<HorizonId, HorizonEntry>> = {
  now: {
    id: "now",
    indexLabel: "01",
    tabLabel: "Now",
    stepLabel: "Build intuition",
    title: "Build real intuition.",
    lead: "Even before modern AI, I wanted learning software that felt calm, personal, and genuinely good to use.",
    paragraphs: [
      [
        {
          type: "text",
          value:
            "Today, AI already knows most core curricula better than any single textbook. That shifts the bottleneck to ",
        },
        {
          type: "note",
          id: "bad-software",
          label: "the craft of the experience",
        },
        {
          type: "text",
          value:
            " — how clearly an idea clicks, how well it adapts to you, and whether it actually stays.",
        },
      ],
      [
        {
          type: "text",
          value:
            "With Axinder, I'm building a faster, more personal way to learn skills that matter in real work — turning genuine understanding into ",
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
      name: "Axinder",
      tagline:
        "A personal AI tutor shaped around how understanding actually sticks.",
      actionLabel: "Explore the tutor",
      href: "https://www.axinder.com",
    },
  },
  next: {
    id: "next",
    indexLabel: "02",
    tabLabel: "Next",
    stepLabel: "Prove the work",
    title: "Prove the work, faster.",
    lead: "Traditions endure until something unmistakably better earns trust.",
    paragraphs: [
      [
        {
          type: "text",
          value: "Formal degrees served the world for centuries, yet ",
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
            "Next, I want Axinder to carry a motivated learner from their first question to work-ready mastery — offering clear, honest proof of what they can do, in a fraction of the usual time.",
        },
      ],
    ],
  },
  "long-game": {
    id: "long-game",
    indexLabel: "03",
    tabLabel: "Long game",
    stepLabel: "Keep exploring",
    title: "Keep exploring.",
    lead: "Basic literacy and genuine drive should be enough to grasp almost anything.",
    paragraphs: [
      [
        {
          type: "text",
          value:
            "I'm not a pessimist about AI. What I want to guard against is ",
        },
        {
          type: "note",
          id: "stagnation",
          label: "quiet stagnation",
        },
        {
          type: "text",
          value:
            " — outsourcing so much of our thinking that we stop building intuition about the world.",
        },
      ],
      [
        {
          type: "text",
          value:
            "A person paired with AI can reach remarkably far. Whether someone is driven by a career, independence, or wonder, I want tools that help humanity keep pushing its understanding of reality.",
        },
      ],
    ],
  },
};

export const NOTES: Readonly<Record<NoteId, NoteEntry>> = {
  "bad-software": {
    tag: "Origin",
    title: "Craft before hype",
    body: "Cluttered interfaces and rigid drills quietly drain curiosity. Good learning software should feel as considered as the best tools people use to create.",
  },
  "real-leverage": {
    tag: "Grounded",
    title: "Skills that change a life",
    body: "Real understanding compounds into meaningful work, financial independence, and freedom of choice — the quiet kind of wealth built on capability.",
  },
  credentials: {
    tag: "Standard",
    title: "Earn the alternative",
    body: "Critiquing old credentials is easy. The only fair way forward is building a system that genuinely proves real understanding without shortcuts.",
  },
  stagnation: {
    tag: "Horizon",
    title: "Sharper, not passive",
    body: "AI is the strongest lever for thought we've ever had. Its highest use isn't thinking instead of us — it's helping more people understand deeper than before.",
  },
};

export const RECALL = {
  triggerLabel: "See what stuck",
  replayLabel: "Revisit the arc",
  title: "Three ideas, in brief",
  description: "Tap each card to reveal the thread behind what I'm building.",
  cards: [
    {
      horizon: "now",
      badge: "01 · Now",
      prompt: "Where the bottleneck moved",
      answer:
        "AI handles the curriculum; craft and personal intuition are what make learning actually stick.",
    },
    {
      horizon: "next",
      badge: "02 · Next",
      prompt: "What earns real trust",
      answer:
        "Honest proof of capability — taking drive from first question to real work, far faster.",
    },
    {
      horizon: "long-game",
      badge: "03 · Long game",
      prompt: "Why we still learn",
      answer:
        "So smarter tools make humans more curious and capable, never passive spectators.",
    },
  ] satisfies ReadonlyArray<RecallCard>,
  rememberedNote: "Build intuition, prove the work, keep exploring.",
  completedEcho: "Build intuition · Prove the work · Keep exploring",
  resetLabel: "Reset cards",
  closeLabel: "Done",
} as const;

export const LINKS: ReadonlyArray<SocialLink> = [
  {
    id: "axinder",
    label: "Axinder",
    href: "https://www.axinder.com",
    hint: "axinder.com",
  },
  {
    id: "github",
    label: "GitHub",
    href: "https://github.com/san-poon",
    hint: "san-poon",
  },
  {
    id: "x",
    label: "X",
    href: "https://x.com/san__poon",
    hint: "@san__poon",
  },
];

export const CONTROLS = {
  portraitButtonLabel: "Nudge San's portrait",
  themeGroupLabel: "Color theme",
  horizonGroupLabel: "Horizon",
  nextPrefix: "Next:",
  noteCloseLabel: "Got it",
  toastDismissLabel: "Dismiss notification",
  progressSuffix: "read",
  notesExploredSingular: "margin note",
  notesExploredPlural: "margin notes",
} as const;
