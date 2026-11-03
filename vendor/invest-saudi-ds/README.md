The Invest Saudi design system, V1.0, is the only guideline for designing and building Invest Saudi / MISA pages. Every page, section and component starts from here. Nothing is designed outside it.

## Rules for building pages (read first)

1. **Build only from this system.** Every component on a page is an `InvestSaudiDS` component, and every colour, size, space, radius and shadow is a token from `tokens.json`. Never hard-code a hex value, a pixel size or a font. Never restyle a component locally to "make it fit".
2. **Before building a component, check that it exists here.** Use the component catalogue below (Header, Footer, OpportunityCard, Button, Input, Tag, Table, Modal…). If what you need exists, use it with its props. If it does not exist, compose it from existing components and tokens only, then flag it as a candidate addition to this system. Do not invent a parallel version.
3. **Before building a section, check every page already built.** If a similar section already exists on another page (a hero, a stats band, an opportunities grid, a FAQ, a CTA strip), reuse that same section and its structure. Do not build a second, slightly different version. One section pattern, one implementation, reused everywhere.
4. **Every public page has the same shell, in this order:** `Header` (which contains the `DigitalStamp` and `SubHeader`), page content, `Footer` (which contains the contact band and the `FeedbackBanner`). Show `CookiesPopup` on first visit.
5. **English, left-to-right.** Pages set `dir="ltr" lang="en"`, and all copy, labels and defaults are English, taken from the file's EN variants. Components use logical properties, so they also work if an Arabic (`dir="rtl"`) version is needed later.
6. **Match the Figma file exactly.** Header, Footer, Digital Stamp, mega menu, cards and every other component follow their Figma EN variant: same structure, order, copy, sizes and tokens. If a page needs something the file draws differently, the file wins.

## Content fundamentals

- Voice is formal and institutional, from a government investment authority: it addresses the investor directly ("you", "your investment journey"), stays confident and factual, and does not oversell.
- Use the file's real labels: "Why Saudi", "Opportunities", "Sectors", "Regent & Cities", "How to Invest", "Insights & News", "Contact", "Log in", "Investor Sign up", "Quick view", "Was this page helpful?", "Let’s start something great.", "© 2026 Invest Saudi. All Rights Reserved." Keep the file's spelling as written.
- Button labels are short verbs or verb phrases in title or sentence case (Subscribe, Confirm, Cancel, Quick view, Log in). Headings are nouns or short phrases; footer section headings may be uppercase where the file shows it (WHY SAUDI).
- No emoji. Exclamation marks only in short invitations the file uses ("Sign up to learn about our latest developments and news!").
- Numbers: 2,000 · 82% · 1.7B SAR · ~USD 0.9–1.4B. Phone numbers in international format (+966 11 506 5777).

## Visual foundations

