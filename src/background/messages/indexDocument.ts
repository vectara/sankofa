import type { PlasmoMessaging } from "@plasmohq/messaging"

// @ts-ignore
const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
    try {
        const {customerId, apiKey, corpusId} = req.body
        let payload = JSON.stringify({
            "customerId": customerId,
            "corpusId": corpusId,
            "document": {
                "documentId": "test-doc",
                "title": "test-doc",
                "description": "Testing the credentials of vectara"
            }
        });
        const response = await fetch("https://api.vectara.io/v1/index", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'customer-id': customerId,
                'x-api-key': apiKey
            },
            body: payload
        })

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

    } catch (err) {
        console.error("logging error", err)
        res.send({
            status: "error",
            message: "Invalid credentials"
        })
    }
}

export default handler