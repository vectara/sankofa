import React, {useEffect, useRef, useState} from "react";
import {getVectaraCreds, getCurrentTab} from "~utils";
import {
    VuiButtonPrimary,
    VuiCallout,
    VuiFlexContainer,
    VuiFlexItem,
    VuiHorizontalRule, VuiSearchInput,
    VuiSpacer, VuiSpinner,
    VuiSummary,
    VuiSummaryCitation,
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
    const searchResultsRef = useRef<HTMLElement[] | null[]>([]);
    const [loading, setLoading] = useState(false)
    const [selectedPosition, setSelectedPosition] = useState(0)

    useEffect(()=>{
        const query = async () => {
            setLoading(true)
            let queryText: string;
            const tab = await getCurrentTab()
            const params = tab.url.split("?")[1].split("=")
            const  paramName= params[0]
            const value = params[1]
            if (paramName === "tabId") {
                queryText = await sendToContentScript({ name: "searchByExample", tabId:Number(value)})
            }
            else {
                queryText = decodeURIComponent(value)
                setSearchText(queryText)
            }

            handleSearchResults(queryText, paramName).catch(err => {
                setError(err)
            })
        }
        query().catch(err => {
            setError(err)
        })

    }, [])

    const handleSearchResults = async (queryText: string, paramName: string) => {
        const {customerId, corpusId, apiKey} = await getVectaraCreds()
        const response = await performSearch(customerId, apiKey, corpusId, queryText, paramName)
        const {status} = response
        const data = await response.json()
        if (status === 200) {
            const results = deserializeSearchResponse(data["responseSet"][0]);
            const summary = data["responseSet"][0]["summary"].length > 0 ? data["responseSet"][0]["summary"][0].text : []
            setSummary(summary)
            setSearchResults(results)
            searchResultsRef.current = searchResultsRef.current.slice(
                0,
                searchResults.length
            );
            setLoading(false)
        }
        else {
            setError(data)
        }
    }

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true)
        setSearchResults([])
        handleSearchResults(searchText, "queryText").catch(err => {
            setError(err)
        })
    }
    const SummaryCitation = ({ reference }: { reference: string }) => {
        return (
            <VuiSummaryCitation
                reference={reference}
                // @ts-ignore
                onClick={(e:any) => {
                    const position = Number(e.target.innerText)
                    setSelectedPosition(position)
                    window.scrollTo({
                        top: searchResultsRef.current[position]!.offsetTop - 225,
                        behavior: "smooth",
                    });
                }}
            />
            )

    };

    const summaryContent = <>
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

    const searchInputContent = <VuiFlexContainer justifyContent="spaceAround" alignItems="center" className="searchInputContainer">
            <VuiFlexItem grow={1}>
                <VuiSearchInput
                    autoFocus
                    placeholder="Ask a question"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    onSubmit={(e) => handleSearchSubmit(e)}
                />
            </VuiFlexItem>

            <VuiFlexItem>
                <VuiButtonPrimary color="primary" size="m" onClick={(e) => handleSearchSubmit(e)}>
                    Search
                </VuiButtonPrimary>
            </VuiFlexItem>
        </VuiFlexContainer>


    if (loading) {
        return (
            <>
                <Header />
                <VuiSpacer size="xxl"/>
                <VuiSpacer size="xxl"/>
                <VuiSpacer size="xxl"/>
                <VuiFlexContainer fullWidth justifyContent="center" alignItems="center" direction="column">
                    {searchInputContent}
                    <VuiSpacer size="xxl"/>
                    <VuiSpacer size="xxl"/>
                    <VuiSpacer size="xxl"/>
                    <VuiSpinner size="xxl" />
                </VuiFlexContainer>
            </>
        )
    }

    return (
        <>
            <Header />
            <VuiSpacer size="xxl"/>
            <VuiSpacer size="xxl" />
            <VuiFlexContainer direction="column" alignItems="center">
            {searchInputContent}
                { error ?
                    <VuiFlexContainer justifyContent="center" alignItems="center" className="fullHeight">
                        <SearchErrorCallout searchError={error} />
                    </VuiFlexContainer>
                    : <>
                        {searchResults.length > 0 ?
                            <VuiFlexItem className="searchContainer">
                                { summary.length > 0 ? summaryContent : <VuiSpacer size="l"/> }

                                {searchResults.map((result, i) =>  (
                                        <SearchResult
                                            isSelected={selectedPosition === i + 1}
                                            key={i}
                                            result={result}
                                            position={i}
                                            ref={(el: HTMLDivElement | null) => (searchResultsRef.current[i] = el)}
                                        />
                                        )
                                )}
                            </VuiFlexItem>
                            :  <VuiFlexContainer  justifyContent="center" alignItems="center" className="fullHeight">
                                <VuiCallout
                                    color="danger"
                                    title="No results found"
                                    headingElement="h2"
                                >
                                </VuiCallout>
                            </VuiFlexContainer>
                        }
                    </>
                }
            </VuiFlexContainer>
        </>
    )

}