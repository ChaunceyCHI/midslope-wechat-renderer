# MidSlope WeChat Renderer

一个本地运行的微信公众号 Markdown 排版工具。它可以把 Markdown 文章渲染成带行内样式的富文本 HTML，并复制到微信公众号编辑器中使用。

## 功能

- Markdown 转微信公众号富文本预览
- 自动内联 CSS，便于粘贴到公众号编辑器
- 支持标题、段落、图片、图注、代码块、引用、表格、任务列表等常见 Markdown 内容
- 本地运行，不依赖后端服务

## 技术栈

- Vite
- marked
- juice

## 安装依赖

```bash
npm install
```

如果在 PowerShell 中遇到 `npm.ps1` 执行策略限制，可以使用：

```bash
npm.cmd install
```

## 本地运行

```bash
npm run dev
```

PowerShell 下也可以使用：

```bash
npm.cmd run dev
```

启动后打开终端提示的本地地址，通常是：

```text
http://localhost:5173
```

## 使用方式

1. 将 Markdown 文章粘贴到左侧输入框。
2. 点击“生成预览”查看公众号样式。
3. 点击“复制到公众号”。
4. 打开微信公众号编辑器并粘贴。

## 构建

```bash
npm run build
```

构建产物会输出到 `dist/` 目录。

## 项目结构

```text
.
├── examples/        # 示例 Markdown
├── src/
│   ├── clipboard.js # 富文本复制逻辑
│   ├── main.js      # 页面交互入口
│   ├── renderer.js  # Markdown 渲染与样式内联
│   └── theme.css    # 公众号排版主题
├── index.html       # 应用页面
├── package.json
└── README.md
```

## 说明

本项目面向个人本地排版流程，适合先在浏览器里预览，再复制到微信公众号后台做最终检查。
