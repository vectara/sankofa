import type {DeserializedSearchResult, DocMetadata} from "../types";
import {parseSnippet} from "~parseSnippet";

export async function performSearch(customerId: string, apiKey: string, corpusId: string, queryText: string, queryType: string, skipSummary: string="false" ) {
    let searchRequest = {
        'query': [
            {
                'query': queryText,
                "numResults": 10,
                "contextConfig": {
                    "sentencesBefore": 3,
                    "sentencesAfter": 3,
                    "startTag": "<b>",
                    "endTag": "</b>"
                },
                "corpusKey": [
                    {
                        "customerId": customerId,
                        "corpusId": corpusId,
                        "lexicalInterpolationConfig": {
                            "lambda": 0.025
                        }
                    }
                ]
            }
        ]
    };
    if (queryType !== "queryText") {
        searchRequest["query"][0]["corpusKey"]["semantics"] = "RESPONSE"
    }
    console.log(skipSummary)

    if (queryType === "queryText" && skipSummary === "false") {
        searchRequest["query"][0]["summary"]= [
            {
                "maxSummarizedResults": 5,
                "responseLang": navigator.language.substring(0,2)
            }
        ]
    }

    return await fetch("https://api.vectara.io/v1/query", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            'customer-id': customerId,
            'x-api-key': apiKey
        },
        body: JSON.stringify(searchRequest)
    });
}

const convertMetadataToObject = (metadata: DocMetadata[]) => {
    const obj: Record<string, string> = {};
    metadata.forEach((item) => {
        obj[item.name] = item.value;
    });
    return obj;
};

const parseMetadata = (rawMetadata: DocMetadata[]) => {
    const metadata = convertMetadataToObject(rawMetadata);
    return {
        source: metadata.source as string,
        url: metadata.url,
        title: metadata.title || "Untitled",
        metadata
    };
};

export const deserializeSearchResponse = (
    searchResponse
): Array<DeserializedSearchResult> | undefined => {
    if (!searchResponse) return undefined;

    const results: Array<DeserializedSearchResult> = [];
    const { response: responses, document: documents } = searchResponse;

    responses.forEach((response) => {
        const { documentIndex, text: rawText } = response;
        const { pre, post, text } = parseSnippet(rawText);
        const document = documents[Number(documentIndex)];
        const { id, metadata: rawMetadata } = document;
        const { source, url, title, metadata } = parseMetadata(rawMetadata);

        results.push({
            id,
            snippet: {
                pre,
                text,
                post
            },
            source,
            url,
            title,
            metadata
        });
    });

    return results;
};