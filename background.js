// background.js (最終デバッグ版)

console.log('バックグラウンドスクリプトが起動しました。PDFへのアクセスを監視します。');

chrome.webRequest.onHeadersReceived.addListener(
  (details) => {
    console.log(`[検知] URL: ${details.url}, Type: ${details.type}`);

    const contentTypeHeader = details.responseHeaders.find(
      (header) => header.name.toLowerCase() === 'content-type'
    );

    if (contentTypeHeader) {
      console.log(`[検知] Content-Type: ${contentTypeHeader.value}`);
    }

    if (contentTypeHeader && contentTypeHeader.value.toLowerCase().includes('application/pdf')) {
      console.log('★★★ PDFを検知しました！リダイレクトを実行します ★★★');
      
      const viewerUrl = chrome.runtime.getURL(
        `viewer/viewer.html?file=${encodeURIComponent(details.url)}`
      );

      chrome.tabs.update(details.tabId, { url: viewerUrl });
    }
  },
  {
    urls: ['<all_urls>'],
    types: ['main_frame', 'sub_frame'],
  },
  ['responseHeaders']
);