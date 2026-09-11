import { readFileSync } from 'node:fs'
import { execFileSync } from 'node:child_process'

const { devDependencies } = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'))
// These split packages did not exist on the legacy host. They are build-time
// type contracts only; the standalone Store engine is bundled into the client.
const modern = new Set(['dsh-client-ui-renderer', 'dsh-client-ui-session', 'dsh-api-session-controller', 'dsh-http-proxy', 'dsh-launch-environment'])
const packages = Object.keys(devDependencies)
  .filter(name => name.startsWith('@deepseek-ai/dsh-') && !modern.has(name.slice('@deepseek-ai/'.length)))
  .map(name => `${name}@0.1.1-rc.2`)
packages.push('@deepseek-ai/cordis@4.0.1')
for (const name of ['brand', 'attachment', 'invariants', 'timeout', 'typert-protocol']) {
  const spec = `@deepseek-ai/dsh-${name}@0.1.1-rc.2`
  if (!packages.includes(spec)) packages.push(spec)
}
// Only node_modules changes; npm ci restores the checked-in dependency lock.
execFileSync(process.execPath, [process.env.npm_execpath, 'install', '--no-save', '--package-lock=false', '--legacy-peer-deps', ...packages], { stdio: 'inherit' })
