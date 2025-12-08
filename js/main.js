import { COLORS, PATTERNS, PERSONALITIES, MUTATIONS, DEFECTS } from './data.js';
import * as Engine from './engine.js';
import * as Adventure from './adventure.js';

let subjects = [];
let idCounter = 1;
let selection = { M: null, F: null };
let currentFocus = null;
let filter = 'all';
let currentDetailId = null;

let inventory = { 
    gold: 2000, 
    maxSlots: 5 
};

document.addEventListener('DOMContentLoaded', init);

function init() {
    bindClick('btn-breed', doFusion);
    bindClick('btn-wiki', showWiki);
    bindClick('btn-tree', showTree);
    bindClick('btn-reset', resetGame);
    bindClick('btn-expand', buySlot);
    bindClick('btn-close-overlay', () => toggleId('overlay', false));
    bindClick('btn-close-modal', () => toggleId('modal', false));
    bindClick('btn-close-tree', () => toggleId('tree-modal', false));
    bindClick('slot-M', () => unselect('M'));
    bindClick('slot-F', () => unselect('F'));

    const helpBtn = document.getElementById('btn-help');
    if(helpBtn) {
        helpBtn.addEventListener('click', () => toggleId('help-modal', true));
        document.getElementById('btn-close-help').addEventListener('click', () => toggleId('help-modal', false));
    }

    document.querySelectorAll('.filter').forEach(btn => {
        btn.addEventListener('click', (e) => setFilter(e.target.dataset.filter || e.target.getAttribute('data-filter'), e.target));
    });

    spawnAdamAndEve();
    renderLair(); 
    updateResources();
    
    setTimeout(() => {
        if(!localStorage.getItem('visited_v41')) {
            toggleId('help-modal', true);
            localStorage.setItem('visited_v41', 'true');
        }
    }, 500);
    
    window.showDetail = showDetail;
    window.exaltSubject = exaltSubject;
    window.startExplore = startExplore;
}

// 🔥 核心修改：死人也占位！
function getValidCount() {
    // 只要没被放逐(卖掉)，就占坑位！包括死人！
    return subjects.filter(s => !s.exalted).length;
}

function spawnAdamAndEve() {
    if (subjects.length > 0) return;
    let adam = Engine.generateSubject(1, 'M', 0, 0, [null,null], 0, null, idCounter++);
    adam.name = "Subject-Alpha"; 
    adam.genes.defects = ['none', 'cyclops', 'none', 'none', 'none', 'none', 'none', 'weak'];
    let eve = Engine.generateSubject(1, 'F', 1, 2, [null,null], 3, null, idCounter++);
    eve.name = "Subject-Beta"; 
    eve.genes.defects = ['none', 'none', 'none', 'withered', 'hemophilia', 'none', 'none', 'none'];
    addSubject(adam); addSubject(eve);
}

function buySlot() {
    if (inventory.gold >= 1000) {
        inventory.gold -= 1000;
        inventory.maxSlots += 1;
        updateResources();
        alert("✅ 扩容成功！容量: " + inventory.maxSlots);
        renderLair();
    } else {
        alert("资金不足 1000$");
    }
}

