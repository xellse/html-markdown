# 引擎 API 参考（写场景时看这份）

项目结构由 `scripts/new_project.py` 生成：

```
project/
├── build.py                  把引擎 + 播放器 + 一集的场景拼成单个 HTML
├── src/
│   ├── engine.js             通用引擎（画线、人物、组件、场景系统、渲染、音频）
│   ├── player.js             播放器（时钟、章节、互动停顿、配音同步、配乐）
│   ├── shell.html            页面外壳（字体、CSS、播放条）
│   └── ep1/                  一集 = 一个文件夹
│       ├── meta.json         页面文字、封面帧、配音声音、每个场景的配乐
│       ├── _xx_shared.js     （可选）几个场景共用的道具和函数：下划线开头，总会被构建带上，并且排在最前
│       └── 00_title.js …     场景文件，按文件名顺序播放
├── tools/audio.py            生成配音 + 配乐包 → episode-1.audio.js，然后自动重新构建页面
├── tools/check_timing.py     生成配音前检查字幕长度和时长
├── tools/dump_lines.cjs      （audio.py 内部使用）导出每句字幕
└── audio/{voice,music}/      配音缓存、配乐素材
```

## 目录
1. 核心原则：一切都是时间的纯函数
2. 场景（defineScene）
3. 轨道（tracks）与关键帧
4. 人物：造型、姿势、表情、视线、锚点
5. 组件（fx）一览
6. 场景道具（set）与自定义道具（PROPS）
7. 绘图基础函数
8. 写自己的组件
9. 字幕、配音、音效
10. meta.json
11. 构建、检查、生成音频
12. 常见坑

---

## 1. 核心原则：一切都是时间的纯函数
`render(t)` 根据时间 t 画出唯一确定的一帧：
- 没有"上一帧的状态"，不用 `Math.random()`，抖动也由时间决定。
- 所以拖动进度条、截图检查、从任意时刻开始播放都完全可靠。
- 每一帧，所有图元（带稳定 key 的 path、circle、text）放进一个列表（DL），再按 key 与 SVG 做增量同步。**key 必须稳定且唯一**，推荐用组件 id 作前缀：`fx.id + '.body'`。

### 坐标和时间的约定
- 舞台坐标 1600 × 900，原点在左上角，y 向下。
- **`write` 的 y 是字的顶端**：字高等于 size，数字写在 y 到 y + size 之间。**`text`、`scribe`、`title`、`speech`、`label` 的 y 是文字的垂直中心**。
- 组件里的 `t0`、`t1` 和轨道时间都是**场景内时间**，`targets(F)` 里的 `F.t` 也一样；`F.T` 是整集时间。**meta.json 的 `poster` 是整集时间**。
- 字体常量：`CFG.FONT_ZH`（站酷快乐体，中文默认）、`CFG.FONT_MIX`（Patrick Hand 优先，适合英文和数字标签）、`CFG.FONT_MONO`（VT323，代码和屏幕）。含英文字母的文字用默认字体时，`text()` 会自动换成 `FONT_MIX`，因为站酷把 O 画成方块。
- `render(t)` 之后，`EP.lastF` 是这一帧的 F（锚点、目标点），`tools/lint_frames.cjs` 靠它找角色的脸。
- 等宽代码字体每个字符宽 `CFG.MONO_ADV × size`（0.4）。`textWidth(str, size, CFG.FONT_MONO)` 会按这个值估算。

## 2. 场景（defineScene）
每个场景文件调用一次 `defineScene`，外面包一层立即执行的函数，避免变量互相污染。

