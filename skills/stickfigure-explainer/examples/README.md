# 范例：《数学少年陶哲轩》第 1、2 集的场景源码

这是完整、经过验收的真实作品，可以当作"怎么写场景"的参考。里面的手法：
- 印章：tao-ep1/30_age7.js
- 教室、老师和大孩子一起反应：tao-ep1/30_age7.js
- 报纸道具：tao-ep1/30_age7.js
- 复古电脑和真实的 BASIC 程序：tao-ep1/20_age6.js
- 数学小知识卡：tao-ep1/25_fib.js
- 折线逼近（极限）：tao-ep1/26_ratio.js
- 作业本和小问号初登场：tao-ep1/40_notebook.js
- 脑子和手赛跑：tao-ep1/42_race.js
- 互动停顿和奇偶证明：tao-ep1/50_yourturn.js
- 快乐数：tao-ep2/10_visitor.js
- 圆上连线自动数区域：tao-ep2/20_circles.js
- 三种写法对比：tao-ep2/50_oddproof.js
- 四个小窍门卡片墙：tao-ep2/55_rules.js
- 用电脑穷举完成证明：tao-ep2/60_happyproof.js

**想看它们跑起来**：把某一集的文件夹复制到项目的 `src/` 下，例如 `cp -r tao-ep2 <项目>/src/ep2`，然后运行 `python3 build.py ep2`。

几点说明：
- tao-ep1 的小问号用的是它自己文件里的 `COMP.q1_qm`，那是早期版本；现在的引擎自带 `COMP.qm`，功能相同。
- 两集的配音包没有附带，运行 `python3 tools/audio.py ep2` 即可生成。
- `tao-series-outline.md` 是系列大纲范例，包括观众画像、事实与出处、每集的学习目标。
