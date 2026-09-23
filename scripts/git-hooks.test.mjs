import assert from 'node:assert/strict'
import { execFileSync, spawnSync } from 'node:child_process'
import { copyFileSync, existsSync, mkdirSync, mkdtempSync, readFileSync, realpathSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { test } from 'node:test'
import { imageOpener, imagePath, runHook } from './git-hooks.mjs'

const script = fileURLToPath(new URL('./git-hooks.mjs', import.meta.url))

test('only aguegea opens the local image; CI, bypass and missing images skip lookup', async () => {
  for (const scenario of [
    { login: 'aguegea', expected: true },
    { login: ' AgUeGeA\n', expected: true },
    { login: 'someone-else' },
    { login: 'aguegea-copy' },
    { login: '' },
    { login: 'aguegea', ci: true, noLookup: true },
    { login: 'aguegea', skip: true, noLookup: true },
    { login: 'aguegea', image: `${imagePath}.missing`, noLookup: true },
  ]) {
    let opened = false
    let lookedUp = false
    await runHook({
      ci: false, skip: false, ...scenario,
      getLogin: () => { lookedUp = true; return scenario.login },
      open: (path) => { assert.equal(path, imagePath); opened = true },
    })
    assert.equal(opened, Boolean(scenario.expected))
    assert.equal(lookedUp, !scenario.noLookup)
  }
})

test('identity and viewer failures never reject Git operations', async () => {
  for (const failing of ['getLogin', 'open']) {
    await assert.doesNotReject(runHook({
      ci: false, skip: false,
      getLogin: () => 'aguegea', open: () => {},
      [failing]: () => { throw new Error('Unavailable') },
    }))
  }
})

test('platform openers pass filenames as a single argument without a shell', () => {
  const path = join(tmpdir(), 'an image #1.svg')
  assert.deepEqual(imageOpener('darwin', path), ['open', [path]])
  const gif = join(tmpdir(), 'logo.gif')
  assert.deepEqual(imageOpener('darwin', gif), ['open', ['-a', 'Safari', gif]])
  assert.deepEqual(imageOpener('linux', path), ['xdg-open', [path]])
  assert.deepEqual(imageOpener('win32', path), ['rundll32', ['url.dll,FileProtocolHandler', pathToFileURL(path).href]])
})

function repository(t) {
  const cwd = realpathSync(mkdtempSync(join(tmpdir(), 'repository hooks ')))
  t.after(() => rmSync(cwd, { recursive: true, force: true }))
  const env = {
    ...process.env, CI: '', VERCEL: '', AGUSTINEGEA_SKIP_PRANK: '', AGUSTINEGEA_SKIP_HOOKS: '',
    GIT_CONFIG_GLOBAL: process.platform === 'win32' ? 'NUL' : '/dev/null',
    GIT_CONFIG_NOSYSTEM: '1',
  }
  const git = (...args) => execFileSync('git', args, { cwd, env, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] })
  git('-c', 'init.templateDir=', 'init', '--quiet')
  const run = (action) => spawnSync(process.execPath, [script, action], { cwd, env, encoding: 'utf8' })
  return { cwd, env, git, run }
}

test('enable/disable is repeatable and refuses conflicts before modifying either hook', (t) => {
  const { cwd, git, run } = repository(t)
  const commit = join(cwd, '.git/hooks/pre-commit')
  const push = join(cwd, '.git/hooks/pre-push')
  assert.equal(run('enable').status, 0)
  assert.equal(run('enable').status, 0)
  assert.equal(readFileSync(commit, 'utf8'), readFileSync(push, 'utf8'))
  assert.equal(run('disable').status, 0)
  assert.equal(existsSync(commit), false)
  assert.equal(existsSync(push), false)
  assert.equal(run('disable').status, 0)

  writeFileSync(push, '#!/bin/sh\nexit 42\n')
  assert.equal(run('enable').status, 1)
  assert.equal(run('disable').status, 1)
  assert.equal(existsSync(commit), false)
  assert.equal(readFileSync(push, 'utf8'), '#!/bin/sh\nexit 42\n')
  rmSync(push)
  git('config', '--local', 'core.hooksPath', 'custom-hooks')
  assert.equal(run('enable').status, 1)
  assert.equal(run('disable').status, 1)
  assert.equal(existsSync(commit), false)
  assert.equal(existsSync(push), false)
})

