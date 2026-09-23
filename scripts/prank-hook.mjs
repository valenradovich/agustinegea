import { execFileSync, spawnSync } from 'node:child_process'
import { chmodSync, existsSync, lstatSync, mkdirSync, readFileSync, unlinkSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

// Replace this file (or change its filename here) to use another repo image.
export const imagePath = fileURLToPath(new URL('../public/aguegea-detected.svg', import.meta.url))
const hookNames = ['pre-commit', 'pre-push']
const hook = `#!/bin/sh
# agustinegea: locally enabled image prank for aguegea.
if [ -f scripts/prank-hook.mjs ] && command -v node >/dev/null 2>&1; then
  node scripts/prank-hook.mjs run </dev/null >/dev/null 2>&1 || :
fi
exit 0
`

function githubLogin() {
  return execFileSync('gh', ['api', '--hostname', 'github.com', 'user', '--jq', '.login'], {
    encoding: 'utf8',
    timeout: 3000,
    stdio: ['ignore', 'pipe', 'ignore'],
    env: { ...process.env, GH_PROMPT_DISABLED: '1' },
  }).trim()
}

export function imageOpener(platform, path) {
  if (platform === 'darwin') return ['open', [path]]
  if (platform === 'win32') return ['rundll32', ['url.dll,FileProtocolHandler', pathToFileURL(path).href]]
  return ['xdg-open', [path]]
}

function openImage(path) {
  const [command, args] = imageOpener(process.platform, path)
  const result = spawnSync(command, args, { timeout: 3000, stdio: 'ignore' })
  if (result.error || result.status !== 0) throw new Error('Image viewer unavailable')
}

export async function runPrank({
  ci = Boolean(process.env.CI),
  skip = process.env.AGUSTINEGEA_SKIP_PRANK === '1',
  getLogin = githubLogin,
  open = openImage,
  image = imagePath,
} = {}) {
  if (ci || skip || !existsSync(image)) return
  try {
    if ((await getLogin()).trim().toLowerCase() !== 'aguegea') return
    await open(image)
  } catch {
    // Missing tools, offline identity lookups and viewer failures must never block Git.
  }
}

function manageHooks(action) {
  const configured = spawnSync('git', ['config', '--get', 'core.hooksPath'], { encoding: 'utf8' })
  if (configured.error || (configured.status !== 0 && configured.status !== 1)) {
    throw new Error('Unable to inspect Git hook configuration.')
  }
  if (configured.status === 0) {
    throw new Error('A custom core.hooksPath is configured. Leaving existing hooks untouched.')
  }

  // Inspect both hooks before changing either, so a conflict cannot partly enable the prank.
  const paths = hookNames.map((name) => {
    const path = resolve(execFileSync('git', ['rev-parse', '--git-path', `hooks/${name}`], {
      encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'],
    }).trim())
    let exists = false
    try {
      const stat = lstatSync(path)
      exists = true
      if (!stat.isFile() || readFileSync(path, 'utf8') !== hook) {
        throw new Error(`A different ${name} hook exists. Leaving existing hooks untouched.`)
      }
    } catch (error) {
      if (error.code !== 'ENOENT') throw error
    }
    return { path, exists }
  })

  for (const { path, exists } of paths) {
    if (action === 'disable') {
      if (exists) unlinkSync(path)
    } else {
      mkdirSync(dirname(path), { recursive: true })
      if (!exists) writeFileSync(path, hook, { flag: 'wx', mode: 0o755 })
      else chmodSync(path, 0o755)
    }
  }
  console.log(action === 'disable'
    ? 'Image prank disabled locally.'
    : 'Enabled locally: commits and pushes by aguegea open the repo image. Undo: pnpm prank:disable')
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const action = process.argv[2]
  if (action === 'run') {
    await runPrank()
  } else if (action === 'enable' || action === 'disable') {
    try {
      manageHooks(action)
    } catch (error) {
      console.error(error.message)
      process.exitCode = 1
    }
  } else {
    console.error('Usage: node scripts/prank-hook.mjs enable|disable|run')
    process.exitCode = 1
  }
}
