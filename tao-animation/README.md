# 数学少年陶哲轩（动画）

给 Jasper 看的陶哲轩成长动画。风格参照 Ben Orlin 的火柴人漫画，第 1 集约 3 分钟，第 2–4 集约 7–8 分钟，只在网页里播放。

| 文件 | 内容 |
|---|---|
| `episode-1.html` | 第 1 集《一眼看出来》，旁边要放着 `episode-1.audio.js`（配音 + 配乐） |
| `episode-2.html` | 第 2 集《看出来 ≠ 证出来》，配 `episode-2.audio.js` |
| `episode-3.html` | 第 3 集《卡住，然后想通》，配 `episode-3.audio.js`；分镜与逐句旁白见 `ep3-script.md` |
| `episode-4.html` | 第 4 集《第一次站上世界赛场》，配 `episode-4.audio.js`；分镜与逐句旁白见 `ep4-script.md` |
| `style-sample.html` | 最初确认风格用的 10 秒样片 |
| `script-outline.md` | 6 集剧本大纲 |

## 目录结构

- `src/engine.js`：6 集共用的动画引擎，负责线条、火柴人、小问号、标注、音频。
- `src/player.js`：播放器，包括章节、"轮到你了"的暂停、配音同步和配乐。
- `src/shell.html`：页面外壳。
- `src/ep1/`、`src/ep2/`、`src/ep3/`：每集的各个场景，按文件名顺序播放；下划线开头的文件（如 `_e3_shared.js`）是本集共用的角色和道具，总会排在最前。`meta.json` 里是页面文字、配音声音和每个场景用的配乐。

## 重新生成

```bash
python3 tools/audio.py ep1   # 台词或配乐改了才需要运行
python3 build.py ep1         # 生成 episode-1.html
```

`tools/audio.py` 做三件事：
- 用微软 Edge 神经网络语音为每句字幕生成配音，存到 `audio/voice/`。已经生成过的台词不会重复生成。
- 截取、压缩配乐，存到 `audio/music/`。
- 打包成 `episode-1.audio.js`，并列出比原定时间长的台词。

配音声音：
- 旁白：云希；
- 小陶的台词：云夏（男孩声）；
- 小问号：云希，音调调高。

在字幕里写 `voice: 'kid'` 或 `voice: 'qm'`，就能指定这一句用哪个声音。

配乐来自 Kevin MacLeod（incompetech.com），CC BY 4.0 授权，页面底部有署名。
