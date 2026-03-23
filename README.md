# Retro Mac OS (Browser Edition)

Retro Mac OS running entirely in the browser. This project recreates a System-7-style desktop with draggable “apps” you can launch from the menu bar or dock.

## Live Project

- `retro-os.html` (main entry): https://abhimanyumarwah.github.io/retromacos/retro-os.html

## What’s Included

The desktop provides these built-in mini-apps:

- **About This Mac**: quick info window
- **Beatbox**: step sequencer with Web Audio + export/import
- **Infinity Gauntlet**: retro-style UI/manual for the stones (opened from the dock)
- **Pixel Paint**: pixel canvas with a palette, brush size, and PNG export
- **Notes**: local notes saved to `localStorage`
- **Snake**: classic grid snake game (arrow keys)
- **iPod**: legacy iPod-style overlay UI you can drag around
- **Dream macOS**: additional “dream” window (from the menu)

## How to Use

On the Retro Mac desktop:

- Click dock icons to open apps
- Use the top menu bar to launch app windows
- Drag window title bars to reposition

For the games:

- **Snake**: use arrow keys, press **Start** / **Stop**

## Local Development (optional)

This repo is static (no build step required for the main app).

1. Start a local server:

```bash
python3 server.py 8000
```

2. Open:

```text
http://localhost:8000/retro-os.html
```

## Project Structure

- `retro-os.html`: main Retro Mac OS desktop page
- `js/retro-os.js`: all app/window logic for the desktop

## Notes

If you only care about the desktop, `retro-os.html` + `js/retro-os.js` are the key files.

## License

Educational/entertainment project. Any referenced characters/names are property of their respective owners.
