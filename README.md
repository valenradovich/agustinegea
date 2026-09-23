# agustinegea

A fictional parody portfolio built with Next.js, React, TypeScript, and Tailwind CSS. Fork it, change the copy, and share your own version with friends. The included demo contains adult-themed jokes.

No database, API keys, login, or paid services are required. The site is a single page with editable profile details, experience, statistics, and contact links.

## Run locally

Install [Node.js 24](https://nodejs.org/) and the pinned package manager:

```sh
npm install --global pnpm@10.10.0
git clone https://github.com/valenradovich/agustinegea.git
cd agustinegea
pnpm install --frozen-lockfile
pnpm dev
```

If you use nvm, run `nvm install && nvm use` inside the repository before installing pnpm. Open [localhost:3000](http://localhost:3000). If that port is busy, use `pnpm dev --port 3001`.

For an independent copy, click **Use this template → Create a new repository** on GitHub, then clone your new repository's URL instead. Choose **Fork** if you want to contribute changes back. You don't need access to the original v0 project or deployment.

## Make it yours

| File | What to change |
| --- | --- |
| [`lib/portfolio.ts`](lib/portfolio.ts) | Name, initials, email, page title/description, all main copy, experience, and statistics |
| [`app/globals.css`](app/globals.css) | Colors, typography tokens, and light/dark themes |
| [`app/layout.tsx`](app/layout.tsx) | Fonts, language, and global page settings |
| [`components/parody-portfolio.tsx`](components/parody-portfolio.tsx) | Page layout and section structure |
| [`public/`](public/) | Icons and other static assets |

The default email is a placeholder (`agustin@example.com`); replace it with an address you want to publish. Keep the fictional-parody disclaimer accurate for your version. The sample facts and experience are jokes, not real credentials.

## Checks and production

```sh
pnpm lint       # ESLint, including Next.js and TypeScript rules
pnpm typecheck  # Generate route types and check TypeScript
pnpm build      # Production build; TypeScript errors fail the build
pnpm start      # Serve the production build locally
```

Run `pnpm check` to run lint, typecheck, and build together. GitHub Actions runs the same checks and a dependency audit on pull requests and pushes to `main`. Commit `pnpm-lock.yaml` whenever dependencies change; use pnpm consistently.

Fonts are downloaded from Google by `next/font` at build time, then served by the app. Installation and builds need internet access.

## Deploy your fork

- **Vercel:** import your fork, select Next.js and Node.js 24, use `pnpm install --frozen-lockfile` to install and `pnpm build` to build, then deploy. Your fork uses its own deployment and domain.
- **A Node.js host:** install dependencies, run `pnpm build`, then run `pnpm start` as a persistent process. The default port is 3000; use `pnpm start --port 8080` to change it. Put your host's HTTPS proxy in front of the server.

This repo uses the Next.js server build; it is not configured for GitHub Pages. The original repository may be connected to v0/Vercel automatic deployments, so merging to its `main` branch can publish changes.

### Optional analytics

Analytics is off by default. To enable Vercel Web Analytics, enable it in your own Vercel project and set `NEXT_PUBLIC_ENABLE_ANALYTICS=true` before building. Locally, you can copy `.env.example` to `.env.local`; this is optional. Development builds never load analytics.

Never put secrets in `NEXT_PUBLIC_*` variables or `lib/portfolio.ts`: those values are public. Local environment files are ignored by Git.

## Contribute

See [CONTRIBUTING.md](CONTRIBUTING.md) for the fork-and-PR workflow and [SECURITY.md](SECURITY.md) for private vulnerability reports. Feature ideas and reproducible bug reports are welcome in [Issues](https://github.com/valenradovich/agustinegea/issues).

## License and credits

[MIT](LICENSE). Keep the license notice when sharing copies. `private: true` in `package.json` only prevents accidental npm publication; it does not restrict use under the license.

Originally bootstrapped with [v0](https://v0.app). Built on [Next.js](https://nextjs.org), [React](https://react.dev), [Tailwind CSS](https://tailwindcss.com), [shadcn/ui](https://ui.shadcn.com), [Base UI](https://base-ui.com), and [Lucide](https://lucide.dev). Third-party packages, fonts, and trademarks retain their own licenses and rights.
