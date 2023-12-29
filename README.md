## Vectara Browser Extension 🚀

## Features

## Installation
Follow these simple steps to get started with the extension:

1. **Clone the GitHub Repository**
    ```bash
    git clone https://github.com/vectara/browser-extension.git
    cd browser-extension
    ```
2. **Install dependencies**
    ```bash
    yarn install
    ```
3. **Run build command**
    ```bash
    yarn build
    ```

## Running the browser extension

### Chrome
- Open `chrome://extensions/` in your Chrome browser.
  Enable "Developer mode" in the top-right corner.
  Click on "Load unpacked" and select the build folder.

### Mozilla Firefox
- open `public/manifest.json` 
- replace `"service_worker": "./static/js/background.js"` with `"scripts": ["./static/js/background.js"]`
- run the command `yarn build`
- Open `about:debugging#/runtime/this-firefox` in your Firefox browser.
  Click on "Load Temporary Add-on" and select the manifest.json file inside the build folder.

Voilà! 🎉 The extension is now installed and ready to rock!