function startExplore(biome) {
    if (!currentFocus) { alert("⚠️ 请先点击一名样本！"); return; }
    if (inventory.gold < 100) { alert("资金不足 (需100$)"); return; }
    if (biome === 'waste' && getValidCount() >= inventory.maxSlots) {
        if(!confirm("⚠️ 库容已满，无法带回幸存者。\n继续？")) return;
    }

    inventory.gold -= 100;
    updateResources();

    let s = currentFocus;
    if (selection.M === s) unselect('M');
    if (selection.F === s) unselect('F');

    s.state = 'exploring';
    let hint = "";
    if(s.mut && (s.mut.tier==='S'||s.mut.tier==='SS')) hint = ` (🌟${s.mut.name})`;
    log(`🚀 ${s.name} 前往 ${biome==='forest'?'安全区':'废土'}...${hint}`);
    renderLair();

    setTimeout(() => {
        let res = Adventure.explore(s, biome);
        s.hp += res.hpChange;
        s.rads = (s.rads || 0) + res.radsChange;
        if (res.gold) inventory.gold += res.gold;

        if (res.wildSurvivor) {
            if (getValidCount() < inventory.maxSlots) {
                let wildData = res.wildSurvivor;
                let wild = Engine.generateSubject(0, wildData.sex, Math.floor(Math.random()*COLORS.length), 0, [null,null], Math.floor(Math.random()*PERSONALITIES.length), wildData.mut, idCounter++);
                wild.name = "Survivor-" + wild.id;
                wild.rads = Math.floor(Math.random()*40) + 20; 
                addSubject(wild);
                log(`✅ 回收幸存者 ${wild.name}`);
                if(wild.mut) showOverlay(wild, "⚠️ 发现异化幸存者");
            } else {
                log("❌ 发现幸存者，但库容已满。");
            }
        }

        if (res.newMutation) {
            s.mut = res.newMutation;
            showOverlay(s, "☢️ 后天突变");
        }

        if (s.hp <= 0 || s.rads >= 100) {
            s.hp = 0; s.dead = true;
            log(`💀 ${s.name} 死亡。`);
            currentFocus = null; 
            document.getElementById('explore-target').innerHTML = "当前指派: <span style='color:#666'>未选择</span>";
            checkFailure();
        } else {
            log(`✅ ${s.name} 返回: ${res.log}`);
        }

        s.state = 'idle';
        updateResources(); renderLair();
    }, 1200);
}

function checkFailure() {
    let aliveCount = subjects.filter(s => !s.dead && !s.exalted).length;
    if (aliveCount === 0) {
        setTimeout(() => {
            alert("🛑 【严重警告】 避难所全员灭绝！\n\n管理员，你的无能导致了 NeoGenesis-734 号设施的彻底沦陷。\n总部对你的表现极度失望。\n\n你将被剥夺所有资产，并强制调任至新的废弃设施。\n如果不希望再次失败，请收起你那可笑的仁慈（或愚蠢）。\n\n>> 正在重置系统... (资金惩罚: 重置为 1000)");
            subjects = []; idCounter = 1; selection = { M: null, F: null }; currentFocus = null;
            inventory.gold = 1000;
            let box = document.getElementById('log-box');
            if(box) box.innerHTML = '<div class="log-entry" style="color:#ff2a6d; font-weight:bold;">>> 系统重启... 管理员权限已重置。</div>';
            spawnAdamAndEve();
            renderLair();
            updateResources();
        }, 1000);
    }
}

function doFusion() {
    if (!selection.M || !selection.F) return;
    if (getValidCount() >= inventory.maxSlots) { alert("样本库已满！"); return; }

    let d1 = selection.M, d2 = selection.F;
    let stats = Engine.predictFusion(d1, d2, subjects);
    
    if(stats.isIncest) {
        showDrama("🧬 基因链在尖叫...");
        document.body.classList.add('shake-hard');
        setTimeout(()=>document.body.classList.remove('shake-hard'), 500);
    }

    let newMut = null;
    if(Math.random()*100 < stats.mutChance) {
        let pool = MUTATIONS.filter(m => { if((m.tier==='S'||m.tier==='A') && stats.mutChance<10) return false; return true; });
        if(pool.length) newMut = pool[Math.floor(Math.random()*pool.length)];
    }
    let minC = Math.min(d1.col, d2.col), maxC = Math.max(d1.col, d2.col);
    let childCol = Math.floor(Math.random()*(maxC-minC+1)) + minC;
    if(stats.drift > 0) childCol += (Math.floor(Math.random()*(stats.drift*2+1))-stats.drift);
    if(childCol < 0) childCol = COLORS.length + childCol; childCol %= COLORS.length;

    let baby = Engine.generateSubject(Math.max(d1.gen, d2.gen)+1, Math.random()>0.5?'M':'F', childCol, Math.random()>0.5?d1.pat:d2.pat, [d1.id, d2.id], Math.floor(Math.random()*PERSONALITIES.length), newMut, idCounter++, d1, d2, subjects);
    baby.rads = 0; 
    addSubject(baby);
    if(newMut) showOverlay(baby, "✨ 融合体产生异化 ✨");
    
    selection.M = null; selection.F = null; 
    updateSlots(); renderLair(); 
}

