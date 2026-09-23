# Optional pre-push Rickroll

Run `pnpm prank:enable` yourself to opt in to **automatically opening a Rickroll before pushes by `aguegea`** in this local clone. This installs a `pre-push` hook; normal installation, commits, builds, and cloning do not enable it. AI agents must not enable it on someone's behalf as part of contributor setup.

When the active GitHub CLI account on github.com is **aguegea**, an interactive `git push` opens the video in the default browser automatically. There is no terminal message or per-push question. It triggers on pushes, not commits. Whether the video plays immediately depends on the browser’s playback settings. There is no forced autoplay, fullscreen, volume change, or screamer.

- Requires Node.js, Git, and a signed-in [GitHub CLI](https://cli.github.com/). The account comes from `gh api --hostname github.com user --jq .login`, not the Git author name. It can differ from the account used by your SSH key or Git credential helper.
- Intended for terminal pushes on macOS/Linux or Git Bash on Windows. GUI/background pushes without an interactive terminal and CI skip it.
- Other usernames, missing tools, API timeouts, and browser failures skip the prank. The hook never rejects a push. Identity lookup and browser launch each have a three-second timeout.
- It never reads Git's stream of refs on stdin. It leaves existing pre-push hooks and custom `core.hooksPath` configurations untouched, refusing installation if either conflicts.
- The hook applies to the local Git repository (including linked worktrees). On a branch without this script, it does nothing.

Disable it with `pnpm prank:disable`. Neither command changes global Git configuration. The disable command removes only a recognized hook installed by this feature. If you enabled the earlier prompting version, its hook stays inactive until you explicitly run `pnpm prank:enable` again to accept automatic opening.

Run `pnpm test:prank` to check the username targeting and skip behavior and installation in a temporary repository. Tests do not open a browser or contact GitHub.
