# Font licenses

All five families are self-hosted (served from our own origin through the `@fontsource*` npm packages, which package the Google Fonts files; no request to Google at runtime). Each license was checked on the official Google Fonts repository (`github.com/google/fonts`, `ofl/<family>/OFL.txt`) on 2026-11-03, and the npm packages declare `OFL-1.1` as well.

| Role | Family | Copyright holder (from OFL.txt) | License | Subsets shipped |
|---|---|---|---|---|
| Display (Latin) | Bricolage Grotesque (variable, wght) | The Bricolage Grotesque Project Authors (2022) | SIL OFL 1.1 | latin |
| Body | Inter (variable, wght) | The Inter Project Authors (2020) | SIL OFL 1.1 | latin |
| Mono labels | DM Mono 400, 500 | The DM Mono Project Authors (2020) | SIL OFL 1.1 | latin |
| Arabic display accent | Lalezar 400 | The Lalezar Project Authors (2015) | SIL OFL 1.1 | latin, arabic |
| Arabic body accent | Cairo (variable, wght) | The Cairo Project Authors (2009) | SIL OFL 1.1 | latin, arabic |

OFL 1.1 permits commercial use, embedding and self-hosting; the fonts must not be sold on their own, and reserved font names apply if modified. We do not modify them. Keep this file and the OFL texts available (they ship inside `node_modules/@fontsource*/LICENSE`).

Results: all five are clearly open — no substitutions were needed.

Logo lettering: the real Hipz logo is custom hand-lettering (bubbly white wordmark with a smile curve). It is **not** imitated by any of these fonts. The navbar/footer show a plain-text PLACEHOLDER "Hipz" until the logo file is supplied.

Not checked: Arabic glyph quality of Lalezar/Cairo for specific Algerian words — to be reviewed visually once copy exists.
