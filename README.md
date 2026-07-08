# M1 Qualifying Board Card Generator

Single-file AI fan experience app for the American Speed Festival. Fans upload/take
a photo, pick a racing class, and get an AI-composited image of themselves on a
mocked-up trackside qualifying/timing tower board with a fictional lap time and
grid position.

## Stack
- Single static `index.html` (no build step)
- fal.ai (`flux-pro/kontext/multi`) for AI image compositing
- Vercel for hosting
- Embedded into HubSpot via a Custom HTML iframe using a `postMessage`
  height-reporting protocol (`sendHeight()` / `m1-selfie-height`)

## Deploy
1. Push this repo to GitHub.
2. Import into Vercel (vercel.com/new) — static site, no config needed.
3. Grab the deployed `*.vercel.app` URL and embed it in HubSpot via an iframe
   pointed at that URL.

## TODO before going live
- `BOARD_BG` in the `<script>` (search for `PLACEHOLDER_TIMING_TOWER_BACKGROUND`)
  is a placeholder. Replace it with a real base64-encoded (or hosted URL)
  reference photo of an actual trackside timing tower / qualifying board.
- Confirm the `FAL_KEY` in the script is still valid / has enough credit.
- Review the T&C modal copy for the qualifying board concept (image + lap time
  are fictional/AI-generated) before the event.

## Notes
- No driver roster/second photo is used — the fan's face goes directly onto the
  board. The "class" picker (GT3, Prototype, Vintage, Time Attack, Drift,
  Burnout) only changes flavor text and the fake lap-time range, via
  `CLASS_LAP_RANGES` in the script.
- Generated boards are saved to `localStorage` (`m1_asf_qualifying_boards`) and
  looped in the bottom marquee gallery.
