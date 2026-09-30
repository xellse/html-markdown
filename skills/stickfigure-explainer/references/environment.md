# 环境配置与排障

先运行 `bash <skill>/scripts/setup_env.sh`。下面是它做了什么，以及踩过的坑。

## 依赖
| 用途 | 依赖 | 说明 |
|---|---|---|
| 构建 | Python 3 | build.py 只用标准库 |
| 截图检查、播放测试 | Node + playwright + Chromium | 全局安装时，运行脚本要加 `NODE_PATH=$(npm root -g)` |
| 缩略图、GIF | Pillow | |
| 配音 | edge-tts（微软 Edge 朗读接口，免费，要联网） | |
| 配音时长 | mutagen | |
| 截取、压缩配乐 | imageio-ffmpeg（自带静态 ffmpeg） | |

## 坑 1：截图里的字全是系统默认字体
- **现象**：截图里没有手写字体，`console.txt` 显示 `requestfailed … ERR_CERT_AUTHORITY_INVALID` 或 "no web font loaded"。
- **原因**：云端会话的出网流量经过一个会重新签发 TLS 证书的代理。curl、pip、node 都信任它的 CA，**但 Chromium 用自己的 NSS 证书库**，而那个库是空的。
- **修复**（setup_env.sh 已包含）：
  ```bash
  apt-get install -y libnss3-tools
  certutil -A -d sql:$HOME/.pki/nssdb -n ccr-agent-proxy -t "C,," -i /root/.ccr/agent-proxy-ca.crt
  ```
  同时，Playwright 启动时要显式传代理：`chromium.launch({ proxy: { server: process.env.HTTPS_PROXY } })`。capture.cjs 和 playtest.cjs 已经这样做。
- 这不是关闭证书校验，而是把环境指定的 CA 加进浏览器信任库。

## 坑 2：edge-tts 报 CERTIFICATE_VERIFY_FAILED
- **原因**：edge-tts 用 certifi 自带的 CA 包，不读系统设置；它走的 websocket 也需要显式代理。
- **修复**（tools/audio.py 已包含）：生成配音前，把 `certifi.where` 指向 `SSL_CERT_FILE` 或 `/root/.ccr/ca-bundle.crt`，调用时传 `proxy=HTTPS_PROXY`。
- 普通电脑上没有代理，这两步会自动跳过。

## 坑 3：node 报 "require is not defined in ES module scope"
- **原因**：项目根目录的 `package.json` 里写了 `"type": "module"`。
- **修复**：node 脚本一律用 `.cjs` 扩展名。技能包里的脚本都已经是 `.cjs`。

## 坑 4：推送被拒（403）
- 通常是会话没有这个仓库的 GitHub 写权限，重试没用。
- 告诉用户去重新授权，然后再推：
  - 连接 GitHub：https://claude.ai/connect-github
  - 或者安装 Claude GitHub App

## 坑 5：发布到 Artifact 后没有声音、字体不对
- 发布前要剥掉 `<!doctype>`、`<html>`、`<head>`、`<body>` 标签（见 pipeline.md 第 10 节）。
- `episode-N.audio.js` 要作为附带文件一起发布，页面用相对路径加载它。
- Artifact 的 CSP 只允许 Google Fonts 的样式表和少数 CDN 的脚本。**所有音频都必须打包进同源文件**，不能引用外部音频链接。
- 浏览器要求用户点一下才能出声。播放器在第一次点击时创建音频环境，之后自动播放。

## 坑 6：配音和画面对不上
- 播放器会等配音说完再往下走（旁白比留的时间长时，画面会停住）。
- 经常停住，说明时长留得不够。按 audio.py 最后列出的"超时句子"拉长那一句，或者删几个字。
- 手机或平板没声音：先检查静音开关和"配音""音乐"两个开关。

## 坑 7：截图和真实播放不一样
- 截图用 `__seek(t)` 直接跳到那一刻，真实播放会有"等配音"的停顿。
- 两种都要测：capture.cjs 截图，playtest.cjs 走真实播放器。

## 无法联网时
- **配音**：audio.py 只为新的或改动过的台词生成配音，旧的从 `audio/voice/` 缓存里读。完全离线时，播放器会退回到浏览器自带的中文语音（声音因设备而异）。
- **配乐**：模板已经附带压缩好的配乐（`audio/music/`），不需要联网。
- **字体**：页面需要联网加载 Google Fonts；离线时会退回系统字体，能看但不好看。
