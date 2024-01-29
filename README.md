This is a [Plasmo extension](https://docs.plasmo.com/) project bootstrapped with [`plasmo init`](https://www.npmjs.com/package/plasmo).

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
    pnpm install
    ```
3. **Build command for chrome**
    ```bash
    pnpm build
    ```
4. **Build command for firefox**
    ```bash
    pnpm build --target=firefox-mv2
    ```   
5. **Build command for edge**
    ```bash
    pnpm build --target=edge-mv3
    ```   

## Running the browser extension

### Chrome
- Open `chrome://extensions/` in your Chrome browser. 
- Enable `Developer mode` in the top-right corner. 
- Click on `Load unpacked` and select the `chrome-mv3-prod` folder from the  build folder.
- Click on the extension Icon in the top right corner.
- Pin the sankofa extension to make it visible in the toolbar.


### Firefox
- Open `about:debugging#/runtime/this-firefox` in your firefox browser.
- Click on  `Load Temporary Add-on` and select manifest.json file from `build/firefox-mv2-prod` folder.
- Click on the extension Icon in the top right corner.
- Pin the sankofa extension to make it visible in the toolbar.

### Edge
- Click on the `...` on the top-right to open the context menu, and click “extensions”
  Then click “Manage Extensions”.
- In the extensions screen turn on “developer mode”. 
- Click on `Load unpacked` and select the `edge-mv3-prod` folder from the  build folder.
- In the extensions icon in the Edge toolbar, you can click the little “eye” icon to ensure Sankofa is showing as its own Icon.
