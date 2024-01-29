import {useMessage} from "@plasmohq/messaging/dist/hook";
import {Readability} from "@mozilla/readability";


export default function searchByExample() {
    useMessage<string, string>(async (req, res) => {
        try {
                const {name} = req
                console.log(name)
                if (name === "searchByExample") {
                    let documentClone = document.cloneNode(true);
                    const article = new Readability(documentClone as Document).parse();
                    const text = article ? article.textContent : "";
                    res.send(text)
                }
                }
                catch (e) {
                    console.log(e)
                }
    })
}