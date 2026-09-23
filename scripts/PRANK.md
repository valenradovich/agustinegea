# The aguegea image prank

After a one-time local setup, both `git commit` and `git push` open
[`public/aguegea-detected.svg`](../public/aguegea-detected.svg) in the default
viewer when the active GitHub CLI account on **github.com** is **aguegea**.
Other accounts do nothing. The image is a replaceable placeholder.

```sh
# Requires Node.js 24, Git and GitHub CLI signed in with gh auth login.
pnpm prank:enable
# To remove both hooks:
pnpm prank:disable
```

Git does not activate hooks from a clone or pull. Each contributor must run
`pnpm prank:enable` once in their clone; dependency installation and builds do
not install hooks. The hooks are local to the repository, including linked
worktrees. They do nothing on branches where `scripts/prank-hook.mjs` is absent.
Existing hooks (including the separate Rickroll hook) and custom `core.hooksPath`
configurations are left untouched: enable/disable refuses to change them.

The lookup uses `gh api --hostname github.com user --jq .login`, not `git user.name`
or the author of the commit. Git does not provide a verified GitHub username to
hooks. The CLI account can differ from the account used by an SSH key or credential
helper; this is a joke, not access control. Missing GitHub CLI, logged-out/offline
accounts, CI, a missing image, or a failed viewer all skip the prank. Identity lookup
and image launch each have a three-second timeout, and neither can reject a commit
or push. Git's pre-push stdin is never consumed. A commit followed by a push triggers
the image twice. A later Git failure does not undo the image opening.

macOS uses `open`, Linux uses `xdg-open`, and Windows uses `rundll32` (Git for Windows
runs the shell hook). A desktop viewer and Node/gh on Git's PATH are required;
GUI Git clients with a different PATH may skip it. The image opens in whatever app
is associated with its file type. To skip temporarily:

```sh
AGUSTINEGEA_SKIP_PRANK=1 git push
```

Replace the SVG to change the joke. For a PNG/JPEG, save it in `public/` and change
the `imagePath` filename near the top of `scripts/prank-hook.mjs`. There are no
external image requests, new dependencies, or changes to the portfolio page.

Run `pnpm test:prank` to verify targeting, skips, failures, and hook installation
using temporary repositories and mocked viewers. Tests do not contact GitHub or
open an image.
