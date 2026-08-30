# Favicon Changer (personal Edge extension)

A small local extension that lets you override the favicon (tab icon) shown
for any website you visit. Your choice is remembered per-site and reapplied
automatically whenever you come back.

## Load it into Edge

1. Open Edge and go to `edge://extensions`.
2. Turn on **Developer mode** (toggle in the bottom-left of the sidebar).
3. Click **Load unpacked**.
4. Select this folder (`favicon-changer-extension`).
5. The extension appears in your toolbar. Pin it if you want quick access
   (puzzle-piece icon → pin next to "Favicon Changer").

That's it — no build step, no dependencies.

## Using it

1. Go to any website.
2. Click the extension icon in the toolbar.
3. Pick a new favicon one of three ways:
   - Click one of the emoji presets.
   - Paste an image URL into the **Image URL** field and press Enter/Tab.
   - Upload a local image file with **Or upload an image**.
4. Click **Apply to this site** — the tab icon updates immediately and the
   choice is saved for that site (matched by hostname, e.g. `example.com`).
5. To go back to the site's real favicon, open the popup on that site and
   click **Reset** — the tab reloads and the override is cleared.

Your per-site favicon choices are stored locally in the browser
(`chrome.storage.local`) and never leave your machine.

## Notes / known limitations

- Some sites set their favicon dynamically via JavaScript after the page
  loads. The extension watches for that and re-applies your override, but a
  site that keeps re-setting its icon on a timer could occasionally flicker
  back — reopening the popup and clicking Apply again fixes it.
- Overrides are per-hostname, so `mail.example.com` and `example.com` are
  treated as separate sites.
- Because this is loaded as an unpacked extension, Edge will show a
  "Developer mode extensions" warning banner — that's expected for local,
  non-Store extensions and is safe to ignore.
- If you ever reset your browser profile or move this folder, you'll need
  to re-load it via `edge://extensions` (unpacked extensions are tied to
  the folder's location on disk).

## Updating

If you edit `content.js`, `popup.js`, `popup.html`, or `manifest.json`,
go to `edge://extensions` and click the refresh icon on the Favicon Changer
card to pick up the changes (already-open tabs need a reload too).
