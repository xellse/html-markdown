# 火柴人讲解动画项目

由 stickfigure-explainer 技能生成。每一集是 `src/` 下的一个文件夹，构建后得到一个可以直接播放的网页。

```bash
python3 build.py ep1          # → episode-1.html
python3 tools/audio.py ep1    # 配音和配乐 → episode-1.audio.js（构建时会自动带上）
```

## 目录
| 路径 | 内容 |
|---|---|
| `src/engine.js` | 动画引擎，全系列共用 |
| `src/player.js` | 播放器 |
| `src/shell.html` | 页面外壳 |
| `src/epN/meta.json` | 页面文字、封面帧、配音声音、每个场景的配乐 |
| `src/epN/NN_*.js` | 场景，按文件名顺序播放 |
| `audio/voice/` | 配音缓存 |
| `audio/music/` | 配乐 |

## 配乐署名
配乐来自 Kevin MacLeod（incompetech.com），CC BY 4.0 授权，页面底部会自动显示署名。

配音使用微软 Edge 神经网络语音。
