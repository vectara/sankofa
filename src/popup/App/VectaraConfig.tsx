import React, {useState} from 'react';
import {saveVectaraSettings} from "../../utils";
import CustomToolTip from "../../components/customToolTip";

interface FormValues {
    customerId: string,
    apiKey: string,
    corpusId: string,
    autoSendAllPages: string,
    delayToSend: string
}
const VectaraConfig = () => {
        const [errors, setErrors] = useState( {
            customerId: "",
            apiKey: "",
            corpusId: "",
            autoSendAllPages: "",
            delayToSend: ""
        })
        const [formData, setFormData] = useState<FormValues>({
            customerId: "",
            apiKey: "",
            corpusId: "",
            autoSendAllPages: "",
            delayToSend: ""
        })

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
        alert(JSON.stringify(newErrors))
        //@ts-ignore
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
        const handleSubmit = (e:any) => {
                e.preventDefault();
            const isValid = validateForm();
            if (isValid) saveVectaraSettings(formData)

        }
        const handleChange = (e:any, name:string) => {
                setFormData({...formData, [name]:e.target.value});
        }

    return (
        <form onSubmit={handleSubmit} style={{display: "flex", flexDirection: "column"}}>
                {/*<h1>Index to Vectara Settings</h1>*/}
                <div className="config-div">
                    <div style={{display:'flex', flexDirection:'column', width:'88%'}}>
                        <div style={{display:'flex', flexDirection:'row', alignItems:'center'}}>
                            <label style={{marginRight:5, fontSize:14, color:'#646262', marginBottom:5}}>Vectara Customer Id</label> <a href="https://console.vectara.com" target="_new"><CustomToolTip text="This is a tooltip for the info icon" /></a>
                        </div>
                        <input placeholder={'Customer Id'} name="cusotmerId" className="vuiSearchInput__input" value={formData.customerId} onChange={(e)=>handleChange(e, 'customerId')} />
                        {errors?.customerId && <div style={{ color: 'red' }}>{errors.customerId}</div>}
                    </div>

                </div>


                <div className="config-div">
                    <div style={{display:'flex', flexDirection:'column', width:'88%'}}>
                        <div style={{display:'flex', flexDirection:'row', alignItems:'center'}}>
                            <label style={{marginRight:5, fontSize:14, color:'#646262', marginBottom:5}}>Vectara API Key</label><a href="https://console.vectara.com/console/api-keys" target="_new"><CustomToolTip text={'This is tool tip'}/></a>
                        </div>
                        <input placeholder={'Vectara Api Key'} name="indexApiKey" className="vuiSearchInput__input" value={formData.apiKey} type="password" onChange={(e)=>handleChange(e, 'apiKey')} />
                        {errors?.apiKey && <div style={{ color: 'red' }}>{errors.apiKey}</div>}
                    </div>
                </div>
                <div className="config-div">
                    <div style={{display:'flex', flexDirection:'column', width:'88%'}}>
                        <div style={{display:'flex', flexDirection:'row', alignItems:'center'}}>
                            <label style={{marginRight:5, fontSize:14, color:'#646262', marginBottom:5}}>Vectara Corpus ID </label><a href="https://console.vectara.com/console/corpora" target="_new"><CustomToolTip text={'This is tool tip'}/></a>
                        </div>
                        <input placeholder={'Corpus Id'} name="corpusId" className="vuiSearchInput__input" value={formData.corpusId} type="number" min="1" onChange={(e)=>handleChange(e, 'corpusId')} />
                        {errors?.corpusId && <div style={{ color: 'red' }}>{errors.corpusId}</div>}
                    </div>
                </div>
                <div className="config-div">
                    <div style={{display:'flex', flexDirection:'column', width:'88%'}}>
                        <label style={{fontSize:14, color:'#646262', marginBottom:5}}>Delay (in ms) before sending a page to Vectara</label>
                        <input placeholder={'Delay to send'} name="delayToSend" className="vuiSearchInput__input" value={formData.delayToSend} type="number" min="0" max="60000" onChange={(e)=>handleChange(e, 'delayToSend')} />
                    </div>
                    </div>
                <div className="config-div">
                    <div style={{display:'flex',alignItems:'center'}}>
                    <input name="autoSendAllPages" style={{marginRight: "10px"}} value={formData.autoSendAllPages} type="checkbox" onChange={(e)=>handleChange(e, 'autoSendAllPages')} /><label style={{marginRight:5, marginBottom:5, fontSize:14, color:'#646262'}}>Auto send all pages to Vectara</label>
                    </div>

                </div>
                <div style={{display: "flex", justifyContent: "center", marginTop:"5px"}}>
                <button type="submit" className="vuiButton" style={{width: "200px"}}>Save</button>
                </div>
        </form>
    );
};

export default VectaraConfig;
