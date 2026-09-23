import assert from 'node:assert/strict'
import { execFileSync, spawnSync } from 'node:child_process'
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { test } from 'node:test'
import { runPrank } from './prank-hook.mjs'

test('only an interactive aguegea who says yes is offered the video', async () => {
  for (const scenario of [
    { login: 'aguegea', yes: true, expected: true },
    { login: 'Aguegea', yes: true, expected: true },
    { login: 'aguegea', yes: false },
    { login: 'someone-else', yes: true },
    { login: 'aguegea', yes: true, ci: true },
    { login: 'aguegea', yes: true, interactive: false },
  ]) {
    let opened = false
    let prompted = false
    let lookedUp = false
    await runPrank({
      interactive: scenario.interactive ?? true,
      ci: scenario.ci ?? false,
      getLogin: () => { lookedUp = true; return scenario.login },
      confirm: () => { prompted = true; return scenario.yes },
      open: (url) => { assert.equal(url, 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'); opened = true },
      log: () => {},
    })
    assert.equal(opened, Boolean(scenario.expected))
    if (scenario.ci || scenario.interactive === false) assert.equal(lookedUp, false)
    if (scenario.login === 'someone-else') assert.equal(prompted, false)
  }
})

test('failed identity lookups, prompts, and browser commands never reject a push', async () => {
  for (const failing of ['getLogin', 'confirm', 'open']) {
    await assert.doesNotReject(runPrank({
      interactive: true, ci: false,
      getLogin: () => 'aguegea', confirm: () => true, open: () => {}, log: () => {},
      [failing]: () => { throw new Error('Unavailable') },
    }))
  }
})

test('local enable/disable preserves other hooks and custom hook paths', () => {
  const cwd = mkdtempSync(join(tmpdir(), 'portfolio-hook-'))
  const script = fileURLToPath(new URL('./prank-hook.mjs', import.meta.url))
  const env = { ...process.env, GIT_CONFIG_GLOBAL: process.platform === 'win32' ? 'NUL' : '/dev/null', GIT_CONFIG_NOSYSTEM: '1' }
  const run = (action) => spawnSync(process.execPath, [script, action], { cwd, env, encoding: 'utf8' })
  try {
    execFileSync('git', ['-c', 'init.templateDir=', 'init', '--quiet'], { cwd, env })
    const path = join(cwd, '.git/hooks/pre-push')
    assert.equal(run('enable').status, 0)
    assert.match(readFileSync(path, 'utf8'), /scripts\/prank-hook.mjs run <\/dev\/tty/)
    assert.equal(run('enable').status, 0)
    assert.equal(run('disable').status, 0)
    assert.equal(existsSync(path), false)
    assert.equal(run('disable').status, 0)

    writeFileSync(path, '#!/bin/sh\nexit 42\n')
    assert.equal(run('enable').status, 1)
    assert.equal(run('disable').status, 1)
    assert.equal(readFileSync(path, 'utf8'), '#!/bin/sh\nexit 42\n')
    execFileSync('git', ['config', '--local', 'core.hooksPath', 'custom-hooks'], { cwd, env })
    assert.equal(run('enable').status, 1)
    assert.equal(readFileSync(path, 'utf8'), '#!/bin/sh\nexit 42\n')
  } finally {
    rmSync(cwd, { recursive: true, force: true })
  }
})
