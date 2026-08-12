# DaVinci Resolve handoff (free edition)

Everything here works in the free version. Studio-only shortcuts are noted at
the bottom; nothing in this workflow depends on them.

## Before importing anything

**Set the timeline frame rate first, and make it match `--fps`.** Resolve's
project frame rate cannot be changed once media is in the timeline, and an EDL
built at 30fps imported into a 24fps timeline puts every marker in the wrong
place. Default here is 30.

**Know your timeline start timecode.** Resolve timelines start at `01:00:00:00`
by default, not zero. That is why `--tc-start` exists and defaults to one hour.
An EDL whose timecodes fall outside the timeline's range imports silently and
does nothing — this is the single most common reason markers "don't appear."

## Track layout

Build the timeline this way and every cue already knows where it goes — the
`resolve_track` column in `shots.csv` is computed from it.

```
V4 — Titles & graphics       A4 — SFX 2
V3 — Screen recordings       A3 — SFX
V2 — B-roll                  A2 — Music
V1 — A-roll / spine          A1 — VO
```

The principle: audio on A1 is the spine and everything is cut against it.
B-roll layers above, trimmed to start slightly before and end slightly after the
cut it's covering. Rename the tracks in Resolve to match — it costs thirty
seconds and makes the shot list directly actionable.

## Importing markers

1. Media Pool → right-click the timeline → **Timelines > Import > Timeline
   Markers from EDL**
2. Select `videos/<slug>/build/markers.edl`

Gotchas, in the order they bite:

- Frame rate mismatch → markers land at the wrong times.
- Timecode outside the timeline range → nothing imports, no error.
- The timeline must be long enough to contain the markers. Drop the VO (or a
  placeholder of roughly the right length) on the timeline first.
- Special characters in marker names may not survive the round trip.

## Marker colours

| Colour | Means |
| --- | --- |
| Cyan | chapter boundary |
| Purple | motion graphic or chart slot |
| Yellow | B-roll / screen / still cue |
| Red | unsourced — needs a source before it ships |
| Green | locked |

The build tool emits cyan, purple, yellow, and red. Red is applied
automatically to any cue that pulls in outside material and has no `src:` — so
after import, **every red marker on the timeline is an open question**, and the
timeline itself becomes the to-do list.

Green is for you to apply by hand as chapters lock.

Resolve names these `ResolveColorCyan`, `ResolveColorPurple`, and so on in the
EDL. Resolve has sixteen marker colours; the five above are the ones this
workflow uses. **Confirm the exact colour names in your install's marker dialog
before relying on them** — I could not verify the full sixteen-name list against
Blackmagic's own documentation, and a wrong name in an EDL comment is the kind
of thing that fails quietly.

## Recording the voiceover

Read from `build/script.vo.txt`. Markers are stripped so your eye can't trip on
them; chapter rules stay because you record chapter by chapter.

- **Record by chapter.** Not the whole video (one flub costs the take) and not
  sentence by sentence (the performance goes flat). Chapter-sized takes match
  the marker boundaries, so a retake replaces exactly one region.
- **Punch and roll within a chapter.** Back up a sentence, punch in on the flub,
  keep going. Standard solo technique and much faster than retaking.
- **Record a scratch pass first.** A fast, unpolished full read, dropped on the
  timeline. Cut picture against it. It exposes pacing and length problems before
  you commit to a performance take, and it costs ten minutes.
- `**Bold**` in the script marks vocal stress. `…` is a short pause, `/` a
  longer break, `//` a full stop and breath.
- `node videos/_tools/build.mjs videos/<slug> --clean` drops the chapter rules
  if you're feeding the text to a TTS tool rather than reading it.

## After recording: exact timecodes

Estimated timecodes drift — they're word count divided by words-per-minute, and
over twenty minutes the error compounds. Once the VO is on the timeline:

1. Read the real in-point of each chapter off the Resolve timecode display.
2. Write them into `videos/<slug>/build/timings.csv`:

   ```csv
   chapter,timecode
   HOOK,01:00:00:00
   CH01,01:00:45:00
   CH02,01:02:30:00
   ```

3. Re-run:

   ```bash
   node videos/_tools/build.mjs videos/<slug> --from-timings
   ```

Chapter markers become exact, and cues inside each chapter are rescaled
proportionally so they keep their position relative to the words they sit under.
Re-import the EDL (delete the old markers first — `Mark > Markers > Delete All
Markers`, or delete by colour) and the YouTube chapter block in
`build/chapters.txt` is now correct.

Timeline timecodes and video-relative ones are both accepted; the tool detects
which you wrote and says so.

## YouTube chapters

Paste `build/chapters.txt` into the video description. The three rules, which
the build tool validates:

1. The first timestamp must be exactly `00:00`.
2. At least three timestamps, in ascending order.
3. Each chapter at least 10 seconds long.

Break any of them and YouTube silently renders the block as plain text — no
chapters, no error, no indication anything went wrong. If the build tool reports
a validation failure, fix it before publishing.

## Studio-only, for reference

Not required by anything above, but they would collapse half this workflow:

- **Text-Based Editing** — transcribes clips, then you edit by editing the
  transcript.
- **AI IntelliScript** (Resolve 20) — import the script, and Resolve matches it
  against transcribed audio to assemble a timeline of best takes, with
  alternates on additional tracks. `build/script.vo.txt` is already in the right
  shape to feed it.

Both require Resolve Studio. The free edition has no speech-to-text at all, and
no external Python scripting API — which is why this workflow goes through EDL
files rather than driving Resolve programmatically.
