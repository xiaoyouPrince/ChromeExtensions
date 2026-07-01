# Copy Unlocker

Chrome / Edge / Arc Manifest V3 扩展，用于恢复网页文本选择、复制、剪切快捷键和右键菜单。

## 能处理的限制

- CSS 禁止选择：`user-select: none`
- 行内事件：`oncopy`、`onselectstart`、`oncontextmenu` 等
- 页面脚本监听复制、选择、右键菜单、拖拽事件后阻止默认行为
- 页面脚本拦截 `Ctrl/Cmd + A`、`Ctrl/Cmd + C`、`Ctrl/Cmd + X`

## 安装

1. 打开 Chrome / Edge / Arc 的扩展管理页。
2. 开启开发者模式。
3. 选择“加载已解压的扩展程序”。
4. 选择本目录：`copy-unlocker-extension`。

## 使用

安装后刷新目标网页，再正常拖选文本或使用复制快捷键。

## 说明

这个扩展只恢复浏览器默认选择和复制能力，不会绕过登录、付费墙、网络权限或加密内容。某些站点如果把正文渲染成图片、Canvas、视频或 Shadow DOM 内部私有结构，仍可能无法直接复制。
