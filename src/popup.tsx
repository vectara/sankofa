import {useEffect, useState} from "react"
import {sendToContentScript} from "@plasmohq/messaging"
import {getVectaraCreds, getCurrentTab, runTextSearch, openSettings, saveSkipSummary} from "~utils";

import './style.scss'
import {
    VuiButtonPrimary, VuiCallout, VuiCheckbox,
    VuiFlexContainer,
    VuiFlexItem, VuiIcon,
    VuiIconButton,
    VuiSearchInput, VuiSpacer, VuiSpinner,
    VuiText, VuiTextColor, VuiTitle
} from "~ui";
import {MdOutlineSettings} from "react-icons/md";
import {BiCheck} from "react-icons/bi";

function IndexPopup() {
    const [searchValue, setSearchValue] = useState("");
    const [isConfigAvailable, setIsConfigAvailable] = useState(true)
    const [configChecked, setConfigChecked] = useState(false)
    const [pageIndexedSuccessfully, setPageIndexedSuccessfully] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [isDomainExcluded ,  setIsDomainExcluded] = useState(false)
    const [skipSummary, setSkipSummary] = useState(false)
    useEffect(()=>{
        const getExistingConfig = async () => {

            const {customerId, corpusId, apiKey, skipSummary } = await getVectaraCreds()
            if (customerId === undefined || apiKey === undefined || corpusId === undefined ) {
                setIsConfigAvailable(false)
            }
            setSkipSummary(Boolean(skipSummary))
            setConfigChecked(true)
        }
        getExistingConfig().catch(error => {console.log(error)})

    }, [])

    const handleAddToVectara = async () => {
        setLoading(true)
        const res = await sendToContentScript({ name: "indexPageViaUi" })
        if (res.status === "OK" || res.status === "CONFLICT"){
            setPageIndexedSuccessfully(true)
        }
        else if (res.status === "excluded") {
            setIsDomainExcluded(true)
        }
        else {
            setError(res.message)
        }

        setLoading(false)
    }
    const searchButtonOnClick = () => {
        setError("")
        if (searchValue) {
            runTextSearch("queryText", searchValue, skipSummary)
        }
    }
    const handleFindSimilar = async () => {
        const tab = await getCurrentTab()
        runTextSearch("tabId", tab.id)
    }

    if (!configChecked) {
        return (
            <VuiFlexContainer justifyContent="center" className="popup">
                <VuiTitle size="m">
                    <h2>Verifying Vectara Settings...</h2>
                </VuiTitle>
            </VuiFlexContainer>
        )
    }

    if (!isConfigAvailable) {
        return  (
            <div id="configurePopup" >
                <VuiFlexContainer direction="column" justifyContent="center" alignItems="center" className="popup">
                    <VuiSpacer size="m" />
                    <VuiFlexItem>
                        <VuiTitle size="s"><h1>Vectara settings not found</h1></VuiTitle>
                    </VuiFlexItem>
                    <VuiFlexItem>
                        <VuiText>Add settings to enable the extension.</VuiText>
                    </VuiFlexItem>
                    <VuiFlexItem>
                        <VuiButtonPrimary
                            onClick={()=> {
                                openSettings()
                            }}
                            color="primary">
                            Let's Configure
                        </VuiButtonPrimary>
                    </VuiFlexItem>
                </VuiFlexContainer>
            </div>
        )
    }
    return (
        <div id="indexPopup">
            <VuiFlexContainer justifyContent="center" alignItems="center" direction="column" className="popup">

                <VuiFlexContainer fullWidth justifyContent="spaceBetween" alignItems="baseline">
                    <VuiFlexItem grow={1}>
                        <VuiTitle size="xs">
                            <h5>Index/Search</h5>
                        </VuiTitle>
                        <VuiSpacer size="m" />
                    </VuiFlexItem>
                    <VuiFlexItem>
                        <VuiIconButton icon={ <MdOutlineSettings size={200} />} color="neutral"
                                       onClick={()=> openSettings()}
                        />
                    </VuiFlexItem>
                </VuiFlexContainer>
                <VuiFlexContainer>
                    <VuiFlexItem>
                        <VuiSearchInput className="searchInputWidth"
                                        autoFocus placeholder="Ask a question"
                                        value={searchValue}
                                        onChange={(e)=> setSearchValue(e.target.value)}
                                        onSubmit={(e) => { e.preventDefault(); searchButtonOnClick() }} />
                        <VuiSpacer size="xs" />
                        <VuiCheckbox
                            label="Skip summary(search only)"
                            onChange={() => {
                                saveSkipSummary(!skipSummary).catch(error => console.log(error))
                                setSkipSummary(!skipSummary)

                            }}
                            checked={skipSummary}
                        />
                    </VuiFlexItem>
                    <VuiFlexItem>
                        <VuiButtonPrimary color="primary" size="m" onClick={searchButtonOnClick}> Search </VuiButtonPrimary>
                    </VuiFlexItem>
                </VuiFlexContainer>
                <VuiSpacer size="s" />
                {loading ? <VuiSpinner size="xs" /> : null}
                <VuiSpacer size="l" />
                <VuiFlexContainer justifyContent="spaceBetween" alignItems="center">
                    <VuiFlexItem>
                        {
                            isDomainExcluded ? <VuiFlexContainer alignItems="center" spacing="xs">

                                    <VuiFlexItem grow={false}>
                                        <VuiText>
                                            <p>
                                                <VuiTextColor color="danger">Domain is excluded</VuiTextColor>
                                            </p>
                                        </VuiText>
                                    </VuiFlexItem>
                                </VuiFlexContainer> :
                                pageIndexedSuccessfully ? <VuiFlexContainer alignItems="center" spacing="xs">
                                        <VuiFlexItem grow={false}>
                                            <VuiIcon color="success">
                                                <BiCheck height="20px" width="20px" />
                                            </VuiIcon>
                                        </VuiFlexItem>

                                        <VuiFlexItem grow={false}>
                                            <VuiText>
                                                <p>
                                                    <VuiTextColor color="success">Page indexed</VuiTextColor>
                                                </p>
                                            </VuiText>
                                        </VuiFlexItem>
                                    </VuiFlexContainer>
                                    : <VuiButtonPrimary color="primary" size="m" onClick={handleAddToVectara}>
                                        Index Page
                                    </VuiButtonPrimary>
                        }
                    </VuiFlexItem>
                    <VuiFlexItem>
                        <VuiButtonPrimary color="primary" size="m" onClick={handleFindSimilar}> Find Similar Pages </VuiButtonPrimary>
                    </VuiFlexItem>
                </VuiFlexContainer>
                <VuiSpacer size="xs"/>
                {
                    error && <>
                            <VuiSpacer size="m" />
                            <VuiCallout
                                size="s"
                                color="danger"
                                title="Oops!"
                                headingElement="h5"
                                onDismiss={() => (setError(""))}
                            >
                                {error}
                            </VuiCallout>
                        </>
                }
            </VuiFlexContainer>
        </div>

    );
}

export default IndexPopup
