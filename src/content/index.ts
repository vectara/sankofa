import browser from "webextension-polyfill";
import {Readability} from "@mozilla/readability";

const getMeta = (metaName:string) => {
    const metas = document.getElementsByTagName('meta');

    for (let i = 0; i < metas.length; i++) {
        if (metas[i].getAttribute('name') === metaName) {
            return metas[i].getAttribute('content');
        }
    }
    return '';
}

const processPage = (delay="asConfigured") => {
    const title = document.getElementsByTagName("title")[0].innerHTML
    const description = getMeta('description') ? getMeta('description') : getMeta('twitter:description')
    try {
        let documentClone = document.cloneNode(true);
        const article = new Readability(<Document>documentClone).parse();
        const text = article ? article.textContent : "";
        const message = {
            type: "sendToVectara",
            delay: delay,
            url: window.location.href,
            title: title,
            description: description,
            text: text
        }
        browser.runtime.sendMessage(message)
    }
    catch (e) {
        const message = {
            type: "sendRawHtmlToVectara",
            delay: delay,
            url: window.location.href,
            title: title,
            description: description,
            html:  document.documentElement.outerHTML
        }
        browser.runtime.sendMessage(message)
    }
}

browser.runtime.onMessage.addListener( async (message, sender, sendResponse) => {
        if( message.type === "sendToVectara" ) {
            processPage("immediate");
        }
    }
);