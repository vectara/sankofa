import browser from 'webextension-polyfill';
import axios from "axios";

export async function getCurrentTab() {
    const list = await browser.tabs.query({ active: true, currentWindow: true })
    return list[0]
}

export async function sendMessageToContentScript(tabId:number, message:object) {
    return browser.tabs.sendMessage(tabId, message);
}

export async  function getDataFromStorage(key:string) {
        const result = await browser.storage.sync.get(key)
        return result && result[key] ? result[key] : ""
}

export async function uploadDataToVectara(customerId:string, apiKey:string, payload:object) {
    const response = await fetch("https://api.vectara.io/v1/index", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            'customer-id': customerId,
            'x-api-key': apiKey
        },
        body: JSON.stringify(payload)
    });
}

export async function uploadFileToVectara(customerId:string, apiKey:string, payload:object) {
    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: "https://api.vectara.io/v1/index",
        headers: {
            "Content-Type": "application/json",
                'customer-id': customerId,
                'x-api-key': apiKey
        },
        data : payload
    }
    const response =  await axios.request(config)
}

export async function saveVectaraSettings(data:any){
    await browser.storage.sync.set({ vectaraCustomerId: data.customerId });
    await browser.storage.sync.set({ vectaraApiKey: data.apiKey });
    await browser.storage.sync.set({ vectaraCorpusId: data.corpusId });
    await browser.storage.sync.set({ delayToSend: data.delayToSend });
    await browser.storage.sync.set({ autoSendAllPages: data.autoSendAllPages})
}

export function runTextSearch(textToSearch:string) {
    window.open('search.html?q=' + encodeURIComponent(textToSearch), '_blank');
}