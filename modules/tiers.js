import { getMemberImage, getMemberColor } from './config.js';

// 티어 표시 업데이트
export function updateTierDisplay(tierData, combinations, setupDragAndDrop) {
    Object.keys(tierData).forEach(tier => {
        const content = document.querySelector(`[data-tier="${tier}"]`);
        content.innerHTML = tierData[tier].map(combo => {
            const [member1, member2] = combo.split(' × ');
            return `<div class="combination-card" draggable="true" data-combo="${combo}">
                <div class="combo-member">
                    <div class="combo-member-name">${member1}</div>
                    <img src="${getMemberImage(member1)}" alt="${member1}" class="combo-face" style="border-color: ${getMemberColor(member1)}" onerror="this.style.display='none'">
                </div>
                <div class="combo-member">
                    <div class="combo-member-name">${member2}</div>
                    <img src="${getMemberImage(member2)}" alt="${member2}" class="combo-face" style="border-color: ${getMemberColor(member2)}" onerror="this.style.display='none'">
                </div>
            </div>`;
        }).join('');
    });

    // 풀에서 이미 배치된 조합들 제거
    const placedCombos = Object.values(tierData).flat();
    const pool = document.getElementById('combinationsPool');
    const remainingCombos = combinations.filter(combo => {
        const comboText = combo.join(' × ');
        const reverseComboText = `${combo[1]} × ${combo[0]}`;
        return !placedCombos.some(placed => 
            placed === comboText || placed === reverseComboText
        );
    });

    if (remainingCombos.length === 0) {
        pool.innerHTML = '<p style="color: #666; text-align: center;">모든 조합이 배치되었습니다! 🎉</p>';
    } else {
        pool.innerHTML = remainingCombos.map(combo =>
            `<div class="combination-card" draggable="true" data-combo="${combo.join(' × ')}">
                <div class="combo-member">
                    <div class="combo-member-name">${combo[0]}</div>
                    <img src="${getMemberImage(combo[0])}" alt="${combo[0]}" class="combo-face" style="border-color: ${getMemberColor(combo[0])}" onerror="this.style.display='none'">
                </div>
                <div class="combo-member">
                    <div class="combo-member-name">${combo[1]}</div>
                    <img src="${getMemberImage(combo[1])}" alt="${combo[1]}" class="combo-face" style="border-color: ${getMemberColor(combo[1])}" onerror="this.style.display='none'">
                </div>
            </div>`
        ).join('');
    }

    setupDragAndDrop();
}

// 터치로 조합을 티어로 이동하는 함수
export function moveCombToTier(comboText, tier, tierData, updateTierDisplay, updateGraphElements) {
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
}