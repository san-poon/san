import type { HorizonId, NoteId } from "./journey-machine";

export type CopySegment =
  | { readonly type: "text"; readonly value: string }
  | { readonly type: "note"; readonly id: NoteId; readonly label: string };

export interface HorizonEntry {
  readonly id: HorizonId;
  readonly indexLabel: string;
  readonly tabLabel: string;
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
    "San Poon builds Axinder: learning tools for real intuition, fast proof of work, and keeping humans thinking.",
  url: "https://sanpoon.com",
} as const;

export const IDENTITY = {
  name: "San Poon",
  shortName: "San",
  roleTag: "Building Axinder",
  avatarSrc: "/san-poon-global-profile.jpg",
  headline: "AI has the answers. Understanding is still our job.",
  subheadline:
    "I build fast, personal learning tools for real intuition and provable skill — so AI makes us sharper, not softer.",
  portraitQuips: [
    {
      title: "This page is short on purpose",
      description:
        "Tap the underlined bits. Each one hides an unfiltered note.",
    },
    {
      title: "No degrees harmed on this page",
      description: "Paper is cheap. Proof is the whole point.",
    },
    {
      title: "Reading late?",
      description: "Light, Auto, and Dark live in the top corner.",
    },
    {
      title: "Still poking me?",
      description: "Good. The universe isn't going to understand itself.",
    },
  ],
} as const;

export const HORIZONS: Readonly<Record<HorizonId, HorizonEntry>> = {
  now: {
    id: "now",
    indexLabel: "01",
    tabLabel: "Now",
    title: "Learn it for real.",
    lead: "I cared about learning tools before the AI wave — mostly out of spite for how bad they were.",
    paragraphs: [
      [
        {
          type: "text",
          value: "Long before AI, ",
        },
        {
          type: "note",
          id: "bad-software",
          label: "ugly, slow, paywalled apps",
        },
        {
          type: "text",
          value:
            " made me angry. Now AI teaches core material better than most courses ever did — leaving craft as the real bottleneck.",
        },
      ],
      [
        {
          type: "text",
          value:
            "Axinder is my answer: fast, personal lessons that build real intuition for work that matters — including ",
        },
        {
          type: "note",
          id: "real-leverage",
          label: "building real leverage",
        },
        {
          type: "text",
          value: ".",
        },
      ],
    ],
    spotlight: {
      name: "Axinder",
      tagline: "Personal learning that builds intuition, not busywork.",
      actionLabel: "Try a lesson",
      href: "https://www.axinder.com",
    },
  },
  next: {
    id: "next",
    indexLabel: "02",
    tabLabel: "Next",
    title: "Prove it, 2–10× faster.",
    lead: "Mocking degrees is easy. Building what replaces them is the work.",
    paragraphs: [
      [
        {
          type: "text",
          value: "I don't hate school — I hate broken proof. Too many ",
        },
        {
          type: "note",
          id: "credentials",
          label: "centuries-old certificates",
        },
        {
          type: "text",
          value: " reward copying and cramming over understanding.",
        },
      ],
      [
        {
          type: "text",
          value:
            "Next, Axinder takes a motivated learner from first lesson to genuinely job-ready — no gaming the test, no four-year detour.",
        },
      ],
    ],
  },
  "long-game": {
    id: "long-game",
    indexLabel: "03",
    tabLabel: "Long game",
    title: "Keep thinking.",
    lead: "If you can read and you care enough, you should be able to learn anything.",
    paragraphs: [
      [
        {
          type: "text",
          value: "I don't buy sci-fi AI doom. What scares me is ",
        },
        {
          type: "note",
          id: "stagnation",
          label: "meat without minds",
        },
        {
          type: "text",
          value:
            " — coasting while machines do the thinking until we stop pushing into the unknown.",
        },
      ],
      [
        {
          type: "text",
          value:
            "A human paired with AI is exponentially more capable. Curiosity, pride, or a paycheck — whatever the spark, anyone should be able to go deep and keep pushing what we understand about the universe.",
        },
      ],
    ],
  },
};

export const NOTES: Readonly<Record<NoteId, NoteEntry>> = {
  "bad-software": {
    tag: "Origin",
    title: "It started with bad apps",
    body: "Cluttered screens, paywalled PDFs, clunky drills. Bad design kills curiosity faster than hard math ever did.",
  },
  "real-leverage": {
    tag: "Candid",
    title: "Yes, money counts",
    body: "Wealth in Naval's sense: rare understanding that compounds into leverage and freedom — not hustle-bro noise.",
  },
  credentials: {
    tag: "The bar",
    title: "Replace before you retire",
    body: "You don't earn the right to retire degrees until you ship proof nobody can cheat.",
  },
  stagnation: {
    tag: "Real fear",
    title: "Anti-stagnation, not anti-AI",
    body: "AI is the strongest lever humans have built. Using it as an excuse to stop understanding the universe would be the real loss.",
  },
};

export const RECALL = {
  triggerLabel: "See what stuck",
  replayLabel: "Replay recall",
  title: "Did the arc stick?",
  description: "Three cards, one per beat. Guess first, then flip.",
  cards: [
    {
      horizon: "now",
      badge: "01 · Now",
      prompt: "What's broken in learning?",
      answer:
        "The craft. AI handles the material; the tools still feel awful. Axinder makes learning fast, personal, and real.",
    },
    {
      horizon: "next",
      badge: "02 · Next",
      prompt: "What beats a degree?",
      answer:
        "Proof you can actually do the work — first lesson to job-ready, 2–10× faster, no cheating.",
    },
    {
      horizon: "long-game",
      badge: "03 · Long game",
      prompt: "What's the real AI risk?",
      answer:
        "Not robots. Stagnation. Anyone who can read should be able to learn anything and keep pushing.",
    },
  ] satisfies ReadonlyArray<RecallCard>,
  rememberedNote:
    "That's the arc: learn it for real, prove it fast, keep thinking.",
  completedEcho: "Learn it for real · Prove it fast · Keep thinking",
  resetLabel: "Flip them back",
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
  continuePrefix: "Continue to",
  noteCloseLabel: "Got it",
  progressSuffix: "read",
  notesExploredSingular: "margin note",
  notesExploredPlural: "margin notes",
} as const;