**Theme.** Dark is the default theme: the source file draws every page and component in Dark mode, on `bg-primary` (#0c0e12) and `bg-secondary` (#13161b). Light is the alternate theme. Three elements are always light whatever the page theme, as in the file: the `DigitalStamp`, the `SubHeader` and the `CookiesPopup` (they set `data-theme="light"` themselves).

**Colour.**
- Brand is teal: `brand-500` #03a8a0 for primary buttons (`button-primary-bg`), focus rings and active tabs; `brand-600` #027c76 for `bg-brand-solid` and hover (`button-primary-bg_hover`). Tertiary buttons are filled by default in this file (`button-secondary-bg_hover`), not transparent. Use the brand only for action and emphasis. It is not a background for large areas.
- `dga-*` (DGA green) is reserved for the government stamp and DGA marks.
- Text: `text-primary` for headings and lead cells, `text-secondary` for labels and body, `text-tertiary` for supporting text and hints, `text-placeholder` for placeholders. Errors: `text-error-primary`, `border-error`.
- Surfaces: `bg-primary` for the page, `bg-secondary` for cards (opportunity card, footer), `bg-primary_alt` for alerts, `bg-tertiary`/`bg-quaternary` for tracks and wells. Borders: `border-primary` for controls and dividers inside cards, `border-secondary` for card outlines and table rules.
- Badges, tags, charts and featured icons take the `utility-<colour>-50/200/700` triplet (fill, border, text).
- Always pick the semantic tokens (`text-*`, `bg-*`, `border-*`, `fg-*`, `button-*`, `utility-*`). Primitives (`brand-500`, `gray-dark-mode-900`…) are for the system itself.

**Type.** IBM Plex Sans Arabic (DGA font) for everything, Latin and Arabic alike, display and body, loaded from Google Fonts. The scale is the file's: `text-xs` 12/18 → `text-xl` 20/30 and `display-xs` 24/32 → `display-2xl` 72/90, each in Regular 400, Medium 500, Semibold 600 and Bold 700 (classes such as `.text-md-regular` and `.display-lg-semibold`). Display md and larger use −2% letter-spacing. Body copy is `text-md-regular`. Labels and buttons are Medium. Card titles are `text-xl-bold`. Page titles are `display-sm`/`display-md` semibold.

**Spacing and layout.** The spacing scale is `spacing-xxs` 2 · `xs` 4 · `sm` 6 · `md` 8 · `lg` 12 · `xl` 16 · `2xl` 20 · `3xl` 24 · `4xl` 32 · `5xl` 40 · `6xl` 48 · `7xl` 64 · `8xl` 80 · `9xl` 96 · `10xl` 128 · `11xl` 160. Page container: `container-max-width-desktop` 1280px with `container-padding-desktop` 32px (`container-padding-mobile` 16px). Text blocks max out at `paragraph-max-width` 720px. Breakpoints in the file: Desktop 1440, Mobile 375.

**Radius.** Buttons, inputs and pagination cells use `radius-xs` (4px), the signature of this system. Do not round them more. Cards, nav bar and cookie tiles use `radius-md` (8px). Alerts, metrics and tables use `radius-xl` (12px). Tags, avatars, switches and featured icons use `radius-full`.

**Elevation.** Use `shadow-xs` on buttons, inputs and the nav bar; `shadow-sm` on metric cards; `shadow-lg` on dropdowns; `shadow-xl` on modals. Focus is always `focus-ring` (4px brand ring over a 2px white gap), or `focus-ring-error` on invalid fields. Modal overlays blur the page behind.

**Motion.** Keep it short and functional: colour transitions at 150ms. No decorative animation.

## Iconography

- Icons come only from `InvestSaudiDS.Icon`: the file's 1,173 line icons (24px grid, 2px round strokes, `currentColor`), for example `home-line`, `search-lg`, `globe-01`, `building-07`, `marker-pin-01`, `arrow-left`. The list is `InvestSaudiDS.icons`.
- Social marks are filled: `social-x`, `social-linkedin`, `social-instagram`, `social-youtube`, `social-snapchat`, `social-facebook`, `social-google`, `social-apple`.
- Sizes are 16 (hints, tags), 20 (buttons, inputs, nav) and 24 (2xl buttons, featured content). Colour comes from `fg-*` tokens on the parent.
- No emoji, no other icon libraries, no hand-drawn icons.

## Logos

- The Invest Saudi logo (`assets/Logos/invest-saudi-logo-white.svg`) is white ink and goes on dark surfaces only. In the header it sits at 34px tall, followed by a 1px `border-primary` rule and the Vision 2030 mark (`vision-2030-on-dark.svg`).
- MISA, DGA, CST and the government entities have `-on-dark` (white) and `-on-light` (dark ink) versions. Pick the version that matches the surface and never recolour a mark.
- The footer carries the MISA and Invest Saudi logos. The digital stamp carries the DGA logo.

## Component catalogue

Shell: `Header` (with `DigitalStamp`, `SubHeader`, `MegaMenu`), `Footer` (with contact band and `FeedbackBanner`), `CookiesPopup`, `SidebarNav` (signed-in portal).
Page structure: `PageHeader`, `SectionHeader`, `SectionLabel`, `CardHeader`, `SectionFooter`, `ContentDivider`, `InlineCTA`, `FAQ`, `EmptyState`.
Investment content: `OpportunityCard` (Level 1), `OpportunityDetails` (Level 2), `QRCodeButton`, `MetricItem`, `NumberTicker`, `StatsGallery`, `Carousel`, `PaginationDots`.
Data: `Table`, `LineChart` (line and bar), `PieChart`, `ProgressCircle`, `ActivityGauge`, `ProgressBar`.
Actions and forms: `Button`, `ButtonGroup`, `CloseButton`, `SocialButton` (Nafath first), `AppStoreBadge`, `Input`, `Textarea`, `Select`, `DatePicker`, `Calendar`, `VerificationCodeInput`, `FileUpload`, `Checkbox`, `CheckboxCard`, `Radio`, `Switch`, `Slider`, `FilterPanel`, `Chip`, `CommandBar`.
Feedback and navigation: `Alert`, `Notification`, `FeaturedIcon`, `Tooltip`, `HelpIcon`, `Modal`, `SlideoutMenu`, `DropdownMenu`, `Loading`, `ProgressSteps`, `CircularStepper`, `Tabs` (including vertical), `Breadcrumbs`, `Pagination`, `Tag`, `Avatar`, `AvatarGroup`, `ActivityFeed`, `Message`, `Icon`, `CodeSnippet`.

Each component's README says which props it takes and when to use it. Usage notes and component guidance paraphrase the source Figma file ([IS]Design-System_V1.0).

## Not synced

These parts of the Figma file are not in this system yet:
- Design-annotation and mockup helpers (cursors, numeric keys, spec notes, device and browser mockups, video player, credit-card mockup). These are internal documentation pieces, not product UI.
- The Team sections page, which has no components in the file.
- Backdrop blurs (`backdrop-blur-sm` to `xl`) are not tokens. Use `backdrop-filter: blur(8px)` on overlays only.
- The file's layout grids (desktop, tablet and mobile; 2 to 12 columns) are not exported. Use the container and spacing tokens.
- Light-mode values of the email and WYSIWYG-editor component colours, and the WYSIWYG toolbar component.
- The roughly 150 private-company partner logos on the Logos page, and the MEWA logo, which did not export cleanly.