function exaltSubject() {
    if(!currentDetailId) return;
    // 即使是死人，卖了也给钱（回收尸体）
    if(confirm("确认执行无害化处理？\n(回收基因材料，获得 100 信用点)")) {
        let s = getSubject(currentDetailId);
        s.exalted = true;
        inventory.gold += 100; 
        updateResources();
        if(selection.M===s) unselect('M');
        if(selection.F===s) unselect('F');
        toggleId('modal', false);
        renderLair();
        checkFailure();
    }
}

// 辅助函数
function bindClick(id, func) { const el = document.getElementById(id); if(el) el.addEventListener('click', func); }
function toggleId(id, show) { const el = document.getElementById(id); if(show) el.classList.remove('hidden'); else el.classList.add('hidden'); }
function addSubject(s) { subjects.unshift(s); }
function getSubject(id) { return subjects.find(s => s.id === id); }

function renderLair() {
    const grid = document.getElementById('lair');
    if (!grid) return;
    grid.innerHTML = '';
    
    let list = subjects.filter(s => !s.exalted);
    if (filter === 'M') list = list.filter(s => s.sex === 'M');
    if (filter === 'F') list = list.filter(s => s.sex === 'F');
    if (filter === 'mut') list = list.filter(s => s.mut);
    if (filter === 'alive') list = list.filter(s => !s.dead);
    
    // 🔥 这里的计数现在是真实的“占坑数”
    // 为了让用户看到真实容量，我们用 getValidCount()
    let occupied = getValidCount();
    document.getElementById('count').innerText = occupied; // 显示真实占用
    let maxLabel = document.getElementById('max-slots');
    if(maxLabel) maxLabel.innerText = inventory.maxSlots;

    list.forEach(s => {
        let el = document.createElement('div');
        let isFocused = (currentFocus === s);
        let isInFusion = (selection.M === s || selection.F === s);
        let isMeltdown = s.defect && s.defect.id === 'meltdown';
        let classes = ['card'];
        if (s.dead) classes.push('dead');
        if (isFocused) classes.push('focused');
        if (isInFusion) classes.push('in-fusion');
        el.className = classes.join(' ');
        if (isMeltdown && !s.dead) el.style.opacity = "0.7"; 
        if (s.state === 'exploring') el.style.opacity = "0.4";

        let pat = PATTERNS[s.pat] || PATTERNS[0];
        let mutCss = s.mut ? s.mut.css : '';
        let defCss = s.defect ? s.defect.css : '';
        let col = COLORS[s.col];
        let sexColor = s.sex === 'M' ? 'var(--accent)' : '#e91e63';
        let sexSymbol = s.sex === 'M' ? '♂' : '♀';
        let radColor = s.rads > 50 ? 'color:#f0f; font-weight:bold' : 'color:#666';
        
        el.innerHTML = `<div class="info-icon">i</div><div style="font-size:12px; display:flex; justify-content:space-between; color:#666;"><span>G${s.gen}</span><span style="color:${sexColor}; font-weight:bold;">${sexSymbol}</span></div><div class="ball-wrapper"><div class="ball ${mutCss} ${defCss}" style="background-color:${col}; ${pat.css}"></div></div><div style="text-align:center; font-size:14px;">${s.mut ? '<span class="tag mut">★</span>' : ''}${s.defect ? '<span class="tag sick">☣</span>' : ''}${s.name}</div><div style="text-align:center; font-size:12px; color:${s.rads>50?'#f0f':'#666'}">☢ ${s.rads||0}</div>`;
        el.querySelector('.info-icon').addEventListener('click', (e) => { e.stopPropagation(); showDetail(s.id); });
        el.addEventListener('click', () => { 
            // 死人也能点！(为了放逐)
            // 但死人不能探索和繁育
            if(s.dead) {
                // 如果点了死人，只选中它(为了方便看详情或放逐)，但不更新探索/繁育
                currentFocus = s;
                // 更新探索面板显示"已死亡"
                const targetEl = document.getElementById('explore-target');
                if(targetEl) targetEl.innerHTML = `当前选中: <b style="color:#f44">${s.name} (已死亡)</b>`;
                renderLair();
                return;
            }
            if (s.state === 'exploring') return;
            if (s.defect && s.defect.id === 'meltdown') { alert("🚫 基因熔毁：个体已绝育。"); return; }
            currentFocus = s;
            const targetEl = document.getElementById('explore-target');
            if(targetEl) targetEl.innerHTML = `当前指派: <b style="color:var(--accent)">${s.name}</b> (HP:${s.hp} ☢:${s.rads||0})`;
            if (s.sex === 'M') selection.M = s; else selection.F = s;
            updateSlots(); renderLair();
        });
        grid.appendChild(el);
    });
}

