# 🏛️ NeoGenesis: Wasteland Genetics Simulator

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![No Dependencies](https://img.shields.io/badge/Dependencies-None-success?style=for-the-badge)

《NeoGenesis》是一款基于纯原生前端技术（Vanilla JS/CSS3）开发的**赛博废土风繁育与生存模拟器**。

在经历末日浩劫后的世界上，你将扮演 NeoGenesis-734 号避难所的 AI 管理员。受限于底层的“视觉认知障碍滤网”，在你眼中，幸存的畸形生物和人类不过是一个个色彩斑斓的**“发光球体”**。你需要抛弃人类的伦理，通过基因融合、高危探索和残酷的资源调度，在这个绝望的世界中延续最高阶的基因。



---

## ✨ 核心机制 (Core Features)

### 🧬 硬核遗传学引擎 (Mendelian Genetics Engine)
游戏底层内置了一套严密的基因遗传算法：
* **四重螺旋结构：** 拥有 4 个基因座（Loci），严格遵循显隐性分离定律。
* **近亲繁殖惩罚：** 强制血亲融合会大幅提高突变率，但也极易导致“基因熔毁（Meltdown）”，产出带有致命结构异常（如独眼、萎缩）的死胎或残次品。
* **后天异化系统：** 辐射累积可能导致个体觉醒 S/SS 级神级突变（附带免伤、资源双倍等实战增益）。

### 🌍 动态探索状态机 (Expedition & RNG System)
* 派遣实验体前往“安全区”或高辐射的“废土深处”拾荒。
* 动态计算辐射值（Rads）累积与生命体征（HP）损耗。
* 探索事件池：遭遇辐射风暴、发现战前金库，或带回携带未知基因的“野生幸存者”。

### ⚖️ 残酷的资源调度 (Resource & Capacity Management)
* **死者占位机制：** 阵亡的实验体会化作墓碑，永久占用宝贵的收容槽位。
* **道德困境：** 资金永远匮乏。你必须做出抉择——是花重金扩容避难所，还是将为避难所牺牲的“英雄”尸体执行“无害化处理（Exalt）”，变卖成 100 信用点？

---

## 💻 技术栈与实现细节 (Technical Details)

本项目**零外部依赖**，未使用任何第三方游戏引擎或 UI 框架。

* **Architecture:** 模块化 ES6 (Data / Engine / Adventure / Main)。
* **Logic:** 纯 JavaScript 手写数值平衡、状态机流转与概率学判定。
* **UI/UX:** 原生 CSS3 实现极致的 Cyberpunk 视觉体验。
  * `Glassmorphism` (毛玻璃拟态) 构建 UI 面板。
  * 纯 CSS 粒子动画模拟废土星云背景与终端呼吸灯。
  * 自定义发光滤镜（Glow/Neon Effects）区分不同基因层级的表现。

---

## 🚀 本地运行 (Local Setup)

由于本项目为纯静态网页，无需配置任何 Node 环境或数据库。
