# san

Personal site for San Poon (`sanpoon.com`), built with Next.js, React 19, Tailwind CSS v4, and `@ui-sdk/react` + `@ui-sdk/core`.

## ui-sdk

Before using or changing `ui-sdk` components, follow the `ui-sdk` skill if installed, and read `node_modules/@ui-sdk/react/docs/llms.txt`. To build a custom component, also search `node_modules/@ui-sdk/react/docs/core.md` by heading and read `rendering.md` next to it.

## Repo map

- `app/`: Next.js App Router single page (`/`), local Google Sans Flex fonts (`app/fonts/`), global tokens and `ui-sdk` layer styles (`app/globals.css`).
- `lib/journey-machine.ts`: Pure finite state machine governing the interactive horizon tour, margin notes, and recall dialog.
- `lib/site-content.ts`: Typed copy and external links (`Axinder`, `GitHub`, `X`).
- `lib/preferences.ts`: `ui-sdk` color-scheme preference (`light`, `system`, `dark`).
- `components/`: Client UI components built exclusively on `@ui-sdk/react` primitives and WebMCP agent registration.
- `tests/`: Vitest + Testing Library unit, agent-bridge, and WebMCP checks.

## Commands

- `pnpm typecheck`
- `pnpm test`
- `pnpm lint`
- `pnpm build`
