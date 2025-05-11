# HTML 转 Markdown Chrome 扩展

这是一个简单的 Chrome 扩展，可以一键将网页转换为 Markdown 文件并保存到本地。

## 功能特点

- 一键将当前网页转换为 Markdown 格式
- 自动保存时间和标题信息
- 将图片、视频、音频和 iframe 等媒体元素转换为 Markdown 链接
- 支持自定义保存路径
- 首次使用时弹出保存对话框，之后自动保存到相同位置

## 安装方法

### 开发模式安装

1. 下载或克隆此仓库到本地
2. 打开 Chrome 浏览器，进入扩展管理页面：`chrome://extensions/`
3. 开启右上角的"开发者模式"
4. 点击"加载已解压的扩展程序"
5. 选择项目中的 `src` 目录
6. 扩展将被安装到您的浏览器中

## 使用方法

1. 浏览任意网页时，点击浏览器工具栏中的扩展图标
2. 首次使用时，系统会询问您要保存文件的位置
3. 文件将以 Markdown 格式保存，文件名格式为 `日期_时间_网页标题.md`
4. 保存的 Markdown 文件第一行为时间戳，第二行为网页标题，随后是页面内容

## 设置

1. 右键点击扩展图标，选择"选项"
2. 在设置页面中，您可以修改默认保存路径
3. 支持使用变量：`${YYYY}` (年)、`${MM}` (月)、`${DD}` (日)

## 技术栈

- Chrome Extension API (Manifest V3)
- JavaScript
- Turndown (HTML 转 Markdown 库)

## 开发

### 本地开发

1. 克隆仓库：`git clone https://github.com/xellse/html-markdown.git`
2. 进入项目目录：`cd html-markdown`
3. 安装依赖：`npm install`
4. 构建项目：`npm run build`

## 许可证

MIT
