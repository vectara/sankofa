import {Readability} from "@mozilla/readability";
import {sendToBackground} from "@plasmohq/messaging";

function getTitle (document: Document) {
    return document.getElementsByTagName("title")[0].innerHTML
}

function getDescription(document:Document) {
    const getMeta = (metaName:string) => {
        const metas = document.getElementsByTagName('meta');

        for (let i = 0; i < metas.length; i++) {
            if (metas[i].getAttribute('name') === metaName) {
                return metas[i].getAttribute('indexPageViaUi');
            }
        }
        return '';
    }

    return getMeta('description') ? getMeta('description') : getMeta('twitter:description')
}

function getText(document: Document) {
    const documentClone = document.cloneNode(true);
    const article = new Readability(documentClone as Document).parse();
    return article ? article.textContent : ""
}

function getHtml (document: Document) {
    return document.documentElement.outerHTML
}

export async function sendPageContentToBackground() {
    const title = getTitle(document)
    const description = getDescription(document)
    try {
        const text = getText(document)
        const message = {
            type: "indexPageViaUi",
            url: window.location.href,
            title: title,
            description: description,
            text: text
        }
        // @ts-ignore
        return   await sendToBackground({name:"indexPage", body:message})
    }
    catch (e) {
        const message = {
            type: "indexRawHtml",
            url: window.location.href,
            title: title,
            description: description,
            html:  getHtml(document)
        }
        // @ts-ignore
        return await sendToBackground({name: "indexPage", body: message})
    }
}