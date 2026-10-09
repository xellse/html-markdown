# 生成第 2 集制作用文档 ep2-script.md：分工、每场首尾画面约定、顶栏事件、逐句字幕（直接取自 nt2_lines.json）
import json
L = json.load(open('nt2_lines.json', encoding='utf-8'))
WHO = {None: '旁白', 'kid': 'Jasper', 'qm': '小问号'}
SC = [
 # key, file, builder, storyboard heading, start frame, end frame, hud events
 ('title', '00_title.js', '主持人', '片头', '—', '片名淡出，空舞台', '不画顶栏'),
 ('lanes', '10_lanes.js', 'B1', '上集的问题与四条跑道', '空舞台（只有系列名）；小问号 0.2 秒内弹进来',
  '地图淡出，跑道缩成顶栏的细跑道条：最后一帧只剩顶栏的细跑道条', "hud at:'lanes'，strip: 跑道缩进顶栏的那一刻（场景结束前约 1 秒）"),
 ('why4', '15_why4.js', 'B1', '为什么偏偏按 4 分', '只有顶栏细跑道条', '只剩顶栏（细跑道条 + 卡①）', "hud at:'why4'，dock: [[t, 1]]（卡①写完后飞进顶栏；n2_bigcard 的 dock 用同一个 t）"),
 ('agenda', '20_agenda.js', 'B1', '奇数两条打勾，摆出议程', '只有顶栏', '只剩顶栏 + 议程条（三个编号）', "hud at:'agenda'，agenda: t（三块牌缩成议程条的那一刻）"),
 ('squares', '30_squares.js', 'B2', '平方落进哪几条', '只有顶栏 + 议程条', '只剩顶栏 + 议程条', "hud at:'squares'"),
 ('even', '35_even.js', 'B2', '偶数边：切成 4 块', '只有顶栏 + 议程条', '只剩顶栏 + 议程条', "hud at:'even'"),
 ('odd', '40_odd.js', 'B2', '奇数边：风车切法', '只有顶栏 + 议程条', '只剩顶栏（卡①②）+ 议程条（①打勾）', "hud at:'odd'，dock: [[t, 2]]，tick: [[t, 0]]"),
 ('predict', '50_predict.js', 'B3', '先预测，再核对', '只有顶栏 + 议程条', '只剩顶栏 + 议程条', "hud at:'predict'，flash: [[t, 1]]（\"零头够减，整组减整组\"时卡①闪一下）"),
 ('proof', '60_proof.js', 'B3', '假设 6 写得出', '只有顶栏 + 议程条',
  '顶栏收起（细边）+ 议程条 + 证明栈第 0、1 行（第 1 行是当前行）+ 栈上方的范围卡 N2.STACK_CARD；其余淡出', "hud at:'proof'，collapse: [[约 0.3, 1]]；pop: [[t0, t1, 2]]（\"刚证过\"时卡②弹出）"),
 ('borrow', '65_borrow.js', 'B4', '借位', '顶栏收起 + 议程条 + 证明栈 0–1 行（from: 2, cur: [[0, 1]]）+ 范围卡',
  '同上，证明栈 0–4 行（第 4 行当前）+ 范围卡；其余淡出', "hud at:'borrow'（开场就是收起的）"),
 ('wall', '70_wall.js', 'B4', '撞墙', '顶栏收起 + 议程条 + 证明栈 0–4 行（from: 5, cur: [[0, 4]]）+ 范围卡',
  '顶栏展开（卡①②③）+ 议程条（①②打勾）+ 证明栈 0–7 行全亮、盖了"反证法"章 + 范围卡；其余淡出', "hud at:'wall'，collapse: [[t, 0]]（需要时展开），dock: [[t, 3]]，tick: [[t, 1]]，可用 stripHi"),
 ('dark', '80_dark.js', 'B5', '整条熄灭', '顶栏 + 议程条 + 证明栈（from: 8, all: -9, stamp: -9）+ 范围卡',
  '只剩顶栏（卡①②③）+ 议程条（①②③打勾）', "hud at:'dark'，tick: [[t, 2]]（2026 盖章、\"根本没有\"打勾时），flash: [[t, 1]]（结尾卡①弹出）"),
 ('enough', '85_enough.js', 'B5', '余数门能判', '只有顶栏 + 议程条', '只剩顶栏（卡①–④）+ 议程条', "hud at:'enough'，dock: [[t, 4]]"),
 ('ending', '90_ending.js', '主持人', '地图（两扇门的分工）', '只有顶栏 + 议程条', '全部淡出（顶栏 out）', "hud at:'ending'，out: 结尾"),
 ('end', '95_end.js', '主持人', '片尾', '空舞台', '—', '不画顶栏'),
]
out = []
out.append('''# 《一道题长大了》第 2 集《不用试遍所有数》制作用分镜与字幕

> 生成：`script-src/gen_script2.py`（字幕逐句取自 `script-src/nt2_lines.json`，时间按真实配音排）。画面设计以 `ep2-storyboard.md` 为准（每场的"画面"要点和关键镜头五栏表）；本文件只管**分工、接缝、顶栏事件和逐句字幕**。

**观众**：Jasper，小学一年级，正在练四位数加减乘除；看漫士沉思录 20–35 分钟的视频津津有味。本集比第 1 集难、信息密度高（每分钟 218 字），**全片当故事讲，没有暂停点**。成片要导出 4K（3840×2160），所以 16:9 构图、所有字 ≥ 36 号（顶栏小图标除外）、重要画面在 y 790 以上。

## 分工
| 场景 | 文件 | 谁做 | 时长 |
|---|---|---|---|''')
for k, f, who, *_ in SC:
    out.append(f"| {k} | `src/ep2/{f}` | {who} | {L[k]['dur']} 秒 |")
