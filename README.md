# Saudi As Your Regional Hub: Next.js Page

Route: `/why-saudi/regional-hub`. Built on the Invest Saudi design system V1.0, used unchanged.

## 1. How The Design System Is Used

- `vendor/invest-saudi-ds/` holds the published files byte for byte: `bundle.js`, `bundle.css`, `tokens.css`, `tokens.json`, `design-system.json`, `index.d.ts`, `README.md`. `npm run ds:verify` checks them against `CHECKSUMS.txt` (SHA-256 of the published version 1793700615-c498).
- `public/_blob/` holds the system's twelve logo and badge assets at the exact `/_blob/<id>` paths the bundle references. `next.config.mjs` serves them as `image/svg+xml`.
- `lib/ds.tsx` sets `window.React` and loads the bundle once, then exposes `window.InvestSaudiDS` through `useDS()`. The bundle is a browser script, so every band is a client component rendered after mount. There is no fork, patch or re-export of the system.
- `app/globals.css` imports `tokens.css` then `bundle.css`, and adds page layout only (`.rh-*` classes). Every value in those classes is a token (`--spacing-*`, `--container-*`, `--bg-*`, `--border-*`, `--radius-*`, `--shadow-*`). No component is restyled.
- Bands alternate the system's two themes: dark (the default) and light, set with `data-theme="light"` on alternate bands so every token flips; no component is restyled. Hero, Reach, Market access, Routes, Companies and Continue are dark; Router, Connectivity, Platforms, Industry and Comparison are light.
- Page shell as the system README requires: `Header` (with `DigitalStamp` and `SubHeader`), content, `Footer` (with contact band and `FeedbackBanner`), `CookiesPopup` on first visit. Dark theme, `lang="en" dir="ltr"`, IBM Plex Sans Arabic from the system stylesheet.

## 2. Experience Hierarchy (Visual Refinement, Nov 2026)

Inspire (hero with the globe as the visual) → Understand (anchor market, editorial figure) → Explore (connectivity globe with Air, Land, Sea, Digital and the integrated network; platforms as a location strip) → Evaluate (market access summary with details on demand; routes as tabs; industry editorial; companies showcase; comparison on demand) → Act (talent, advisor, FAQ). The regional case builder is a guided three-step slide-out (`CaseBuilder.tsx`) opened from the hero CTA, a persistent button after scrolling, the case strip under the hero, and the Act band; it sets the same shared context as before. Provenance is a footnote line everywhere except inside detail tables, where it keeps the status badge.

## 2a. Bands And The Components Behind Them

| # | Band | File | Design-system components used |
|---|---|---|---|
| 0 | Hero | `HeroBand.tsx` | Breadcrumbs, Button (xl primary and secondary), type classes (display-lg-semibold, text-xl-regular), three-figure strip with provenance; brand-token gradient background with an `image` prop for the approved photograph |
| 1 | Router | `RouterBand.tsx` | SectionLabel, Select, Chip (checkbox, multi-select markets), ButtonGroup (route, wide screens), Select (route, narrow screens) |
| 2 | Reach | `ReachBand.tsx` | SectionHeader, MetricItem, Tag (status) |
| 3 | Connectivity | `ConnectivityBand.tsx`, `Globe.tsx` | SectionHeader with Tabs (Air, Sea, Ground), composed SVG globe (tokens only), MetricItem, Alert, Button, Table (details toggle) |
| 4 | Market access | `MarketAccessBand.tsx` | SectionHeader, Table, Tag (sector, status dot) |
| 5 | Platforms | `PlatformsBand.tsx` | SectionHeader, CardHeader, Tag, Button, EmptyState |
| 6 | Routes | `RoutesBand.tsx` | SectionHeader, CheckboxCard (radio), CardHeader, ProgressSteps, Button, Alert |
| 7 | Industry in the region | `IndustryBand.tsx` | SectionHeader, EmptyState (unavailable state), LineChart bar and CardHeader (served state) |
| 8 | Who already does this | `CompaniesBand.tsx` | SectionHeader, FilterPanel, CardHeader, Tag, EmptyState, InlineCTA |
| 9 | Hub comparison | `ComparisonBand.tsx` | SectionHeader, Alert (warning), Table (striped) |
| 10 | Talent, living, continue | `ContinueBand.tsx` | SectionHeader, InlineCTA, CardHeader, Button, FAQ |

