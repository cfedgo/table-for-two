# Table for Two

A little collection of ad-free games for a little time together. Designed for two people sharing an iPhone or iPad, with computer opponents for solo play or teaming up.

## Games

- **Tic-tac-toe:** two players, a gentle computer, or an unbeatable computer.
- **Dots & boxes:** 2 × 2, 3 × 3, and 4 × 4 boards with automatic scoring and extra turns.
- **Checkers:** American/English rules, forced captures, multiple jumps, kings, and highlighted legal moves.
- **Hangman:** short words, picture clues, optional spoken clues, eight chances, and a secret-word mode for taking turns.

The board games have Gentle and Tricky computer settings. Games include undo and device-local saves. There are no ads, trackers, runtime API calls, application accounts, or external fonts. All gameplay runs in the browser.

## Run locally

Install Node.js 22 or newer, then run:

```sh
npm start
```

Open the local address printed in the terminal. No dependency installation or build step is required.

```sh
npm run check
```

This checks JavaScript syntax and runs the automated tests.

## Publish with GitHub Pages

1. In the repository's **Settings → Pages**, set **Source** to **GitHub Actions**.
2. Push to `main`, or run **Publish website** from the **Actions** tab.
3. The workflow runs the tests and publishes only `dist/`. Its deployment summary contains the live website link.

Pull requests run checks without deploying. Changes merged into `main` run checks and publish the updated site. No personal access token or custom secret is required by these workflows.

The app uses relative URLs, so it works at a repository path such as `/table-for-two/` as well as on a custom domain. The files in `dist/` can also be hosted by any HTTPS static host.

## Add to iPhone or iPad

1. Open the published website in Safari.
2. Choose **Share → Add to Home Screen**.
3. Turn on **Open as Web App** if offered, then choose **Add**.
4. Open the new icon online once and wait for **Ready for offline play**.
5. Try reopening in airplane mode before relying on offline play at a restaurant.

Saved games stay on each device. Clearing website data removes saves. Device speech and offline voices depend on the device's configuration.

## Project layout

```text
dist/                  Website files, published as-is
  app.js               Screens, controls, saved games, computer turns
  rules.js             Pure game rules and computer opponents
  sw.js                Offline cache
  manifest.webmanifest Home Screen app settings
tests/                 Automated checks
.github/workflows/     Pull request checks and Pages deployment
preview.mjs            Local development server
```

When changing website files, bump the cache version in `dist/sw.js`. A newly downloaded version waits until old app windows close before activating, to avoid replacing code during a game.

## Next checks and improvements

- Verify touch targets and layout on real iPhone and iPad screens.
- Verify Home Screen installation and airplane-mode relaunch on iOS.
- Tune word clues and computer difficulty after family playtesting.
- Consider Four in a Row and Memory Match next.

The rule tests and simulated application checks have passed. Actual iOS installation and offline behavior still need device testing.
