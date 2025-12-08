import { ITEMS, MUTATIONS } from './data.js';

// 计算突变带来的增益
function applyMutationBuffs(subject, result) {
    if (!subject.mut) return;

    const tier = subject.mut.tier;
    const name = subject.mut.name;

    // SS & S 级：神级能力
    if (tier === 'SS' || tier === 'S') {
        // 50% 概率免疫伤害
        if (result.hpChange < 0 && Math.random() < 0.5) {
            result.hpChange = 0;
            result.log += ` [${name}立场] 抵挡了所有伤害！`;
        }
        // 50% 概率金币翻倍
        if (result.gold > 0 && Math.random() < 0.5) {
            result.gold *= 2;
            result.log += ` [${name}共鸣] 物质转化，收益翻倍！`;
        }
    }
    // A & B 级：生存辅助
    else if (tier === 'A' || tier === 'B') {
        // 抵抗辐射
        result.radsChange = Math.floor(result.radsChange * 0.5);
        // 减少伤害
        if (result.hpChange < 0) {
            result.hpChange = Math.floor(result.hpChange * 0.7); // 减伤30%
            result.log += ` [${name}] 吸收了部分冲击。`;
        }
    }
}

export function explore(subject, biome) {
    let result = {
        log: "",
        hpChange: 0,
        radsChange: 0,
        gold: 0,
        event: null,
        wildSurvivor: null,
        newMutation: null
    };

    let roll = Math.random();

    // 🌲 森林
    if (biome === 'forest') {
        result.radsChange = 2;
        if (roll < 0.1) {
            result.log = "遭遇小型野兽。";
            result.hpChange = -10;
        } else {
            result.log = "搜寻到物资。";
            result.gold = Math.floor(Math.random()*150)+50;
        }
    } 
    // ☢️ 废土
    else if (biome === 'waste') {
        result.radsChange = 25; 
        
        // 25% 空手 (20-30%区间)
        if (roll < 0.25) {
            result.log = "废墟一片死寂，无功而返。";
        }
        // 25% 受伤
        else if (roll < 0.50) {
            result.log = "遭遇辐射风暴！装甲受损！";
            result.hpChange = -50;
        }
        // 35% 捡钱
        else if (roll < 0.85) {
            result.log = "发现战前金库！";
            result.gold = Math.floor(Math.random()*600)+400;
        } 
        // 15% 捡人
        else {
            result.log = "生命讯号捕获！发现幸存者！";
            result.event = 'survivor_found';
            
            let wildMut = null;
            // 废土幸存者 70% 带突变
            if (Math.random() < 0.7) {
                if (Math.random() < 0.15) wildMut = MUTATIONS.find(m => m.id === 'scourge'); 
                else {
                    let pool = MUTATIONS.filter(m => m.tier !== 'C' && m.id !== 'scourge');
                    wildMut = pool[Math.floor(Math.random()*pool.length)];
                }
            }
            result.wildSurvivor = { sex: Math.random()>0.5?'M':'F', mut: wildMut };
        }
    }

    // 🔥 应用突变增益 (V38 新增)
    applyMutationBuffs(subject, result);

    // 后天辐射突变
    if (subject.rads + result.radsChange > 60 && Math.random() < 0.3 && !subject.mut) {
        result.event = 'mutation_acquired';
        result.log += " [警告] 基因重组！";
        let pool = MUTATIONS.filter(m => m.tier !== 'C');
        result.newMutation = pool[Math.floor(Math.random()*pool.length)];
    }

    return result;
}