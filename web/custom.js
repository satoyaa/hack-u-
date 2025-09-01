document.addEventListener('DOMContentLoaded', () => {
    // ツールバーの要素が読み込まれるのを待つ
    const interval = setInterval(() => {
        const toolbar = document.getElementById('toolbarViewerRight');
        if (toolbar) {
            clearInterval(interval);
            addInvertButton(toolbar);
        }
    }, 100);
});

function addInvertButton(toolbar) {
    const invertButton = document.createElement('button');
    invertButton.id = 'invertButton';
    invertButton.className = 'toolbarButton';
    invertButton.title = '上下反転';
    invertButton.innerHTML = `
        <span class="toolbarButtonLabel">上下反転</span>
    `;

    // 既存のボタンの前に挿入
    const presentationModeButton = document.getElementById('presentationMode');
    toolbar.insertBefore(invertButton, presentationModeButton);

    let isInverted = false;

    invertButton.addEventListener('click', () => {
        const viewerContainer = document.getElementById('viewerContainer');
        isInverted = !isInverted;

        if (isInverted) {
            viewerContainer.style.transform = 'rotate(180deg)';
            invertButton.classList.add('toggled');
        } else {
            viewerContainer.style.transform = 'none';
            invertButton.classList.remove('toggled');
        }
    });
}