import { execFileSync, spawnSync } from 'node:child_process'
import { chmodSync, existsSync, lstatSync, mkdirSync, readFileSync, realpathSync, unlinkSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

// logo.gif: "Screamer2.gif", uploaded by Artistosteles, CC BY-SA 4.0.
// https://commons.wikimedia.org/wiki/File:Screamer2.gif
// https://creativecommons.org/licenses/by-sa/4.0/
// Based on "Bad day...nice Halloween" by Frédéric DUPONT (darkpatator), CC BY 2.0.
// https://www.flickr.com/photos/20149359@N00/408638625/
// https://creativecommons.org/licenses/by/2.0/
// Downloaded unchanged; renamed only. These media licenses are separate from the code's MIT license.
export const imagePath = fileURLToPath(new URL('../public/logo.gif', import.meta.url))
const hookNames = ['pre-commit', 'pre-push']
const hook = `#!/bin/sh
# agustinegea: repository Git hooks.
if [ -f scripts/git-hooks.mjs ] && command -v node >/dev/null 2>&1; then
  node scripts/git-hooks.mjs run </dev/null >/dev/null 2>&1 || :
fi
exit 0
`

export function imageOpener(platform, path) {
  // Preview shows GIF frames separately; Safari plays the animation.
  if (platform === 'darwin' && path.toLowerCase().endsWith('.gif')) return ['open', ['-a', 'Safari', path]]
  if (platform === 'darwin') return ['open', [path]]
  if (platform === 'win32') return ['rundll32', ['url.dll,FileProtocolHandler', pathToFileURL(path).href]]
  return ['xdg-open', [path]]
}

function openImage(path) {
  const [command, args] = imageOpener(process.platform, path)
  const result = spawnSync(command, args, { timeout: 3000, stdio: 'ignore' })
  if (result.error || result.status !== 0) throw new Error('Image viewer unavailable')
}

export async function runHook({
  ci = Boolean(process.env.CI),
  skip = process.env.AGUSTINEGEA_SKIP_HOOKS === '1',
  open = openImage,
  image = imagePath,
} = {}) {
  if (ci || skip || !existsSync(image)) return
  try {
    await open(image)
  } catch {
    // Missing tools and viewer failures must never block Git.
  }
}

function manageHooks(action, { quiet = false } = {}) {
  const configured = spawnSync('git', ['config', '--get', 'core.hooksPath'], { encoding: 'utf8' })
  if (configured.error || (configured.status !== 0 && configured.status !== 1)) {
    throw new Error('Unable to inspect Git hook configuration.')
  }
  if (configured.status === 0) {
    throw new Error('A custom core.hooksPath is configured. Leaving existing hooks untouched.')
  }

  // Inspect both hooks before changing either, so a conflict cannot partly install the hooks.
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
      else {
        writeFileSync(path, hook)
        chmodSync(path, 0o755)
      }
    }
  }
  if (!quiet) console.log(action === 'disable'
    ? 'Repository hooks disabled locally.'
    : 'Repository hooks enabled locally. Undo: pnpm hooks:disable')
}

function installHooks() {
  if (process.env.CI || process.env.VERCEL || process.env.AGUSTINEGEA_SKIP_HOOKS === '1') return
  try {
    // An extracted copy inside another repository must not install hooks in its parent.
    const root = execFileSync('git', ['rev-parse', '--show-toplevel'], {
      encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'],
    }).trim()
    if (realpathSync(root) !== realpathSync(process.cwd())) return
    const disabled = spawnSync('git', ['config', '--local', '--bool', '--get', 'agustinegea.hooksDisabled'], {
      encoding: 'utf8',
    })
    if (disabled.error || ![0, 1].includes(disabled.status) || disabled.stdout.trim() === 'true') return
    manageHooks('enable', { quiet: true })
  } catch {
    // Setup must also work without Git, outside a clone, or with existing hooks.
  }
}

export async function main(action) {
  if (action === 'install') {
    installHooks()
  } else if (action === 'run') {
    await runHook()
  } else if (action === 'enable' || action === 'disable') {
    try {
      manageHooks(action)
      execFileSync('git', ['config', '--local', 'agustinegea.hooksDisabled', String(action === 'disable')], {
        stdio: 'ignore',
      })
    } catch (error) {
      console.error(error.message)
      process.exitCode = 1
    }
  } else {
    console.error('Usage: node scripts/git-hooks.mjs install|enable|disable|run')
    process.exitCode = 1
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  await main(process.argv[2])
}
