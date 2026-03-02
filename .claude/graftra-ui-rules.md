# Graftra 项目 UI/UX 规则

> 本文件记录 Graftra 项目的特定 UI/UX 设计规则，供 ui-ux-pro-max skill 参考。

---

## 图标系统

### 规则：使用 Lucide Icons
- **强制要求**: 所有图标必须使用 [Lucide Icons](https://lucide.dev/)
- **禁止使用**: Emoji 作为图标
- **原因**: Lucide Icons 专业、可定制、与设计系统一致

### 安装方式（Vue 3 项目）
```bash
npm install lucide-vue-next
```

### 使用示例

#### 静态 HTML 文件（graftra-landing-animated.html, app.html）
```html
<!-- 使用内联 SVG，已本地化，无需 CDN -->
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <polyline points="20 6 9 17 4 12"/>
</svg>
```

#### Vue 3 组件
```vue
<script setup>
import { User, Search, Settings } from 'lucide-vue-next'
</script>

<template>
  <User :size="24" />
  <Search :size="20" />
  <Settings :size="24" />
</template>
```

#### 动态图标（JavaScript）
```javascript
const successIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>'
```

### 常用图标映射

| 功能 | Lucide 图标 | 禁止使用的 emoji |
|------|-------------|------------------|
| AI/机器人 | `bot` | 🤖 |
| 文档/文件 | `file-text`, `file-check` | 📄 |
| 目标/瞄准 | `target` | 🎯 |
| 速度/闪电 | `zap` | ⚡ |
| 设计/调色板 | `palette` | 🎨 |
| 箭头向右 | `arrow-right` | → |
| 搜索 | `search` | 🔍 |
| 设置 | `settings` | ⚙️ |
| 首页 | `home` | 🏠 |
| 用户 | `user` | 👤 |
| 删除 | `trash-2` | 🗑️ |
| 编辑 | `edit-2` | ✏️ |
| 保存 | `save` | 💾 |
| 关闭 | `x` | ❌ |
| 检查/完成 | `check` | ✅ |

---

## 项目信息

- **项目名称**: Graftra
- **产品类型**: AI 智能的流程图生成器
- **目标用户**: 设计师、产品经理、企业用户
- **核心价值**: 文档 → 智能分析 → 流程图生成

---

## 更新日志

| 日期 | 规则变更 | 版本 |
|------|----------|------|
| 2025-02-14 | 新增 Lucide Icons 规则 | 1.0.0 |
| 2025-02-15 | 图标本地化完成，移除 CDN 依赖 | 2.0.0 |
