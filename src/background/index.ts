import {Storage} from "@plasmohq/storage";
import {uploadDocumentToVectara} from "~background/utils";

chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        contexts: ['selection'],
        title: 'Search My Vectara',
        id: 'searchByTextContext',
    });
});

chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        contexts: ['selection'],
        title: 'Index to My Vectara',
        id: 'indexByTextContext',
    });
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
    if(info.menuItemId === "searchByTextContext" ) {
        const url = chrome.runtime.getURL("../tabs/search.html")
        chrome.tabs.create({'url':`${url}?queryText=` + encodeURIComponent(info.selectionText)});
    }

    if(info.menuItemId === "indexByTextContext") {
        const storage = new Storage()
        const customerId = await storage.get("vectaraCustomerId")
        const apiKey = await storage.get("vectaraApiKey")
        const corpusId = await storage.get("vectaraCorpusId")


        const metadata = {
            'url': tab.url,
            'pageViewTime': Math.floor(Date.now() / 1000),
        };
        let payload = {
            "customerId": customerId,
            "corpusId": corpusId,
            "document": {
                "documentId": String(Date.now()),
                "title": tab.title,
                'metadataJson': JSON.stringify(metadata),
                'section': [
                    {
                        'text': info.selectionText
                    }
                ]
            }
        };

        const response = await uploadDocumentToVectara(customerId, apiKey, payload)
        const data = await response.json()
        const statusCode =  data.status.code
        let message: string;
        if (statusCode === "OK" || statusCode === "CONFLICT"){
            message = "Text indexed to vectara successfully."
        }
        else {
            message = "Something went wrong while indexing the text."
        }
        const icons = chrome.runtime.getManifest().icons
        let iconUrl: string
        if(icons['128'].startsWith('moz-extension://')) {
            iconUrl = icons['128']
        }
        else {
            iconUrl = chrome.runtime.getURL(`/${icons['128']}`)
        }

        chrome.notifications.create(`indexByTextNotification-${Date.now()}`, {
            type: 'basic',
            iconUrl: iconUrl,
            title: '',
            message: message,
        });
    }

});