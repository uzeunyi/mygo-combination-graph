import { getMemberImage, getMemberColor } from './config.js';

// 조합 생성
export function generateCombinations(members) {
    const combinations = [];
    for (let i = 0; i < members.length; i++) {
        for (let j = i + 1; j < members.length; j++) {
            combinations.push([members[i], members[j]]);
        }
    }

    // 조합 셔플
    for (let i = combinations.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [combinations[i], combinations[j]] = [combinations[j], combinations[i]];
    }

    return combinations;
}

// 조합 풀 업데이트
export function updateCombinationsPool(combinations, setupDragAndDrop) {
    const pool = document.getElementById('combinationsPool');

    if (combinations.length === 0) {
        pool.innerHTML = '<p style="color: #666; text-align: center;">조합을 드래그해서 티어를 만들어보세요!</p>';
        return;
    }

    pool.innerHTML = combinations.map(combo => {
        return `<div class="combination-card" draggable="true" data-combo="${combo.join(' × ')}">
            <div class="combo-member">
                <div class="combo-member-name">${combo[0]}</div>
                <img src="${getMemberImage(combo[0])}" alt="${combo[0]}" class="combo-face" style="border-color: ${getMemberColor(combo[0])}" onerror="this.style.display='none'">
            </div>
            <div class="combo-member">
                <div class="combo-member-name">${combo[1]}</div>
                <img src="${getMemberImage(combo[1])}" alt="${combo[1]}" class="combo-face" style="border-color: ${getMemberColor(combo[1])}" onerror="this.style.display='none'">
            </div>
        </div>`;
    }).join('');

    setupDragAndDrop();
}