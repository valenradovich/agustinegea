// Compatibility entry point for existing hooks and contributor instructions.
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { main } from './git-hooks.mjs'
export { imageOpener, imagePath, runHook as runPrank } from './git-hooks.mjs'

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  await main(process.argv[2])
}