test('automatic installation is quiet, skips conflicts and preserves a disabled state', (t) => {
  const { cwd, env, git, run } = repository(t)
  const commit = join(cwd, '.git/hooks/pre-commit')
  const push = join(cwd, '.git/hooks/pre-push')
  for (const flag of ['CI', 'VERCEL', 'AGUSTINEGEA_SKIP_PRANK', 'AGUSTINEGEA_SKIP_HOOKS']) {
    env[flag] = '1'
    assert.equal(run('install').status, 0)
    assert.equal(existsSync(commit), false)
    assert.equal(existsSync(push), false)
    env[flag] = ''
  }
  mkdirSync(join(cwd, '.git/hooks'), { recursive: true })
  writeFileSync(push, '#!/bin/sh\nexit 42\n')
  assert.equal(run('install').status, 0)
  assert.equal(existsSync(commit), false)
  assert.equal(readFileSync(push, 'utf8'), '#!/bin/sh\nexit 42\n')
  rmSync(push)
  git('config', '--local', 'core.hooksPath', 'custom-hooks')
  assert.equal(run('install').status, 0)
  assert.equal(existsSync(commit), false)
  git('config', '--local', '--unset', 'core.hooksPath')
  for (let i = 0; i < 2; i++) {
    const result = run('install')
    assert.equal(result.status, 0)
    assert.equal(result.stdout + result.stderr, '')
    assert.equal(existsSync(commit), true)
    assert.equal(existsSync(push), true)
  }
  assert.equal(run('disable').status, 0)
  assert.equal(run('install').status, 0)
  assert.equal(existsSync(commit), false)
  assert.equal(existsSync(push), false)
  assert.equal(run('enable').status, 0)
  assert.equal(git('config', '--local', '--get', 'agustinegea.prankDisabled').trim(), 'false')
  assert.equal(existsSync(commit), true)
})

test('existing hooks upgrade to the neutral entry point and the old CLI still works', (t) => {
  const { cwd, env, run } = repository(t)
  const legacy = `#!/bin/sh
# agustinegea: locally enabled image prank for aguegea.
if [ -f scripts/prank-hook.mjs ] && command -v node >/dev/null 2>&1; then
  node scripts/prank-hook.mjs run </dev/null >/dev/null 2>&1 || :
fi
exit 0
`
  mkdirSync(join(cwd, '.git/hooks'), { recursive: true })
  for (const name of ['pre-commit', 'pre-push']) {
    writeFileSync(join(cwd, '.git/hooks', name), legacy, { mode: 0o755 })
  }
  const oldScript = fileURLToPath(new URL('./prank-hook.mjs', import.meta.url))
  const result = spawnSync(process.execPath, [oldScript, 'install'], { cwd, env, encoding: 'utf8' })
  assert.equal(result.status, 0)
  for (const name of ['pre-commit', 'pre-push']) {
    const installed = readFileSync(join(cwd, '.git/hooks', name), 'utf8')
    assert.match(installed, /scripts\/git-hooks.mjs run/)
    assert.doesNotMatch(installed, /prank/)
  }
  assert.equal(run('disable').status, 0)
  assert.equal(existsSync(join(cwd, '.git/hooks/pre-commit')), false)
  assert.equal(existsSync(join(cwd, '.git/hooks/pre-push')), false)
})

test('automatic setup skips non-repositories and copies nested inside another repo', (t) => {
  const { cwd, env } = repository(t)
  const nested = join(cwd, 'nested-copy')
  mkdirSync(nested)
  const run = () => spawnSync(process.execPath, [script, 'install'], { cwd: nested, env, encoding: 'utf8' })
  assert.equal(run().status, 0)
  assert.equal(existsSync(join(cwd, '.git/hooks/pre-commit')), false)
  rmSync(join(cwd, '.git'), { recursive: true, force: true })
  const result = run()
  assert.equal(result.status, 0)
  assert.equal(result.stdout + result.stderr, '')
})

test('normal pnpm installation runs prepare and installs both hooks', (t) => {
  const { cwd, env } = repository(t)
  mkdirSync(join(cwd, 'scripts'))
  copyFileSync(script, join(cwd, 'scripts/git-hooks.mjs'))
  const pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'))
  writeFileSync(join(cwd, 'package.json'), JSON.stringify({
    name: 'hook-install-test', private: true,
    packageManager: pkg.packageManager,
    scripts: { prepare: pkg.scripts.prepare },
  }))
  execFileSync('pnpm', ['install', '--offline', '--lockfile-only', '--ignore-scripts'], { cwd, env, stdio: 'pipe' })
  execFileSync('pnpm', ['install', '--offline', '--frozen-lockfile'], { cwd, env, stdio: 'pipe' })
  assert.equal(existsSync(join(cwd, '.git/hooks/pre-commit')), true)
  assert.equal(existsSync(join(cwd, '.git/hooks/pre-push')), true)
})

