import {useEffect, useState} from "react"
import {sendToContentScript} from "@plasmohq/messaging"
import {getVectaraCreds, getCurrentTab, runTextSearch} from "~utils";
import VectaraConfig from "~options";

import './style.scss'
import {
    VuiButtonPrimary, VuiCallout,
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
    const [editVectaraConfig, toggleEditVectaraConfig] = useState(false)
    useEffect(()=>{
        const getExistingConfig = async () => {

            const {customerId, corpusId, apiKey } = await getVectaraCreds()
            if (customerId === undefined || apiKey === undefined || corpusId === undefined ) {
                setIsConfigAvailable(false)
            }

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
        else {
            setError(res.message)
        }

        setLoading(false)
    }

    const toggleVectaraConfig = () => {
        toggleEditVectaraConfig(!editVectaraConfig)
    }

    const searchButtonOnClick = () => {
        setError("")
        if (searchValue) {
            runTextSearch("queryText", searchValue)
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
                            toggleEditVectaraConfig(!editVectaraConfig)
                            setIsConfigAvailable(true)
                        }}
                        color="primary">
                        Let's Configure
                    </VuiButtonPrimary>
                </VuiFlexItem>
            </VuiFlexContainer>
        )
    }
    return (
        <VuiFlexContainer justifyContent="center" alignItems="center" direction="column" className="popup">
            {
                editVectaraConfig ? <VectaraConfig toggleVectaraConfig={toggleVectaraConfig} /> :
                    <>
                        <VuiFlexContainer fullWidth justifyContent="spaceBetween" alignItems="baseline">
                            <VuiFlexItem grow={1}>
                                <VuiTitle size="xs">
                                    <h5>Index/Search</h5>
                                </VuiTitle>
                                <VuiSpacer size="m" />
                            </VuiFlexItem>
                            <VuiFlexItem>
                                <VuiIconButton icon={ <MdOutlineSettings />} color="neutral"
                                               onClick={()=> toggleEditVectaraConfig(!editVectaraConfig)}
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
                                    pageIndexedSuccessfully ? <VuiFlexContainer alignItems="center" spacing="xs">
                                            <VuiFlexItem grow={false}>
                                                <VuiIcon color="success">
                                                    <BiCheck />
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
                        {
                            error ? <>
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
                            </>: null
                        }
                    </>
            }

        </VuiFlexContainer>
    );
}

export default IndexPopup