function log(text) { let box = document.getElementById('log-box'); if(box) { box.innerHTML += `<div class="log-entry">[${new Date().toLocaleTimeString()}] ${text}</div>`; box.scrollTop = box.scrollHeight; } }
function updateResources() { document.getElementById('res-gold').innerText = inventory.gold; }
function showDrama(text) { const el = document.getElementById('drama-bubble'); const txt = document.getElementById('drama-text'); if(el && txt) { el.classList.remove('hidden'); txt.innerText = text; el.style.animation = 'none'; el.offsetHeight; el.style.animation = 'fade-in-out 4s forwards'; } }
function showDetail(id) { currentDetailId = id; let s = getSubject(id); toggleId('modal', true); let p1 = getSubject(s.parents[0]), p2 = getSubject(s.parents[1]); let parentNames = `${p1?p1.name:'?'} + ${p2?p2.name:'?'}`; let pers = PERSONALITIES[s.pers]; let defName = s.defect ? `<span style="color:var(--sick)">${s.defect.name}</span>` : "无结构异常"; let g = s.genes.defects; let fmt = (gene) => gene==='none' ? 'O' : '<b style="color:red">X</b>'; let geneStr = `A:${fmt(g[0])}${fmt(g[1])} B:${fmt(g[2])}${fmt(g[3])} C:${fmt(g[4])}${fmt(g[5])} D:${fmt(g[6])}${fmt(g[7])}`; let sexDisplay = s.sex === 'M' ? `<span style="color:var(--accent); font-weight:bold;">♂ 男性样本</span>` : `<span style="color:#e91e63; font-weight:bold;">♀ 女性样本</span>`; document.getElementById('modal-body').innerHTML = `<h2 style="text-align:center; color:var(--accent); margin-bottom:5px;">${s.name}</h2><div style="text-align:center; margin-bottom:15px;">${sexDisplay}</div><div style="text-align:center; margin:10px;">生命体征: ${s.hp}/${s.maxHp} | 辐射: <span style="color:${s.rads>50?'#f0f':'#fff'}">${s.rads||0}</span></div><div style="background:#222; padding:10px; border-radius:6px; font-size:13px;"><div>🧬 基因图谱 (O=正常 X=缺陷):</div><div style="font-family:monospace; margin:5px 0; background:#111; padding:5px;">${geneStr}</div><div>☣ 显性缺陷: ${defName}</div><div>🧠 心理评估: ${pers.name}</div><div>✨ 异化特征: ${s.mut ? '<b style="color:gold">'+s.mut.name+'</b>' : '无'}</div><div>👪 基因来源: ${parentNames}</div></div><button id="btn-exalt-action" style="width:100%; margin-top:15px; background:#411; border:1px solid #622;">⚡ 执行无害化处理 (移除 +100$)</button>`; document.getElementById('btn-exalt-action').onclick = exaltSubject; }
function unselect(sex) { selection[sex] = null; updateSlots(); renderLair(); }
function updateSlots() { ['M', 'F'].forEach(sex => { let el = document.getElementById(`slot-${sex}`); let s = selection[sex]; if (s) { let mutCss = s.mut ? s.mut.css : ''; let defCss = s.defect ? s.defect.css : ''; let pat = PATTERNS[s.pat] || PATTERNS[0]; el.innerHTML = `<span class="slot-remove">×</span><div class="ball-wrapper"><div class="ball ${mutCss} ${defCss}" style="background-color:${COLORS[s.col]}; ${pat.css}"></div></div>`; el.querySelector('.slot-remove').addEventListener('click', (e) => { e.stopPropagation(); unselect(sex); }); el.classList.add('filled'); } else { let sexSymbol = sex === 'M' ? '♂' : '♀'; let sexColor = sex === 'M' ? 'var(--accent)' : '#e91e63'; el.innerHTML = `<span style="font-size:30px; color:${sexColor}">${sexSymbol}</span>`; el.classList.remove('filled'); } }); let dash = document.getElementById('dashboard'); let btn = document.getElementById('btn-breed'); if (selection.M && selection.F) { dash.classList.remove('hidden'); let stats = Engine.predictFusion(selection.M, selection.F, subjects); document.getElementById('val-chance').innerText = stats.mutChance + "%"; document.getElementById('val-risk').innerText = stats.risk; let genesEl = document.getElementById('val-genes'); if(genesEl) genesEl.innerHTML = stats.isIncest ? "<b style='color:var(--danger)'>⚠ 血亲</b>" : "<span style='color:var(--accent)'>✔ 开放</span>"; btn.classList.remove('disabled'); if (stats.isIncest) { btn.classList.add('danger'); btn.classList.remove('ready'); btn.innerText = "强行执行融合 (高危)"; } else { btn.classList.remove('danger'); btn.classList.add('ready'); btn.innerText = "启动融合协议"; } } else { dash.classList.add('hidden'); btn.classList.add('disabled'); btn.classList.remove('danger', 'ready'); btn.innerText = "等待样本载入..."; } }
function showOverlay(d, t) { toggleId('overlay',true); document.querySelector('#overlay h2').innerText=t; document.getElementById('mut-title').innerText=d.mut.name; document.getElementById('mut-desc').innerText=`稀有度评级: ${d.mut.tier}`; document.getElementById('mut-stage').innerHTML=`<div class="ball ${d.mut.css}" style="background-color:${COLORS[d.col]}"></div>`; }
function showWiki(){ toggleId('modal', true); let mutList = MUTATIONS.map(m => `<li><b style="color:${m.tier==='SS'?'#f0f':'var(--gold)'}">${m.name}</b> (${m.tier})</li>`).join(''); let defList = DEFECTS.filter(d=>d.id!=='none').map(d => `<li><b style="color:var(--sick)">${d.name}</b>: ${d.desc}</li>`).join(''); document.getElementById('modal-body').innerHTML = `<h3>📘 变异数据库</h3><ul>${mutList}</ul><hr><h3>☣ 污染体分类</h3><ul>${defList}</ul>`; }
function showTree() { toggleId('tree-modal', true); const box = document.getElementById('tree-box'); box.innerHTML = ''; let gens = {}; subjects.forEach(d => { if(!gens[d.gen]) gens[d.gen]=[]; gens[d.gen].push(d); }); Object.keys(gens).sort((a,b)=>a-b).forEach(g => { let row = document.createElement('div'); row.className = 'tree-gen-row'; row.setAttribute('data-gen', 'Gen '+g); let label = document.createElement('div'); label.className = 'tree-gen-label'; label.innerText = 'Gen ' + g; let nodesBox = document.createElement('div'); nodesBox.className = 'tree-nodes-box'; gens[g].sort((a,b)=>a.id-b.id).forEach(d => { let node = document.createElement('div'); node.className = `tree-node ${d.exalted?'dead':''}`; let dot = `<span style="display:inline-block;width:10px;height:10px;background:${COLORS[d.col]};border-radius:50%;margin-right:5px;"></span>`; node.innerHTML = `${dot}${d.name} <span style="color:${d.sex=='M'?'#0ff':'#f0f'}">${d.sex=='M'?'♂':'♀'}</span>`; nodesBox.appendChild(node); }); row.appendChild(label); row.appendChild(nodesBox); box.appendChild(row); }); }
function setFilter(f,t){filter=f;renderLair();} function resetGame(){location.reload();}