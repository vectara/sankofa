import React, {useEffect, useState} from 'react';
import {Storage} from "@plasmohq/storage"

import './style.scss'
import {
    VuiButtonPrimary, VuiCallout,
    VuiCheckbox,
    VuiFlexContainer,
    VuiFlexItem,
    VuiIconButton,
    VuiLabel,
    VuiLink,
    VuiSelect,
    VuiSpacer, VuiTab, VuiTabs,
    VuiText,
    VuiTextColor,
    VuiTextInput
} from "~ui";
import {RiArrowGoBackFill} from "react-icons/ri";
import {getExtConfig} from "~utils";
import {MdDelete} from "react-icons/md";
import {sendToBackground} from "@plasmohq/messaging";

interface FormValues {
    customerId: string,
    apiKey: string,
    corpusId: string,
    autoSendAllPages: boolean,
    delayToSend: string
    domainsToSkip: string[]
}
const VectaraConfig = ({toggleVectaraConfig}) => {
    const [errors, setErrors] = useState( {
        customerId: "",
        apiKey: "",
        corpusId: "",
        autoSendAllPages: "",
        delayToSend: "",
    })
    const [formData, setFormData] = useState<FormValues>({
        customerId: "",
        apiKey: "",
        corpusId: "",
        autoSendAllPages: false,
        delayToSend: "0",
        domainsToSkip: [""]
    })
    const[configSavedSuccessfully, setConfigSavedSuccessfully] = useState(false)
    const[loading, setLoading] = useState(false)
    const [credentialsInvalidError, setCredentialsInvalidError] = useState("")
    const [tab, setTab] = useState<"vConfig" | "indexing">("vConfig");


    useEffect(()=>{
        const getExistingConfig = async () => {

            const {customerId, corpusId, apiKey, delayToSend, autoSendAllPages, domainsToSkip} = await getExtConfig()
            setFormData({
                customerId: customerId,
                corpusId:corpusId,
                apiKey:apiKey,
                delayToSend: delayToSend,
                autoSendAllPages: Boolean(autoSendAllPages),
                // @ts-ignore
                domainsToSkip: domainsToSkip ? domainsToSkip.length > 0 ? domainsToSkip : [""] : [""]

            })
        }
        getExistingConfig().catch(err => {
            console.log(err)
        })
    }, [])

    const handleRemoveField = (index:number) => {
            const newFields = [...formData.domainsToSkip];
            newFields.splice(index, 1);
            setFormData({...formData, domainsToSkip: newFields});
    };

    const handleAddField = () => {
        const domainsToSkip = formData.domainsToSkip
        // @ts-ignore
        domainsToSkip.push("")
        setFormData({ ...formData, domainsToSkip: domainsToSkip })
    };
    const validateForm = () => {
        const newErrors: { [key in keyof FormValues]?: string } = {};
        if (!formData.customerId.trim()) {
            newErrors.customerId = 'Customer Id is required';
        }
        if (!formData.apiKey.trim()) {
            newErrors.apiKey = 'Api key is required';
        }

        if (!formData.corpusId.trim()) {
            newErrors.corpusId = 'Corpus Id is required';
        }
        //@ts-ignore
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const verifyCredentials = async () => {
        const message = {
            customerId: formData.customerId,
            corpusId: formData.corpusId,
            apiKey: formData.apiKey
        }
        return await sendToBackground({name: "indexDocument", body: message})
    }
    const handleSubmit = async (e:any) => {
        e.preventDefault();
        if (validateForm()) {
            setLoading(true)
            const response = await verifyCredentials()
            if (response.status === "OK" || response.status === "ALREADY_EXISTS") {
                const storage = new Storage()
                await storage.set("vectaraCustomerId", formData.customerId)
                await storage.set("vectaraApiKey", formData.apiKey)
                await storage.set("vectaraCorpusId", formData.corpusId)
                await storage.set("vectaraAutoSendAllPages", formData.autoSendAllPages)
                await storage.set("vectaraDelayToSend", String(formData.delayToSend))
                await storage.set("vectaraDomainsToSkip", formData.domainsToSkip)
                setConfigSavedSuccessfully(true)
                setLoading(false)
            }
            else {
                setCredentialsInvalidError(response.message)
                setLoading(false)
            }

        }

    }
    const handleChange = (e:any, name:string) => {
        setFormData({...formData, [name]:e.target.value});
    }


    const domains = formData.domainsToSkip.map((value, index) => {
        return <>
            <VuiSpacer size="xs"/>
            <VuiFlexContainer spacing="none">
                <VuiTextInput
                    fullWidth
                    placeholder="Domain name"
                    value={formData.domainsToSkip[index]}
                    onChange={(e) => setFormData((formData) => {
                        let domainsToSkip = formData.domainsToSkip
                        // @ts-ignore
                        domainsToSkip[index] = e.target.value
                        return {...formData, domainsToSkip: domainsToSkip}
                    })}
                />
                <VuiIconButton icon={<MdDelete/>} color="danger" size="m" onClick={() => handleRemoveField(index)}/>
            </VuiFlexContainer>
        </>
    });

    const getTabscontent = () => {
        if (tab === "vConfig") {
            return <>
                <VuiSpacer size="s" />
                <VuiFlexItem>
                    <VuiLabel labelFor="customerId">Customer Id</VuiLabel>
                    <VuiTextInput
                        placeholder="Customer Id"
                        id="customerId"
                        value={formData.customerId}
                        onChange={(e)=>handleChange(e, 'customerId')}
                    />
                    <VuiTextColor color="danger">{errors?.customerId && errors.customerId}</VuiTextColor>
                </VuiFlexItem>
                <VuiFlexItem>
                    <VuiLabel labelFor="corpusId">Corpus Id</VuiLabel>
                    <VuiTextInput
                        placeholder="Corpus Id"
                        id="corpusId"
                        value={formData.corpusId}
                        onChange={(e)=>handleChange(e, 'corpusId')}
                    />
                    <VuiTextColor color="danger">{errors?.corpusId && errors.corpusId}</VuiTextColor>
                </VuiFlexItem>
                <VuiFlexItem>
                    <VuiLabel labelFor="apiKey">API Key</VuiLabel>
                    <VuiTextInput
                        placeholder="API Key"
                        id="apiKey"
                        value={formData.apiKey}
                        onChange={(e)=>handleChange(e, 'apiKey')}
                    />
                    <VuiTextColor color="danger">{errors?.apiKey && errors.apiKey}</VuiTextColor>
                </VuiFlexItem>
            </>
        }
        else {
            return <>
                <VuiSpacer size="s" />
                <VuiFlexItem>
                    <VuiCheckbox
                        label="Auto send all pages"
                        onChange={() => setFormData({ ...formData, autoSendAllPages: !formData.autoSendAllPages})}
                        checked={formData.autoSendAllPages}

                    />
                    <VuiSpacer size="xs" />
                    <VuiFlexItem>
                        <div style={{display:"flex", alignItems:"center"}}>
                            <VuiSelect
                                value={formData.delayToSend}
                                className="delayInputWidth"
                                options={[
                                    { text: "0 seconds", value: "0" },
                                    { text: "15 seconds", value: "15" },
                                    {text: "30 seconds", value: "30"},
                                    {text: "45 seconds", value: "45"},
                                    {text: "60 seconds", value: "60"}
                                ]}
                                onChange={(e)=>handleChange(e, 'delayToSend')}
                            />
                            <div style={{marginLeft: "8px"}}>
                                <VuiText>
                                    Duration on a page before indexing on Vectara.
                                </VuiText>
                            </div>
                        </div>
                    </VuiFlexItem>

                </VuiFlexItem>
                <VuiFlexItem>
                    <VuiLabel labelFor="domainsToSkip">Domains to excluded</VuiLabel>
                    {domains}
                    <VuiSpacer size= "m" />
                    <VuiButtonPrimary color="primary" onClick={handleAddField} isDisabled={loading}>
                        Add domain
                    </VuiButtonPrimary>
                </VuiFlexItem>

            </>
        }
    }


    return (
        <VuiFlexContainer fullWidth direction="column" className="configPopup">
            <VuiFlexContainer fullWidth justifyContent="spaceBetween" alignItems="center">
                <VuiFlexItem>
                    New to Vectara?
                    <a href="https://console.vectara.com/signup/?utm_source=sankofa&utm_medium=extension&utm_term=demo&utm_content=console&utm_campaign=sankofa-signup-console" target="_blank">
                        Sign Up
                    </a>
                </VuiFlexItem>
                <VuiFlexItem>
                    Vectara console
                    <a href="https://console.vectara.com/login" target="_blank">
                        Log In
                    </a>
                </VuiFlexItem>
                <VuiFlexItem>
                    <VuiIconButton icon={ <RiArrowGoBackFill />} color="neutral"
                                   onClick={()=> { if(validateForm()) toggleVectaraConfig(false)}}

                    />
                </VuiFlexItem>
            </VuiFlexContainer>
            <VuiSpacer size="l"/>
            <form onSubmit={handleSubmit}>
                <VuiFlexContainer fullWidth direction="column" justifyContent="center">
                    <VuiFlexContainer justifyContent="spaceBetween">
                        <VuiTabs>
                            <VuiTab
                                isActive={tab === "vConfig"}
                                // @ts-ignore
                                onClick={(e: React.MouseEvent) => {
                                    e.preventDefault();
                                    setTab("vConfig")}
                                }
                            >
                                <VuiText> Vectara Configuration</VuiText>
                            </VuiTab>
                            <VuiTab isActive={
                                tab === "indexing"}
                                // @ts-ignore
                                    onClick={(e: React.MouseEvent) => {
                                        e.preventDefault();
                                        setTab("indexing")}
                                    }
                            >
                                <VuiText> Indexing Options</VuiText>
                            </VuiTab>
                        </VuiTabs>
                    </VuiFlexContainer>
                    {
                        getTabscontent()
                    }
                    <VuiFlexItem>
                        <VuiButtonPrimary color="primary" isSubmit isDisabled={loading}>
                            Save
                            { configSavedSuccessfully ? toggleVectaraConfig(false) : null }
                        </VuiButtonPrimary>
                    </VuiFlexItem>
                </VuiFlexContainer>
            </form>
            {
                credentialsInvalidError ? <>
                    <VuiSpacer size="m" />
                    <VuiCallout
                        size="s"
                        color="danger"
                        title="Oops!"
                        headingElement="h5"
                        onDismiss={() => (setCredentialsInvalidError(""))}
                    >
                        {credentialsInvalidError}
                    </VuiCallout>
                </>: null
            }
        </VuiFlexContainer>
    );
};

export default VectaraConfig;
