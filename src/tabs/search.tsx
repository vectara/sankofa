import React, {useEffect, useState} from "react";
import {getVectaraCreds, getCurrentTab} from "~utils";
import {
    VuiFlexContainer,
    VuiFlexItem,
    VuiHorizontalRule,
    VuiSpacer, VuiSpinner,
    VuiSummary,
    VuiSummaryCitation, VuiText,
    VuiTitle
} from "~ui";
import {SearchResult} from "~tabs/SearchResult";
import '../style.scss'
import {SearchErrorCallout} from "~tabs/SearchErrorCallout";
import {sendToContentScript} from "@plasmohq/messaging";
import Header from "~components/header";
import {deserializeSearchResponse, performSearch} from "~tabs/utils";


export default function searchResultsPage () {
    const [searchResults, setSearchResults] = useState([])
    const [summary, setSummary] = useState("")
    const [error, setError] = useState("")
    const [searchText, setSearchText] = useState("")
    useEffect(()=>{
        const query = async () => {
            let queryText: string;
            const {customerId, corpusId, apiKey} = await getVectaraCreds()
            const tab = await getCurrentTab()
            const params = tab.url.split("?")[1].split("=")
            const  paramName= params[0]
            const value = params[1]
            if (paramName === "tabId") {
                queryText = await sendToContentScript({ name: "searchByExample", tabId:Number(value)})
            }
            else {
                queryText = value
                setSearchText(queryText)
            }
            const response = await performSearch(customerId, apiKey, corpusId, queryText, paramName)
            const {status} = response
            const data = await response.json()
            if (status === 200) {
                const results = deserializeSearchResponse(data["responseSet"][0]);
                const summary = data["responseSet"][0]["summary"][0].text
                setSummary(summary)
                setSearchResults(results)
            }
            else {
                setError(data)
            }
        }
        query().catch(err => {
            setError(err)
        })

    }, [])

    const SummaryCitation = ({ reference }: { reference: string }) => {
        return <>
            {" "}
            <VuiSummaryCitation
                reference={reference}
            />
        </>
    };

    return (
        <>
            <Header />
            <VuiSpacer size="xl"/>
            <VuiFlexContainer fullWidth direction="column" alignItems="center">
                { error ?
                    <VuiFlexContainer justifyContent="center" alignItems="center" className="fullHeight">
                        <SearchErrorCallout searchError={error} />
                    </VuiFlexContainer>
                    :
                    <VuiFlexItem className="searchContainer">
                        {searchResults.length > 0 ?
                            <>
                                { summary && (
                                    <>
                                        <VuiSpacer size="l" />
                                        <VuiTitle size="xs">
                                            <VuiFlexContainer alignItems="center">
                                                <h2>
                                                    <strong>Query</strong>
                                                </h2>
                                            </VuiFlexContainer>
                                        </VuiTitle>
                                        <VuiSpacer size="s"/>
                                        <VuiText>{searchText}</VuiText>
                                        <VuiSpacer size="l" />

                                        <VuiTitle size="xs">
                                            <VuiFlexContainer alignItems="center">
                                                <h2>
                                                    <strong>Summary</strong>
                                                </h2>
                                            </VuiFlexContainer>
                                        </VuiTitle>

                                        <VuiSpacer size="s" />

                                        <VuiSummary summary={summary} SummaryCitation={SummaryCitation} />

                                        <VuiSpacer size="l" />
                                        <VuiHorizontalRule />
                                        <VuiSpacer size="l" />

                                        <VuiTitle size="xs">
                                            <h2>
                                                <strong>References</strong>
                                            </h2>
                                        </VuiTitle>

                                        <VuiSpacer size="s" />
                                    </>
                                )}

                                {searchResults.map((result, i) => (
                                    <SearchResult
                                        key={i}
                                        result={result}
                                        position={i}
                                    />
                                ))}
                            </>
                            : <VuiFlexContainer fullWidth justifyContent="center" alignItems="center" className="fullHeight">
                                <VuiSpinner size="xxl" />
                            </VuiFlexContainer>
                        }
                    </VuiFlexItem>
                }
            </VuiFlexContainer>
        </>
    )

}