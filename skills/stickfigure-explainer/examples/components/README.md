# 组件速览：代码块、变量盒子、荧光笔、划线、圈框、数轴、改名的小知识卡

这两个很短的测试场景，演示了编程和讲解最常用的几个组件：
- `codeBlock`：打字、缩进、行指针、输出；
- `varBox`：变量盒子，数字和文字两种值；
- `band`、`strike`、`ringRect`：配合 `rect: {code, line, from, to}`，精确作用在代码的某几个字符上；
- `label` 指向代码中的字符；
- `numberLine`：跳跃的小人、栅栏、高亮区间；
- `factCard` 的 `stamp`（改成"编程小知识"）；
- `write` 的 `anchor: 'middle'`；
- 小问号的 `signSide: 'left'`。

**看效果**：复制到项目的 `src/ep9/`，再放一份 meta.json（从 ep1 复制，把 out 改成 episode-9.html），然后运行 `python3 build.py ep9`。