out.append(f"| 合计 | | | {round(sum(L[k]['dur'] for k, *_ in SC), 1)} 秒 |")
out.append('''
## 全集约定（每个代理都要遵守）
- **共享素材**：`src/ep2/_n1_shared.js`（第 1 集原样）和 `src/ep2/_n2_shared.js`（本集）。先读 `_n2_shared.js` 开头的清单和每个组件上方的注释。只读，不改；需要改写进报告。
- **顶栏和议程条**（`COMP.n2_hud`）：**每一场**（片头、片尾除外）都要放 `{ type:'n2_hud', id:'hud', at:'<场景 id>', …本场事件 }`，放在 fx 数组**最前面**。开场状态由 `N2.HUD_AT` 规定（= 上一场结尾），切场时顶栏不跳；场景里只写本场发生的变化（见下面每场的"顶栏事件"）。顶栏占 x 440–1560、y 66–170，议程条占 x 40–420、y 86–170：主体画面放在 y 190–790，不要压到这两块。
- **证明栈**（`COMP.n2_stack`，proof、borrow、wall、dark 四场）：行的内容固定在 `N2.STACK`，位置用默认值，**不要改 x、y、lh**。上一场写过的行用 `from` 带进来，`cur: [[0, 上一场最后的当前行]]` 让高亮接着亮。栈上方钉一张范围卡：`{ type:'prop', kind:'n1_card', id:'scope', at: N2.STACK_CARD.at, w: N2.STACK_CARD.w, h: N2.STACK_CARD.h, size: N2.STACK_CARD.size, lines: N2.STACK_CARD.lines, t0: … }`（proof 场钉上，后面三场 t0: -1 开场就在）。
- **接缝**：除了下表写明要带过去的东西（顶栏、议程条、证明栈和它的范围卡），**每一场的最后一帧只剩这些**：本场的其他东西都要在结尾前淡出或走出画面（lint 的 SEAM、POP 会查）。开场同理：只从这些东西开始，别的都在本场里出现。角色（Jasper、小问号）在一场里登场、离场，不要跨场留在台上。
- **花纹**：余 0 实心、余 1 斜线、余 2 网点、余 3 空心，用 `N2.fill` 画，**只用来表示余几**。风车分片、借位、平方检查站上的东西都不用这四种花纹。数字砖用 `N2.brick`（左边花纹签，右边写数，花纹不会穿过数字）。
- **角色**：Jasper 用 `cast: { kid: N2.kid }`（和第 1 集同一个孩子）；他的台词（voice 'kid'）说的时候他要在画面上。小问号用引擎的 `qm` 组件（size 120–160），台词用举牌 `sign` 显示短句。旁白不当裁判。
- **手写**：`write` 的字形现在有 0–9、x + − × ÷ = ≠ < > ✓ ✗ , . ? □ ( ) … → ² |，以及 n a b m u v r w。别的字符会被直接丢掉、不报错：中文用 `scribe` 或 `text`；①②③④ 用 `text`；不写 ∞、≥、≤、"0/1"（写"0 或 1"）。除法、乘法写横式（"2026 ÷ 4 = 506 … 2"）；竖式只有 predict 的 2026 − 1369 和 borrow 角上的 20 − 1，用几行 `write` 按数位右对齐，再用 `stroke` 画横线。
- **字幕**：必须逐字使用下面给出的字幕（t0、t1、text、say、voice、hide 原样复制；不要 `iu` 字段）。画面要在旁白说到时出现。
- **数字自己验算**：场景里用到的算式，在场景文件里用 JS 验算，算错时 `console.error`（第 1 集的做法）。
- **命名前缀**：每个场景文件的新全局名（COMP、PROPS、POSE）都加前缀，例如 lanes 用 `l2_`，why4 用 `w2_`……（见下表"前缀"）。

## 每场：接缝、顶栏事件、字幕''')
PFX = {'lanes': 'l2_', 'why4': 'w2_', 'agenda': 'g2_', 'squares': 's2_', 'even': 'e2_', 'odd': 'o2_', 'predict': 'p2_', 'proof': 'f2_', 'borrow': 'b2_', 'wall': 'q2_', 'dark': 'd2_', 'enough': 'n2x_', 'ending': 'h2_', 'title': 'h2_', 'end': 'h2_'}
for k, f, who, head, start, end, hud in SC:
    d = L[k]
    out.append(f"\n### {k} · `{f}` · {who} · {d['dur']} 秒 · 前缀 `{PFX[k]}`")
    out.append(f"- **分镜**：`ep2-storyboard.md` 里标题含\"{head}\"的那一节（画面要点 + 关键镜头）。")
    out.append(f"- **开场画面**：{start}")
    out.append(f"- **结尾画面**：{end}")
    out.append(f"- **顶栏事件**：{hud}")
    out.append('- **字幕**（`subs` 原样复制）：')
    out.append('```js')
    for s in d['subs']:
        o = {x: y for x, y in s.items() if x != 'iu'}
        out.append('  ' + json.dumps(o, ensure_ascii=False) + ',')
    out.append('```')
    out.append('  - 逐句：' + '；'.join(f"{i+1}. {WHO[s.get('voice')]}（{s['t0']}–{s['t1']}）" for i, s in enumerate(d['subs'])))
open('../ep2-script.md', 'w', encoding='utf-8').write('\n'.join(out) + '\n')
print('wrote ep2-script.md')
