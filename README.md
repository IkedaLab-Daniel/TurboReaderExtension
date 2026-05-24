# TurboReaderExtension

Chrome extension to complete videos and move to the next section on demand.

## Setup
1. Open Chrome and go to `chrome://extensions`.
2. Enable "Developer mode" (top right).
3. Click "Load unpacked" and select this folder.

## Usage
1. Open a page with a video and a next-section control.
2. Click the TurboReader toolbar icon to open the popup.
3. Adjust the selector or delay if needed, then click "Run now".
4. The extension will set the video to the end, wait the selected delay, then click the next control.

## Customize
- Use the popup fields to change the selector or delay, then click "Save".
- Defaults live in `DEFAULT_CONFIG` inside `background.js`.

## Notes
- The current selector is `.next` (based on the provided HTML snippet).
- This runs only when you click "Run now" in the popup.
