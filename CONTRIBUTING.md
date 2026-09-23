# Contributing

Small fixes, better documentation, and portfolio improvements are welcome. For a large change, open an issue first so we can agree on the direction.

1. Fork the repository and clone your fork.
2. Install Node.js 24 and pnpm 10.10.0, then run `pnpm install --frozen-lockfile`.
3. Create a branch: `git switch -c your-change`.
4. Make your changes. Keep profile copy in `lib/portfolio.ts`, layout in `components/`, and styles in `app/globals.css`.
5. Run `pnpm check`. For visual changes, also check the page on a narrow and a wide screen, both color schemes, and with keyboard navigation. Include screenshots in the PR when useful.
6. Commit your changes, push to your fork, and open a pull request against `main`. Describe the problem, your change, and how you checked it.

Use pnpm and include lockfile changes when updating dependencies. CI must pass before merging. This small portfolio has no dedicated automated interaction test suite; lint, type checking, production builds, and manual browser checks are the current validation baseline.

Do not commit credentials, local environment files, private contact information, or content you don't have permission to share. Report vulnerabilities privately as described in [SECURITY.md](SECURITY.md).

Be respectful and constructive with other contributors. Contributions are provided under the repository's [MIT license](LICENSE).
