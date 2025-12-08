// === 🎨 颜色库 ===
export const COLORS = [
    "#222", "#fff", "#888", "#f00", "#fa0", "#ff0", 
    "#0f0", "#0ff", "#00f", "#80f", "#f0f", "#e91e63", 
    "#00bcd4", "#8bc34a", "#ffc107", "#795548", "#607d8b", 
    "#3f51b5", "#9c27b0", "#ff5722"
];

// === 🧬 花纹样式 ===
export const PATTERNS = [
    {id:"basic", n:"基础", css:""}, 
    {id:"tiger", n:"条纹", css:"background-image: repeating-linear-gradient(45deg, transparent 0, transparent 5px, rgba(0,0,0,0.4) 5px, rgba(0,0,0,0.4) 10px)"}, 
    {id:"spot", n:"波点", css:"background-image: radial-gradient(rgba(255,255,255,0.3) 20%, transparent 20%); background-size: 10px 10px"}, 
    {id:"crystal", n:"晶格", css:"background-image: conic-gradient(from 0deg, rgba(255,255,255,0.4), transparent 60%, rgba(255,255,255,0.4))"}
];

// === ☣ 遗传病 (5种核心病症) ===
export const DEFECTS = [
    { id: "none", name: "无", css: "" },
    // 生理类
    { id: "weak", name: "体质虚弱", css: "", desc: "HP上限降低" },
    { id: "hemophilia", name: "凝血障碍", css: "", desc: "易死亡，HP大减" },
    // 结构类
    { id: "cyclops", name: "独眼畸形", css: "def-cyclops", desc: "显性结构畸变" },
    { id: "withered", name: "肌肉萎缩", css: "def-withered", desc: "显性结构畸变，极弱" },
    // 终极惩罚
    { id: "meltdown", name: "基因熔毁", css: "def-meltdown", desc: "结构崩溃，强制绝育" }
];

// === 🧠 性格 (影响探索吐槽) ===
export const PERSONALITIES = [
    { id: "leader", name: "领袖", desc: "魅力非凡", stats: { hp: 30, mut: -5, stab: 5 } },
    { id: "psycho", name: "精神病", desc: "不可预测", stats: { hp: -10, mut: 20, stab: 20 } },
    { id: "romantic", name: "浪漫", desc: "容易动情", stats: { hp: 0, mut: 0, stab: 0 } },
    { id: "stable", name: "保守", desc: "厌恶变化", stats: { hp: 10, mut: -5, stab: 0 } },
    { id: "chaos", name: "混沌", desc: "拥抱随机", stats: { hp: -10, mut: 10, stab: 10 } },
    { id: "brave", name: "勇敢", desc: "生存率高", stats: { hp: 20, mut: 0, stab: 3 } },
    { id: "curious", name: "好奇", desc: "探索收益", stats: { hp: -5, mut: 5, stab: 5 } },
    { id: "royal", name: "高贵", desc: "血统纯正", stats: { hp: 0, mut: -4, stab: 0 } },
    { id: "mad", name: "疯狂", desc: "理智边缘", stats: { hp: -20, mut: 15, stab: 20 } }
];

// === ✨ 突变特效库 (C级 -> SS级) ===
export const MUTATIONS = [
    // 🔥 SS 级 (废土独占)
    { id: "scourge", name: "废土之灾", tier: "SS", chance: 0, css: "fx-scourge", desc: "来自废土深处的深度腐化。" },

    // ✨ S 级
    { id: "plasma", name: "等离子", tier: "S", chance: 0.5, css: "fx-plasma" },
    { id: "void", name: "虚空核心", tier: "S", chance: 0.5, css: "fx-void-core" },
    { id: "radiant", name: "以太光辉", tier: "S", chance: 0.5, css: "fx-radiant" },

    // ⚡ A 级
    { id: "glitch-h", name: "重度故障", tier: "A", chance: 2, css: "fx-glitch-heavy" },
    { id: "crystal-f", name: "晶体化", tier: "A", chance: 3, css: "fx-crystal" },

    // 🌟 B 级
    { id: "neon", name: "霓虹边", tier: "B", chance: 5, css: "fx-neon" },
    { id: "pixel", name: "像素化", tier: "B", chance: 5, css: "fx-pixel" },
    { id: "stone", name: "石化", tier: "B", chance: 5, css: "fx-stone" },
    { id: "ghost", name: "相位模糊", tier: "B", chance: 5, css: "fx-ghost" },

    // 💊 C 级 (形状改变)
    { id: "sq", name: "方块体", tier: "C", chance: 10, css: "shape-square" },
    { id: "pl", name: "胶囊体", tier: "C", chance: 10, css: "shape-pill" },
    { id: "dm", name: "菱形体", tier: "C", chance: 10, css: "shape-diamond" }
];

// === 📦 物品库 (虽然现在直接折算金币，但保留定义防报错) ===
export const ITEMS = [
    { id: "gold", name: "信用点", type: "currency" },
    { id: "food", name: "合成口粮", type: "consumable", effect: "hp+20" },
    { id: "mutagen", name: "高纯度诱变剂", type: "item", desc: "强制样本异化" }
];