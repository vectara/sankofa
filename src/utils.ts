import {Storage} from "@plasmohq/storage";

export async function getCurrentTab() {
    const list = await chrome.tabs.query({ active: true, currentWindow: true })
    return list[0]
}

export async function getVectaraCreds () {
    const storage = new Storage()
    const customerId = await storage.get("vectaraCustomerId")
    const apiKey = await storage.get("vectaraApiKey")
    const corpusId = await storage.get("vectaraCorpusId")

    return {customerId, corpusId, apiKey}
}

export async function getExtConfig () {
    const storage = new Storage()
    const customerId = await storage.get("vectaraCustomerId")
    const apiKey = await storage.get("vectaraApiKey")
    const corpusId = await storage.get("vectaraCorpusId")
    const autoSendAllPages = await storage.get("vectaraAutoSendAllPages")
    const delayToSend = await storage.get("vectaraDelayToSend")
    const domainsToSkip = await storage.get("vectaraDomainsToSkip") || [""]

    return {customerId, corpusId, apiKey, delayToSend, autoSendAllPages, domainsToSkip}
}

export function runTextSearch(paramName: string, value:string | number) {
    const url = chrome.runtime.getURL("/tabs/search.html")
    window.open(`${url}?${paramName}=` + encodeURIComponent(value), '_blank');
}