```js
(() => {
  const FL = 780;                                  // 本场景地面 y
  defineScene({
    id: 'look',                                    // 唯一 id；配音 key 形如 'look#2'
    chapter: '看出规律',                            // 有它才出现在章节按钮里
    dur: 20.6,                                     // 秒；场景首尾相接，没有过渡
    floor: FL,
    cast: { kid: { H: 240, head: 0.44, torso: 0.22, leg: 0.3, arm: 0.34, hair: 'tuft', kid: true, blink: [3.3, 0.9] } },
    order: ['kid'],                                // 绘制顺序（默认按 cast 的顺序）
    tracks: { kid: { pos: [[0, [260, FL]]], pose: [[0, 'kidPoint'], [8.5, 'kidCheer', 0.1, 'back']], face: [[0, 'focus']] } },
    targets: F => ({ rows: [820, 380] }),          // 视线和标签可以引用的命名点
    pen: 'eq',                                     // 可选：手臂 IK 'pen' 跟随这个 write 的笔尖
    set: [{ type: 'floor', t0: 0 }],               // 场景道具（第 6 节）
    fx: [ /* 组件列表，按顺序绘制（第 5 节） */ ],
    subs: [{ t0: 0.3, t1: 5.3, text: '……' }],       // 字幕 = 配音（第 9 节）
    sfx: [[1.2, 'hop']],                           // 额外音效 [时间, 名称]
    steps: [{ t0: 1.9, t1: 2.95, hz: 5.2 }],       // 脚步声（配合 makeWalk）
    pauses: [12.45],                               // 互动停顿点（"想好了吗？"）
    noSeries: false,                               // true 时不显示左上角系列名（片头用）
  });
})();
```
- 场景内的时间都从 0 开始。组件的 `t0` 可以是负数，表示"切进来时已经画好了"，负时刻的音效会被自动丢掉。
- `EP.series`（系列名）在场景文件执行前已经从 meta.json 注入，可以直接用。

## 3. 轨道（tracks）与关键帧
关键帧格式：`[t, 值, 过渡秒数=0.12, 缓动='io']`，含义是"从 t 开始向这个值过渡，t + 过渡秒数时到达"。
- **值**可以是：
  - 数字或数组（逐项插值）；
  - 对象（逐字段插值）；
  - 库里的名字（`'kidCheer'` 会查 POSE 或 FACE）；
  - 函数 `t => 值`，用于走路、晃腿这类每帧都在变的动作。
- **缓动**：`lin`、`io`、`out`、`in`、`back`（过冲，姿势切换常用）。
- 人物轨道字段：

| 字段 | 值 | 说明 |
|---|---|---|
| `enter` | 秒 | 出场时间，出场时弹出 |
| `pos` | `[x, 地面y]` | 脚底位置；坐着的时候是臀部位置 |
| `pose` | 姿势 | 见第 4 节 |
| `face` | 表情 | 见第 4 节 |
| `turn` | -1..1 | 脸朝向，负值朝左 |
| `gaze` | 分步轨道 | `'viewer'`、目标名或 `[x, y]` |
| `squash` | 数值 | 挤压拉伸，1 为原样 |
| `bag` / `bagSq` | 数值 | 背包在背上（1）或落地（0） |

- 分步轨道（不插值）用 `stepTrack` 读，例如 gaze、小问号的 mood、act、sign。
- 走路：`pose: [[0, makeWalk(1.9, 2.95, 5.2, { bag: true, idle: 'carryBag' })]]`，配合 `pos: [[0, [1760, FL]], [1.9, [1300, FL], 1.05, 'lin']]`。

## 4. 人物

### 造型（cast 定义）
| 字段 | 说明 |
|---|---|
| `H` | 身高 |
| `head` / `torso` / `leg` / `arm` | 占身高的比例 |
| `hair` | tuft、messy、part、ponytail、sides、bob、curly，或自定义的 `HAIR.x` |
| `kid` | 孩子版的眼睛、线宽 |
| `glasses`、`tie`、`chalk` | 布尔值，戴眼镜、打领带、手拿粉笔 |
| `bag` + `bagFloor: [x, y]` | 背书包，以及书包落地的位置 |
| `desk: [x, y]` | 手臂 IK 的 'desk' 目标 |
| `noShadow` | 不画脚下阴影 |
| `blink: [周期, 相位]` | 眨眼节奏 |
| `floor` | 这个人物自己的地面 |
| `z` | 整体抬高层级，例如印在报纸上的小人 |

### 姿势（POSE）
字段含义：
- `lean`：身体倾斜；`tilt`：头倾斜。
- `armL` / `armR: [上臂角, 前臂相对角]`：0° 朝下，90° 朝外侧水平，180° 朝上。L 在画面左侧，R 在右侧。
- `legL` / `legR` 同理。
- `armScale`、`legScale`、`thigh`：肢体长度比例。
- `sit: 1`：坐着，`pos` 变成臀部位置。
- `hop`：离地高度；`sq`：挤压。
- `ikL` / `ikR: { w: 1, to, dx, dy, bend: 'down' | 'out' }`：手伸向一个目标。
  - `to` 可以是 hip、chin、head（dx、dy 以头半径为单位）、desk、pen；其他值表示绝对坐标。

