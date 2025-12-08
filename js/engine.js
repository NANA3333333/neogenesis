import { PERSONALITIES, DEFECTS } from './data.js';

function getAncestors(subject, list, depth) { let s = new Set(); if (depth <= 0 || !subject) return s; subject.parents.forEach(pid => { if (pid) { s.add(pid); let parent = list.find(d => d.id === pid); if (parent) { getAncestors(parent, list, depth - 1).forEach(i => s.add(i)); } } }); return s; }
export function checkIncest(s1, s2, list) { if (s1.id === s2.id) return true; let a1 = getAncestors(s1, list, 5); let a2 = getAncestors(s2, list, 5); if (a1.has(s2.id) || a2.has(s1.id)) return true; for (let id of a1) if (a2.has(id)) return true; return false; }
export function predictFusion(dad, mom, list) { let pD = PERSONALITIES[dad.pers]; let pM = PERSONALITIES[mom.pers]; let mutChance = 5 + pD.stats.mut + pM.stats.mut; if (mutChance < 1) mutChance = 1; let drift = 1 + pD.stats.stab + pM.stats.stab; let isIncest = checkIncest(dad, mom, list); if (isIncest) { mutChance += 30; drift += 15; } let riskLevel = "低"; let dadBad = dad.genes.defects.some(g => g !== 'none'); let momBad = mom.genes.defects.some(g => g !== 'none'); if (isIncest) riskLevel = "极高 (四重判定)"; else if (dadBad && momBad) riskLevel = "高 (隐患叠加)"; else if (dadBad || momBad) riskLevel = "中 (携带)"; return { mutChance, drift, isIncest, risk: riskLevel }; }

// 🔥 核心修复：inheritGenes 函数
function inheritGenes(dad, mom, isIncest) {
    let childGenes = [];
    const LOCI_MAP = ['cyclops', 'withered', 'hemophilia', 'weak'];
    let failedLociCount = 0;
    let activeDefectsList = []; // 修复点：定义列表

    for (let i = 0; i < 4; i++) {
        let p1 = dad.genes.defects[2*i + (Math.random()<0.5?0:1)];
        let p2 = mom.genes.defects[2*i + (Math.random()<0.5?0:1)];
        if (isIncest && Math.random() < 0.2) { p1 = LOCI_MAP[i]; } // 近亲衰退
        childGenes.push(p1, p2);

        let badGeneName = LOCI_MAP[i];
        let hasBad = (p1 === badGeneName) || (p2 === badGeneName);
        let isHomozygous = (p1 === badGeneName) && (p2 === badGeneName);
        if (isHomozygous || (hasBad && isIncest && Math.random() < 0.4)) {
            failedLociCount++;
            activeDefectsList.push(badGeneName);
        }
    }

    let finalDefect = null;
    if (failedLociCount >= 3) finalDefect = DEFECTS.find(d => d.id === 'meltdown');
    else if (activeDefectsList.length > 0) { // 修复点：使用列表长度判断
        let visualDefect = activeDefectsList.find(d => d === 'cyclops' || d === 'withered');
        let idToShow = visualDefect || activeDefectsList[0];
        finalDefect = DEFECTS.find(d => d.id === idToShow);
    }
    return { genes: childGenes, active: finalDefect, failureCount: failedLociCount };
}

export function generateSubject(gen, sex, col, pat, parents, persIdx, mut, idCounter, dadObj=null, momObj=null, list=[]) {
    let pData = PERSONALITIES[persIdx];
    let baseMaxHp = 100 + pData.stats.hp;
    let geneList = new Array(8).fill('none'); 
    let activeDefect = null;
    let failureCount = 0;

    if (dadObj && momObj) {
        let isIncest = checkIncest(dadObj, momObj, list);
        let result = inheritGenes(dadObj, momObj, isIncest);
        geneList = result.genes;
        activeDefect = result.active;
        failureCount = result.failureCount;
    } else {
        if(Math.random()<0.8) geneList[1] = 'cyclops';
        if(Math.random()<0.8) geneList[5] = 'hemophilia';
    }

    if (failureCount > 0) baseMaxHp -= (failureCount * 25);
    if (activeDefect && activeDefect.id === 'meltdown') baseMaxHp = 10;
    if (baseMaxHp < 5) baseMaxHp = 5;

    return {
        id: idCounter,
        name: "Subject-" + String(idCounter).padStart(3, '0'),
        gen, sex, col, pat,
        hp: baseMaxHp, maxHp: baseMaxHp,
        parents, pers: persIdx, mut,
        state: 'idle', dead: false, exalted: false,
        genes: { defects: geneList },
        defect: activeDefect,
        rads: 0
    };
}