# 项目规则

## 本地文件保存位置
- 之后所有需要保存到用户本地电脑的文件（导出的视频、音频、文档等），都保存在**外置 SSD 下的 `claude code` 文件夹**里（macOS 上一般是 `/Volumes/<SSD 名>/claude code/`；不知道 SSD 名时先问用户）。
- 一批文件：在 `claude code` 下新建一个文件夹放进去（文件夹名写清楚内容，例如 `一道题长大了-第2集-4K`）。
- 单个文件：直接放在 `claude code` 文件夹下，不另建文件夹。
- 给用户的本地命令（例如导出视频）要把输出路径写成这个位置。

## 视频
- 导出和压缩视频都在用户本地电脑上做，不在云端做（见 skills/stickfigure-explainer/references/pipeline.md 第 10 节）。
