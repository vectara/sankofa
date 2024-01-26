import React, {useEffect, useState} from 'react';

import '../style.scss'
import {
    VuiButtonPrimary, VuiCallout,
    VuiCheckbox,
    VuiFlexContainer,
    VuiFlexItem, VuiHorizontalRule,
    VuiIconButton,
    VuiLabel,
    VuiLink, VuiNotifications,
    VuiSelect,
    VuiSpacer,
    VuiText,
    VuiTextColor,
    VuiTextInput, VuiTitle,
    type Notification
} from "~ui";
import {getExtConfig, setConfig} from "~utils";
import {MdDelete} from "react-icons/md";
import {sendToBackground} from "@plasmohq/messaging";
import Header from "~components/header";

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
    const [notifications, setNotifications] = useState<Notification[]>([]);


    useEffect(()=>{
        const getExistingConfig = async () => {

            let {customerId, corpusId, apiKey, delayToSend, autoSendAllPages, domainsToSkip} = await getExtConfig()
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

    const handleRemoveDomains = (index:number) => {
        const newFields = [...formData.domainsToSkip];
        newFields.splice(index, 1);
        setFormData({...formData, domainsToSkip: newFields});
    };

    const handleAddDomains = () => {
        const domainsToSkip = formData.domainsToSkip
        // @ts-ignore
        domainsToSkip.push("")
        setFormData({ ...formData, domainsToSkip: domainsToSkip })
    };
    const validateForm = () => {
        const newErrors: { [key in keyof FormValues]?: string } = {};
        if (!formData.customerId?.trim()) {
            newErrors.customerId = 'Customer Id is required';
        }
        if (!formData.apiKey?.trim()) {
            newErrors.apiKey = 'Api key is required';
        }

        if (!formData.corpusId?.trim()) {
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
        setConfigSavedSuccessfully(false)
        setCredentialsInvalidError("")
        if (validateForm()) {
            setLoading(true)
            const response = await verifyCredentials()
                if (response.status === "OK" || response.status === "ALREADY_EXISTS") {
                    setConfig(formData)
                    setConfigSavedSuccessfully(true)
                    setLoading(false)
                    setNotifications([
                        {
                            color: "success",
                            message: "Credentials verified and saved successfully!"
                        }
                    ])
                }
                else {
                    setCredentialsInvalidError(response.message)
                    setLoading(false)
                }


            }

        }

    const handleChange = async (e:any, name:string) => {
        setFormData({...formData, [name]:e.target.value});
    }


    const domains = formData.domainsToSkip.map((value, index) => {
        return <div key={index}>
            <VuiSpacer size="xs"/>
            <VuiFlexContainer spacing="none">
                <VuiTextInput
                    // @ts-ignore
                    disabled={!formData.autoSendAllPages}
                    fullWidth
                    placeholder="Domain name"
                    value={formData.domainsToSkip[index]}
                    onChange={(e) => setFormData((formData) => {
                        let domainsToSkip = formData.domainsToSkip
                        // @ts-ignore
                        domainsToSkip[index] = e.target.value
                        return {...formData, domainsToSkip: domainsToSkip}
                    })}
                    className={formData.autoSendAllPages ? '' : 'disabled-input'}
                />
                <VuiIconButton icon={<MdDelete size={20}/>} color="danger" size="m" onClick={() => handleRemoveDomains(index)}/>
            </VuiFlexContainer>
        </div>
    });
    return (
        <VuiFlexContainer direction="column" className="fullHeight">
            <Header />
            <VuiSpacer size="xxl" />
            <VuiSpacer size="xxl" />

            {
                configSavedSuccessfully &&
                <VuiNotifications
                    notifications={notifications}
                    onShowAll={() => console.log("Show all")}
                    onDismiss={() => setNotifications([])}
                    onClose={() => setNotifications([])}
                    onDismissAll={() => setNotifications([])}/>
            }

            <VuiFlexContainer fullWidth direction="column" justifyContent="center" alignItems="center">
                <VuiFlexContainer justifyContent="spaceBetween" className="settingsForms" >
                    <VuiFlexItem>
                        <VuiTitle size="xs"><p>New to Vectara?</p></VuiTitle>
                        <a href="https://console.vectara.com/signup/?utm_source=sankofa&utm_medium=extension&utm_term=demo&utm_content=console&utm_campaign=sankofa-signup-console" target="_blank">
                            Sign Up
                        </a>
                    </VuiFlexItem>
                    <VuiFlexItem>
                        <VuiTitle size="xs"><p>Vectara Console</p></VuiTitle>
                        <a href="https://console.vectara.com/login" target="_blank">
                            Log In
                        </a>
                    </VuiFlexItem>
                </VuiFlexContainer>
                <VuiFlexContainer className="settingsForms">
                    <VuiSpacer size="s"/>
                    <VuiHorizontalRule color="neutral"  />
                </VuiFlexContainer>

                {/* Catching because sometime throws the Error: Promised response from onMessage listener went out of scope   */}
                <form onSubmit={(e) =>
                    handleSubmit(e).catch(err => {
                        setLoading(false)
                        setCredentialsInvalidError("Something went wrong. Please refresh the page and try again.")
                    })}
                >
                    <VuiFlexContainer direction="column" justifyContent="center" className="settingsForms">
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
                                        // @ts-ignore
                                        disabled={!formData.autoSendAllPages}
                                        value={formData.delayToSend}
                                        className={`delayInputWidth ${formData.autoSendAllPages ? '' : 'disabled-input'}`}
                                        options={[
                                            { text: "0 seconds", value: "0" },
                                            { text: "5 seconds", value: "5" },
                                            {text: "10 seconds", value: "10"},
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
                            <VuiButtonPrimary
                                className={formData.autoSendAllPages ? '' : 'disabled-input'}
                                color="primary" onClick={handleAddDomains} isDisabled={loading || !formData.autoSendAllPages}>
                                Add domain
                            </VuiButtonPrimary>
                        </VuiFlexItem>
                        <VuiFlexItem>
                            <VuiButtonPrimary color="primary" isSubmit isDisabled={loading}>
                                Save
                            </VuiButtonPrimary>
                        </VuiFlexItem>
                    </VuiFlexContainer>
                </form>
                {
                    credentialsInvalidError && <VuiFlexContainer className="settingsForms">
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
                    </VuiFlexContainer>
                }
            </VuiFlexContainer>
        </VuiFlexContainer>

    );
};

export default VectaraConfig;
