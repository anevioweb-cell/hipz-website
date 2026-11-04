# Font licenses

All five families are self-hosted (served from our own origin through the `@fontsource*` npm packages, which package the Google Fonts files; no request to Google at runtime). Each license was checked on the official Google Fonts repository (`github.com/google/fonts`, `ofl/<family>/OFL.txt`) on 2026-11-03, and the npm packages declare `OFL-1.1` as well.

| Role | Family | Copyright holder (from OFL.txt) | License | Subsets shipped |
|---|---|---|---|---|
| Display (Latin) | Bricolage Grotesque (variable, wght) | The Bricolage Grotesque Project Authors (2022) | SIL OFL 1.1 | latin |
| Body | Inter (variable, wght) | The Inter Project Authors (2020) | SIL OFL 1.1 | latin |
| Mono labels | DM Mono 400, 500 | The DM Mono Project Authors (2020) | SIL OFL 1.1 | latin |
| Arabic display accent | **Baloo Bhaijaan 2** 800 (since Phase 5; replaced Lalezar) | The Baloo 2 Project Authors (2019) | SIL OFL 1.1 | arabic only |
| Arabic body accent | Cairo (variable, wght) | The Cairo Project Authors (2009) | SIL OFL 1.1 | latin, arabic |

OFL 1.1 permits commercial use, embedding and self-hosting; the fonts must not be sold on their own, and reserved font names apply if modified. We do not modify them. Keep this file and the OFL texts available (they ship inside `node_modules/@fontsource*/LICENSE`).

Results: all five are clearly open — no substitutions were needed.

Logo lettering: the real Hipz logo is custom hand-lettering (bubbly white wordmark with a smile curve). It is **not** imitated by any of these fonts. The navbar/footer show a plain-text PLACEHOLDER "Hipz" until the logo file is supplied.

Not checked: Arabic glyph quality of Lalezar/Cairo for specific Algerian words — to be reviewed visually once copy exists.

## Phase 5 — Arabic display font review

Every Arabic string on the site (هايبز, ليمون, خوخ, عطشان؟, ماتش, طريق, لمّة, راحة, ليمون أو خوخ) was rendered at 64 px (display) and 18 px (body) in five open fonts: `docs/shots/arabic-check.png`.

| Candidate | License (checked on github.com/google/fonts `ofl/<family>/OFL.txt`, 2026-11-04) | Notes |
|---|---|---|
| Lalezar 400 (previous) | SIL OFL 1.1 — The Lalezar Project Authors (2015) | Joins are correct, but its final teh marbuta (ة) is a tiny closed loop pushed above the baseline, so **راحة** reads like "راح،" at display size — the owner's observation is confirmed. Single weight. |
| Cairo Black 900 | SIL OFL 1.1 — The Cairo Project Authors (2009) | Clean, very heavy and wide; feels corporate next to the rounded logo. |
| Rubik 800 | SIL OFL 1.1 — The Rubik Project Authors (2015) | Good shaping; geometric, a bit cold. |
| **Baloo Bhaijaan 2 800** | SIL OFL 1.1 — The Baloo 2 Project Authors (2019) | Rounded, bubbly strokes that match the Hipz wordmark and Bricolage; every join, dot and the ة in راحة read correctly; dots sit well clear of the baseline. |
| Reem Kufi 700 | SIL OFL 1.1 — The Reem Kufi Project Authors (2015–2022) | Kufic style, too formal; final forms (خوخ) stretch oddly at display size. |

**Decision:** Baloo Bhaijaan 2 ExtraBold (800) for **display** Arabic only (`.ar-display`, token `--font-arabic-display`), self-hosted from `@fontsource/baloo-bhaijaan-2`, Arabic subset only (21 kB woff2, vs 52 kB for Lalezar's Arabic file). Body Arabic stays Cairo. Lalezar was removed.
