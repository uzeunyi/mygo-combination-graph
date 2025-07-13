import { generateCombinations, updateCombinationsPool } from './modules/combinations.js';
import { updateTierDisplay, moveCombToTier } from './modules/tiers.js';
import { setupDragAndDrop } from './modules/dragAndDrop.js';
import { updateGraph, updateGraphElements } from './modules/graph.js';

let members = [];
let combinations = [];
let tierData = { S: [], A: [], B: [], C: [] };

// 멤버 추가 (필요시)
function addMember() {
    const input = document.getElementById('memberInput');
    if (!input) return;
    const memberName = input.value.trim();

    if (memberName && !members.includes(memberName)) {
        members.push(memberName);
        input.value = '';
        initializeCombinations();
    }
}

// 멤버 삭제 (필요시)
function removeMember(memberName) {
    members = members.filter(m => m !== memberName);
    initializeCombinations();
}

// 조합 초기화
function initializeCombinations() {
    combinations = generateCombinations(members);
    tierData = { S: [], A: [], B: [], C: [] };
    updateCombinationsPool(combinations, () => setupDragAndDrop(
        tierData, 
        combinations, 
        () => updateTierDisplay(tierData, combinations, () => setupDragAndDrop(
            tierData, 
            combinations, 
            () => updateTierDisplay(tierData, combinations, () => setupDragAndDrop(tierData, combinations, updateTierDisplayWrapper, updateCombinationsPoolWrapper, updateGraphElementsWrapper)),
            updateCombinationsPoolWrapper,
            updateGraphElementsWrapper
        )),
        updateCombinationsPoolWrapper,
        updateGraphElementsWrapper
    ));
    updateGraph(members, tierData);
}

// 래퍼 함수들
function updateTierDisplayWrapper() {
    updateTierDisplay(tierData, combinations, () => setupDragAndDrop(tierData, combinations, updateTierDisplayWrapper, updateCombinationsPoolWrapper, updateGraphElementsWrapper));
}

function updateCombinationsPoolWrapper() {
    updateCombinationsPool(combinations, () => setupDragAndDrop(tierData, combinations, updateTierDisplayWrapper, updateCombinationsPoolWrapper, updateGraphElementsWrapper));
}

function updateGraphElementsWrapper() {
    updateGraphElements(tierData);
}

function moveCombToTierWrapper(comboText, tier) {
    moveCombToTier(comboText, tier, tierData, updateTierDisplayWrapper, updateGraphElementsWrapper);
}

// 티어 칩 이벤트
document.addEventListener('DOMContentLoaded', () => {
    const chips = document.querySelectorAll('.tier-chip');
    
    chips.forEach(chip => {
        chip.addEventListener('click', () => {
            const activeChips = document.querySelectorAll('.tier-chip.active');
            
            // 모든 칩이 활성화된 상태에서 클릭한 경우
            if (activeChips.length === chips.length) {
                // 클릭한 칩만 남기고 나머지 비활성화
                chips.forEach(c => c.classList.remove('active'));
                chip.classList.add('active');
            } else {
                // 일반 토글
                chip.classList.toggle('active');
            }
            
            updateGraphElementsWrapper();
        });
    });

    // 초기 멤버 설정 (MyGO!!!!! 멤버들)
    members = ['토모리', '타키', '소요', '아논', '라나'];
    initializeCombinations();
});