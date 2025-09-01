chrome.webRequest.onBeforeRequest.addListener(
  function(details) {
    // PDFファイルへのリクエストか、PDFを返す可能性のあるリクエストを捕捉
    if (details.type === 'main_frame' && !details.url.includes('pdfjs.action=download')) {
      // 拡張機能自身のビューアへのリクエストは除外する
      if (details.url.startsWith('chrome-extension://')) {
        return;
      }
      
      const pdfUrl = encodeURIComponent(details.url);
      const viewerUrl = chrome.runtime.getURL(`web/viewer.html?file=${pdfUrl}`);
      
      return { redirectUrl: viewerUrl };
    }
  },
  {
    urls: ["*://*/*.pdf", "*://*/*.PDF"], // .pdfで終わるURLを監視
    types: ["main_frame", "sub_frame"]
  },
  ["blocking"]
);

// Content-Typeがapplication/pdfの場合もリダイレクトするためのリスナー（より確実）
chrome.webRequest.onHeadersReceived.addListener(
  function(details) {
    if (details.statusCode === 200 && details.type === 'main_frame') {
      const contentTypeHeader = details.responseHeaders.find(header => header.name.toLowerCase() === 'content-type');
      if (contentTypeHeader && contentTypeHeader.value.toLowerCase().includes('application/pdf')) {
        // 既にリダイレクト済み、またはダウンロードの場合は何もしない
        if (details.url.includes('viewer.html') || details.url.includes('pdfjs.action=download')) {
          return;
        }

        const pdfUrl = encodeURIComponent(details.url);
        const viewerUrl = chrome.runtime.getURL(`web/viewer.html?file=${pdfUrl}`);
        
        return { redirectUrl: viewerUrl };
      }
    }
  },
  {
    urls: ["<all_urls>"],
    types: ["main_frame", "sub_frame"]
  },
  ["blocking", "responseHeaders"]
);