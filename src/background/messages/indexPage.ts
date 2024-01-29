import type { PlasmoMessaging } from "@plasmohq/messaging"

import { Storage } from "@plasmohq/storage"
import {uploadDocumentToVectara, uploadFileToVectara} from "../utils";

// @ts-ignore
const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
    try {
        const message = req.body
        const storage = new Storage()
        const customerId = await storage.get("vectaraCustomerId")
        const apiKey = await storage.get("vectaraApiKey")
        const corpusId = await storage.get("vectaraCorpusId")

        if (customerId === "" || apiKey === "" || corpusId === "") return true

        const metadata = {
            'url': message.url,
            'pageViewTime': Math.floor(Date.now() / 1000),
        };
        if (message.type === "indexPageViaUi") {
            let payload = {
                'customerId': parseInt(customerId),
                'corpusId': parseInt(corpusId),
                'document': {
                    'title': message.title ? message.title : '',
                    'documentId': message.url, // something like slugify
                    'description': message.description ? message.description : '',
                    'metadataJson': JSON.stringify(metadata),
                    'section': [
                        {
                            'text': message.text
                        }
                    ]
                }
            };

            const response = await uploadDocumentToVectara(customerId, apiKey, payload)
            const data = await response.json()
            try {
                res.send({
                    status: data.status.code,
                    message: data.status.statusDetail
                })
            }
            catch (e) {
                res.send({
                    status: "error",
                    message: data.message
                })
            }
        }

        if (message.type === "indexRawHtml") {
            let payload = new FormData()
            const blob =  new Blob([message.html], { type: "text/html" })
            payload.append('file', blob, message.url)
            const response = await uploadFileToVectara(corpusId, customerId, apiKey, payload)
            const data = await response.json()
            try {
                res.send({
                    status: data.status.code,
                    message: data.status.statusDetail || data.details
                })
            }
            catch (e) {
                res.send({
                    status: "error",
                    message: data.message
                })
            }
        }

    } catch (err) {
        console.error("logging error", err)
        res.send({
            status: "error",
            message: "Error while indexing the page."
        })
    }
}

export default handler