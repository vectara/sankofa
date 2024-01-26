import {Storage} from "@plasmohq/storage";

export async function getCurrentTab() {
    try {
        const list = await chrome.tabs.query({ active: true, currentWindow: true })
        return list[0]
    }

    catch (error) {
        const list = await browser.tabs.query({ active: true, currentWindow: true })
        return list[0]
    }
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

export async function setConfig({customerId, apiKey, corpusId, autoSendAllPages, delayToSend, domainsToSkip}) {

    const storage = new Storage()
    await storage.set("vectaraCustomerId", customerId)
    await storage.set("vectaraApiKey", apiKey)
    await storage.set("vectaraCorpusId", corpusId)
    await storage.set("vectaraAutoSendAllPages", autoSendAllPages)
    await storage.set("vectaraDelayToSend", String(delayToSend))
    await storage.set("vectaraDomainsToSkip", domainsToSkip)
}

export function runTextSearch(paramName: string, value:string | number) {
    const url = chrome.runtime.getURL("/tabs/search.html")
    window.open(`${url}?${paramName}=` + encodeURIComponent(value), '_blank');

}

export function openSettings() {
    const url = chrome.runtime.getURL("/tabs/settings.html")
    window.open(url, '_blank');

}
