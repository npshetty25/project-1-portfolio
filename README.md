# Nirav Shetty: Portfolio

Personal portfolio for a Computer Science undergraduate (MIT Manipal, batch 2027). Plain HTML, CSS and JavaScript: no framework, no build step.

Live: https://niravshettyportfolio.vercel.app/

## What is on the page

- **Hero** with the resume download as the primary action.
- **About**: education and internships.
- **Skills**: grouped icon grid.
- **Projects**: seven projects rendered from data, with a filter, two featured case studies and a collapsible "How it works" on each card.
- **Certifications**: each links to its credential.
- **Music dock**: a corner player that picks a random track from my public Spotify playlist on every load.
- **Contact**.

Dark and light themes (persisted), keyboard focus styles, skip link and `prefers-reduced-motion` support are built in.

## Project structure

| Path | Purpose |
|---|---|
| `index_portfolio.html` | Page markup (entry point; `vercel.json` rewrites `/` to it) |
| `css/style.css` | Tokens, layout, components |
| `js/script.js` | Theme, nav, scroll reveal, counters, role rotator, sliders |
| `js/render.js` | Builds project cards, filters and the music dock from data |
| `js/data/projects.js` | **Project content.** Edit this to add or change a project |
| `js/data/playlist.js` | Snapshot of the Spotify playlist's track list |
| `assets/images/` | Profile photo and project screenshots |
| `assets/resume/` | The downloadable resume PDF |

Scripts are classic (non-module) files on purpose, so the page also works when opened straight from disk.

## Editing content

**Add a project:** add an object to `js/data/projects.js` (see the header comment there for the fields). Use only facts you can verify in the project's own repository, and set `note` to an honest status line. `groups` controls which filter chips include it.

**Update the playlist snapshot:** re-fetch the track list from the playlist's embed page and replace `tracks` in `js/data/playlist.js`.

**Replace the resume:** overwrite `assets/resume/NiravPShetty_resume.pdf`.

## Music dock: how it behaves

The dock shows the Spotify embed for one randomly chosen track plus an expandable full-playlist embed. **Spotify embeds cannot autoplay or start muted**, so the visitor presses the play button in the player. Signed-out visitors hear Spotify's 30-second previews. The dock starts collapsed on phones.

## Run locally

Open `index_portfolio.html` in a browser, or serve the folder:

```
npx serve .
```

## Deploy

The repository is connected to Vercel; pushing to `master` deploys. `vercel.json` rewrites `/` to `index_portfolio.html`.

## Known limitations

- Skill icons still load Font Awesome from a CDN. Skill names are plain text, so the grid stays readable if the CDN fails.
- QA Copilot and Windscapes have no public repository, so their cards carry no source link.
- The ODDOREVE, QA Copilot and Episode Three terminal previews are labelled as illustrative or taken from reports; they are not recordings.
- Project images are large PNGs and have not been converted to WebP yet.

## Contact

- Email: shettynirav2005@gmail.com
- GitHub: https://github.com/npshetty25
- LinkedIn: https://www.linkedin.com/in/nirav-shetty-71a707370/
