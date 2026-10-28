# For Sona — a little museum of us

A free static website built with plain HTML, CSS, and JavaScript. The sequence follows the video: glossy-heart opening, pink “I Love You” reveal, growing heart tree, gift, rose wallpaper, polaroid wall, three-knock museum door, scratch-off gallery, photo puzzle, sealed letter with a voice-note player, and promise checklist. It uses the reference's rose wallpaper and couple illustration.

## Run it on Windows

1. Install [Visual Studio Code](https://code.visualstudio.com/) if you don't already have it.
2. In VS Code, choose **File → Open Folder…** and select this `outputs` folder.
3. Open `index.html`, then double-click it in File Explorer to launch the site in your browser. For a local server, install the free **Live Server** extension in VS Code and choose **Go Live**.
4. Tap the heart once to start the opening story. The visual story scenes advance automatically. The museum door, scratch-to-reveal photos, puzzle, letter, and promise checklist wait for her interaction. Once she scratches a gallery photo, the next covered photo appears automatically after a short pause. Use the top-right music button to toggle the soundtrack.

## Make it yours

- The recipient name **Sona** appears in `index.html`; change it there if needed.
- The eight photos you shared are copied into `photos/` and used in both the polaroid wall and scratch-off gallery. To change the order, edit the image paths in `.polaroid-wall` and `galleryPhotos`.
- Edit the letter and promises in `index.html` so they sound like you.
- When you provide your tracks, place the background song in this folder as `background-music.mp3` and your voice recording as `voice-note.mp3`. The music toggle plays your song when that file exists; otherwise it plays the gentle built-in bell fallback. The voice-note button can also load a recording from the device.
- Audio starts only after the visitor taps the music toggle, because browsers block music from starting on their own.

## Publish free with GitHub Pages

1. Create a free account at [GitHub](https://github.com/) and install [GitHub Desktop](https://desktop.github.com/).
2. In GitHub Desktop, create a repository from this `outputs` folder and publish it to GitHub.
3. On GitHub, open the repository's **Settings → Pages**. Under **Build and deployment**, select **Deploy from a branch**, choose `main` and `/(root)`, then save.
4. Once the Pages panel shows the site address, open it on your phone and share it with Sona.

GitHub Pages sites are public on the free plan. Only publish photos and personal details you are comfortable sharing publicly. The gallery uses the photos in `photos/`, so they will be published along with the site.

## Files

- `index.html` — story screens and editable personal copy
- `style.css` — colors, animations, responsive layouts, and room styling
- `script.js` — heart tree, scratch reveal, museum door, puzzle, voice note, and music interactions
- `rose-wall.png` and `couple.png` — reference-matched visual assets
- `photos/` — your eight gallery images
- `door-scene.png` — museum entrance artwork
