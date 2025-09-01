// viewer.js (デバッグコード追加版)
import * as pdfjsLib from './lib/pdf.mjs';

pdfjsLib.GlobalWorkerOptions.workerSrc = './lib/pdf.worker.mjs';

const urlParams = new URLSearchParams(window.location.search);
const pdfUrl = decodeURIComponent(urlParams.get('file'));

async function renderPdf() {
  try {
    console.log('1. renderPdf関数が開始されました。'); // ★追加

    const pdf = await pdfjsLib.getDocument(pdfUrl).promise;
    console.log('2. PDFドキュメントの読み込みに成功しました。'); // ★追加

    const page = await pdf.getPage(1);
    console.log('3. ページ(1)の取得に成功しました。'); // ★追加

    const viewport = page.getViewport({ scale: 1.5 });

    const canvas = document.getElementById('pdf-canvas');
    const textLayer = document.getElementById('text-layer');
    const context = canvas.getContext('2d');

    canvas.height = viewport.height;
    canvas.width = viewport.width;
    textLayer.style.height = `${viewport.height}px`;
    textLayer.style.width = `${viewport.width}px`;

    await page.render({ canvasContext: context, viewport: viewport }).promise;
    console.log('4. Canvasへの背景描画が完了しました。'); // ★追加

    // テキスト情報を取得し、その中身を調査する
    const textContent = await page.getTextContent();
    console.log('5. getTextContentが完了しました。'); // ★追加
    console.log('▼調査結果▼', textContent); // ★追加: これが最も重要
    console.log(`発見したテキスト要素の数: ${textContent.items.length}`); // ★追加

    for (const item of textContent.items) {
      // ループに入ったことを確認
      console.log('ループ処理中:', item.str); // ★追加

      const span = document.createElement('span');
      span.textContent = item.str.toUpperCase();
      span.style.color = `hsl(${Math.random() * 360}, 100%, 65%)`;
      
      const transform = pdfjsLib.Util.transform(viewport.transform, item.transform);
      span.style.position = 'absolute';
      span.style.transform = `matrix(${transform.join(',')})`;
      span.style.transformOrigin = '0% 0%';
      span.style.fontSize = `${transform[0]}px`;
      span.style.fontFamily = 'sans-serif';
      
      textLayer.appendChild(span);
    }
    console.log('6. 全ての処理が完了しました。'); // ★追加

  } catch (error) {
    console.error('PDFのレンダリング中にエラーが発生しました:', error);
    document.body.textContent = `PDFの読み込みに失敗しました: ${error.message}`;
  }
}

renderPdf();