内置姿势：

| 类别 | 姿势 |
|---|---|
| 站立 | stand, carryBag, crouch, jumpUp, raiseHand, wave, point, cheer, akimbo, scratchStand, thinkStand, wipeSweat, cheeks, kidCheer, kidPoint, announce, lookUp |
| 坐姿 | sitBase, sitHands, sitCrouch, chinHand, armsDesk, leanBack, sitUp, scratchHead, thinkChin, shock, sitFloor, sitScratch |
| 老师 | chalkUp, write, present, teachShock |

新姿势用 `Object.assign(POSE, { 前缀_名字: {...} })` 添加。

### 表情（FACE）
内置表情：neutral, smile, focus, idea, grin, proud, proudGrin, joy, bored, puzzled, surprised, jaw, sheepish, effort, laugh。

表情由这些字段组合：
- `eyes: 'open' | 'happy'`；
- `lidL` / `lidR`（0–1，眼睑）、`eyeSY`（眼睛纵向缩放）、`pupil`（瞳孔大小）；
- `brow: 'none' | 'line' | 'arc'` + `browL` / `browR`（角度）、`browY`；
- `mouth: 'flat' | 'smile' | 'grin' | 'o' | 'jaw' | 'wavy' | 'smirk' | 'frown'` + `mw`（嘴宽）、`mo`（张开程度）；
- `headSY`（头纵向缩放）。

### 视线与锚点
- 视线：`gaze` 取 `'viewer'`、`scene.targets` 里的名字、另一个角色的 id（看他的头）、`'pen'`，或 `[x, y]`。
- 每帧每个人物都会发布锚点 `F.anchors[id]`：head、headTop、mouth、jaw、handL、handR、hip、footL、footR、r（头半径）、bag。标签、对白、"?"标记都靠锚点定位。

## 5. 组件（fx）一览
每个组件是一个带 `type` 的对象，放在 `fx` 数组里，按顺序绘制。大多数组件都支持 `t0`、`t1`（出现和消失的时间）和 `id`。

| type | 主要参数 | 用途 |
|---|---|---|
| `ageStamp` | `age`（+`suffix`，默认'岁'）或 `label`（'唐朝'、'第1步'）、`place`（飘带文字）、`center`、`R: 150`、`dockT`、`dock: [1486, 108]`、`dockScale: 0.46`、`pulse: [t…]`、`t1`（0.25 秒缩小消失，换年龄前用）、`key`（两个印章同时在画面上时用不同的 key） | 红色印章，先盖在中央，再停靠到角落 |
| `write` | `text`、`x`、`y`（字顶）、`size`、`speed`（单位/秒）、`gap`、`glyphGap`、`track`、`color: 'red'`、`w`、`z`、`sfx`、`endSfx`、`silent` | 手写数学，只支持 GLYPH 里的字符 |
| `highlight` | `of`（某个 write 的 id）、`t0`、`dur` | 黄色荧光笔划过整行 |
| `ring` | `of`、`glyph`（字符序号，空格也算） | 红笔圈出一个字符 |
| `label` | `text` 或 `[行1, 行2]`、`at`、`rot`、`target`、`bend`、`gap`、`size`、`color: 'ink'` | 红笔标注加箭头 |
| `speech` | `text` 或 `[行…]`、`at`、`tail: [dx, dy]`、`speaker`、`size`、`rot`、`color` | 无气泡对白，一条尾线指向说话人 |
| `mark` | `char: '?'`、`on: [ids]`、`stagger` | 头顶弹出 ? 或 ! |
| `title` | `text`、`x`、`y`、`size`、`color`、`rot`、`underline`、`anchor`、`font` | 大标题、金句、揭晓词 |
| `scribe` | `text`、`x`、`y`、`size`、`cps`（每秒字数）、`color`、`anchor: 'start'`、`font` | 逐字出现的文字（中文、英文、代码） |
| `thought` | `at`、`rx`、`ry`、`from: {char, part}` | 思考云泡泡 |
| `prop` | `kind`（PROPS 里的名字）、`at` 或 `pos` 轨道、`rot`、`scale`、`drawDur`、`sfxAt` 以及自定义字段 | 画一个自定义道具，可以移动、旋转 |
| `qm` | `pos` 轨道、`size`（200 为标准）、`mood`、`act`、`sign`（分步轨道，null 表示不举牌）、`gaze`、`burst`、`silent` | 小问号 |
| `factCard` | `box: [x0, y0, x1, y1]`、`topic`（标题）、`stamp`（印章文字，默认"数学小知识"，可改成"编程小知识"等）、`rules: [y…]` | 小知识卡 |
| `codeBlock` | `x`（左边）、`y`（第 0 行中心）、`size: 56`、`lh`、`cps: 14`、`lines: [{text, t0}]`（开头的空格就是缩进）、`pc: [[t, 行号]]`、`pcT1`、`out: {text, t0, size, dx, dy}` | 代码逐字打出，红色行指针，输出行 |
| `varBox` | `name`、`cx`、`cy`、`w: 160`、`h: 110`、`size: 70`、`vals: [[t, '值']]`、`t0` | 变量盒子：新值写进去，旧值被红笔划掉并飘走；非数字的值会打字显示 |
| `band` | `rect`、`t0`、`t1`、`dur`、`pad` | 黄色荧光笔，可以画在任意矩形上 |
| `strike` | `rect`、`t0`、`dur` | 红笔划掉任意矩形 |
| `ringRect` | `rect`、`t0`、`pad` | 红笔圈出任意矩形 |
| `numberLine` | `from`、`to`、`x0`、`y`、`dx: 90`、`size: 60`、`t0`、`token: [[t, 值]]`、`tokenText: 'i'`、`fence: [[t, 位置]]`（9.5 表示 9 和 10 之间）、`hi: [[t, [lo, hi]]]` | 数轴：小人在格子间跳，栅栏，高亮范围 |
| `speedLines` | `char`、`part`（例如 'handR'） | 手部速度线 |
| `swingMarks` | `char` | 晃腿的弧线 |

