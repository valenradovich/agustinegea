# Contributing

Contribute improvements to the shared Agustin Egea website by opening a PR against **`valenradovich/agustinegea` → `main`**. A fork is your workspace for the contribution; you do not need to create or host another website. For a large change, open an issue first so we can agree on the direction.

If you use an AI coding agent, have it read [AGENTS.md](AGENTS.md) first. It covers project constraints, validation, branches, forks, and the pull request workflow.

1. Create or reuse a fork of [valenradovich/agustinegea](https://github.com/valenradovich/agustinegea/fork) under your GitHub account, then clone your fork. This is the default even with write access. Agents receiving a contribution request to "clone" the shared URL should follow this fork-first workflow. The repository owner uses a branch in the shared repository; an explicit user request for a direct checkout or a read-only clone takes precedence.
2. Fetch the shared repository's latest `main` and create a topic branch from it. Preserve any existing local work before switching branches. Reuse an existing contribution branch when continuing its PR.
3. Install Node.js 24 and pnpm 10.10.0, then run `pnpm install --frozen-lockfile` before editing, including when dependencies are already present.
4. Make your changes. Keep profile copy in `lib/portfolio.ts`, layout in `components/`, and styles in `app/globals.css`.
5. Run `pnpm check`. For visual changes, also check the page on a narrow and a wide screen, both color schemes, and with keyboard navigation. Include screenshots in the PR when useful.
6. Commit your changes, push the topic branch to your fork, and open a pull request with base repository **`valenradovich/agustinegea`**, base branch **`main`**, and your fork/branch as the head. Describe the problem, your change, and how you checked it.

For a freshly cloned fork, these commands create a contribution branch. Replace `your-change` with a descriptive branch name. If an `upstream` remote already exists, verify its URL instead of adding it again:

```sh
git remote -v
git remote add upstream https://github.com/valenradovich/agustinegea.git
git fetch upstream
git switch -c your-change upstream/main
pnpm install --frozen-lockfile
# Make your changes, then:
pnpm check
git add <files-you-changed>
git commit -m "Describe your change"
git push -u origin your-change
```

Replace `<files-you-changed>` with the actual paths. Open the PR on GitHub, or use GitHub CLI after writing its description to a file outside the repository:

```sh
gh pr create --repo valenradovich/agustinegea --base main --head YOUR_GITHUB_USERNAME:your-change --title "Describe your change" --body-file /path/to/pr-body.md
```

Replace the username, branch, title, and body-file path. Follow the [PR template](.github/pull_request_template.md). The maintainer reviews and merges accepted changes; Vercel then deploys the shared site. Do not push directly to `main` or merge your own contribution.

## Already cloned the shared repository?

Keep your checkout and any local changes. Inspect `git status`, `git remote -v`, and `gh api user --jq .login` first. When `origin` is the shared repository and no `upstream` remote exists, run this from that checkout:

```sh
gh repo fork --clone=false --remote
git remote -v
```

GitHub CLI creates or reuses your fork, makes it `origin`, and renames the previous `origin` to `upstream`. Verify both URLs before proceeding. If your existing remote layout differs, avoid automatic renaming: inspect it, then use `gh repo fork --clone=false --remote --remote-name fork` only when `fork` is unused or already points to your fork. Add a missing `upstream` pointing to the shared repository without replacing any existing remote; if that name is occupied by another repository, use a different unused name for the shared repository and substitute it in the fetch/branch commands.

Use the actual fork remote when pushing (`git push -u fork your-change` if you named it `fork`). The PR target remains `valenradovich/agustinegea:main`. Do not create another checkout or discard work just to change the push destination. The repository owner skips fork creation and uses a topic branch; explicit user instructions take precedence. Read-only cloning does not require a fork or a PR.

Use pnpm and include lockfile changes when updating dependencies. Run the local checks and confirm the Vercel preview builds before merging. This small portfolio has no dedicated automated interaction test suite; lint, type checking, production builds, and manual browser checks are the current validation baseline.

For documentation-only changes, check links and `git diff --check`; a production rebuild is not required. If a fork's Vercel preview requires maintainer authorization, include your local check results and leave the PR open. No paid account, separate deployment, or Vercel team membership is required to contribute.

Do not commit credentials, local environment files, private contact information, or content you don't have permission to share. Report vulnerabilities privately as described in [SECURITY.md](SECURITY.md).

Be respectful and constructive with other contributors. Contributions are provided under the repository's [MIT license](LICENSE).
