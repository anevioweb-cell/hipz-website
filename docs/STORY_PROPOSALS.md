# Story page — proposals from the launch video (NOT in code)

Source: `docs/LAUNCH_VIDEO_NOTES.md` (launch post https://www.instagram.com/p/De2O1q4slGM/). Every item below stays **out of `src/data/story.js`** until the owner confirms it. Once confirmed, add it with `verified: true`; the page renders video-sourced entries only when `verified` is true.

| Field in `story.js` | Proposed value | Source | Confidence | Needs from the owner |
|---|---|---|---|---|
| `tagline` (new optional field) | en: "HIPZ, Always Friends." · ar: «مع هايبز، ديما صحاب» | caption, written by the account; speech 00:54 | medium | Is this the official slogan? Exact Arabic spelling? |
| `quotes[0]` | original: «واليوم، بكل فخر وحب، نقدّمولكم HIPZ» · translation: "Today, with love and pride, we finally introduce HIPZ!" (the account's own English) | caption | exact text; attribution "Kada & Miloud" (account) | OK to quote? Attributed to both? |
| `quotes[1]` | original: «خاطر الصحبة الحقيقية ماشي غير كلمة… هي لحظات، ذكريات وحكايات تجمعنا» · translation: "Because true friendship is more than just a word… it's the moments, memories, and stories that bring us together." | caption | exact text | OK to quote? |
| `originNote` | "Hipz is Kada & Miloud's new project — a dream they say they poured their hearts into." | speech 01:03.9 + caption | medium | Confirm the wording; anything about why/how it started (not in the video) |
| `milestones[0]` | `{ label: 'Launch post', date: '2026-10-23', … }` | visible post date | high (as a post date only) | Is this the official launch date? Otherwise keep the label "launch post" |
| `plantName` / `plantCity` | — | not mentioned | — | Owner only |
| `foundedYear` | — | not mentioned | — | Owner only |

Not proposed: the staged "bout", the "secret project" lines and the childhood voice-over (too uncertain in dialect speech-to-text, and they describe the film, not the brand).
