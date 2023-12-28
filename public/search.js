function searchResultBlockGenerator(document, position, text, score, documentMetadata) {
  //console.log(documentMetadata);
  let resultBlock = document.createElement('div');
  resultBlock.classList.add('vuiSearchResult');
  resultBlock.id = 'search-result-' + position;

  // add result position
  let resultNumberBlock = document.createElement('div');
  resultNumberBlock.classList.add('vuiSearchResultPosition');
  resultNumberBlock.appendChild(document.createTextNode(position));
  resultBlock.appendChild(resultNumberBlock);

  // create title/link
  let link = document.createElement('a');
  link.target = '_blank';
  link.classList.add("vuiLink","vuiTitle","vuiTitle--s","vuiTitle--left");
  documentMetadata.metadata.forEach(metadata => {
    if (metadata.name === 'url') {
      link.href = metadata.value;
    } else if (metadata.name === 'title') {
      link.appendChild(document.createTextNode(metadata.value));
    }
  });
  resultBlock.appendChild(link);

  let spacer = document.createElement('div');
  spacer.classList.add('vuiSpacer','vuiSpacer--xs');
  resultBlock.appendChild(spacer);

  // add the link URL as metadata below the header
  let metadataContainer = document.createElement('div');
  metadataContainer.classList.add('vuiText', 'vuiText--s', 'vuiText--left', 'searchResultSiteCategory');
  let linkMeta = document.createElement('p');
  linkMeta.classList.add('vuiTextColor','vuiTextColor--subdued');
  linkMeta.appendChild(document.createTextNode(link.href));
  metadataContainer.appendChild(linkMeta);
  resultBlock.appendChild(metadataContainer);

  // add the result snippet
  let snippetBlock = document.createElement('p');
  snippetBlock.classList.add('vuiText','vuiText--s','vuiText--left');
  snippetBlock.appendChild(document.createTextNode(text));
  resultBlock.appendChild(snippetBlock);
  return resultBlock;
}

async function performSearch(queryText) {
  let accountId = "";
  await browser.storage.sync.get('vectaraCustomerId').then( function (result) {
    if (result && result.vectaraCustomerId) {
      accountId = result.vectaraCustomerId;
    }
  });
  let apiKey = "";
  await browser.storage.sync.get('vectaraApiKey').then( function (result) {
    if (result && result.vectaraApiKey) {
      apiKey = result.vectaraApiKey;
    }
  });
  let corpusId = 1;
  await browser.storage.sync.get('vectaraCorpusId').then( function (result) {
    if (result && result.vectaraCorpusId) {
      corpusId = result.vectaraCorpusId;
    }
  });
  if (accountId == "" || apiKey == "") {
    return true;
  }

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
            "customerId": accountId,
            "corpusId": corpusId,
            "lexicalInterpolationConfig": {
              "lambda": 0.025
            }
          }
        ],
        "summary": [
          {
            "summarizerPromptName": "vectara-summary-ext-v1.2.0",
            "maxSummarizedResults": 5,
            "responseLang": navigator.language.substring(0,2)
          }
        ]  
      }
    ]
  };

  const response = await fetch("https://api.vectara.io/v1/query", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      'customer-id': accountId,
      'x-api-key': apiKey
    },
    body: JSON.stringify(searchRequest)
  });

  if (response.ok) {
    const searchResultsBlock = document.getElementById("searchResults");
    searchResultsBlock.innerHTML = '';

    let searchResultsJson = await response.json();
    let results = searchResultsJson.responseSet[0];
    let summary = results.summary;
    let summaryHeading = document.createElement('div');
    summaryHeading.innerHTML = '<h1>Summary</h1>'
    let summaryBlock = document.createElement('div');

    summaryBlock.id = 'summary';

    summaryBlock.style.height = '150px';
    summaryBlock.style.lineHeight = '20px';
    summaryBlock.style.fontSize = '15px';
    summaryBlock.style.padding = '20px 330px';
    summaryBlock.innerHTML = summary[0].text.replace(/\[(\d+)\]/g, '<span class="highlight">[$1]</span>')
    summaryBlock.innerHTML.replace(/\[(\d+)\]/g, '<span class="highlight">[$1]</span>');
    //summaryBlock.appendChild(document.createTextNode(summary[0].text.replace(/\[(\d+)\]/g, '<span class="highlight">[$1]</span>')));
    searchResultsBlock.appendChild(summaryBlock);
    let largeSpacer1 = document.createElement('div');
    largeSpacer1.classList.add('vuiSpacer','vuiSpacer--l');
    searchResultsBlock.appendChild(largeSpacer1);
    // let hr = document.createElement('hr');
    // hr.classList.add('vuiHorizontalRule');
    // searchResultsBlock.appendChild(hr);
    let largeSpacer2 = largeSpacer1.cloneNode(true);
    searchResultsBlock.appendChild(largeSpacer2);

    let searchResultsListBlock = document.createElement('div');
    searchResultsListBlock.classList.add('uiFlexItem','vuiFlexItem--flexGrow1','searchContent');

    for (var i = 0; i < results.response.length; i++) {
      let result = results.response[i];
      let text = result.text;
      let score = result.score;
      let documentIndex = result.documentIndex;
      let documentMetadata = results.document[documentIndex];

      let singleResultBlock = searchResultBlockGenerator(document, i+1, text, score, documentMetadata);
      searchResultsListBlock.appendChild(singleResultBlock);
    }
    searchResultsBlock.appendChild(searchResultsListBlock);
  } else {
    console.error('Error querying Vectara');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
  });
  let queryString = params.q;
  performSearch(queryString);
});