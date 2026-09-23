# agustinegea

Contribute :)

## Contribute to the website

1. [Fork this repository](https://github.com/valenradovich/agustinegea/fork) into your GitHub account and clone your fork. Your fork is a workspace for proposing changes to the shared site.
2. Create a branch, make your changes, and run the checks below.
3. Push the branch to your fork and [open a pull request](https://github.com/valenradovich/agustinegea/compare) with **base repository `valenradovich/agustinegea`**, **base branch `main`**, and your fork/branch as the head.
4. The maintainer reviews and merges accepted changes; Vercel then updates the shared website.

You do not need your own deployment, domain, Vercel account, or access to the original v0 project. Contributors with write access can use a branch in this repository and still open a PR. See [CONTRIBUTING.md](CONTRIBUTING.md) for commands. AI agents should read [AGENTS.md](AGENTS.md) first.

## Run locally

Install [Node.js 24](https://nodejs.org/) and the pinned package manager. Replace `YOUR_GITHUB_USERNAME` with the account that owns your fork:

```sh
npm install --global pnpm@10.10.0
git clone https://github.com/YOUR_GITHUB_USERNAME/agustinegea.git
cd agustinegea
pnpm install --frozen-lockfile
pnpm dev
```

If you use nvm, run `nvm install && nvm use` inside the repository before installing pnpm. Open [localhost:3000](http://localhost:3000). If that port is busy, use `pnpm dev --port 3001`.

## Where to make changes

| File | What to change |
| --- | --- |
| [`lib/portfolio.ts`](lib/portfolio.ts) | Name, initials, email, page title/description, all main copy, experience, and statistics |
| [`app/globals.css`](app/globals.css) | Colors, typography tokens, and light/dark themes |
| [`app/layout.tsx`](app/layout.tsx) | Fonts, language, and global page settings |
| [`components/parody-portfolio.tsx`](components/parody-portfolio.tsx) | Page layout and section structure |
| [`public/`](public/) | Icons and other static assets |

The current email is a placeholder (`agustin@example.com`). Changes to the site identity or public contact details should be intentional and explained in the PR. Keep the fictional-parody disclaimer accurate. The facts and experience on the site are jokes, not real credentials.

## Checks and production

```sh
pnpm lint       # ESLint, including Next.js and TypeScript rules
pnpm typecheck  # Generate route types and check TypeScript
pnpm build      # Production build; TypeScript errors fail the build
pnpm start      # Serve the production build locally
```

Run `pnpm check` to run lint, typecheck, and build together. Vercel builds pull-request previews and deploys changes to `main`; there is no separate GitHub Actions workflow. Run `pnpm audit` locally when updating dependencies. Commit `pnpm-lock.yaml` whenever dependencies change; use pnpm consistently.

Fonts are downloaded from Google by `next/font` at build time, then served by the app. Installation and builds need internet access.

## Shared deployment

The maintainer manages the existing Vercel deployment on the [free Hobby plan](https://vercel.com/docs/plans/hobby), subject to its personal/non-commercial use and usage limits. Contributors do not need to deploy anything or purchase services. Custom domain renewal is separate from hosting.

Vercel creates PR previews when authorized. A preview from a fork may need maintainer authorization; local development and checks still work without it. Only the maintainer merges PRs into `main`, which triggers the shared site's production deployment.

`vercel.json` keeps the install and build commands in the repository and overrides the old project-level v0 injection command. No private v0 build script is required.

### Optional analytics

Analytics is off by default. Only enable Vercel Web Analytics if the maintainer explicitly requests it; it requires enabling it in the shared Vercel project and setting `NEXT_PUBLIC_ENABLE_ANALYTICS=true` before building. Locally, you can copy `.env.example` to `.env.local`; this is optional. Development builds never load analytics.

Never put secrets in `NEXT_PUBLIC_*` variables or `lib/portfolio.ts`: those values are public. Local environment files are ignored by Git.

## Contribute

See [CONTRIBUTING.md](CONTRIBUTING.md) for the fork-and-PR workflow and [SECURITY.md](SECURITY.md) for private vulnerability reports. Feature ideas and reproducible bug reports are welcome in [Issues](https://github.com/valenradovich/agustinegea/issues).

Using an AI coding agent? Start with [AGENTS.md](AGENTS.md) for repository instructions and the complete PR workflow.

## License and credits

[MIT](LICENSE). Keep the license notice when sharing copies. `private: true` in `package.json` only prevents accidental npm publication; it does not restrict use under the license.

Originally bootstrapped with [v0](https://v0.app). Built on [Next.js](https://nextjs.org), [React](https://react.dev), [Tailwind CSS](https://tailwindcss.com), [shadcn/ui](https://ui.shadcn.com), [Base UI](https://base-ui.com), and [Lucide](https://lucide.dev). Third-party packages, fonts, and trademarks retain their own licenses and rights.
