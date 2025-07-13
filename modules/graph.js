import { tierColors, getMemberImage, getMemberColor } from './config.js';

let simulation, svg, nodesGroup, linksGroup;

// 그래프 업데이트
export function updateGraph(members, tierData) {
    if (members.length === 0) return;

    const container = document.getElementById('graph-container');
    container.innerHTML = '';

    const width = container.offsetWidth;
    const height = container.offsetHeight;

    svg = d3.select('#graph-container')
        .append('svg')
        .attr('width', width)
        .attr('height', height);

    // 노드 데이터 (원형으로 고정 배치)
    const radius = Math.min(width, height) * 0.3;
    const centerX = width / 2;
    const centerY = height / 2;
    const nodes = members.map((member, index) => {
        const angle = (index / members.length) * 2 * Math.PI;
        return {
            id: member,
            x: centerX + radius * Math.cos(angle),
            y: centerY + radius * Math.sin(angle),
            fx: centerX + radius * Math.cos(angle),
            fy: centerY + radius * Math.sin(angle)
        };
    });

    // 링크 데이터 (티어별로 색상 구분)
    const links = [];
    Object.keys(tierData).forEach(tier => {
        tierData[tier].forEach(comboText => {
            const [source, target] = comboText.split(' × ');
            links.push({
                source: source,
                target: target,
                tier: tier,
                color: tierColors[tier]
            });
        });
    });

    // 시뮬레이션 설정 (노드 고정으로 단순화)
    simulation = d3.forceSimulation(nodes)
        .force('link', d3.forceLink(links).id(d => d.id))
        .stop();

    // 링크 force 실행해서 source/target을 객체로 변환
    simulation.force('link').initialize(nodes);
    simulation.force('link').links(links);

    // 링크 그리기
    linksGroup = svg.append('g');

    // 노드 그리기
    nodesGroup = svg.append('g');

    updateGraphElements(tierData);
}

export function updateGraphElements(tierData) {
    const links = [];
    const activeChips = document.querySelectorAll('.tier-chip.active');
    
    activeChips.forEach(chip => {
        const tier = chip.dataset.tier;
        tierData[tier].forEach(comboText => {
            const [source, target] = comboText.split(' × ');
            const sourceNode = simulation.nodes().find(n => n.id === source);
            const targetNode = simulation.nodes().find(n => n.id === target);
            if (sourceNode && targetNode) {
                links.push({
                    source: sourceNode,
                    target: targetNode,
                    tier: tier,
                    color: tierColors[tier]
                });
            }
        });
    });

    // 링크 업데이트
    const linkSelection = linksGroup.selectAll('line')
        .data(links);

    linkSelection.exit().remove();

    linkSelection.enter()
        .append('line')
        .attr('class', 'link')
        .attr('stroke-width', 3)
        .merge(linkSelection)
        .attr('stroke', d => d.color)
        .attr('opacity', 0.7)
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);

    // 노드 업데이트
    const nodeSelection = nodesGroup.selectAll('g')
        .data(simulation.nodes());

    nodeSelection.exit().remove();

    const nodeEnter = nodeSelection.enter()
        .append('g')
        .attr('class', 'node')
        .attr('transform', d => `translate(${d.x},${d.y})`)
        .on('mouseover', handleNodeHover)
        .on('mouseout', handleNodeOut);

    // 노드 이미지 추가
    nodeEnter.append('clipPath')
        .attr('id', d => `clip-${d.id}`)
        .append('circle')
        .attr('r', 30);

    nodeEnter.append('image')
        .attr('xlink:href', d => getMemberImage(d.id))
        .attr('x', -30)
        .attr('y', -30)
        .attr('width', 60)
        .attr('height', 60)
        .attr('clip-path', d => `url(#clip-${d.id})`)
        .attr('preserveAspectRatio', 'xMidYMin slice');

    // 노드 테두리 원
    nodeEnter.append('circle')
        .attr('r', 30)
        .attr('fill', 'none')
        .attr('stroke', d => getMemberColor(d.id))
        .attr('stroke-width', 3);
}

function handleNodeHover(event, d) {
    linksGroup.selectAll('line')
        .classed('highlighted', link => link.source.id === d.id || link.target.id === d.id)
        .classed('dimmed', link => link.source.id !== d.id && link.target.id !== d.id);
}

function handleNodeOut() {
    linksGroup.selectAll('line')
        .classed('highlighted', false)
        .classed('dimmed', false);
}