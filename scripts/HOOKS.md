# Repository Git hooks

Both `pnpm install` (including `--frozen-lockfile`) and `pnpm dev` install the
hooks automatically, without a separate enable command. Dependency installation
uses the package's `prepare` script; `pnpm dev` runs the same installer before
starting Next.js, even when dependencies are already installed. Afterward,
both `git commit` and `git push` open
[`public/logo.gif`](../public/logo.gif) when the active GitHub CLI account on
**github.com** is **aguegea**. Other accounts do nothing. The asset is replaceable.

```sh
# Remove both hooks and keep them disabled across future installs:
pnpm hooks:disable
# Re-enable after explicitly disabling:
pnpm hooks:enable
```

Git does not activate hooks from a clone or pull alone: run dependency setup
with lifecycle scripts enabled (not `--ignore-scripts`), or start `pnpm dev`.
Setup installs quietly without opening the image or querying GitHub. It skips CI,
Vercel, non-Git directories, and `AGUSTINEGEA_SKIP_HOOKS=1`. Installation errors
never fail dependency setup or prevent the dev server from starting. Builds do
not install hooks. Arguments such as `pnpm dev --port 3001` still reach Next.js.

The hooks are local to the repository, including linked
worktrees. They do nothing on branches where `scripts/git-hooks.mjs` is absent.
Existing hooks and custom `core.hooksPath`
configurations are left untouched: automatic setup skips them, and manual
enable/disable refuses to change them. Disabling saves `agustinegea.hooksDisabled`
in local Git config so later installs and dev sessions respect that choice; enabling clears the
disabled state. No global Git configuration is changed.

The lookup uses `gh api --hostname github.com user --jq .login`, not `git user.name`
or the author of the commit. Git does not provide a verified GitHub username to
hooks. The CLI account can differ from the account used by an SSH key or credential
helper; this is a local display feature, not access control. Missing GitHub CLI, logged-out/offline
accounts, CI, a missing image, or a failed viewer all skip opening the image. Identity lookup
and image launch each have a three-second timeout, and neither can reject a commit
or push. Git's pre-push stdin is never consumed. A commit followed by a push triggers
the image twice. A later Git failure does not undo the image opening.

macOS opens GIFs in Safari for animation, Linux uses `xdg-open`, and Windows uses `rundll32` (Git for Windows
runs the shell hook). A desktop viewer and Node/gh on Git's PATH are required;
GUI Git clients with a different PATH may skip it. Outside the macOS GIF case,
the image opens in the app associated with its file type. To skip temporarily:

```sh
AGUSTINEGEA_SKIP_HOOKS=1 git push
```

Replace the GIF to change the image. For a PNG/JPEG, save it in `public/` and change
the `imagePath` filename near the top of `scripts/git-hooks.mjs`. There are no
external image requests, new dependencies, or changes to the portfolio page.

Run `pnpm test:hooks` to verify targeting, skips, failures, and hook installation
using temporary repositories and mocked viewers. Tests do not contact GitHub or
open an image.
