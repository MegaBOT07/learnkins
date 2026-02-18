Place your game banner image here as `treasurehunt.png` so the Games page can show it.

Steps:
1. Save the image you attached (or any banner image) with the filename `treasurehunt.png`.
2. Put the file into this folder:
   `project/public/games/treasurehunt.png`
3. Start the dev server (or reload) and open the Games page — the first game's banner will use this image.

Quick PowerShell example (replace source path):

```powershell
copy 'C:\path\to\your-image.png' 'C:\Users\mohit\Downloads\learnkinsnew1\learnkinsnew\project\public\games\treasurehunt.png'
```

Notes:
- Using `public/games` means the image is served statically at `/games/treasurehunt.png` and does not require modifying imports.
- If you prefer the image bundled instead (imported via `src/assets`), tell me and I will convert the page to use an imported asset.
