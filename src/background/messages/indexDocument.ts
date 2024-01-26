import type { PlasmoMessaging } from "@plasmohq/messaging"
import {uploadDocumentToVectara} from "~background/utils";

// @ts-ignore
const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
    try {
        const {customerId, apiKey, corpusId} = req.body
        let payload = {
            "customerId": customerId,
            "corpusId": corpusId,
            "document": {
                "documentId": "test-doc",
                "title": "test-doc",
                "description": "Testing the credentials of vectara"
            }
        };

        const response = await uploadDocumentToVectara(customerId, apiKey, payload)
        const data = await response.json()
        console.log(data)
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

    } catch (err) {
        console.error("logging error", err)
        res.send({
            status: "error",
            message: err.message
        })
    }
}

export default handler