import assert from 'node:assert/strict'
import { execFileSync, spawnSync } from 'node:child_process'
import { copyFileSync, existsSync, mkdirSync, mkdtempSync, readFileSync, realpathSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { test } from 'node:test'
import { imageOpener, imagePath, runPrank } from './prank-hook.mjs'

const script = fileURLToPath(new URL('./prank-hook.mjs', import.meta.url))

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
    await runPrank({
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
    await assert.doesNotReject(runPrank({
      ci: false, skip: false,
      getLogin: () => 'aguegea', open: () => {},
      [failing]: () => { throw new Error('Unavailable') },
    }))
  }
})

test('platform openers pass filenames as a single argument without a shell', () => {
  const path = join(tmpdir(), 'an image #1.svg')
  assert.deepEqual(imageOpener('darwin', path), ['open', [path]])
  assert.deepEqual(imageOpener('linux', path), ['xdg-open', [path]])
  assert.deepEqual(imageOpener('win32', path), ['rundll32', ['url.dll,FileProtocolHandler', pathToFileURL(path).href]])
})

function repository(t) {
  const cwd = realpathSync(mkdtempSync(join(tmpdir(), 'image prank ')))
  t.after(() => rmSync(cwd, { recursive: true, force: true }))
  const env = {
    ...process.env, CI: '', VERCEL: '', AGUSTINEGEA_SKIP_PRANK: '',
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
  for (const flag of ['CI', 'VERCEL', 'AGUSTINEGEA_SKIP_PRANK']) {
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
  copyFileSync(script, join(cwd, 'scripts/prank-hook.mjs'))
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

test('real commits and pushes run installed hooks with mocked GitHub and image viewers', {
  skip: process.platform === 'win32' ? 'POSIX executable mocks; Windows opener tested separately' : false,
}, (t) => {
  const { cwd, env, git, run } = repository(t)
  for (const name of ['scripts', 'public', 'bin']) mkdirSync(join(cwd, name))
  copyFileSync(script, join(cwd, 'scripts/prank-hook.mjs'))
  copyFileSync(imagePath, join(cwd, 'public/aguegea-detected.svg'))
  env.PATH = `${join(cwd, 'bin')}:${env.PATH}`
  env.PRANK_TEST_LOG = join(cwd, 'opens.jsonl')
  env.PRANK_TEST_LOGIN = 'aguegea'
  writeFileSync(join(cwd, 'bin/gh'), '#!/usr/bin/env node\nconsole.log(process.env.PRANK_TEST_LOGIN)\n', { mode: 0o755 })
  const opener = process.platform === 'darwin' ? 'open' : 'xdg-open'
  writeFileSync(join(cwd, 'bin', opener), `#!/usr/bin/env node
require('node:fs').appendFileSync(process.env.PRANK_TEST_LOG, JSON.stringify(process.argv.slice(2)) + '\\n')
process.exit(Number(process.env.PRANK_TEST_FAIL || 0))
`, { mode: 0o755 })
  const opened = () => readFileSync(env.PRANK_TEST_LOG, 'utf8').trim().split('\n').map(JSON.parse)
  git('config', 'user.name', 'Test contributor')
  git('config', 'user.email', 'contributor@example.invalid')
  git('config', 'commit.gpgsign', 'false')
  assert.equal(run('enable').status, 0)
  git('commit', '--quiet', '--allow-empty', '-m', 'Test pre-commit')
  git('-c', 'init.templateDir=', 'init', '--bare', '--quiet', 'remote.git')
  git('push', './remote.git', 'HEAD:refs/heads/test')
  assert.deepEqual(opened(), Array.from({ length: 2 }, () => [join(cwd, 'public/aguegea-detected.svg')]))

  env.PRANK_TEST_LOGIN = 'someone-else'
  git('commit', '--quiet', '--allow-empty', '-m', 'Other account')
  assert.equal(opened().length, 2)
  env.PRANK_TEST_LOGIN = 'aguegea'
  env.PRANK_TEST_FAIL = '1'
  git('commit', '--quiet', '--allow-empty', '-m', 'Viewer failure still commits')
  assert.equal(opened().length, 3)
  rmSync(join(cwd, 'scripts/prank-hook.mjs'))
  git('commit', '--quiet', '--allow-empty', '-m', 'Branch without prank still commits')
  assert.equal(opened().length, 3)
})
