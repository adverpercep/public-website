# AP 2026 Website Redesign — Claude Code Context

## Project overview

**Client:** Advertiser Perceptions — B2B market research/intelligence firm serving media, advertising, and ad tech executives.

**Goal:** Build a static HTML demo site from Claude-generated mockups, suitable for client presentation/upload. Long-term plan is to migrate into WordPress (possibly just the blog/Insights section).

**Current phase:** Static HTML demo — pages fully built, linked, cleaned, and ready to zip/upload.

**Tech stack:**
- Pure HTML + CSS (no framework, no build step)
- Poppins via Google Fonts
- Material Symbols Outlined via Google Fonts (icons on homepage "What We Deliver" section)
- No JavaScript beyond native `<details>` accordion on `ad-insights-hub.html`
- Staff photos hotlinked from `https://www.advertiserperceptions.com/wp-content/uploads/`
- Forms: HubSpot JS embed (see HubSpot Forms section below)

**Key contacts (from page content):**
- info@advertiserperceptions.com
- (212) 626-6683
- 1120 Avenue of the Americas, 4th Floor, New York, NY 10036

---

## File map

All production files live in the project root unless noted.

| File | Nav active | Notes |
|------|------------|-------|
| `index.html` | Home | |
| `solutions.html` | Solutions | |
| `insights.html` | Insights | |
| `about.html` | About Us | |
| `results.html` | What We Do | |
| `ad-insights-hub.html` | Ad Insights Hub | |
| `adpros.html` | (none) | Footer-linked |
| `careers.html` | (none) | Util bar-linked |
| `connect.html` | Connect | |
| `sitemap.html` | (none) | Footer-linked |
| `team/*.html` | (none) | 30 individual bio pages |

