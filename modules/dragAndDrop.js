// 드래그 앤 드롭 설정
export function setupDragAndDrop(tierData, combinations, updateTierDisplay, updateCombinationsPool, updateGraphElements, showTouchModal) {
    const cards = document.querySelectorAll('.combination-card');
    const tierContents = document.querySelectorAll('.tier-content');
    const swapArea = document.getElementById('swapArea');

    cards.forEach(card => {
        // 터치 이벤트 추가
        card.addEventListener('touchstart', e => {
            e.preventDefault();
            showTouchModal(card.dataset.combo);
        });

        card.addEventListener('dragstart', e => {
            e.dataTransfer.setData('text/plain', card.dataset.combo);
            card.classList.add('dragging');
        });

        card.addEventListener('dragend', e => {
            card.classList.remove('dragging');
        });
    });

    tierContents.forEach(content => {
        content.addEventListener('dragover', e => {
            e.preventDefault();
            content.classList.add('drag-over');
        });

        content.addEventListener('dragleave', e => {
            content.classList.remove('drag-over');
        });

        content.addEventListener('drop', e => {
            e.preventDefault();
            content.classList.remove('drag-over');

            const comboText = e.dataTransfer.getData('text/plain');
            const tier = content.dataset.tier;

            // 기존 티어에서 제거
            Object.keys(tierData).forEach(t => {
                tierData[t] = tierData[t].filter(combo => combo !== comboText);
            });

            // 새 티어에 추가
            if (!tierData[tier].includes(comboText)) {
                tierData[tier].push(comboText);
            }

            updateTierDisplay();
            updateGraphElements();
        });
    });

    // 순서 바꾸기 영역
    swapArea.addEventListener('dragover', e => {
        e.preventDefault();
        swapArea.style.background = '#ffeaa7';
    });

    swapArea.addEventListener('dragleave', e => {
        swapArea.style.background = '#fff3cd';
    });

    swapArea.addEventListener('drop', e => {
        e.preventDefault();
        e.stopPropagation();
        swapArea.style.background = '#fff3cd';
        
        const comboText = e.dataTransfer.getData('text/plain');
        if (!comboText) return;
        
        const [member1, member2] = comboText.split(' × ');
        
        // 티어에서 제거
        Object.keys(tierData).forEach(tier => {
            tierData[tier] = tierData[tier].filter(combo => combo !== comboText);
        });
        
        // 조합 배열에서 순서 바꾸기
        const comboIndex = combinations.findIndex(combo => 
            combo.join(' × ') === comboText
        );
        if (comboIndex !== -1) {
            combinations[comboIndex] = [member2, member1];
        }
        
        updateTierDisplay();
        updateCombinationsPool();
        updateGraphElements();
    });

    // 풀로 다시 드래그할 수 있게
    const pool = document.getElementById('combinationsPool');
    pool.addEventListener('dragover', e => e.preventDefault());
    pool.addEventListener('drop', e => {
        e.preventDefault();
        const comboText = e.dataTransfer.getData('text/plain');

        // 모든 티어에서 제거
        Object.keys(tierData).forEach(t => {
            tierData[t] = tierData[t].filter(combo => combo !== comboText);
        });

        updateTierDisplay();
        updateGraphElements();
    });
}