# Updating the record from a spreadsheet

You edit a Google Sheet. The site pulls it every morning and republishes itself.
You never touch code, the terminal, or a CSV file.

## One-time setup

**1. Make the sheet.**
Go to <https://sheets.new>. Then File > Import > Upload, and upload
`data/ledger.csv` from this project. Choose "Replace spreadsheet". That gives you
every existing row with the right column headings already in place.

**2. Publish it as CSV.**
File > Share > Publish to web. Under "Link", pick the sheet, and change
"Web page" to **Comma-separated values (.csv)**. Press Publish, and copy the
link. It looks like:

```
https://docs.google.com/spreadsheets/d/e/2PACX-.../pub?gid=0&single=true&output=csv
```

This makes the sheet readable by anyone with the link. That is fine: everything
in it gets published on the site anyway. Do not keep anything private in it.

**3. Tell the site where the sheet is.**
On GitHub, go to the repository > Settings > Secrets and variables > Actions >
the **Variables** tab > New repository variable.
Name it `SHEET_CSV_URL` and paste the link as the value.

**4. Turn on publishing.**
Repository > Settings > Pages > under "Build and deployment", set Source to
**GitHub Actions**. Then add a second repository variable named `BASE_PATH` with
the value `/undefiled-religion-web/`. (If you later put the site on its own
domain, delete that variable.)

That is the setup done, once.

## Adding a payment, from then on

Open the sheet, on a phone or a laptop, and add a row:

| month   | ref           | category        | amount | currency | note                              |
|---------|---------------|-----------------|--------|----------|-----------------------------------|
| 2026-03 | Coordinator B | Pooled transfer | 320000 | MWK      | Maize flour, cooking oil and fees |

- **month** must be `YYYY-MM`.
- **amount** can have commas, the sync strips them. No `MK`, no `£`.
- **currency** is `MWK` or `GBP`, whichever you actually sent.
- **note** is optional. Say what it bought. Never a name, a school or a place.

The site picks it up the next morning. To publish immediately, go to the
repository > Actions > "Publish the record" > Run workflow.

## What happens if you make a mistake

The sync refuses to publish a broken sheet and the site keeps showing the last
good record. It stops on:

- a month that is not `YYYY-MM`, an amount that is not a number, a currency that
  is not MWK or GBP, an empty ref or category
- the sheet suddenly having far fewer rows than the record, which is what a bad
  paste or a deleted range looks like

It also prints a warning, without stopping, if a note looks like it contains a
phone number, an email, a named school or a place. Those warnings are the
safeguarding net. If you see one, take the detail out of the note.

## Running it by hand

```bash
npm run sync:dry   # read the sheet, report what would change, write nothing
npm run sync       # pull the sheet into data/ledger.csv
npm run publish    # sync, then build
```

For local runs, put the link in a file called `.env.local` at the top of the
project:

```
SHEET_CSV_URL=https://docs.google.com/spreadsheets/d/e/2PACX-.../pub?output=csv
```

That file is gitignored and never leaves your machine.
