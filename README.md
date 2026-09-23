# Contributing

1. [Fork this repository](https://github.com/valenradovich/agustinegea/fork) and clone your fork.
2. Install Node.js 24 and pnpm 10.10.0, then start a branch and run locally:

   ```sh
   git switch -c your-change
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
