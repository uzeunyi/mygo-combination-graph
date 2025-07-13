import { getMemberImage, getMemberColor } from './config.js';

let currentTouchCombo = null;

// 터치 모달 표시 함수
export function showTouchModal(comboText) {
    currentTouchCombo = comboText;
    const touchModal = document.getElementById('touchModal');
    const modalComboDisplay = document.getElementById('modalComboDisplay');
    const [member1, member2] = comboText.split(' × ');
    
    modalComboDisplay.innerHTML = `
        <div class="combo-member">
            <div class="combo-member-name">${member1}</div>
            <img src="${getMemberImage(member1)}" alt="${member1}" class="combo-face" style="border-color: ${getMemberColor(member1)}" onerror="this.style.display='none'">
        </div>
        <div class="combo-member">
            <div class="combo-member-name">${member2}</div>
            <img src="${getMemberImage(member2)}" alt="${member2}" class="combo-face" style="border-color: ${getMemberColor(member2)}" onerror="this.style.display='none'">
        </div>
    `;
    
    touchModal.style.display = 'flex';
}

// 터치 모달 이벤트 설정
export function setupTouchModal(moveCombToTier) {
    const touchModal = document.getElementById('touchModal');
    
    // 모달 버튼 이벤트
    document.querySelectorAll('.touch-tier-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            if (currentTouchCombo) {
                const tier = btn.dataset.tier;
                moveCombToTier(currentTouchCombo, tier);
                touchModal.style.display = 'none';
                currentTouchCombo = null;
            }
        });
    });

    // 모달 배경 클릭 시 닫기
    touchModal.addEventListener('click', e => {
        if (e.target === touchModal) {
            touchModal.style.display = 'none';
            currentTouchCombo = null;
        }
    });
}