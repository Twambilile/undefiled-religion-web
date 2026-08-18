#!/usr/bin/env node
/**
 * Pulls live exchange rates into data/rates.json.
 *
 * There are two kinds of rate here and they are treated differently on purpose:
 *
 *   gbpToMwk   one figure per YEAR, used to convert the record. FROZEN. A
 *              payment made in 2023 is worth what it was worth in 2023, and
 *              re-converting history at today's rate would quietly rewrite it.
 *   liveGbpToMwk / perGbp
 *              today's rates, used for the calculator, the "what it buys"
 *              prices, and the currency switch. These are refreshed daily.
 *
 * If the fetch fails or the numbers look wrong, the existing rates are kept and
 * the script exits 0, so a flaky API can never break the publish.
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const ratesPath = join(root, 'data', 'rates.json')
const rates = JSON.parse(readFileSync(ratesPath, 'utf8'))

const WANT = Object.keys(rates.perGbp)
const API = 'https://open.er-api.com/v6/latest/GBP'

/** A new rate more than this far from the old one is treated as suspect. */
const TOLERANCE = 3

let data
try {
  const res = await fetch(API, { signal: AbortSignal.timeout(20000) })
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`)
  data = await res.json()
} catch (err) {
  console.warn(`Could not reach the rates API (${err.message}). Keeping the rates on file.`)
  process.exit(0)
}

if (data.result !== 'success' || !data.rates) {
  console.warn('The rates API did not return a usable result. Keeping the rates on file.')
  process.exit(0)
}

const live = data.rates
const missing = [...WANT, 'MWK'].filter((c) => typeof live[c] !== 'number' || live[c] <= 0)
if (missing.length) {
  console.warn(`Missing rates for ${missing.join(', ')}. Keeping the rates on file.`)
  process.exit(0)
}

const suspect = []
const nextPerGbp = { ...rates.perGbp }
for (const code of WANT) {
  const before = rates.perGbp[code]
  const now = live[code]
  if (before && (now > before * TOLERANCE || now < before / TOLERANCE)) {
    suspect.push(`${code}: ${before} -> ${now}`)
    continue
  }
  nextPerGbp[code] = Number(now.toFixed(code === 'NGN' || code === 'KES' ? 0 : 4))
}

const beforeMwk = rates.liveGbpToMwk || rates.gbpToMwk[String(new Date().getUTCFullYear())]
const nowMwk = live.MWK
let nextLiveMwk = rates.liveGbpToMwk
if (beforeMwk && (nowMwk > beforeMwk * TOLERANCE || nowMwk < beforeMwk / TOLERANCE)) {
  suspect.push(`MWK: ${beforeMwk} -> ${nowMwk}`)
} else {
  nextLiveMwk = Math.round(nowMwk)
}

if (suspect.length) {
  console.warn('These looked wrong and were left alone:')
  suspect.forEach((s) => console.warn('  ' + s))
}

rates.perGbp = nextPerGbp
rates.liveGbpToMwk = nextLiveMwk
rates.ratesUpdated = new Date().toISOString().slice(0, 10)
rates.ratesSource = 'open.er-api.com'

writeFileSync(ratesPath, JSON.stringify(rates, null, 2) + '\n')
console.log(`Rates updated ${rates.ratesUpdated}: £1 = MK ${nextLiveMwk}, $${nextPerGbp.USD}, €${nextPerGbp.EUR}`)
