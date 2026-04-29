# Self Direction Page

一个为个人日常使用设计的静态导航页，使用原生 `HTML + CSS + JavaScript` 实现，可直接本地打开，也可部署到 GitHub Pages。

线上地址：
[https://yukiaya-zhang.github.io/self-directon-page/](https://yukiaya-zhang.github.io/self-directon-page/)

## 功能概览

- 默认保留 `日常`、`学习`、`二次元` 三个分组，不预置默认网站
- 支持在页面内管理分组、网站链接和 `Quick Access`
- 支持实时更新时间、主题切换、语言切换和真实天气卡片
- 支持 `Recent` 最近访问记录与本地固定快捷入口
- 支持自定义背景图，配置仅保存在当前浏览器
- 兼容 `file://` 本地直开和 GitHub Pages 项目页部署

## 本地使用

这个项目不依赖构建工具。

- 最简单的方式：直接双击 [index.html](C:/Users/25194/Desktop/Practical_Codes/SelfDirectionPage/index.html)
- 也可以使用任意静态服务器在本地打开

页面配置默认写入浏览器本地存储，不会自动跨设备同步。

## 项目结构

- [index.html](C:/Users/25194/Desktop/Practical_Codes/SelfDirectionPage/index.html)：页面骨架和各类弹层节点
- [styles.css](C:/Users/25194/Desktop/Practical_Codes/SelfDirectionPage/styles.css)：整体视觉、响应式和组件样式
- [js/app.js](C:/Users/25194/Desktop/Practical_Codes/SelfDirectionPage/js/app.js)：页面交互、渲染、天气、主题和设置逻辑
- [js/store.js](C:/Users/25194/Desktop/Practical_Codes/SelfDirectionPage/js/store.js)：状态模型与纯逻辑存储函数
- [js/store.browser.js](C:/Users/25194/Desktop/Practical_Codes/SelfDirectionPage/js/store.browser.js)：浏览器直开场景使用的存储实现
- [tests/store.test.js](C:/Users/25194/Desktop/Practical_Codes/SelfDirectionPage/tests/store.test.js)：状态层回归测试

## 说明

- favicon 目前以前端可直接获取的地址为主，部分网站可能因为自身图标策略无法稳定返回
- 背景图、语言、主题、快捷入口等个性化设置仅保存在当前浏览器
