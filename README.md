## Sankofa: A Browser Extension by Vectara 🚀
[Sankofa](https://en.wikipedia.org/wiki/Sankofa), which means “to retrieve" in the [Twi language](https://en.wikipedia.org/wiki/Twi_language) of [Ghana](https://en.wikipedia.org/wiki/Ghana), 
is a browser extension created by Vectara. Its goal is to demonstrate the use of Vectara and its powerful semantic search and summarization capabilities.

When using Sankofa you can index web pages you visit (or instruct Sankofa to do so automatically). After pages are indexed
in a Vectara corpus, you can us Sankofa to find pages you've visited before, ask questions about the content of pages you had
visited or find pages similar to a page you are now visiting in your browser.

## Installation

### Pre-requisites:
To get started, the minimum requirement is to install [npm and node](https://nodejs.org/en/download). That's it!

To install Sankofa from this repository, please follow these steps:

1. **Clone the GitHub Repository**
    ```bash
    git clone https://github.com/vectara/sankofa.git
    cd sankofa
    ```
2. **Install dependencies**
    ```bash
    npm install
    ```

### Building the browser extension and installing it for your browser:

**Google Chrome**
- Build with `npm build`
- Open `chrome://extensions/` in your Chrome browser. 
- Enable `Developer mode` in the top-right corner. 
- Click on `Load unpacked` and select the `chrome-mv3-prod` folder from the  build folder.
- Click on the extension Icon in the top right corner.
- Pin the sankofa extension to make it visible in the toolbar.

**Firefox**
- Build with `npm build --target=firefox-mv2`
- Open `about:debugging#/runtime/this-firefox` in your firefox browser.
- Click on  `Load Temporary Add-on` and select manifest.json file from `build/firefox-mv2-prod` folder.
- Click on the extension Icon in the top right corner.
- Pin the sankofa extension to make it visible in the toolbar.

**Microsoft Edge**
- Build with `npm build --target=edge-mv3`
- Click on the `...` on the top-right to open the context menu, and click “extensions”
  Then click “Manage Extensions”.
- In the extensions screen turn on “developer mode”. 
- Click on `Load unpacked` and select the `edge-mv3-prod` folder from the  build folder.
- In the extensions icon in the Edge toolbar, you can click the little “eye” icon to ensure Sankofa is showing as its own Icon.
