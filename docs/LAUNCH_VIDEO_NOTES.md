# Launch video — research notes (PRIVATE, Phase 6 Part B)

**Status: research only. NOTHING from this video is shown on the site** until the owner confirms it. The video file (`docs/inputs/launch-video.mp4`) is gitignored, never embedded, and none of its frames or audio are reused anywhere.

## Metadata (read from the public, logged-out post page on 2026-11-04)

| Field | Value |
|---|---|
| URL | https://www.instagram.com/p/De2O1q4slGM/ (owner-supplied) |
| Accounts | collaboration post by **@kadawmiloud** ("kadaWmiloud \| قادة و ميلود") **and @hipzdrink** |
| Launch post date | **2026-10-23 18:47 UTC** (visible post date; this is the *post* date, not a confirmed launch date) |
| Type / audio | video post, "Original audio" |
| Duration | 111.5 s; video 1916×1078 (VP9), audio AAC 44.1 kHz |
| Engagement shown | 111K likes, 2,672 comments (snapshot) |
| Tags / mentions | caption mentions @hipzdrink; emoji 🍋🍑 |

**Caption (exact, as posted; the account wrote both languages):**

> سمحولنا على كل لحظة خلّعناكم فيها وقلّقتو علينا ❤️ / حبّينا نشاركوكم حلم خدمنا عليه من قلوبنا، بطريقة تبقى محفورة في الذاكرة. / خاطر الصحبة الحقيقية ماشي غير كلمة… هي لحظات، ذكريات وحكايات تجمعنا ❤️. / واليوم، بكل فخر وحب، نقدّمولكم HIPZ 🍋🍑 / مع هايبز، ديما صحاب❤️.
>
> We're truly sorry for every moment we made you worry about us. ❤️ / We wanted to share a dream we've poured our hearts into, in a way you'd never forget. / Because true friendship is more than just a word… it's the moments, memories, and stories that bring us together. ❤️ / Today, with love and pride, we finally introduce HIPZ! 🍋🍑 / HIPZ, Always Friends. ❤️ / @hipzdrink

**Visible comments:** not recorded here (they are third-party content; only the comment count above is kept).

## How it was obtained
- `yt-dlp` (open source, **no login, no cookies**) on the public post URL: **worked** (video + audio streams merged, 17.9 MB). No downloader site was used.
- Pacing: one page visit for metadata, one yt-dlp request.

## Visual summary (frames every 1.5 s, viewed by hand; no OCR needed)
A scripted short film, not a documentary: a staged boxing bout in a gym (two boxers, a referee, a ringside commentator with a headset), intercut with children playing (garden, video games, bicycles), the boxers bruised (stage make-up), a child handing over Hipz bottles; a rooftop scene in a city with two men talking and drinking from Hipz bottles; then friends at a ping-pong table, older men playing dominoes, people drinking Hipz; it ends with the **Lemon** and **Peach** bottles in an orchard and the Hipz logo with its smile. **No burned-in subtitles or captions** were found in the frames (only the bottle labels and logo), so no OCR was run. Other brands visible: boxing-glove and sportswear logos; children appear on screen.

## Speakers (no face recognition)
No caption or on-screen name identifies who speaks. Labels are by role only: **A** = ringside commentator (headset), **B** = voice-over narrator, **C/D** = the two men in the rooftop scene. The commentator announces a bout "between Kada and Miloud", but nothing visible verifies which person on screen is Kada or Miloud, and the height rule cannot be applied (the rooftop men are filmed separately). **Speakers are therefore not attributed.**

## Transcription
- Tool: **faster-whisper 1.2.1** with **Systran/faster-whisper-large-v3** (Whisper large-v3, multilingual, CTranslate2 conversion, 2.9 GB — already in the local Hugging Face cache, so nothing was downloaded), CPU int8, beam 5, VAD filter, word timestamps, temperature 0.
- Runs: language auto-detect (→ Arabic, p = 0.966; next: English 0.012, French 0.005) and forced Arabic. **Both gave identical text.**
- Quality: mean word probability 0.76; 14 of 181 words below 0.45 (marked `[unclear?]`, or `[unclear]` below 0.2). Whisper writes Algerian darija in Arabic script and spells French loanwords phonetically (e.g. "بيلونسو بروجي" ≈ "lancer projet"?). **Accuracy limits:** large-v3 is not trained for darija; misheard words can look confident; music covers parts (the 00:54–01:04 segment probably holds more speech than recognised; 01:33–01:51 is music only). Nothing was "fixed" by hand.

### Transcript (original language, machine output)

