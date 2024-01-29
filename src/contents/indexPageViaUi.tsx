import {useMessage} from "@plasmohq/messaging/hook"
import {sendPageContentToBackground} from "~contents/utils";

export default function indexPageViaUi() {
    useMessage<string, string>(async (req, res) => {
        const { name, tabId} = req;
        if (name === "indexPageViaUi") {
            const response = await sendPageContentToBackground()
            res.send(response)
        }
    })
}

