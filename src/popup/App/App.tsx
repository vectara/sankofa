import React, {useEffect, useState} from 'react';
import './App.css';
import {
    getCurrentTab,
    runTextSearch,
    sendMessageToContentScript
} from "../../utils";
import VectaraConfig from "./VectaraConfig";
import browser from "webextension-polyfill";

function App() {
    const [isConfigAvailable, setIsConfigAvailable] = useState(true)
    const [configChecked, setConfigChecked] = useState(false)
    useEffect(()=>{
        let customerId, apiKey, corpusId = ""
        const fetchData = async () => {
            let result = await browser.storage.sync.get('vectaraCustomerId')
            customerId = result.vectaraCustomerId ? result.vectaraCustomerId : ""
            result = await browser.storage.sync.get('vectaraApiKey')
            apiKey = result.vectaraApiKey ? result.vectaraApiKey : ""
            result = await browser.storage.sync.get('vectaraCorpusId')
            corpusId = result.vectaraCorpusId ? result.vectaraCorpusId : ""
            if (customerId === "" || apiKey === "" || corpusId === "" ) {
                setConfigChecked(true)
                setIsConfigAvailable(false)
            }

            setConfigChecked(true)


        };
        fetchData();
        }, [])

    const [editVectaraConfig, toggleEditVectaraConfig] = useState(false)
    const [inputValue, setInputValue] = useState("")
    const indexPage = async () => {
     const message = { type: 'sendToVectara' };
     const tab = await getCurrentTab()
     await sendMessageToContentScript(tab.id as number,  message)
     }

     const inputHandleChange = (e:any) => {
        setInputValue(e.target.value)
     }

     const searchButtonOnClick = () => {
        if (inputValue) {
            runTextSearch(inputValue)
        }
     }

    const handleOnKeyDown = (e:any) => {
        if (e.key === 'Enter') {
            if (inputValue) {
                runTextSearch(inputValue)
            }
        }
    }

    const openDetailsPage = () => {
        window.open('details.html', '_blank');
    }

    if (!configChecked) {
        return (
            <div style={{display: "flex", justifyContent: "center", height:"200px"}}>
                <h2>Checking Vectara Settings...</h2>
            </div>
        )
    }

    if (!isConfigAvailable) {
        return  (
            <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
                <h2>Vectara settings are missing</h2>
                Please add vectara account settings to use extension.
                <button
                    className="vuiButton"
                    style={{width: "200px", marginTop: "20px", marginBottom: "20px"}}
                    onClick={()=> {
                        toggleEditVectaraConfig(!editVectaraConfig)
                        setIsConfigAvailable(true)
                    }}
                >
                    Let's Configure
                </button>
            </div>
        )
    }
    return (
          <div style={{padding:'10px', display:'flex', flexDirection:'column'}}>
              {
                  editVectaraConfig ? <VectaraConfig/>:
                      <>
                          <div>
                          <h1>Search/Answer</h1>
                          <div style={{display: "flex", justifyContent: "end"}}>
                              <input
                                  name="searchText"
                                  value={inputValue}
                                  onChange={inputHandleChange}
                                  onKeyDown={handleOnKeyDown}
                                  placeholder="Ask My Vectara"
                                  className="vuiSearchInput__input"
                              />
                              <button
                                  onClick={searchButtonOnClick}
                                  className="vuiButton"
                                  style={{width: "80px"}}
                              >
                                  Search
                              </button>
                          </div>
                      </div>
                          <div>
                              <h1>Index this page</h1>
                              <div style={{display: "flex", justifyContent: "space-evenly", marginTop:10}}>
                                  <button
                                      onClick={indexPage}
                                      className="vuiButton"
                                      style={{width:"180px"}}
                                  >
                                      Add to Vectara
                                  </button>
                                  <button
                                      className="vuiButton"
                                      style={{width:"180px"}}
                                  >
                                      Find Similar Pages
                                  </button>

                              </div>
                          </div>
                      </>
              }

              <div style={{display: "flex", justifyContent: "space-evenly", alignItems: "baseline", marginTop:20}}>
                  <button
                      className="vuiButton"
                      style={{width: "180px"}}
                      onClick={()=> toggleEditVectaraConfig(!editVectaraConfig)}
                  >
                      {editVectaraConfig ? 'Go Back' : 'Show Vectara Config'}
                  </button>
                  <button
                      className="vuiButton"
                      style={{width: "180px"}}
                      onClick={openDetailsPage}
                  >
                      Extension Details
                  </button>
              </div>

          </div>
    );
}

export default App;