**`rect`（矩形）** 可以写成：
- `[x, y, w, h]`；
- `{ code: 'cb', line: 1, from: 9, to: 21 }`：codeBlock 第 1 行第 9–21 个字符；
- `{ write: 'eq', from: 0, to: 3 }`：手写行的第 0–3 个字符；
- `{ target: 'cb.out', w: 70, h: 70 }`：以某个命名点为中心；
- `F => [x, y, w, h]`：函数。

组件会发布一些命名点：
- codeBlock：`'<id>.pc'`（行指针）、`'<id>.out'`（输出）；
- numberLine：`'<id>.token'`、`'<id>.v<值>'`。

**`write` 的其他参数**：
- `anchor: 'middle' | 'end'`：x 是这一行的中心或右端；
- `writeWidth(text, size)`：返回手写一行的实际宽度；
- 布局好的写块也有 `fx.width`。

**小问号举牌的方向**：牌子默认在右边，约占 70 + 牌宽一半（按 size / 200 缩放）。靠近舞台右边缘时，用 `signSide: 'left'` 把牌子举到左边。

标签和箭头的 `target` 可以写成：
- `[x, y]`；
- `{ char: 'kid', part: 'headTop', dx, dy }`；
- `{ write: 'eq', glyph: 2, dy }`（指向某个手写字符的下方）；
- `{ target: 'rows' }`（`scene.targets` 里的名字，或组件发布的命名点）；
- `{ code: 'cb', line: 1, col: 19 }`（指向代码第 1 行第 19 个字符的下方）。

系列名和字幕由渲染器自动绘制，不用放进 fx。

## 6. 场景道具与自定义道具
- 内置 `SETDRAW`：
  - `floor { y? }`
  - `board { x, y, w, h }`（黑板）
  - `desk { x, top, w?, open? }`
  - `stool { x, seat }`
  - `chair { x, seat, full? }`
  - `door { x, w, top }`
  - 都在 `set: [{ type, …, t0, t1? }]` 里声明，出现时 0.38 秒画出来，参数 p 是绘制进度。
- 自定义静态道具：`SETDRAW.前缀_名字 = (s, p, lt) => { … }`。
- 自定义可动道具：`PROPS.前缀_名字 = (fx, t, lt, p, F) => { … }`。
  - 在局部坐标里画（原点是 `at` 或 `pos`），配合 `{ type: 'prop', kind: '前缀_名字', … }` 使用。
  - 多笔道具用 `stag(p, i, n)` 按笔顺依次画出。

