// content.js (最終修正版)

console.log('PDF Hiderスクリプトが読み込まれました。');

// PDFビューアを非表示にし、フィードバックを表示する関数
const hidePdfViewer = (pdfElement) => {
  // すでに処理済みの場合は何もしない
  if (document.getElementById('pdf-hider-message')) {
    return;
  }
  
  pdfElement.style.display = 'none';

  document.body.style.backgroundColor = '#333';
  const messageDiv = document.createElement('div');
  messageDiv.id = 'pdf-hider-message'; // 処理済みの目印としてIDを付与
  messageDiv.textContent = 'PDFを検知し、非表示にしました。（ステップ①完了）';
  messageDiv.style.cssText = `
    position: fixed; top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    color: white; font-size: 24px; font-family: sans-serif;
    padding: 20px; background-color: rgba(0,0,0,0.5);
    border-radius: 10px; z-index: 9999;
  `;
  document.body.appendChild(messageDiv);

  console.log('PDFビューアを発見し、非表示にしました。');
};

// ▼▼▼ ここからが重要な修正点 ▼▼▼

// 1. まず、スクリプト実行時点ですでに要素が存在しないかチェックする
const existingEmbed = document.querySelector('embed[type="application/pdf"]');
if (existingEmbed) {
  // もし見つかったら、すぐに非表示処理を実行
  hidePdfViewer(existingEmbed);
} else {
  // 2. もし見つからなければ、これから追加される可能性に備えて監視を開始する
  const observer = new MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {
      if (mutation.type === 'childList') {
        for (const node of mutation.addedNodes) {
          if (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'EMBED' && node.type === 'application/pdf') {
            hidePdfViewer(node);
            observer.disconnect();
            return;
          }
        }
      }
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
}