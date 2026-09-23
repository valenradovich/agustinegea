import { execFileSync, spawnSync } from 'node:child_process'
import { chmodSync, lstatSync, mkdirSync, readFileSync, unlinkSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

const video = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
const legacyHook = `#!/bin/sh
# agustinegea: optional Rickroll prompt; installed explicitly by its user.
# Git supplies refs on stdin. Read the prompt from the terminal instead.
if [ -t 2 ] && [ -r /dev/tty ] && [ -f scripts/prank-hook.mjs ]; then
  node scripts/prank-hook.mjs run </dev/tty || :
fi
exit 0
`

const hook = `#!/bin/sh
# agustinegea: automatically open a Rickroll for aguegea; explicitly enabled locally.
if [ -t 2 ] && [ -f scripts/prank-hook.mjs ] && command -v node >/dev/null 2>&1; then
  node scripts/prank-hook.mjs run-auto </dev/null || :
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

function openVideo(url) {
  const [command, args] = process.platform === 'darwin'
    ? ['open', [url]]
    : process.platform === 'win32'
      ? ['rundll32', ['url.dll,FileProtocolHandler', url]]
      : ['xdg-open', [url]]
  const result = spawnSync(command, args, { timeout: 3000, stdio: 'ignore' })
  if (result.error || result.status !== 0) {
    throw new Error('Browser unavailable')
  }
}

export async function runPrank({
  interactive = Boolean(process.stderr.isTTY),
  ci = Boolean(process.env.CI),
  getLogin = githubLogin,
  open = openVideo,
} = {}) {
  if (!interactive || ci) return
  try {
    if ((await getLogin()).toLowerCase() !== 'aguegea') return
    await open(video)
  } catch {
    // An optional joke must never reject a push, including on offline machines.
  }
}

function manageHook(action) {
  const configured = spawnSync('git', ['config', '--get', 'core.hooksPath'], { encoding: 'utf8' })
  if (configured.error || (configured.status !== 0 && configured.status !== 1)) {
    throw new Error('Unable to inspect Git hook configuration.')
  }
  if (configured.status === 0) {
    throw new Error('A custom core.hooksPath is configured. Leaving existing hooks untouched.')
  }
  const path = resolve(execFileSync('git', ['rev-parse', '--git-path', 'hooks/pre-push'], {
    encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'],
  }).trim())
  let exists = false
  try {
    const stat = lstatSync(path)
    exists = true
    if (!stat.isFile() || ![hook, legacyHook].includes(readFileSync(path, 'utf8'))) {
      throw new Error('A different pre-push hook exists. Leaving it untouched.')
    }
  } catch (error) {
    if (error.code !== 'ENOENT') throw error
  }
  if (action === 'disable') {
    if (exists) unlinkSync(path)
    console.log('Optional Rickroll hook disabled.')
    return
  }
  mkdirSync(dirname(path), { recursive: true })
  if (!exists) writeFileSync(path, hook, { flag: 'wx', mode: 0o755 })
  else {
    writeFileSync(path, hook)
    chmodSync(path, 0o755)
  }
  console.log('Enabled locally: pushes by aguegea will automatically open a Rickroll, without a prompt.')
  console.log('Undo with: pnpm prank:disable')
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const action = process.argv[2]
  if (action === 'run-auto') {
    await runPrank()
  } else if (action === 'enable' || action === 'disable') {
    try {
      manageHook(action)
    } catch (error) {
      console.error(error.message)
      process.exitCode = 1
    }
  } else if (action !== 'run') {
    // Old prompt-version hooks stay inactive until their owner runs enable again.
    console.error('Usage: node scripts/prank-hook.mjs enable|disable|run-auto')
    process.exitCode = 1
  }
}