| Time | Text |
|---|---|
| 00:03.76–00:10.96 | ازاي [unclear?] المشاهدين كلكم الدائرين رسميا اطلق النزال ما [unclear?] بين قادة تعقاد و ميلود و ميلود تعقاد و ميلود |
| 00:13.95–00:19.53 | كي كنا صغار بقاش على بنا من اللي كل ضحكات حكناها يجي نهان نتمنى و نعيشوها مجددا |
| 00:19.53–00:29.32 | و فهمنا انهم شو [unclear?] الدكرايات اللي تهم انما الانسان اللي عيشتهم معاهم |
| 00:29.32–00:31.68 | قادة يأكد باللي راحنا مازال و يرد بيلك ما [unclear?] |
| 00:33.79–00:36.89 | مي مين ذاك لأسباب او اخرى لعباد يتفق |
| 00:36.89–00:40.79 | ازاي المشاهدين تزداد عدة النزال و مازال معرفناش لمن الغلبة |
| 00:40.79–00:42.39 | [unclear] واحد يرفضه |
| 00:42.39–00:43.79 | بالصحيح |
| 00:43.79–00:45.85 | لو [unclear?] كان هذا الزوج يجمع بيناتهم بحاجة ريال |
| 00:45.85–00:47.13 | مهما يطولوا |
| 00:47.76–00:49.27 | مهما يشرقوا ولا يغربوا |
| 00:53.56–00:54.12 | جامد |
| 00:54.12–01:03.87 | وهذا هو شعارنا في آيبس |
| 01:03.87–01:05.27 | مشروعنا جديد |
| 01:06.25–01:07.29 | حبا قوش |
| 01:07.29–01:08.05 | حبا دروات |
| 01:08.05–01:09.61 | جبت سكيفين تاك دروب أومانتو |
| 01:09.61–01:10.83 | زيدا حبا دروات |
| 01:10.83–01:11.65 | راه طايح |
| 01:11.65–01:12.39 | لا [unclear?] بواصن |
| 01:12.39–01:13.39 | آيبس تخرج في يده |
| 01:13.39–01:13.95 | يشوف فيها |
| 01:13.95–01:14.89 | يشوف كاميرا |
| 01:14.89–01:15.45 | بصحتك |
| 01:16.50–01:17.45 | عزباتك شدي تاني؟ |
| 01:17.45–01:19.11 | لا بركة مزعقة تاك |
| 01:19.11–01:22.21 | بيلونسو بروجي سري ولا [unclear?] مولو [unclear?] نزعقو هنان مولو ندابزو نتناوشو كي صغار |
| 01:22.21–01:23.55 | [unclear] شبه [unclear?] تولي اخر منهم قاع؟ |
| 01:23.55–01:25.35 | ليريجي [unclear?] رايدير هاكا ولونسي بروجي |
| 01:25.35–01:26.13 | اديها راميطو |
| 01:26.13–01:27.11 | لا ماديرو مش كيما هاك |
| 01:27.11–01:28.39 | مش [unclear?] كيما هاكا مش عصو بوان [unclear?] |
| 01:28.39–01:29.67 | شو؟ غاني ندرو عفصة شابة |
| 01:29.67–01:30.51 | عفصة كوميرسيال |
| 01:30.51–01:31.63 | بحكمو غروب تاع صحاب |
| 01:31.63–01:32.85 | ونعطوهم القرع |

### English translation — UNVERIFIED MACHINE-ASSISTED TRANSLATION
Translated from the machine transcript above (not from a human listening). Darija idioms and French loanwords are guessed; anything uncertain is marked. **Do not quote or publish.**

