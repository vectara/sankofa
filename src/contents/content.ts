import {Storage} from "@plasmohq/storage";
import {sendPageContentToBackground} from "~contents/utils";

let delayToSend = 0
let startTime: number
let intervalId: string | number | NodeJS.Timeout;
async function getIntervalConfig() {
    const storage = new Storage()
    const autoSendAllPages = await storage.get("vectaraAutoSendAllPages")
    delayToSend = Number(await storage.get("vectaraDelayToSend")) * 1000

    return {autoSendAllPages, delayToSend }
}

async function startTimer() {
    startTime = new Date().getTime()

    // TODO: add check if page already exits then don't start the script

    const {autoSendAllPages, delayToSend } = await getIntervalConfig()
    if (Boolean(autoSendAllPages) === true) {
        if(delayToSend === 0) {
            sendPageContentToBackground()
        }
        else {
            intervalId = setInterval(processPage, delayToSend);
        }

    }

}

async function processPage() {
    const currentTime = new Date().getTime();
    const elapsedTime = currentTime - startTime;
    if (elapsedTime >= delayToSend) {
        stopTimer()
        sendPageContentToBackground()
    }
}

// Stop the interval when the tab or window is switched
function stopTimer() {
    clearInterval(intervalId);
}

// Event listener for tab or window switch
document.addEventListener('visibilitychange', handleVisibilityChange);
window.addEventListener('blur', handleBlur);

function handleVisibilityChange() {
    if (document.hidden) {
        // Tab switched
        stopTimer();
    } else {
        // Tab switched back
        startTimer();
    }
}

function handleBlur() {
    stopTimer();
}

startTimer();

export default {}
