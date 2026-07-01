# ChromeExtensions

通用 Chrome / Edge / Arc 浏览器扩展集中目录。与具体业务项目无关、可日常复用的插件统一放在这里，便于安装、维护和分享。

## 支持的浏览器

基于 [Manifest V3](https://developer.chrome.com/docs/extensions/develop/migrate) 开发，适用于：

- Google Chrome
- Microsoft Edge
- Arc（Chromium 内核）

## 目录结构

每个扩展独立一个子目录，包含 `manifest.json` 及所需资源。**各扩展的详细说明、安装步骤和常见问题，请查看对应目录下的 README。**

```
ChromeExtensions/
├── README.md                      # 本文件：仓库级说明
├── LICENSE
└── copy-unlocker-extension/       # 各扩展独立目录
    ├── manifest.json
    ├── content.js
    ├── unlock.css
    └── README.md                  # 扩展级详细文档
```

## 扩展列表

| 目录 | 说明 | 详细文档 |
|------|------|----------|
| [`copy-unlocker-extension`](./copy-unlocker-extension/) | 恢复网页文本选择、复制、剪切快捷键和右键菜单 | [README](./copy-unlocker-extension/README.md) |

## 通用安装方式

本仓库扩展均以「加载已解压的扩展程序」方式安装，无需打包或上架商店：

1. 克隆或下载本仓库到本地。
2. 打开浏览器的扩展管理页，开启**开发者模式**。
3. 点击**加载已解压的扩展程序**，选择目标扩展所在子目录（例如 `copy-unlocker-extension`）。
4. 安装完成后，**刷新**需要使用的网页（已打开的标签页不会自动生效）。

各扩展的具体步骤、使用方法和排错说明，见上表对应 README。

## 许可证

[MIT License](./LICENSE)
