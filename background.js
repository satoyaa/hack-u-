// background.js (最終完成版)

// 1. リダイレクトルールを設定する機能
chrome.runtime.onInstalled.addListener(() => {
  // 既存のルールをクリア
  chrome.declarativeNetRequest.getDynamicRules((rules) => {
    const ruleIds = rules.map(rule => rule.id);
    chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: ruleIds,
      addRules: [{
        id: 1,
        priority: 1,
        action: {
          type: 'redirect',
          redirect: {
            // 正規表現を使い、元のURLをviewer.htmlのパラメータとして渡す
            regexSubstitution: `${chrome.runtime.getURL('viewer/viewer.html')}?file=\\0`
          }
        },
        condition: {
          regexFilter: '.*\\.pdf(\\?.*)?$',
          resourceTypes: ['main_frame']
        }
      }]
    });
  });
  console.log('PDFリダイレクトルールが設定されました。');
});

// 2. viewer.jsからのデータ取得依頼を待つ機能
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "fetchPdf") {
    console.log(`background.js: ${request.url} のデータを取得します。`);
    fetch(request.url)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.statusText}`);
        }
        return response.arrayBuffer();
      })
      .then(data => sendResponse({ success: true, data: data }))
      .catch(error => {
        console.error('Fetch error:', error);
        sendResponse({ success: false, error: error.message });
      });
    return true; // 非同期応答を示す
  }
});