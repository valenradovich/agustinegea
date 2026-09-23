# Instructions for AI contributors

These instructions apply to the entire repository. Read this file, [README.md](README.md), and [CONTRIBUTING.md](CONTRIBUTING.md) before making changes. The goal is a small, easy-to-customize portfolio that friends can run and host without paid services.

## Keep the project simple and free

- Use the existing Next.js, React, TypeScript, and Tailwind stack. Prefer existing components and dependencies over adding new ones.
- The default app must work without a database, API keys, login, paid tools, or access to the original v0 project.
- Keep Vercel as the build, preview, and deployment service. Do not add a separate GitHub Actions workflow or another CI/hosting provider unless explicitly requested by the maintainer.
- Target the free Vercel Hobby plan for personal, non-commercial use within its limits. Do not enable paid plans, trials that convert to paid subscriptions, paid add-ons, or metered services. If a requested feature needs spending, explain the cost and propose a free alternative before proceeding.
- Keep analytics disabled by default. Do not enable tracking or introduce external services as part of an unrelated change.
- Preserve the MIT license and third-party notices. Never commit secrets, local environment files, private contact information, or content the contributor does not have permission to share.

## Set up and inspect

1. Inspect `git status`, the current branch, and `git remote -v`. Preserve unrelated work; do not reset, overwrite, or stash someone else's changes without permission.
2. Determine the intended target repository and base branch from the user's request and remotes. A template copy is an independent project; do not send its changes to the original repository by default. For contributions to the original project, target `valenradovich/agustinegea`, branch `main`.
3. Use Node.js 24 (`.nvmrc`) and pnpm 10.10.0 (`package.json`). Install dependencies with `pnpm install --frozen-lockfile`. Use pnpm exclusively and do not introduce npm or Yarn lockfiles.
4. No `.env` file is required. `.env.example` documents optional public configuration. Never copy credentials from another project or machine.
5. Run `pnpm dev` for local development. If port 3000 is occupied, choose an unused port with `pnpm dev --port <port>`; do not stop unrelated processes.

## Make focused changes

| Area | Location |
| --- | --- |
| Profile copy, contact details, metadata text, experience, statistics | `lib/portfolio.ts` |
| Portfolio layout | `components/parody-portfolio.tsx` |
| Shared UI components | `components/ui/` |
| Colors, themes, and global styles | `app/globals.css` |
| Fonts, document language, metadata wiring, optional analytics | `app/layout.tsx` |
| Static images and icons | `public/` |
| Portable Vercel install/build commands | `vercel.json` |

- Keep changes limited to the requested feature or fix. Do not redesign the demo, rewrite unrelated files, or upgrade unrelated packages.
- Keep profile content in the shared content file so visible copy and metadata stay consistent. Preserve the fictional-parody context of the included demo.
- Preserve responsive layouts, semantic HTML, keyboard navigation, and readable light/dark themes. Use a client component only when browser state or interactivity requires it.
- Keep TypeScript strict and fix errors instead of bypassing checks. Do not restore `ignoreBuildErrors` or suppress lint rules broadly to make a build pass.
- For intentional dependency changes, update `package.json` and `pnpm-lock.yaml` together with pnpm. Explain why each new dependency is needed. Do not edit the lockfile manually.
- Preserve the standard `pnpm build` command in Vercel configuration; do not depend on private v0 scripts or local absolute paths.
- Update documentation when setup, commands, configuration, or user-visible behavior changes.

## Validate before opening a PR

- For application, dependency, or build/tooling changes, run `pnpm check` (lint, type checking, and production build).
- For dependency changes, also run `pnpm audit`. Investigate findings; do not hide them with blanket ignores or disable checks.
- For visual changes, check mobile and desktop widths, light/dark themes, navigation/contact links, and keyboard access in a browser. Include screenshots when they help review the change.
- For documentation-only changes, check accuracy, relative links, and `git diff --check`; a production rebuild is not required.
- There is no dedicated automated interaction test suite. Do not claim one passed. Add tests when they protect meaningful new behavior, not merely to mirror simple content edits.
- Installation and production builds need internet access, including Google font downloads during the build. If a check cannot run, record the exact command and blocker in the PR instead of calling it successful.
- Review `git diff` and `git diff --check` before committing. Exclude generated output, logs, local configuration, and unrelated changes. Stop only development processes started for your work.

## Branch, commit, and open the PR

1. Work on a descriptive topic branch, never directly on `main`. Continue an existing branch when updating its PR. Otherwise start from the latest target `main` when the working tree is clean. Use `codex/<short-description>` by default, or follow the contributor's requested branch name.
2. If you lack write access, use the contributor's fork and push the branch there. With write access, a topic branch in the target repository is fine. Confirm the push destination from the remotes before pushing. Never force-push or rewrite shared history unless explicitly instructed.
3. Commit only the intended files with a clear message describing the change. Do not stage unrelated work with an indiscriminate `git add .`.
4. Open a PR against the intended target's `main`, or update the existing PR for that branch. Follow [.github/pull_request_template.md](.github/pull_request_template.md). Use a concise title and explain the problem, resulting behavior, validation results, and any limitations. Mark checklist items truthfully; mark irrelevant checks as not applicable.
5. If using GitHub CLI, write a multiline PR body to a file and pass `--body-file`. For a fork, use `--repo <target-owner>/<target-repo> --base main --head <contributor>:<branch>`; for a branch in the target repository, use `--head <branch>`. Resolve these placeholders from the actual repositories; do not paste them literally.
6. Check the PR status and the Vercel preview when available. Diagnose and fix failures caused by your changes. A fork's preview may require a maintainer's authorization or Vercel connection; report that blocker and provide local check results instead of enabling a paid service or changing access controls.
7. Return the PR link, a short summary, and verification results to the contributor. Leave the PR open for maintainer review. Do not approve or merge it, push to `main`, deploy to production, change billing, or change repository/hosting permissions unless the user explicitly requests that action. Merging can automatically publish the live site.

If GitHub authentication or push access is unavailable, keep the local changes and report what is needed to open the PR. Never claim a PR was opened or a deployment succeeded without verifying it.