test('pnpm dev installs hooks without dependency setup and forwards Next.js arguments', {
  skip: process.platform === 'win32' ? 'POSIX executable mock' : false,
}, (t) => {
  const { cwd, env, git, run } = repository(t)
  mkdirSync(join(cwd, 'scripts'))
  copyFileSync(script, join(cwd, 'scripts/git-hooks.mjs'))
  const pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'))
  writeFileSync(join(cwd, 'package.json'), JSON.stringify({
    name: 'hook-dev-test', private: true,
    packageManager: pkg.packageManager,
    scripts: { dev: pkg.scripts.dev },
  }))
  const bin = join(cwd, 'node_modules/.bin')
  mkdirSync(bin, { recursive: true })
  writeFileSync(join(bin, 'next'), `#!/usr/bin/env node
const fs = require('node:fs')
fs.writeFileSync('dev-result.json', JSON.stringify({
  args: process.argv.slice(2),
  commitHook: fs.existsSync('.git/hooks/pre-commit'),
  pushHook: fs.existsSync('.git/hooks/pre-push'),
}))
`, { mode: 0o755 })
  const dev = () => {
    execFileSync('pnpm', ['dev', '--port', '3001'], { cwd, env, stdio: 'pipe' })
    return JSON.parse(readFileSync(join(cwd, 'dev-result.json'), 'utf8'))
  }
  assert.deepEqual(dev(), { args: ['dev', '--port', '3001'], commitHook: true, pushHook: true })
  assert.equal(run('disable').status, 0)
  assert.deepEqual(dev(), { args: ['dev', '--port', '3001'], commitHook: false, pushHook: false })
  writeFileSync(join(cwd, '.git/hooks/pre-push'), '#!/bin/sh\nexit 42\n')
  git('config', '--local', 'agustinegea.prankDisabled', 'false')
  assert.deepEqual(dev(), { args: ['dev', '--port', '3001'], commitHook: false, pushHook: true })
  assert.equal(readFileSync(join(cwd, '.git/hooks/pre-push'), 'utf8'), '#!/bin/sh\nexit 42\n')
})

test('real commits and pushes run installed hooks with mocked GitHub and image viewers', {
  skip: process.platform === 'win32' ? 'POSIX executable mocks; Windows opener tested separately' : false,
}, (t) => {
  const { cwd, env, git, run } = repository(t)
  for (const name of ['scripts', 'public', 'bin']) mkdirSync(join(cwd, name))
  copyFileSync(script, join(cwd, 'scripts/git-hooks.mjs'))
  copyFileSync(imagePath, join(cwd, 'public/logo.gif'))
  env.PATH = `${join(cwd, 'bin')}:${env.PATH}`
  env.HOOK_TEST_LOG = join(cwd, 'opens.jsonl')
  env.HOOK_TEST_LOGIN = 'aguegea'
  writeFileSync(join(cwd, 'bin/gh'), '#!/usr/bin/env node\nconsole.log(process.env.HOOK_TEST_LOGIN)\n', { mode: 0o755 })
  const opener = process.platform === 'darwin' ? 'open' : 'xdg-open'
  writeFileSync(join(cwd, 'bin', opener), `#!/usr/bin/env node
require('node:fs').appendFileSync(process.env.HOOK_TEST_LOG, JSON.stringify(process.argv.slice(2)) + '\\n')
process.exit(Number(process.env.HOOK_TEST_FAIL || 0))
`, { mode: 0o755 })
  const opened = () => readFileSync(env.HOOK_TEST_LOG, 'utf8').trim().split('\n').map(JSON.parse)
  git('config', 'user.name', 'Test contributor')
  git('config', 'user.email', 'contributor@example.invalid')
  git('config', 'commit.gpgsign', 'false')
  assert.equal(run('enable').status, 0)
  git('commit', '--quiet', '--allow-empty', '-m', 'Test pre-commit')
  git('-c', 'init.templateDir=', 'init', '--bare', '--quiet', 'remote.git')
  git('push', './remote.git', 'HEAD:refs/heads/test')
  const viewerArgs = process.platform === 'darwin'
    ? ['-a', 'Safari', join(cwd, 'public/logo.gif')]
    : [join(cwd, 'public/logo.gif')]
  assert.deepEqual(opened(), Array.from({ length: 2 }, () => viewerArgs))

  env.HOOK_TEST_LOGIN = 'someone-else'
  git('commit', '--quiet', '--allow-empty', '-m', 'Other account')
  assert.equal(opened().length, 2)
  env.HOOK_TEST_LOGIN = 'aguegea'
  env.HOOK_TEST_FAIL = '1'
  git('commit', '--quiet', '--allow-empty', '-m', 'Viewer failure still commits')
  assert.equal(opened().length, 3)
  rmSync(join(cwd, 'scripts/git-hooks.mjs'))
  git('commit', '--quiet', '--allow-empty', '-m', 'Branch without hooks still commits')
  assert.equal(opened().length, 3)
})
