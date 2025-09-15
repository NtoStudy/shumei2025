# Layout重构总结

## 重构目标
统一管理`AppHeader`和`AppFooter`组件，避免在每个页面中重复引用，通过Layout组件统一包含。

## 完成的工作

### 1. 创建Layout组件
- **DefaultLayout.vue**: 包含AppHeader、主内容区域和AppFooter的默认布局
- **SimpleLayout.vue**: 简单布局，用于登录、注册、欢迎页等不需要Header/Footer的页面

### 2. 重构路由配置
- 将路由重新组织为层级结构
- 使用Layout组件作为父路由
- 为不同类型的页面分配不同的Layout:
  - 认证页面使用SimpleLayout
  - 主应用页面使用DefaultLayout

### 3. 重构页面组件
移除了以下页面中重复的AppHeader和AppFooter引用：
- EmotionIndex.vue
- CommunityIndex.vue  
- GrowthIndex.vue
- ResourcesIndex.vue
- ToolsIndex.vue
- Home.vue
- Settings.vue
- Help.vue
- 所有工具子页面 (Breathing.vue, Meditation.vue, 等)

### 4. 创建通用组件
- **PageHeader.vue**: 可复用的页面头部组件，包含图标、标题和描述

## 新的路由结构
```
/                 → SimpleLayout → Welcome.vue
/login            → SimpleLayout → Login.vue  
/register         → SimpleLayout → Register.vue
/app              → DefaultLayout → 
  ├── /home       → Home.vue
  ├── /emotion    → EmotionIndex.vue
  ├── /tools      → ToolsIndex.vue
  ├── /community  → CommunityIndex.vue
  ├── /growth     → GrowthIndex.vue
  ├── /resources  → ResourcesIndex.vue
  └── /settings   → Settings.vue
/help             → SimpleLayout → Help.vue
```

## 优势
1. **代码复用**: 避免了在每个页面重复引用AppHeader和AppFooter
2. **维护性**: Layout的修改只需要在一个地方进行
3. **一致性**: 确保所有页面的布局结构一致
4. **灵活性**: 可以轻松为不同类型的页面配置不同的Layout
5. **性能**: 减少了重复组件的渲染

## 文件变更统计
- 新增文件: 3个 (DefaultLayout.vue, SimpleLayout.vue, PageHeader.vue)
- 修改文件: 15+ 个页面组件和路由配置
- 删除内容: 移除了大量重复的Layout相关代码

## 后续建议
1. 考虑在各个页面中使用新的PageHeader组件来进一步统一页面头部样式
2. 可以为不同业务模块创建专门的Layout组件
3. 考虑添加面包屑导航等通用组件到Layout中