## 7. 绘图基础函数
```js
stroke(key, pts, { z, w, color, fill, closed, draw /*0..1 画到多少*/, boil /*抖动倍数*/, opacity, bow, noStroke, blend })
// pts: [[x, y], [x, y, 1 /*1 = 尖角*/], …]；closed: true 会画成圆滑的闭合曲线
ringPts(key, cx, cy, rx, ry, { n, a0, sweep, rv, closed })   // 手绘不规则圆的点
superPts(cx, cy, w, h, n = 20, ex = 5)                        // 圆角矩形的点（ex 越大越方）
dot(key, [x, y], r, color, z)
text(key, str, x, y, { size, font, color, anchor, rot, scale, opacity, halo, z })  // halo = 纸色描边
textWidth(str, size)                                          // 估算宽度：汉字 = size，英文 ≈ 0.5·size
arrow(key, from, to, { p, bend, color, w, head, z })
shadow(key, cx, cy, w, opacity)
portrait(key, cx, cy, r, { happy, z })                        // 主角的小头像（带那撮头发）
DL.save() / DL.restore() / DL.translate(x, y) / DL.rotate(deg) / DL.scale(s) / DL.about(x, y, fn) / DL.tp([x, y])
clamp, lerp, lerp2, dist, EASE.{lin, io, out, in, back}, evalTrack, stepTrack, layoutWriting, penAt, rnd(hash, i, j), hstr(str)
```
- 画方框要用带尖角的开放折线：`[[x0, y0], [x1, y0, 1], [x1, y1, 1], [x0, y1, 1], [x0, y0, 1]]`，加 `fill` 填色。`closed: true` 会把尖角磨圆。
- 引擎的颜色常量是 `C.ink`、`C.red`、`C.hi`、`C.pencil`、`C.paper`；层级常量是 `Z.set`、`Z.hi`、`Z.board`、`Z.body`、`Z.desk`、`Z.front`、`Z.fx`、`Z.annot`、`Z.stamp`、`Z.sub`。

## 8. 写自己的组件
```js
COMP.dm_grid = {
  init(fx) { /* 可选：构建时预先计算，例如排版 */ return fx; },
  draw(fx, t, F) {            // t = 场景内时间；F.anchors、F.targets、F.pen 可读
    if (t < fx.t0) return;
    const lt = t - fx.t0, u = EASE.back(clamp(lt / 0.22));
    dot(fx.id + '.d0', [400, 300], 16 * u, C.ink, Z.front);
  },
  cues: fx => [[fx.t0, 'pop']],  // 可选：[时间, 音效]
};
// 在场景里使用：{ type: 'dm_grid', id: 'grid', t0: 2 }
```
- **命名都加文件前缀**，例如 `dm_`、`h2_`，否则并行写场景时会互相覆盖。
- 要被别人指向的点，写进 `F.targets[名字]`；角色类的组件写进 `F.anchors[id]`。
- 需要在多个场景之间共享的道具或函数，放进 `src/epN/_前缀_shared.js`（下划线开头）。构建时它总是排在最前，`--only` 单独测试某个场景时也会带上。不要写在某个场景文件里再让别的场景去用。

## 9. 字幕、配音、音效
```js
subs: [
  { t0: 0.3, t1: 5.3, text: '把连续的奇数加起来，看看会得到什么：' },
  { t0: 5.4, t1: 8.4, text: '1，4，9，16……', say: '一，四，九，十六……' },   // 数字的读法
  { t0: 8.5, t1: 12.9, text: '“都是平方数！”', voice: 'kid' },            // 角色声音
  { t0: 13.0, t1: 16.4, text: '“为什么？”', voice: 'qm' },
  { t0: 0.3, t1: 5.8, text: '片名……', hide: true },                     // 只念不显示
]
```
- `say: false` 表示不念。声音在 meta.json 的 `audio.voices` 里定义（narr、kid、qm，可以再加）。
- 时长规则：`t1 - t0 ≥ 0.2 × 字数 + 0.8`（主角声音 0.19 × 字数 + 0.95），行间隔 ≥ 0.1 秒。`python3 tools/check_timing.py ep1` 会逐句检查；也可以在 meta.json 的 `audio.voices.<声音>.pace: [a, b]` 里改系数（见 narrative.md 第 6 节）。
- 音效用 `sfx` 或组件的 `cues`。新音效：`SFX.define('前缀_名字', (tone, noise) => { tone('sine', 880, 440, 0.1, 0.2); })`。

