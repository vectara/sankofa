import browser from "webextension-polyfill";
import {getDataFromStorage, uploadDataToVectara, uploadFileToVectara} from "../utils";

const sendToVectara = async (message:any) => {
    const customerId = await getDataFromStorage("vectaraCustomerId")
    const apiKey = await getDataFromStorage("vectaraApiKey")
    const corpusId = await getDataFromStorage("vectaraCorpusId")

    if (customerId === "" || apiKey === "" || corpusId === "") return true

    const metadata = {
        'url': message.url,
        'pageViewTime': Math.floor(Date.now() / 1000), // TODO: Calculate time actually spent
    };
    if (message.type === "sendToVectara") {
        let payload = {
            'customerId': parseInt(customerId),
            'corpusId': parseInt(corpusId),
            'document': {
                'title': message.title ? message.title : '',
                'documentId': message.url,
                'description': message.description ? message.description : '',
                'metadataJson': JSON.stringify(metadata),
                'section': [
                    {
                        'text': message.text
                    }
                ]
            }
        };

       await uploadDataToVectara(customerId, apiKey, payload)
    }

    if (message.type === "sendRawHtmlToVectara") {
        let payload = new FormData()
        payload.append('file', message.html, message.url )
        await uploadFileToVectara(customerId, apiKey, payload)
    }

}

browser.contextMenus.create({
    contexts: ['selection'],
    title: 'Search My Vectara',
    id: 'searchByTextContext',
});
browser.contextMenus.onClicked.addListener((info, tab) => {
    //@ts-ignore
    browser.tabs.create({'url':'search.html?q=' + encodeURIComponent(info.selectionText)});
});

// Listen for a message from the content script
browser.runtime.onMessage.addListener( async(message, sender, sendResponse) => {
    if (message.type === 'sendToVectara') {
        if (message.delay === 'immediate') {
            await sendToVectara(message)
        }
    }
});