Shared: `shared.tsx` has the `SourceLine` (Tag plus provenance text) and the `Sideways` link row (Button link-color), the two compositions reused on every card.

## 3. Shared Filter Context

Band 1 declares `industry`, `markets[]` and `route`. Bands 2 to 10 read it: reach and connectivity name the markets, market access filters agreements, platforms and comparison filter by route, industry loads the sector's regional layer, companies filter by route and industry, and the advisor link in band 10 carries the whole context as query parameters (`industry`, `route`, `markets`, `page=regional-hub`), the same fields as the microsite filter context and the Copilot page-context hand-off.

## 4. Data And Provenance

`data/regional-hub.ts` is the content model. Every figure is a record with `source`, `period`, `updated`, `status` and `owner`. Four statuses are in use:

- `published`: already shown on investsaudi.sa (Why Saudi page, read 3 Nov 2026) with the source it cites, or taken from an authority's own publication (ZATCA treaty list, MISA RHQ rules, ECZA, GACA ILBZ rules). Not re-verified by the Data team.
- `benchmark`: a public figure from a named source (World Bank LPI 2023, national tax authorities, GCC Secretariat, Arab League, port authorities, public company announcements). Not re-verified; port throughput is marked "to confirm".
- `estimate`: computed on the page (flight and drive times from great-circle distance; schematic corridor geometry).
- `unavailable`: no published value exists. Three hub-comparison rows (visa processing time, land and office cost, industrial electricity tariff) and the per-market regional demand chart stay empty rather than estimated.

Company names come from public announcements; logos are not shown until the company consents. Nothing on this page should be published externally until the Data team re-verifies the `published` and `benchmark` records.

## 5. Composed Patterns That The System Does Not Have (Candidate Additions)

- Sourced stat: MetricItem plus provenance line (band 2).
- Platform card and company card: CardHeader, Tag, Button and provenance line in a `.rh-card` shell built from card tokens (bands 5 and 8).
- Route selector with expanding path: CheckboxCard radio group plus ProgressSteps (band 6).
- Sideways link row on every card (the 360 rule at card level).
- Globe: the system has no map or globe component. `Globe.tsx` renders Natural Earth 1:110m country polygons (`world-atlas` package) through `d3-geo`'s orthographic projection with horizon clipping: graticule, countries with hover names, Saudi Arabia in brand, selected markets in brand tint, published reach rings, hubs, markets and great-circle arcs. Drag and arrow keys. The reach rings animate (marching dash plus a pulse from Riyadh out to the 8-hour ring); both stop under prefers-reduced-motion. Clicking Saudi Arabia zooms in (600 ms, none under reduced motion), swaps to 1:50m boundaries loaded on demand, and shows the national logistics layer: roads, operating rail, planned rail (Landbridge, GCC Railway), ports, airports and the nine border crossings labelled with the neighbour they lead to, with layer tabs (All, Roads, Rail, Ports and airports) and a crossings table. Road and rail geometry are schematic corridors between known cities and border posts, flagged as such on the band; MoT, SAR, Mawani, GACA and ZATCA geometry replace them. Every colour is a token. Bahrain is below 110m resolution and appears as a labelled point only. It is the main candidate addition from this page; the two libraries (d3-geo, topojson-client) and the atlas are the only dependencies outside Next and React.

## 6. Known Limits

- Client-only rendering. The bundle needs `window`, so the page body renders after mount and search engines see the page title and description only. The fix is an ESM build of the system, which is a change to the system and was not made.
- Table is not responsive in the system: `is-table-wrap` clips rather than scrolls below the table width, so on phones the connectivity, agreements and comparison tables are cut off. A stacked table variant is a candidate addition.
- `is-shead-actions` and the ButtonGroup do not wrap. The page keeps page-header actions outside the component and swaps ButtonGroup for Select below 1024px rather than restyling either.
- Header menu labels follow the file, including its spelling "Regent & Cities". The mega menus are not populated.
- Save to My Space and the advisor form are links to routes that do not exist in this project.
- Arabic: components use logical properties, but no Arabic copy or RTL layout was built.

## 7. Run

```
npm install
npm run ds:verify
npm run dev        # http://localhost:3000/why-saudi/regional-hub
npm run preview    # static export to out/ for a shareable preview
```

Open `http://localhost:3000/why-saudi/regional-hub`.
