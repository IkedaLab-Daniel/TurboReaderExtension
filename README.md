# TurboReaderExtension

Chrome extension to complete videos and move to the next section on demand.

## Setup
1. Open Chrome and go to `chrome://extensions`.
2. Enable "Developer mode" (top right).
3. Click "Load unpacked" and select this folder.

## Usage
1. Open a page with a video and a next-section control.
2. Click the TurboReader toolbar button.
3. The extension will set the video to the end, wait 3 seconds, then click the next control.

## Customize
- Update `NEXT_SELECTOR` in `background.js` if your "Next" control uses a different selector.
- Update `DELAY_MS` in `background.js` to change the wait time before clicking next.

## Notes
- The current selector is `.next` (based on the provided HTML snippet).
- This runs only when you click the toolbar button and uses `activeTab` permissions.
