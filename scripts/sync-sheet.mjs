#!/usr/bin/env node
/**
 * Pulls the published Google Sheet and writes data/ledger.csv.
 *
 * The sheet is the thing Patrick edits. This script is the gate between it and
 * the site: it refuses to publish a sheet that is malformed, that has lost a
 * large chunk of its rows, or that carries something a name could be read out
 * of. A bad sync leaves the last good record in place rather than replacing it.
 *
 *   node scripts/sync-sheet.mjs            # normal run
 *   node scripts/sync-sheet.mjs --dry-run  # report only, write nothing
 *   node scripts/sync-sheet.mjs --force    # allow a big drop in row count
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const here = dirname(fileURLToPath(import.meta.url))
const root = join(here, '..')
const csvPath = join(root, 'data', 'ledger.csv')
const metaPath = join(root, 'data', 'ledger.meta.json')

const args = process.argv.slice(2)
const dryRun = args.includes('--dry-run')
const force = args.includes('--force')

const url = process.env.SHEET_CSV_URL || readLocalUrl()

function readLocalUrl() {
  try {
    const env = readFileSync(join(root, '.env.local'), 'utf8')
    const m = env.match(/^SHEET_CSV_URL\s*=\s*(.+)$/m)
    return m ? m[1].trim().replace(/^["']|["']$/g, '') : ''
  } catch {
    return ''
  }
}

if (!url) {
  console.error(
    'No sheet URL. Set SHEET_CSV_URL as a repository variable, or put it in\n' +
      '.env.local as SHEET_CSV_URL=https://docs.google.com/.../pub?output=csv\n' +
      'See data/SHEET.md for how to get that link.',
  )
  process.exit(1)
}

/* ------------------------------------------------------------------ parsing */

function parseCsv(text) {
  const rows = []
  let row = []
  let cell = ''
  let quoted = false
  for (let i = 0; i < text.length; i++) {
    const c = text[i]
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') { cell += '"'; i++ }
      else if (c === '"') quoted = false
      else cell += c
    } else if (c === '"') quoted = true
    else if (c === ',') { row.push(cell); cell = '' }
    else if (c === '\n') { row.push(cell); rows.push(row); row = []; cell = '' }
    else if (c !== '\r') cell += c
  }
  if (cell.length || row.length) { row.push(cell); rows.push(row) }
  return rows.filter((r) => r.some((v) => v.trim() !== ''))
}

const quote = (v) => (/[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v)

/* --------------------------------------------------------------- validation */

const COLUMNS = ['month', 'ref', 'category', 'amount', 'currency', 'note']
// a note should describe what was bought, never how to find someone
const RISKY = [
  { re: /\+?\d[\d\s()-]{8,}/, why: 'looks like a phone number' },
  { re: /\S+@\S+\.\S+/, why: 'looks like an email address' },
  // a named school, e.g. "Chilomoni Secondary", not the ordinary phrase
  // "school fees", which is exactly what most notes are about
  {
    re: /\b[A-Z][a-z]{2,}\s+(Primary|Secondary|School|Academy|College|Institute)\b/,
    why: 'may name a school',
  },
  { re: /\b(village|district|township)\b/i, why: 'may name a place' },
]

const problems = []
const warnings = []

const text = await fetch(url, { redirect: 'follow' }).then((r) => {
  if (!r.ok) throw new Error(`Sheet fetch failed: ${r.status} ${r.statusText}`)
  return r.text()
})

if (/<html/i.test(text.slice(0, 200))) {
  console.error(
    'That URL returned a web page, not CSV. Use File > Share > Publish to web,\n' +
      'pick the sheet, choose Comma-separated values (.csv), and copy that link.',
  )
  process.exit(1)
}

const rows = parseCsv(text)
if (!rows.length) {
  console.error('The sheet came back empty. Nothing written.')
  process.exit(1)
}

const header = rows[0].map((h) => h.trim().toLowerCase())
const missing = COLUMNS.filter((c) => !header.includes(c))
if (missing.length) {
  console.error(`The sheet is missing these columns: ${missing.join(', ')}`)
  console.error(`It needs, in any order: ${COLUMNS.join(', ')}`)
  process.exit(1)
}
const idx = Object.fromEntries(COLUMNS.map((c) => [c, header.indexOf(c)]))

const clean = []
rows.slice(1).forEach((r, i) => {
  const line = i + 2 // sheet row number, allowing for the header
  const get = (c) => (r[idx[c]] ?? '').trim()
  const month = get('month')
  const ref = get('ref')
  const category = get('category')
  const rawAmount = get('amount').replace(/[, ]/g, '')
  const currency = (get('currency') || 'MWK').toUpperCase()
  const note = get('note')

  if (!month && !ref && !rawAmount) return // a blank spacer row is fine

  if (!/^\d{4}-\d{2}$/.test(month)) problems.push(`row ${line}: month "${month}" is not YYYY-MM`)
  const amount = Number(rawAmount)
  if (!rawAmount || !Number.isFinite(amount) || amount < 0) {
    problems.push(`row ${line}: amount "${get('amount')}" is not a positive number`)
  }
  if (!['MWK', 'GBP'].includes(currency)) {
    problems.push(`row ${line}: currency "${currency}" must be MWK or GBP`)
  }
  if (!ref) problems.push(`row ${line}: ref is empty`)
  if (!category) problems.push(`row ${line}: category is empty`)

  for (const { re, why } of RISKY) {
    if (re.test(note)) warnings.push(`row ${line}: note ${why} — "${note}"`)
  }

  clean.push([month, ref, category, String(amount), currency, note])
})

if (problems.length) {
  console.error(`\nNot publishing. ${problems.length} problem(s) in the sheet:\n`)
  problems.forEach((p) => console.error('  ' + p))
  console.error('\nThe site still shows the last good record. Fix these and run again.')
  process.exit(1)
}

/* ------------------------------------------------- guard against a wipe-out */

let existing = 0
try {
  existing = readFileSync(csvPath, 'utf8').trim().split('\n').length - 1
} catch {}

if (existing && clean.length < existing * 0.8 && !force) {
  console.error(
    `\nNot publishing. The sheet has ${clean.length} rows but the record has ${existing}.\n` +
      'That is a big drop, so this looks like a mistake rather than an edit.\n' +
      'If it really is right, run again with --force.',
  )
  process.exit(1)
}

clean.sort((a, b) => (a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0))
const out = [COLUMNS.join(','), ...clean.map((r) => r.map(quote).join(','))].join('\n') + '\n'

const before = (() => { try { return readFileSync(csvPath, 'utf8') } catch { return '' } })()
const changed = before !== out

warnings.forEach((w) => console.warn('  warning: ' + w))
console.log(`\n${clean.length} rows read from the sheet.`)

if (dryRun) {
  console.log(changed ? 'Dry run: the record would change.' : 'Dry run: no change.')
  process.exit(0)
}

if (!changed) {
  console.log('No change. Nothing written.')
  process.exit(0)
}

writeFileSync(csvPath, out)

const meta = JSON.parse(readFileSync(metaPath, 'utf8'))
meta.lastUpdated = new Date().toISOString().slice(0, 10)
writeFileSync(metaPath, JSON.stringify(meta, null, 2) + '\n')

console.log(`Written to data/ledger.csv. Last updated set to ${meta.lastUpdated}.`)