| Time | Translation (unverified) |
|---|---|
| 00:03.76–00:10.96 | [Speaker A, ringside commentator with headset] "Dear viewers, all of you [unclear] — officially, the bout between Kada and Miloud begins: Kada vs Miloud, Miloud vs Kada." (the repeated names are [unclear?] in form) |
| 00:13.95–00:19.53 | [Speaker B, voice-over] "When we were little, [unclear: nothing was left to us?] of all the laughs we shared … [unclear] we wish we could live them again," |
| 00:19.53–00:29.32 | [B] "and we understood that it isn't the memories that matter, but the person you lived them with." |
| 00:29.32–00:31.68 | [A?] "Kada insists that we are still … and [the other] answers you …" [unclear] |
| 00:33.79–00:36.89 | [A?] "… for one reason or another, people [unclear: (don't) agree]." [unclear] |
| 00:36.89–00:40.79 | [A] "Dear viewers, the bout is getting more intense and we still don't know who will win." |
| 00:40.79–00:42.39 | [B?] "[unclear] … each one refuses it(?)" |
| 00:42.39–00:43.79 | [B] "Truly." |
| 00:43.79–00:45.85 | [B] "If this pair is bound by something real," |
| 00:45.85–00:47.13 | [B] "however long it lasts(?)," |
| 00:47.76–00:49.27 | [B] "wherever they go, east or west," |
| 00:53.56–00:54.12 | [B] "Strong." |
| 00:54.12–01:03.87 | [B] "And this is our slogan at Hipz." (the 10 s span probably holds more speech/music that was not recognised) |
| 01:03.87–01:05.27 | [B] "Our new project." / "Our project is new." |
| 01:06.25–01:07.29 | [Rooftop scene, speakers C/D] "He wants … [unclear]" |
| 01:07.29–01:08.05 | [C/D] "He wants … [unclear]" |
| 01:08.05–01:09.61 | [C/D] "I brought … drop … moment(?)" [French words? unclear] |
| 01:09.61–01:10.83 | [C/D] "More, he wants …" [unclear] |
| 01:10.83–01:11.65 | [C/D] "He's fallen / it's dropped." |
| 01:11.65–01:12.39 | [C/D] "No … [unclear]" |
| 01:12.39–01:13.39 | [C/D] "Hipz comes out in his hand," |
| 01:13.39–01:13.95 | [C/D] "he looks at it," |
| 01:13.95–01:14.89 | [C/D] "looks at the camera —" |
| 01:14.89–01:15.45 | [C/D] "Cheers!" (lit. 'to your health') |
| 01:16.50–01:17.45 | [C/D] "Are you … again?" [unclear] |
| 01:17.45–01:19.11 | [C/D] "No … [unclear]" |
| 01:19.11–01:22.21 | [C/D] "… we launch a secret project (French 'lancer projet secret'?), or we shout here, we argue, we squabble like kids" |
| 01:22.21–01:23.55 | [C/D] "[unclear] … will all of them become …?" |
| 01:23.55–01:25.35 | [C/D] "… like this, and launch the project" [French words? unclear] |
| 01:25.35–01:26.13 | [C/D] "Give it … [unclear]" |
| 01:26.13–01:27.11 | [C/D] "No, don't do it like that." |
| 01:27.11–01:28.39 | [C/D] "Not like that, not … [unclear]" |
| 01:28.39–01:29.67 | [C/D] "What? We'll do something cool —" |
| 01:29.67–01:30.51 | [C/D] "a commercial thing (French 'commercial')" |
| 01:30.51–01:31.63 | [C/D] "we take a group of friends" |
| 01:31.63–01:32.85 | [C/D] "and give them … [unclear]" |

## Candidate facts (NONE shown on the site; for the owner to confirm)

| # | Candidate | Where | Confidence | Relation to confirmed facts |
|---|---|---|---|---|
| 1 | Slogan **"HIPZ, Always Friends."** / **«مع هايبز، ديما صحاب»** | caption (exact text); speech 00:54 "this is our slogan at Hipz" | medium (caption text is exact; that it is the official slogan is unconfirmed) | new; consistent |
| 2 | The duo call Hipz their **new project** and "a dream we've poured our hearts into" | speech 01:03.9; caption | medium (speech) / exact (caption wording) | consistent with "owners of @hipzdrink" |
| 3 | Two flavors, **Lemon** and **Peach** | bottles on screen 01:04–01:06 and 01:46–01:50; caption 🍋🍑 | high (visible) | **supports** confirmed fact 2 |
| 4 | Hipz comes in **PET bottles** | bottles on screen | high (visible) | **supports** confirmed fact 3 (330 ml is not readable on screen) |
| 5 | Launch post co-published by @kadawmiloud and @hipzdrink | post page | high (visible) | **supports** confirmed fact 1 |
| 6 | **Launch post date** 23 October 2026 | post page | high (visible post date) | new; a post date, NOT a confirmed launch/founding date |
| 7 | Theme: childhood friendship — "it isn't the memories that matter, but the person you lived them with" | speech 00:13.9–00:29.3 (voice-over) | low–medium (dialect STT) | new (brand idea, not a fact) |
| 8 | The video stages a "bout between Kada and Miloud" and the caption apologises for making fans worry (a staged rift before the reveal?) | speech 00:03.8, 00:36.9; caption | low (interpretation) | new; not a fact to publish |
| 9 | A "secret project" and "a commercial thing with a group of friends" | speech 01:19–01:31 | low | new; unclear |
| — | Plant, city, capacity, founding year, sales, numbers, goals | — | **not mentioned** | — |

Proposals for `src/data/story.js` fields: see `docs/STORY_PROPOSALS.md` (proposals only, nothing in code).
