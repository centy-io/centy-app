#!/usr/bin/env node
/**
 * CSS usage checker — finds unused CSS selectors across the codebase.
 * Similar to Knip for TypeScript, but for CSS.
 *
 * Usage:
 *   node scripts/check-css.js           # Report unused selectors (dry-run)
 *   node scripts/check-css.js --write   # Remove unused selectors from CSS files
 */
import path from 'path'
import fs from 'fs/promises'
import { fileURLToPath } from 'url'
import { PurgeCSS } from 'purgecss'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')

const args = process.argv.slice(2)
const isWrite = args.includes('--write')

// Source files to scan for used selectors
const content = [
  'app/**/*.{tsx,ts,jsx,js}',
  'components/**/*.{tsx,ts,jsx,js}',
  'lib/**/*.{tsx,ts,jsx,js}',
  'hooks/**/*.{tsx,ts,jsx,js}',
]

// Individual CSS files to analyze (exclude globals.css which is just @imports)
const css = [
  'styles/index.css',
  'styles/App.css',
  'styles/components/**/*.css',
  'styles/pages/**/*.css',
]

// Selectors to always keep even if not found statically in content files.
// Add regex patterns here for dynamically generated or runtime-injected class names.
const safelist = {
  standard: [
    // Global element selectors
    ':root',
    'html',
    'body',
    '*',
    'svg',
    'path',
    'circle',
    // Scrollbar pseudo-elements
    '::-webkit-scrollbar',
    '::-webkit-scrollbar-track',
    '::-webkit-scrollbar-thumb',
    '::selection',
    '::placeholder',
    // Screen reader utility (used by accessibility tooling)
    'sr-only',
    // Data-attribute selectors for theming/state
    /\[data-/,
    // TipTap injects .tiptap and .editor-content classes at runtime; keep all rules
    // that target either class (includes compound selectors like .editor-content .tiptap)
    /editor-content/,
    /\.tiptap/,
    // highlight.js / lowlight injects .hljs-* classes into rendered code blocks
    /hljs/,
    // Link-type badges use dynamic classes: `link-type-${type}` (e.g. link-type-issue)
    /link-type-/,
    // Theme class variants added dynamically
    /\.dark\b/,
    /\.light\b/,
  ],
  // Keep CSS variable declarations and keyframe blocks
  variables: [/--/],
  keyframes: [/./],
}

process.chdir(ROOT)

console.log('\nAnalyzing CSS usage...\n')

const purgeResults = await new PurgeCSS().purge({
  content,
  css,
  rejected: true,
  safelist,
})

let totalUnused = 0
let filesWithUnused = 0

for (const result of purgeResults) {
  const raw = result.rejected ?? []
  // Trim whitespace and deduplicate selectors (PurgeCSS may emit duplicates for
  // selectors that appear on multiple lines in the source CSS)
  const rejected = [...new Set(raw.map(s => s.trim()).filter(Boolean))]
  if (rejected.length === 0) continue

  filesWithUnused++
  totalUnused += rejected.length

  const relPath = result.file ? path.relative(ROOT, result.file) : 'unknown'
  console.log(`  ${relPath}`)
  for (const selector of rejected) {
    console.log(`    - ${selector}`)
  }
  console.log()
}

if (totalUnused === 0) {
  console.log('No unused CSS selectors found.\n')
  process.exit(0)
}

console.log(
  `Found ${totalUnused} unused selector(s) across ${filesWithUnused} file(s).`
)

if (isWrite) {
  let written = 0
  for (const result of purgeResults) {
    if (!result.file || (result.rejected?.length ?? 0) === 0) continue
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    await fs.writeFile(result.file, result.css, 'utf-8')
    written++
  }
  console.log(`\nRemoved unused selectors from ${written} file(s).\n`)
} else {
  console.log('\nRun with --write to remove unused selectors.\n')
  process.exit(1)
}
