---
target: Огляд за місяць (4 стани)
total_score: 31
p0_count: 0
p1_count: 2
timestamp: 2026-07-17T18-14-50Z
slug: wireframes-overview-html
---
# Critique — Огляд за місяць (4 стани)

Method: dual-agent (A: design review · B: detector). Target: wireframes/overview.html + -empty/-error/-loading. Language: concept.html «Напрям 3 Ясність».

## Design Health — 31/40 (Good)

| # | Heuristic | Score | Key issue |
|---|-----------|-------|-----------|
| 1 | Visibility of status | 3 | loading skeleton had no SR status (fixed: role=status) |
| 2 | Match real world | 4 | plain UA, hryvnia, lowercase months |
| 3 | Control & freedom | 3 | success has no refresh affordance |
| 4 | Consistency | 3 | compare control = `<a>` in success vs `<button disabled>` in empty/error |
| 5 | Error prevention | 3 | disabled compare correct; no rate-limit on retry |
| 6 | Recognition | 4 | discs+icons, merchants, dates |
| 7 | Flexibility | 2 | no sync, no period picker, no list/map toggle |
| 8 | Aesthetic/minimal | 3 | zone-bar chrome competes with content |
| 9 | Error recovery | 4 | voice.md exemplar (fact+survival+exit) |
| 10 | Help/docs | 2 | no inline explanation of compare/flag threshold |

## Anti-patterns verdict
Not AI-slop. None of the banned tells (identical card grid, hero-metric template, gradient text, eyebrows, side-stripe). Restrained accent. Only source smell: 4 duplicated `:root` token blocks (drift risk; empty.html already omits `--c-*`).

Detector (exit 2): `em-dash-overuse` (overview-error) — FALSE POSITIVE, Ukrainian тире; `monotonous-spacing` (overview-loading) — benign for skeleton state.

## Priority issues
- [P1] Success state: no primary/refresh action while data is bank-synced & can be stale. Fix: add quiet ghost «Оновити» in period zone. → needs markup/copy (frozen).
- [P1] Compare control element inconsistent across states (a vs button). Fix: unify element + aria-disabled. → defensible as-is (availability differs).
- [P2] Double labeling: grey zone-label duplicates each `<h2>`. Scaffolding; must drop in production spec.
- [P2] Error/empty «топ витрат» zone is a bare failure sentence with no exit. Fix: page-level retry or repeat exit. → needs copy/markup (frozen).
- [P3] 4× duplicated token blocks. Fix: extract shared tokens.css → belongs to tokens/ step.

## Persona red flags
- Jordan: coral «більше ніж у травні» flag and «Порівняти з травнем» assume prior-month data exists; need first-run rule.
- Sam: skeletons aria-hidden with no live status (FIXED role=status); `<a>` disabled semantics in success; verify .muted small-text contrast at render.
- Casey: top-only nav = thumb stretch (desktop-primary, acceptable); verify .card-link ≥44px touch target on mobile.

## Minor
- Demo data: «Інше» is #1 category (24%) — undersells categorization value.
- Percentages sum to 89% with no tail row.
- overview-empty footer copy «в дереві зліва» is stale.
