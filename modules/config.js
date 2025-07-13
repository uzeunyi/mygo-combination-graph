// 멤버 이름을 파일명으로 매핑
export const memberToFilename = {
    '토모리': 'tomori',
    '타키': 'taki', 
    '소요': 'soyo',
    '아논': 'anon',
    '라나': 'rana'
};

// 멤버별 색상 정의
export const memberColors = {
    '토모리': '#77BBDD',
    '타키': '#7777AA', 
    '소요': '#FFDD88',
    '아논': '#FF8899',
    '라나': '#77DD77'
};

export const tierColors = {
    S: '#ff69b4',
    A: '#ffd700',
    B: '#4169e1',
    C: '#888888'
};

export function getMemberImage(memberName) {
    const filename = memberToFilename[memberName] || memberName.toLowerCase();
    return `assets/${filename}_face.webp`;
}

export function getMemberColor(memberName) {
    return memberColors[memberName] || '#1e88e5';
}