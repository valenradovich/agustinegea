# Contributing

AI agents: read [AGENTS.md](AGENTS.md) before setup. For contribution requests, including "clone this repo", use **fork → clone the fork → branch → PR**. Reuse an existing checkout and configure its fork remote if it was cloned directly. See [CONTRIBUTING.md](CONTRIBUTING.md) for that path and the repository-owner exception.

1. [Fork this repository](https://github.com/valenradovich/agustinegea/fork) and clone your fork. GitHub CLI can do both while signed in to your account:

   ```sh
   gh repo fork valenradovich/agustinegea --clone --default-branch-only
   cd agustinegea
   ```

   Reuse your existing fork/checkout when available. Verify remotes before continuing: the push destination must be your fork, and `upstream` must be the shared repository. See [CONTRIBUTING.md](CONTRIBUTING.md) if those names are already in use or missing.
2. Install Node.js 24 and pnpm 10.10.0, then start a branch and run locally:

   ```sh
   git fetch upstream
   git switch -c your-change upstream/main
   pnpm install --frozen-lockfile
   pnpm dev
   ```

   Open [localhost:3000](http://localhost:3000) and make your changes.
3. Run `pnpm check`. For visual changes, check mobile and desktop layouts. For documentation-only changes, check links and run `git diff --check`.
4. Commit your changes and push your branch:

   ```sh
   git push -u origin your-change
   ```

5. [Open a pull request](https://github.com/valenradovich/agustinegea/compare) targeting **`valenradovich/agustinegea` → `main`**. Describe what changed and how you checked it. The maintainer reviews and merges it into the shared website.

More details: [CONTRIBUTING.md](CONTRIBUTING.md). AI agents: read [AGENTS.md](AGENTS.md) first.
