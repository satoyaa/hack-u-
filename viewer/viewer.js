// viewer.js (最終完成版)
import * as pdfjsLib from './lib/pdf.mjs';

pdfjsLib.GlobalWorkerOptions.workerSrc = './lib/pdf.worker.mjs';

// URLパラメータから表示するPDFのURLを取得
const urlParams = new URLSearchParams(window.location.search);
const pdfUrl = decodeURIComponent(urlParams.get('file'));

// PDFを描画するメインの非同期関数
async function renderPdf() {
  const messageDiv = document.getElementById('message'); // メッセージ表示用のdiv
  try {
    messageDiv.textContent = 'PDFデータをダウンロード中...';
    
    // background.jsにPDFデータの取得を依頼
    const response = await chrome.runtime.sendMessage({ action: "fetchPdf", url: pdfUrl });

    if (!response || !response.success) {
      throw new Error(response.error || 'バックグラウンドからの応答がありません。');
    }
    
    messageDiv.textContent = 'PDFデータを加工中...';
    
    const { PDFDocument, rgb } = pdfjsLib;
    const pdfDoc = await PDFDocument.load(response.data);
    const firstPage = pdfDoc.getPages()[0];
    
    // ここでPDFへの変更処理を行う（例）
    firstPage.drawText('SUCCESS!', {
      x: 5,
      y: firstPage.getHeight() - 20,
      size: 18,
      color: rgb(0.9, 0.1, 0.1), // 赤色
    });

    const modifiedPdfBytes = await pdfDoc.save();
    
    messageDiv.style.display = 'none'; // メッセージを非表示に

    // ★★★ ステップ③：加工したPDFを表示 ★★★
    // ここからが本来のステップ③の内容です
    const pdfDataUri = `data:application/pdf;base64,${btoa(String.fromCharCode.apply(null, modifiedPdfBytes))}`;
    
    const iframe = document.createElement('iframe');
    iframe.src = pdfDataUri;
    iframe.style.width = '100%';
    iframe.style.height = '100vh';
    iframe.style.border = 'none';
    document.body.innerHTML = ''; // メッセージを消去
    document.body.appendChild(iframe);

  } catch (error) {
    console.error('処理全体でエラーが発生しました:', error);
    messageDiv.textContent = `エラー: ${error.message}`;
  }
}

// PDF描画関数を実行
renderPdf();