## 10. meta.json
```json
{
  "series": "火柴人数学课", "title": "火柴人数学课 第1集", "desc": "一句话简介",
  "h1": "第1集 · 标题", "kicker": "副标题", "aria": "给读屏器的一段描述",
  "poster_label": "播放 · 第1集（约 3 分钟）", "poster": 40, "out": "episode-1.html",
  "audio": {
    "voices": { "narr": {"voice": "zh-CN-YunxiNeural", "rate": "+5%", "pitch": "+0Hz"}, "kid": {…}, "qm": {…} },
    "tracks": { "main": {"file": "Carefree.mp3", "title": "Carefree", "secs": 95, "author": "…", "license": "…"}, … },
    "music": { "场景id": "main", … },
    "think": "think",
    "credits": "（可选）覆盖自动生成的署名"
  },
  "legend": { "hi": "黄色荧光笔 = 关键代码" }
}
```
- `poster`：封面帧的时间（整集时间），选最能代表本集的一帧。
- `legend`：页面底部颜色图例的文字，可选 `ink`、`red`、`hi` 三项，默认是"故事 / 旁白批注 / 关键知识"。
- 声音可以加 `pace: [a, b]`，覆盖 check_timing 用的时长系数。
- `new_project.py` 生成的简介和读屏描述带有【待填写】，发布前要改掉。
- `secs`：配乐截取多长（带 2.5 秒淡出，循环播放）。只打包本集真正用到的曲子。

## 11. 构建、检查、生成音频
```bash
python3 build.py ep1                                   # → episode-1.html（有 episode-1.audio.js 就自动带上）
python3 build.py ep1 --only 10_,20_ -o /tmp/t.html     # 只构建部分场景（测试单个场景时，它们从 t = 0 开始）
python3 tools/check_timing.py ep1                      # 生成配音前检查字幕
python3 tools/audio.py ep1                             # 生成配音和配乐包，列出超出时长的句子，并自动重新构建页面
NODE_PATH=$(npm root -g) node <skill>/scripts/capture.cjs episode-1.html frames "every:5" 1280   # 每 5 秒一段、取每段中点截一帧（2.5, 7.5, …）
python3 <skill>/scripts/sheet.py frames sheet.png 4 480                                          # 拼成一张缩略图，用 Read 看
NODE_PATH=$(npm root -g) node <skill>/scripts/playtest.cjs episode-1.html out                    # 真实播放器测试
python3 <skill>/scripts/gif.py frames_fps gif.gif 12 640                                         # 需要时出 GIF（配合 "fps:12"）
```
- 页面提供的测试接口：`window.__seek(t)`、`__duration`、`__scenes`、`__audio()`。
- `frames/console.txt` 必须为空。里面出现 "no web font loaded" 时，见 environment.md。
- 页面加载就出错时，capture.cjs 会直接打印控制台内容并退出。常见原因是场景代码报错，或者 `--only` 漏掉了依赖。

## 12. 常见坑
- **key 不稳定或重复**，会导致图元闪烁或串位。key 要带组件 id；循环里带上下标。
- **`highlight` 和 `ring` 只能作用于 `write`**。代码、打字文字、任意区域，用 `band`、`strike`、`ringRect` 配合 `rect`。
- **中文和英文字母不能一笔笔写**（GLYPH 里只有数字和数学符号），用 `scribe` 逐字出现；代码用 `codeBlock`。
- **SVG 会吞掉连续空格**：引擎的 `text` 已经加了 `white-space: pre`，缩进可以直接写成空格。
- **共享代码**：写进 `_xx_shared.js`。不要让后面的场景依赖前面场景文件里的全局变量，否则 `--only` 单独测试时会报错。
- **孩子举手、挠头时手被头挡住**：用 `armScale` 1.5–1.75 的姿势（kidCheer、scratchStand）。
- **全屏道具盖住了高层级的东西**：盖住画面的道具放在 z 55；要露在上面的东西（例如人物）设 `def.z`。
- **项目的 package.json 里有 `"type": "module"` 时**，node 脚本要用 `.cjs` 扩展名。
- **标签没有 `t1` 就不会出现**（label、speech 需要 t0 和 t1）。
- **场景中途切画面**：旧的道具设 `t1` 让它消失；人物移出画面或另起一个场景。
- **帧 0 不能是空白**：片头标题的 t0 设成 -0.15。
- **数字自己验算**。几何类（例如区域计数）用脚本在页面加载时算出来，并在算错时 `console.error`。
