# 一道题长大了（数论火柴人动画）

给 Jasper 看的数论动画，接在《数学少年陶哲轩》（`../tao-animation/`）之后。全片只问一道整数题："哪些整数能写成一个平方 ○ 另一个平方？"一共 6 集，每集约 8 分钟，当故事讲，中间不停下来做题。第 2 集起难度和信息密度提高（解说约 218 字/分，第 1 集 183）。

| 文件 | 内容 |
|---|---|
| `outline.md` | 6 集大纲（v3），以及家长两轮要求的对照 |
| `ep1-storyboard.md` | 第 1 集分镜与台词（给家长看：画面意图、关键镜头五栏、误解防法） |
| `ep1-script.md` | 第 1 集制作用分镜与逐句旁白（以它的台词和时间为准） |
| `episode-1.html` + `episode-1.audio.js` | 第 1 集成片网页，两个文件放在一起打开 |
| `ep2-storyboard.md` | 第 2 集分镜与台词（给家长看） |
| `ep2-script.md` | 第 2 集制作用文档：分工、接缝、顶栏事件、逐句字幕（`script-src/gen_script2.py` 生成） |
| `episode-2.html` + `episode-2.audio.js` | 第 2 集成片网页 |
| `research/` | 漫士沉思录 2025 年以来视频的核实笔记（片中引用只用这里核实过的内容） |
| `script-src/` | 台词时间表、分镜文档的生成脚本 |

## 重新生成

```bash
python3 tools/audio.py ep1    # 台词或配乐改了才需要：配音和配乐 → episode-1.audio.js，并自动重新构建
python3 build.py ep1          # → episode-1.html（第 2 集把 ep1 换成 ep2）
NODE_PATH=$(npm root -g) node tools/lint_frames.cjs episode-1.html > lint.md   # 自动查画面问题
```

## 导出 4K 视频（在自己的电脑上做，不在云端）

```bash
NODE_PATH=$(npm root -g) node tools/export_video.cjs episode-1.html episode-1-4k.mp4 --jobs 3
NODE_PATH=$(npm root -g) node tools/export_video.cjs episode-2.html episode-2-4k.mp4 --jobs 3
```

- 默认 3840×2160、24 帧、H.264（CRF 18）+ AAC 192k。画面是逐帧精确渲染的（不是录屏），声音按播放器的方式离线混音：配音、配乐（说话时自动压低）和音效。
- `--res 1920x1080` 出 1080p；`--from 60 --to 90` 只导出一段，先试一下；`--jobs N` 用 N 个浏览器页面并行渲染。
- 需要：Playwright 的 Chromium（`npm i -g playwright`），以及 ffmpeg（系统里有就用系统的，或者 `python3 -m pip install imageio-ffmpeg`，脚本会自动找到它带的 ffmpeg）。
- 字幕是画进画面里的（底部那一行），视频里也会有。

## 目录
| 路径 | 内容 |
|---|---|
| `src/engine.js` | 动画引擎（和陶哲轩系列同一套，加了 ²、n、a、b 字形和离线混音） |
| `src/player.js` | 播放器（多了导出视频用的 `__renderAudio` / `__wavChunk`） |
| `src/ep1/_n1_shared.js` | 第 1 集共用素材：Jasper、书桌、点阵、地图、范围卡片、记号、木牌 |
| `src/ep1/NN_*.js` | 场景，按文件名顺序播放 |
| `src/ep2/_n2_shared.js` | 第 2 集共用素材：顶栏和议程条、四条跑道、数字砖、余数花纹、结论卡、猜想标签、证明栈、地图扩展（`_n1_shared.js` 是第 1 集素材的原样复制） |
| `tools/export_video.cjs` | 导出 MP4 |
| `audio/voice/`、`audio/music/` | 配音缓存、配乐 |

## 配乐署名
配乐来自 Kevin MacLeod（incompetech.com），CC BY 4.0 授权，页面底部会自动显示署名。配音使用微软 Edge 神经网络语音（云希、云夏）。

只给 Jasper 自己看，不对外。
