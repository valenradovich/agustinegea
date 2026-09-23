# Contributing

Contribute improvements to the shared Agustin Egea website by opening a PR against **`valenradovich/agustinegea` → `main`**. A fork is your workspace for the contribution; you do not need to create or host another website. For a large change, open an issue first so we can agree on the direction.

If you use an AI coding agent, have it read [AGENTS.md](AGENTS.md) first. It covers project constraints, validation, branches, forks, and the pull request workflow.

1. Fork [valenradovich/agustinegea](https://github.com/valenradovich/agustinegea/fork) and clone your fork. Contributors with write access may use a branch in the shared repository instead.
2. Install Node.js 24 and pnpm 10.10.0, then run `pnpm install --frozen-lockfile`.
3. Fetch the shared repository's latest `main` and create a topic branch from it. Preserve any existing local work before switching branches.
4. Make your changes. Keep profile copy in `lib/portfolio.ts`, layout in `components/`, and styles in `app/globals.css`.
5. Run `pnpm check`. For visual changes, also check the page on a narrow and a wide screen, both color schemes, and with keyboard navigation. Include screenshots in the PR when useful.
6. Commit your changes, push the topic branch to your fork, and open a pull request with base repository **`valenradovich/agustinegea`**, base branch **`main`**, and your fork/branch as the head. Describe the problem, your change, and how you checked it.

For a freshly cloned fork, these commands create a contribution branch. Replace `your-change` with a descriptive branch name. If an `upstream` remote already exists, verify its URL instead of adding it again:

```sh
git remote -v
git remote add upstream https://github.com/valenradovich/agustinegea.git
git fetch upstream
git switch -c your-change upstream/main
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

Use pnpm and include lockfile changes when updating dependencies. Run the local checks and confirm the Vercel preview builds before merging. This small portfolio has no dedicated automated interaction test suite; lint, type checking, production builds, and manual browser checks are the current validation baseline.

For documentation-only changes, check links and `git diff --check`; a production rebuild is not required. If a fork's Vercel preview requires maintainer authorization, include your local check results and leave the PR open. No paid account, separate deployment, or Vercel team membership is required to contribute.

Do not commit credentials, local environment files, private contact information, or content you don't have permission to share. Report vulnerabilities privately as described in [SECURITY.md](SECURITY.md).

Be respectful and constructive with other contributors. Contributions are provided under the repository's [MIT license](LICENSE).

For an optional local joke before pushing, see [the pre-push Rickroll](scripts/PRANK.md). It is never enabled automatically and is not required to contribute.
