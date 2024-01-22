export async function uploadDataToVectara(customerId:string, apiKey:string, payload:object) {
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            'customer-id': customerId,
            'x-api-key': apiKey,
            "X-Source": "extension",
        },
        body: JSON.stringify(payload)
    }
    return await fetch("https://api.vectara.io/v1/index", options)
}

export async function uploadFileToVectara(corpusId:string, customerId:string, apiKey:string, payload) {
    const url = `https://api.vectara.io/v1/upload?c=${customerId}&o=${corpusId}&d=true`
    const options = {
        method: 'POST',
        headers: {
            "Content-Type": "multipart/form-data",
            'customer-id': customerId,
            'x-api-key': apiKey,
            "X-Source": "extension",
        },
        data : payload
    }
    return await fetch(url, options)
}