**Source files (do not edit — originals):** all client-supplied reference material lives in `internal-assets\` (not part of the site build; excluded from the demo zip).
- `internal-assets\Brand Guidelines & Resources\AP Website Copy Master Document.md` — content/copy brief
- `internal-assets\Brand Guidelines & Resources\AP_Website_Global_Branding_Guidelines_WIP_Shared.docx`
- `internal-assets\Brand Guidelines & Resources\AP_Brand_Guidelines_MAY_2026.pptx`
- `internal-assets\Brand Guidelines & Resources\AP Logos\` — source logo files (production copies live in `assets/images/`)
- `internal-assets\Team Bios Headshots\` — July 2026 team bio/headshot refresh source (pptx, headshot PNGs, and the `people.json` + generator scripts used to build `team/*.html`)

---

## Decisions & conventions

### Branding guidelines
All design work must conform to the brand guidelines in `internal-assets\Brand Guidelines & Resources\`. There are two source docs — **`AP_Brand_Guidelines_MAY_2026.pptx` is the newer and more authoritative one** ("Updated by Marketing May 2026"), superseding the older `AP_Website_Global_Branding_Guidelines_WIP_Shared.docx` wherever they conflict. Note the pptx itself is still WIP in places — slide 37 has an open "Voice & Tone" questionnaire still being answered by leadership, and a few appendix slides (60, 66) have unfilled placeholder text (`asdf`, `Insert subtitle`). Treat it as the current best source, not a finished spec.

Before introducing new colors, typography, iconography, hex orientations, logo usage, or spacing patterns, consult these docs. Key items already called out as pending implementation: horizontal hexagon orientation in hero sections, transparent border-only hex variants, and correct clear-space rules around the AP logo.

### CSS source of truth
`index.html` is the authoritative CSS template. Every sub-page `<head>` contains the full homepage CSS verbatim, with a second `<style>` block appended for page-specific rules. If the design system changes, update `index.html` first, then propagate to all other pages.

### Brand palette
The CSS variables already in `index.html` map to the official palette below (from `AP_Brand_Guidelines_MAY_2026.pptx`). Two of the site's teal variables are off by one hex digit from the deck's official values (`--teal-1`/`--teal-4` vs. Teal 5/Teal 2 below) — cosmetically identical, not worth a mid-project churn to "fix," but use the deck's exact hex if asked to match brand assets precisely (e.g. exporting a graphic to hand back to the client).

**Blue family** — structure, backgrounds, sequential charts
```
Blue 1   #92ACEE   sequential step 4              → --navy-6
Blue 2   #576FD2   sequential step 3              → --navy-5
Blue 3   #303EAD   sequential step 2              → --navy-4
Blue 4 ★ #212E80   PPTX Dark 1 · main bg          → --navy-3
Blue 5   #101B5F   PPTX Dark 2 · footer           → --navy-2
Blue Light #D6E1FF sequential step 5 · bg only    → --navy-7
```
**Teal family** — primary accent ramp, charts, eyebrows, hexagons
```
Teal 1   #84B8BF   hexagons · stat boxes · chart light fill
Teal 2   #4DA0AC   PPTX hyperlink · diverging step 2   (site --teal-4 is #4DA0AD, 1 digit off)
Teal 3 ★ #0B8395   PPTX Accent 1 · primary accent      → --teal-3
Teal 4   #10697F   diverging slight-positive           → --teal-2
Teal 5   #14546D   deepest teal · rare                 (site --teal-1 is #13536D, 1 digit off)
```
**Purple family** — diverging-negative anchor, hex decoration, 3rd categorical series
```
Purple 1   #E1D2ED   light bg wash only
Purple 2   #BFA5D4   diverging slight-negative
Purple 3   #9778B2   hex decoration · mid purple
Purple 4 ★ #806399   PPTX Accent 5 · 3rd categorical series · diverging (−) anchor
Purple 5   #553F6A   diverging most-negative anchor
```
**Neutrals** — text, borders, chart fills, surfaces
```
Neutrals 1 ★ #E4EBF1   PPTX Light 2 · slide bg        → --gray-5
Neutrals 2   #D0D5DD   hairline rules · table borders
Neutrals 3   #B2B8C0   diverging neutral (gray middle)
Neutrals 4   #8C97A2   captions · muted labels
Neutrals 5 ★ #676E7B   PPTX Accent 6 · body copy ink  → --gray-1
```
**Accents**
```
Magenta ★ #DA0058   PPTX Accent 2 · CTA · negative STATE     → --accent-magenta
Orange ★  #F4A046   PPTX Accent 4 · 4th categorical series   → --accent-orange
Yellow    #EDD91A   hero stat on social tiles · not in PPTX theme
Green ★   #2CA074   PPTX Accent 3 · positive callouts
Peri ★    #9099CF   PPTX Followed Link · decrease bar
```
**Chart-only colors** — YoY / delta bars exclusively, never for absolute totals
```
Chart Green  #00AA49   YoY gain · positive delta
Chart Red    #C00000   YoY loss · negative delta
```
⚑ Magenta ≠ Chart Red: Magenta = negative **state** (something is bad now); Chart Red = negative **change** (something got worse). Don't use interchangeably.

**Chart palette rules** (from the deck's decision matrix — relevant if a page ever adds a data chart, e.g. results/insights):
- **Diverging** (sentiment, Likert, agree/disagree, tariff-style pos↔neg): Teal 3/4 for positive, Purple 4/1 for negative, Neutrals 3 for the middle. Never use navy as a diverging endpoint — navy is reserved for chrome (nav/headers/structure).
- **Sequential** (single metric ranked by magnitude — brand health, share of voice): the navy ramp (Blue 5 → Blue Light), darker = more. Always order bars high→low.
- **Categorical** (non-comparable groups — competitors, channels, segments): Blue 4, Teal 3, Purple 4, Orange, Magenta in that order so adjacent categories never share a hue.
- **Positive/negative deltas** (YoY change, wave-over-wave): Chart Green / Chart Red only, never for absolute totals.

### Brand voice (from the same deck)
Intelligent, credible, modern, insight-driven — research-backed authority, not hype. Five characteristics: insight-led, clear & concise, credible & data-backed, strategic (not sales-heavy), modern & conversational. Prefer phrasing like "Research suggests…" / "Data points to…" over "Best-in-class solutions" or "Contact us today!" Relevant to any future blog/insights copy (see `blog/single.html`, `blog/category.html` templates).

### Imagery rules
No screenshots, no low-quality images, no people/faces in photos (people in the far distance is OK). AI-generated imagery is allowed but the brand guidelines must be included in the prompt (called out as crucial for LinkedIn posts specifically). Check the client's imagery folder before generating anything new.

### Logo files
- **Nav (white bg):** `assets/images/AP-Master-Logo-RGB.png` — full color, 44px height
- **Footer (dark navy bg):** `assets/images/AP-Master-Logo-KO.png` — knockout/white, 40px height

### Navigation structure

Primary nav:
- Home → `index.html`
- What We Do → `results.html`
- Solutions → `solutions.html`
- Insights → `insights.html`
- Ad Insights Hub → `ad-insights-hub.html`
- About Us → `about.html`
- Connect → `connect.html`
- Hub Login → `https://www.apinsightshub.com/member-login/` (external, `target="_blank"`)

Utility bar: News → `insights.html` · Careers → `careers.html`

### Hero sections
- **Homepage:** `<section class="hero">` with taller padding
- **Sub-pages:** `<section class="hero compact">` with `.hero.compact{padding:64px 32px 80px}`
- `.hero-grid` uses `align-items:start` (not center) — keeps eyebrow pill at consistent vertical position

### Project Guide / sitemap maintenance
`sitemap.html` serves as the **Project Guide** (its display name) — a human-readable reference for the client covering all pages, outstanding assets, and integration requirements. **Any time a page is added, removed, or renamed, `sitemap.html` must be updated to match.** This includes team bio pages under `team/`. The "Client Action Required" section at the bottom tracks the OG image and HubSpot form embed codes still needed.

### Material Icons
Loaded on all pages that use icons (index, ad-insights-hub, adpros, careers, connect, results):
```html
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet">
```
If new pages add icons, add this `<link>` to those pages too.

### Mega CTA hex z-index fix
`.mega-cta-card` has `isolation:isolate` and `.mcta-hex` has `z-index:-1` to prevent decorative hex shapes from overlapping CTA buttons. Applied to: about, adpros, index, insights, solutions.

### Staff photos
As of the July 2026 bio/headshot refresh, 29 of 30 team photos are local circular PNGs in `assets/images/team/{slug}.png` (sourced from the client's `internal-assets\Team Bios Headshots\Updated Headshot Frames` folder, already framed to brand). Tricia Hoff is still hotlinked from `https://www.advertiserperceptions.com/wp-content/uploads/2025/01/Tricia-Hoff-1.png` (no new headshot supplied). If the client uploads new/updated photos, replace the PNG in `assets/images/team/` — paths in `about.html` and `team/*.html` don't need to change unless the filename changes.

3 people from that round are not yet built (see `sitemap.html` → Client Action Required): Barbara Leung (no bio), Janine Mitrano (no headshot), Andrew Oates (no title).

### External links wired
- Hub Login → `https://www.apinsightshub.com/member-login/`
- LinkedIn footer → `https://www.linkedin.com/company/advertiser-perceptions`
- Staff photos → AP live site (see above)

### HubSpot forms
Forms on this site are implemented via HubSpot JS embed — no backend required. Each form is a `<div>` target plus an inline `hbspt.forms.create()` call. The HubSpot embed script goes in `<head>`:
```html
<script charset="utf-8" type="text/javascript" src="//js.hsforms.net/forms/embed/v2.js"></script>
```
Each form target in the HTML:
```html
<div id="hs-FORMNAME-form"></div>
<script>
  hbspt.forms.create({ region:"na1", portalId:"50601802", formId:"FORM_GUID", target:"#hs-FORMNAME-form" });
</script>
```

**Portal ID: `50601802`** (confirmed)
**Finding Form GUID:** HubSpot → Marketing → Forms → open form → GUID is in the URL: `app.hubspot.com/forms/50601802/editor/GUID-HERE/edit/form`

**Forms needed (GUIDs still required):**
| Page | Purpose | GUID |
|------|---------|------|
| `connect.html` | Contact / Demo Request | _pending_ |
| `ad-insights-hub.html` | Hub Membership Inquiry | _pending_ |
| `insights.html` | Newsletter Signup | _pending_ |

### Footer legal links
Privacy Policy and Website Accessibility Statement link out to the live pages on advertiserperceptions.com (external, `target="_blank"`) rather than local pages — no local versions are planned. No X/Twitter footer link exists (client no longer maintains that platform).

---

## Demo deployment

Zip: `index.html` + all `*.html` files + `team/` folder + `assets/` folder. All paths are relative. External dependencies: Google Fonts CDN (Poppins + Material Symbols) and hotlinked staff photos from advertiserperceptions.com.
